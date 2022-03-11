import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { auth, db, storage } from '../../../database/firebase'
import { Button } from 'react-bootstrap'
import { withRouter } from 'next/router'
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

class ProfilePage extends Component {
    static propTypes = {
        email: PropTypes.string,
        fullName: PropTypes.string,
        profilePicture: PropTypes.string,
        router: PropTypes.object,
        setErrors: PropTypes.func,
        setUserAccount: PropTypes.func,
        uid: PropTypes.string,
        updatePhotoUrl: PropTypes.func
    }

    state = {
        profilePictureBlob: '',
        profilePicturePath: ''
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState !== this.state){
            if (this.state.profilePictureBlob && this.state.profilePicturePath) {
                await this.updateDBProfilePicture()
            } else if (this.state.profilePictureBlob) {
                await this.changeProfilePicture()
            }
        }
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                { this.props.email && this.props.fullName
                    ?   <>
                        <div style={{ alignSelf: 'center' }}>

                            <img className="profile-edit-img" src="/media/edit.png" alt="" />
                            <div className="profile-img-wrapper">
                                <input
                                    alt="profile-img"
                                    className="profile-page-img"
                                    onClick={ () => this.inputFile.current.click() }
                                    src={ this.props.profilePicture || '/media/d20.png' }
                                    type="image"
                                />
                                <input
                                    accept="image/png, image/jpeg"
                                    type="file"
                                    id="file"
                                    ref={ this.inputFile }
                                    style={{ display: 'none' }}
                                    onChange={ () => {
                                        this.fileValidation(this.inputFile.current.files[0])
                                    } }
                                />
                            </div>
                        </div>
                        <div>
                            <div style={{ margin: '25px', textAlign: 'center' }}>
                                <h2>{ this.props.fullName }</h2>
                                <h3>{ this.props.email }</h3>
                                <Button
                                    onClick={ async () => await this.signOut() }
                                    variant="danger"
                                >
                                    { AUTHENTICATION.signOut }
                                </Button>
                            </div>
                        </div>
                        <div className="profile-page-add-to-game-wrapper">
                            <AddToGame />
                        </div>
                    </>
                    : <div>
                        <img src="/media/spinner.webp" alt="loading" className="profile-page-spinner" />
                    </div>
                }
            </div>
        )
    }

    inputFile = createRef()

    changeProfilePicture = async () => {
        const { profilePictureBlob } = this.state
        const { uid, setErrors } = this.props
        const storageRef = storage.ref(`${ uid }/profilePicture/image`)
        await storageRef.put(profilePictureBlob)
            .then(async () => {
                await storageRef.getDownloadURL()
                    .then((url) => {
                        this.setState({
                            profilePicturePath: url
                        })
                    })
            })
            .catch(() => {
                setErrors(ERRORS.generic)
            })
    }

    updateDBProfilePicture = async () => {
        const { uid, setErrors, updatePhotoUrl } = this.props
        const { profilePicturePath } = this.state
        const userAccount = db.collection('users').doc(uid)
        await userAccount.update({ photoURL: profilePicturePath })
            .then (() => {
                console.log(profilePicturePath)
                updatePhotoUrl(profilePicturePath)
                this.setState({
                    profilePicturePath: '',
                    profilePictureBlob: ''
                })
            })
            .catch((err) => {
                setErrors(err.message)
            })
    }

    fileValidation = (fileBlob) => {
        const { setErrors } = this.props
        const fsize = fileBlob.size
        const fileSize = Math.round((fsize / 1024))
        if (fileSize >= 10240) {
            setErrors('File too Big, please select a file less than 10MB')
        } else {
            this.setState({
                profilePictureBlob: fileBlob
            })
        }
    }

    signOut = async () => {
        const { router, setUserAccount, setErrors } = this.props
        await auth.signOut()
            .then(() => {
                setUserAccount({})
            })
            .then(async () => {
                await router.replace('/')
            })
            .catch((err) => {
                setErrors(err)
            })
    }
}

const mapStateToProps = (state) => {
    return {
        email: getCurrentEmail(state),
        fullName: getCurrentFullName(state),
        profilePicture: getProfilePicture(state),
        uid: getCurrentUID(state)
    }
}

export default connect(mapStateToProps, { setErrors, setUserAccount, updatePhotoUrl })(withRouter(ProfilePage))