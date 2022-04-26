import React, { createRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { auth, db, storage } from '../../../database/firebase'
import { Button } from 'react-bootstrap'
import { AUTHENTICATION, ERRORS } from '../../../helpers/language-map'
import AddToGame from './add-to-game'
import {
    getCurrentEmail,
    getCurrentFullName,
    getCurrentUID,
    getProfilePicture,
    setErrors,
    setUserAccount,
    updatePhotoUrl
} from '../../../store/store'
import './profile.scss'

const ProfilePage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const inputFile = createRef()

    const [profilePictureBlob, setProfilePictureBlob] = useState(null)
    const [profilePicturePath, setProfilePicturePath] = useState('')

    const email = useSelector(getCurrentEmail)
    const fullName = useSelector(getCurrentFullName)
    const uid = useSelector(getCurrentUID)
    const profilePicture = useSelector(getProfilePicture)

    useEffect(async () => {
        if (profilePictureBlob && profilePicturePath) {
            await updateDBProfilePicture()
        } else if (profilePictureBlob) {
            await changeProfilePicture()
        }
    }, [profilePicturePath, profilePictureBlob])

    const changeProfilePicture = async () => {
        const storageRef = storage.ref(`${ uid }/profilePicture/image`)
        await storageRef.put(profilePictureBlob)
            .then(async () => {
                await storageRef.getDownloadURL()
                    .then((url) => setProfilePicturePath(url))
            })
            .catch(() => {
                dispatch(setErrors(ERRORS.generic))
            })
    }

    const updateDBProfilePicture = async () => {
        const userAccount = db.collection('users').doc(uid)
        await userAccount.update({ photoURL: profilePicturePath })
            .then (() => {
                dispatch(updatePhotoUrl(profilePicturePath))
                setProfilePictureBlob('')
                setProfilePicturePath('')
            })
            .catch((err) => {
                dispatch(setErrors(err.message))
            })
    }

    const fileValidation = (fileBlob) => {
        const fsize = fileBlob.size
        const fileSize = Math.round((fsize / 1024))
        if (fileSize >= 10240) {
            dispatch(setErrors('The selected image is too big, please select a file less than 10MB'))
        } else {
            setProfilePictureBlob(fileBlob)
        }
    }

    const signOut = async () => {
        await auth.signOut()
            .then(() => {
                dispatch(setUserAccount({}))
            })
            .then(() => {
                navigate('/', { replace: true })
            })
            .catch((err) => {
                dispatch(setErrors(err))
            })
    }

    return (
        <div className="profile__user-data-wrapper">
            { email && fullName
                ?   <>
                    <div>
                        <img className="profile__img__edit" src="/assets/media/edit.png" alt="" />
                        <div className="profile__img__border">
                            <input
                                alt="profile-img"
                                className="profile__page__img"
                                onClick={ () => inputFile.current.click() }
                                src={ profilePicture || '/assets/media/d20.png' }
                                type="image"
                            />
                            <input
                                accept="image/png, image/jpeg"
                                type="file"
                                id="file"
                                onChange={ () => fileValidation(inputFile.current.files[0]) }
                                ref={ inputFile }
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                    <div style={{ margin: '25px', textAlign: 'center' }}>
                        <h2>{ fullName }</h2>
                        <h3>{ email }</h3>
                        <Button
                            onClick={ async () => await signOut() }
                            variant="danger"
                        >
                            { AUTHENTICATION.signOut }
                        </Button>
                    </div>
                    <AddToGame />
                </>
                : <div>
                    <img src="/assets/media/spinner.webp" alt="loading" className="profile__page__spinner" />
                </div>
            }
        </div>
    )
}

export default ProfilePage
