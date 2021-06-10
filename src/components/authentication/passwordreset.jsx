import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'
import { auth } from '../../database/firebase'
import { useHistory } from 'react-router-dom'
import { AUTHENTICATION, ERRORS } from '../../language-map'
import './authentication.css'

export default function PasswordReset ({ setError }) {
    const history = useHistory()

    const [email, setEmail] = useState(null)
    const [emailHasBeenSent, setEmailHasBeenSent] = useState()

    return (
        <div className="authentication-page-container">
            <div className="authentication-box">
                <div className="authentication-header">
                    { AUTHENTICATION.resetPassword }
                </div>
                <Form
                    className="authentication-form-container"
                    onSubmit={ (e) => passwordResetHandler(e) }
                >
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>
                            { AUTHENTICATION.email }
                        </Form.Label>
                        <Form.Control
                            autoComplete="email"
                            data-lpignore="true"
                            onChange={ (e) => {
                                setEmail(e.target.value)
                            } }
                            placeholder="example@gmail.com"
                            type="email"
                        />
                        { emailHasBeenSent &&
                    <div>
                        { AUTHENTICATION.resetEmailSent }
                    </div> }
                    </Form.Group>
                    <div className="authentication-submit">
                        <Button
                            variant="outline-dark"
                            type="submit"
                            onClick={ (e) => passwordResetHandler(e) }
                        >
                            { AUTHENTICATION.sendResetEmail }
                        </Button>
                    </div>
                </Form>
                <div className="authentication-alt-option-container">
                    <span className="authentication-or">or</span>
                    <div className="authentication-alt-option">
                        <Button
                            variant="dark"
                            onClick={ () => {
                                history.push('/account/sign-up')
                            } }
                        >
                            { AUTHENTICATION.createAnAccount }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

    function passwordResetHandler (e) {
        e.preventDefault()
        if (email) {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    setEmailHasBeenSent(true)
                })
                .catch((e) => {
                    switch(e){
                    case e.code === 'auth/user-not-found':
                        setError(ERRORS.emailNotRegistered)
                        break
                    case e.code === 'auth/invalid-email':
                        setError(ERRORS.enterEmail)
                        break
                    default:
                        setError(ERRORS.errorSendingEmail)
                    }
                })
        } else {
            setError(ERRORS.enterEmail)
        }
    }
}

PasswordReset.propTypes = {
    setError: PropTypes.func
}