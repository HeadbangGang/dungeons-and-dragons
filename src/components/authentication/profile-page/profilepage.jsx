import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { auth, db, storage } from '../../../database/firebase'
import { Col, Row, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { setError } from '../../../store/store'
import { AUTHENTICATION, GENERAL } from '../../../language-map'
import AddToGame from './addtogame'
import './profile-page.css'
import userIcon from '../../../media/d20.png'
import editIcon from '../../../media/edit.png'
import { getCurrentUser, updatePhotoUrl, getProfilePicture } from '../../../store/store'


export default function ProfilePage () {
    const history = useHistory()
    const inputFile = useRef(null)
    const dispatch = useDispatch()
    const [profilePictureBlob, setProfilePictureBlob] = useState(null)
    const [profilePicturePath, setProfilePicturePath] = useState(null)

    const userData = useSelector(getCurrentUser)
    const profilePicture = useSelector(getProfilePicture)

    useEffect(() => {
        if (profilePictureBlob && profilePicturePath) {
            updateDBProfilePicture()
        } else if (profilePictureBlob) {
            changeProfilePicture()
        }
    }, [profilePictureBlob, profilePicturePath])

    const changeProfilePicture = async () => {
        const storageRef = storage.ref(`${ userData.get('uid') }/profilePicture/${ profilePictureBlob.name }`)
        storageRef.put(profilePictureBlob).then(() => {
            storageRef.getDownloadURL().then((url) => {
                setProfilePicturePath(url)
            })
        })
    }

    const updateDBProfilePicture = async () => {
        const userAccount = db.collection('users').doc(userData.get('uid'))
        try {
            await userAccount.update({
                photoURL: profilePicturePath
            })
            dispatch(updatePhotoUrl(profilePicturePath))
        } catch (e) {
            dispatch(setError(e.message))
        }
    }

    return (
        <>
            { userData?.get('email') && userData?.get('fullName')
                ? <Col xl={ 12 } lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                    <Row style={{ placeContent: 'center' }}>
                        <img className='profile-edit-img' src={ editIcon } alt='' />
                        <div className='profile-img-wrapper'>
                            <input
                                alt='profile-img'
                                className='profile-page-img'
                                onClick={ () => inputFile.current.click() }
                                src={ profilePicture || userIcon }
                                type='image'
                            />
                            <input
                                accept="image/png, image/jpeg"
                                type='file'
                                id='file'
                                ref={ inputFile }
                                style={{ display: 'none' }}
                                onChange={ () => { setProfilePictureBlob(inputFile.current.files[0]) } }
                            />
                        </div>
                    </Row>
                    <Row style={{ placeContent: 'center' }}>
                        <div style={{ margin: '25px', textAlign: 'center' }}>
                            <h2>{ userData.get('fullName') }</h2>
                            <h3>{ userData.get('email') }</h3>
                            <Button
                                onClick={ async () => {
                                    try {
                                        await auth.signOut()
                                            .then(history.push('/'))
                                    } catch (e) {
                                        dispatch(setError(e))
                                    }
                                } }
                                variant='danger'
                            >
                                { AUTHENTICATION.signOut }
                            </Button>
                        </div>
                    </Row>
                    <Row style={{ placeContent: 'center', minHeight: '150px' }}>
                        <AddToGame />
                    </Row>
                </Col>
                : <div>{ GENERAL.loading }</div>
            }
        </>
    )
}
