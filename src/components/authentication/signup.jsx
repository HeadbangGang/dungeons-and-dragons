import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { auth, generateUserDocument } from '../../database/firebase'
import { AUTHENTICATION, ERRORS, GENERAL } from '../../language-map'

export default function SignUp ({ setError }) {
    const history = useHistory()

    const [email, setEmail] = useState(null)
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)

    return (
        <div className="authentication-page-container">
            <div className="authentication-box">
                <div className="authentication-header">
                    { AUTHENTICATION.createAnAccount }
                </div>
                <Form
                    className="authentication-form-container"
                    onSubmit={ (e) => createAccountHandler(e) }
                >
                    <Form.Group controlId="formUsername">
                        <Form.Label>
                            { AUTHENTICATION.userName }
                        </Form.Label>
                        <Form.Control
                            autoComplete="off"
                            data-lpignore="true"
                            onChange={ (e) => {
                                setUsername(e.target.value)
                            } }
                            placeholder="ILovePokemon1234"
                        />
                        <Form.Text className="text-muted">
                            { GENERAL.beCreative }
                        </Form.Text>
                    </Form.Group>
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
                        <Form.Text className="text-muted">
                            { AUTHENTICATION.noShareInfo }
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            autoComplete="current-password"
                            data-lpignore="true"
                            onChange={ (e) => {
                                setPassword(e.target.value)
                            } }
                            placeholder="Password"
                            type="password"
                        />
                    </Form.Group>
                    <div className="authentication-submit">
                        <Button
                            variant="outline-danger"
                            type="submit"
                            onClick={ (e) => {
                                createAccountHandler(e)
                            } }
                        >
                            { AUTHENTICATION.createAnAccount }
                        </Button>
                    </div>
                </Form>
                <div className="authentication-alt-option-container">
                    <span className="authentication-or">or</span>
                    <div className="authentication-alt-option">
                        <Button
                            variant="dark"
                            onClick={ () => {
                                history.push('/account/sign-in')
                            } }
                        >
                            { AUTHENTICATION.signIn }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

    async function createAccountHandler (e) {
        e.preventDefault()

        if (email && password && username) {
            try{
                const { user } = await auth.createUserWithEmailAndPassword(email, password)
                generateUserDocument(user, { username })
            }
            catch(e){
                if (e.code === 'auth/email-already-in-use') {
                    setError(ERRORS.emailAlreadyExists)
                } else {
                    setError(e.message)
                }
            }
        } else {
            if (!username) {
                setError(ERRORS.enterUsername)
            } else if (!email) {
                setError(ERRORS.enterEmail)
            } else if (!password) {
                setError(ERRORS.enterPassword)
            }
        }
    }
}

SignUp.propTypes = {
    setError: PropTypes.func
}