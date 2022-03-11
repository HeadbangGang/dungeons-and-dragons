/* eslint-disable no-console */
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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
} else {
    firebase.app()
}

export const auth = firebase.auth()
export const db = firebase.firestore()
export const storage = firebase.storage()

if (process.env.NODE_ENV === 'development') {
    console.log('testing locally -- hitting local auth and firestore emulators')
    auth.useEmulator('http://localhost:9099/')
    storage.useEmulator('localhost', 9199)
    db.useEmulator('localhost', 8080)
}

export const generateUserDocument = async (user, additionalData) => {
    if (!user) return
    const { email, photoURL, uid } = user
    const userRef = db.doc(`users/${ uid }`)
    const snapshot = await userRef.get()
    if (!snapshot.exists) {
        await userRef.set({
            email,
            photoURL,
            uid,
            games: {},
            ...additionalData
        })
            .catch((err) => console.error('Error creating user document', err))
    }
    return getUserDocument(uid)
}

export const getUserDocument = async (uid) => {
    if (!uid) return
    try {
        const userDocument = await db.doc(`users/${ uid }`).get()
        return userDocument.data()
    } catch (e) {
        console.error('Error fetching user', e)
    }
}

export const streamGameData = (gameId, observer) => {
    return db.collection('games')
        .doc(gameId)
        .collection('data')
        .onSnapshot(observer)
}