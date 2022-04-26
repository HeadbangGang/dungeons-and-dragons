import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { setErrors } from '../../store/store'
import { Button, Form } from 'react-bootstrap'
import { auth } from '../../database/firebase'
import { AUTHENTICATION, ERRORS } from '../../helpers/language-map'
import './authentication.scss'

const ResetPassword = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const [emailHasBeenSent, setEmailHasBeenSent] = useState(false)

    const passwordResetHandler = () => {
        event.preventDefault()
        if (email) {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    setEmailHasBeenSent(true)
                })
                .catch((e) => {
                    switch(e){
                    case e.code === 'auth/user-not-found':
                        dispatch(setErrors(ERRORS.emailNotRegistered))
                        break
                    case e.code === 'auth/invalid-email':
                        dispatch(setErrors(ERRORS.enterEmail))
                        break
                    default:
                        dispatch(setErrors(ERRORS.errorSendingEmail))
                    }
                })
        } else {
            dispatch(setErrors(ERRORS.enterEmail))
        }
    }

    return (
        <div className="authentication__page-container">
            <div className="authentication__box">
                <div className="authentication__header">
                    { AUTHENTICATION.resetPassword }
                </div>
                <Form
                    className="authentication__form-container"
                    onSubmit={ () => passwordResetHandler() }
                >
                    <Form.Group>
                        <Form.Label>
                            { AUTHENTICATION.email }
                        </Form.Label>
                        <Form.Control
                            autoComplete="email"
                            data-lpignore="true"
                            onChange={ ({ target }) => setEmail(target.value) }
                            placeholder="example@gmail.com"
                            type="email"
                        />
                        { emailHasBeenSent &&
                        <div>
                            { AUTHENTICATION.resetEmailSent }
                        </div> }
                    </Form.Group>
                    <div className="authentication__submit">
                        <Button
                            variant="outline-dark"
                            type="submit"
                            onClick={ () => passwordResetHandler() }
                        >
                            { AUTHENTICATION.sendResetEmail }
                        </Button>
                    </div>
                </Form>
                <div className="authentication__alt-option__container">
                    <span className="authentication__or">or</span>
                    <div className="authentication__alt-option">
                        <Button
                            variant="dark"
                            onClick={ () => navigate('/account/create-account') }
                        >
                            { AUTHENTICATION.createAnAccount }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
