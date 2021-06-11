import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: 'AIzaSyAbUqiIPzGOTk20rWjuy7vBa4Cpvst_zJQ',
    authDomain: 'dungeons-and-dragons-30601.firebaseapp.com',
    projectId: 'dungeons-and-dragons-30601',
    storageBucket: 'dungeons-and-dragons-30601.appspot.com',
    messagingSenderId: '120924024765',
    appId: '1:120924024765:web:aff722a18a6cfc0d4eacd4',
    measurementId: 'G-YPQVF4HKTN'
}

firebase.initializeApp(firebaseConfig)
export const auth = firebase.auth()
export const db = firebase.firestore()
export const storage = firebase.storage()

export const generateUserDocument = async (user, additionalData) => {
    if (!user) return
    const userRef = db.doc(`users/${ user.uid }`)
    const snapshot = await userRef.get()
    if (!snapshot.exists) {
        const { email, photoURL } = user
        try {
            await userRef.set({
                email,
                photoURL,
                games: {},
                ...additionalData
            }).then(() => {
                window.location.replace('/account/profile')
            })
        } catch (e) {
            console.error('Error creating user document', e)
        }
    }
    return getUserDocument(user.uid)
}

const getUserDocument = async uid => {
    if (!uid) return null
    try {
        const userDocument = await db.doc(`users/${ uid }`).get()
        return {
            uid,
            ...userDocument.data()
        }
    } catch (e) {
        console.error('Error fetching user', e)
    }
}
