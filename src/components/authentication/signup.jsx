import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { auth, generateUserDocument } from '../../database/firebase'
import { setError } from '../../store/store'
import { AUTHENTICATION, ERRORS } from '../../language-map'
import './authentication.css'

export default function SignUp () {
    const dispatch = useDispatch()
    const history = useHistory()

    const [email, setEmail] = useState(null)
    const [fullName, setFullName] = useState(null)
    const [password, setPassword] = useState(null)

    return (
        <div className="authentication-page-container">
            <div className="authentication-box">
                <div className="authentication-header">
                    { AUTHENTICATION.createAnAccount }
                </div>
                <Form
                    className="authentication-form-container"
                    onSubmit={ (e) => {
                        e.preventDefault()
                        createAccountHandler(e)
                    } }
                >
                    <Form.Group controlId="formFullName">
                        <Form.Label>
                            { AUTHENTICATION.fullName }
                        </Form.Label>
                        <Form.Control
                            autoComplete="off"
                            data-lpignore="true"
                            onChange={ (e) => {
                                setFullName(e.target.value)
                            } }
                            placeholder='Samwise Gamgee'
                            maxLength='20'
                        />
                        <Form.Text className="text-muted">
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
                            maxLength='30'
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
                            maxLength='15'
                            type="password"
                        />
                    </Form.Group>
                    <div className="authentication-submit">
                        <Button
                            variant="outline-dark"
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
        if (email && password && fullName) {
            try {
                const { user } = await auth.createUserWithEmailAndPassword(email, password)
                generateUserDocument(user, { fullName })
            } catch(e) {
                if (e.code === 'auth/email-already-in-use') {
                    dispatch(setError(ERRORS.emailAlreadyExists))
                } else {
                    dispatch(setError(e.message))
                }
            }
        } else {
            if (!fullName) {
                dispatch(setError(ERRORS.enterFullName))
            } else if (!email) {
                dispatch(setError(ERRORS.enterEmail))
            } else if (!password) {
                dispatch(setError(ERRORS.enterPassword))
            }
        }
    }
}
