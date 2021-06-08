import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useHistory, Link } from 'react-router-dom'
import { auth } from '../../database/firebase'
import { AUTHENTICATION, ERRORS } from '../../language-map'

export default function SignIn ({ setError }) {
    const history = useHistory()

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    return (
        <div className="authentication-page-container">
            <div className="authentication-box">
                <div className="authentication-header">
                    { AUTHENTICATION.signIn }
                </div>
                <Form
                    className="authentication-form-container"
                    onSubmit={ (e) => signInToAccountHandler(e) }
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
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>
                            { AUTHENTICATION.password }
                        </Form.Label>
                        <Form.Control
                            autoComplete="current-password"
                            data-lpignore="true"
                            onChange={ (e) => {
                                setPassword(e.target.value)
                            } }
                            placeholder="Password"
                            type="password"
                        />
                        <Link
                            to={{ pathname: '/account/password-reset' }}
                        >
                            { AUTHENTICATION.forgotPassword }
                        </Link>
                    </Form.Group>
                    <div className="authentication-submit">
                        <Button
                            onClick={ (e) => {
                                signInToAccountHandler(e)
                            } }
                            type="null"
                            variant="outline-danger"
                        >
                            { AUTHENTICATION.signIn }
                        </Button>
                    </div>
                </Form>
                <div className="authentication-alt-option-container">
                    <span className="authentication-or">or</span>
                    <div className="authentication-alt-option">
                        <Button
                            onClick={ () => {
                                history.push('/account/sign-up')
                            } }
                            variant="dark"
                        >
                            { AUTHENTICATION.createAnAccount }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

    async function signInToAccountHandler (e) {
        e.preventDefault()
        if (email && password) {
            try {
                const res = await auth.signInWithEmailAndPassword(email, password)
                if (res.user) {
                    history.push('/account/profile')
                }
            } catch(e) {
                if (e.code === 'auth/wrong-password') {
                    setError(ERRORS.wrongPassword)
                } else if(e.code === 'auth/user-not-found') {
                    setError(ERRORS.noUserFound)
                } else {
                    setError(ERRORS.signingIn)
                }
            }
        } else {
            if (!email) {
                setError(ERRORS.enterEmail)
            } else if (!password) {
                setError(ERRORS.enterPassword)
            }
        }

    }
}

SignIn.propTypes={
    getUserDocument: PropTypes.func,
    setError: PropTypes.func
}