import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { setErrors, setUserAccount } from '../../store/store'
import { auth, getUserDocument } from '../../database/firebase'
import { AUTHENTICATION, ERRORS } from '../../helpers/language-map'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import './authentication.scss'

const SignIn  = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const signInToAccountHandler = async () => {
        event.preventDefault()
        if (email && password) {
            await auth.signInWithEmailAndPassword(email, password)
                .then(async (res) => {
                    const { uid } = res.user
                    await getUserDocument(uid)
                        .then(async (userData) => {
                            const { games, activeGameId } = userData
                            setUserAccount(userData)
                            Object.keys(games).length > 0 || activeGameId
                                ? await navigate('/', { replace: true })
                                : await navigate('/account/profile', { replace: true })
                        })
                })
                .catch((err) => {
                    switch(err.code) {
                    case('auth/user-not-found'):
                        dispatch(setErrors(ERRORS.noUserFound))
                        break
                    case('auth/wrong-password'):
                        dispatch(setErrors(ERRORS.wrongPassword))
                        break
                    default:
                        dispatch(setErrors(ERRORS.signingIn))
                    }
                })
        } else {
            if (!email) {
                dispatch(setErrors(ERRORS.enterEmail))
            } else if (!password) {
                dispatch(setErrors(ERRORS.enterPassword))
            }
        }
    }

    return (
        <div className="authentication__page-container">
            <div className="authentication__box">
                <div className="authentication__header">
                    { AUTHENTICATION.signIn }
                </div>
                <Form
                    className="authentication__form-container"
                    onSubmit={ async () => await signInToAccountHandler() }
                >
                    <Form.Group className="authentication__group-wrapper">
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
                    </Form.Group>
                    <Form.Group className="authentication__group-wrapper">
                        <Form.Label>
                            { AUTHENTICATION.password }
                        </Form.Label>
                        <Form.Control
                            autoComplete="current-password"
                            data-lpignore="true"
                            onChange={ ({ target }) => setPassword(target.value) }
                            placeholder="Password"
                            type="password"
                        />
                        <Link to="/account/password-reset">
                            { AUTHENTICATION.forgotPassword }
                        </Link>
                    </Form.Group>
                    <div className="authentication__submit">
                        <Button
                            onClick={ async () => await signInToAccountHandler() }
                            type="submit"
                            variant="outline-dark"
                        >
                            { AUTHENTICATION.signIn }
                        </Button>
                    </div>
                </Form>
                <div className="authentication__alt-option__container">
                    <span className="authentication__or">or</span>
                    <div className="authentication__alt-option">
                        <Button
                            onClick={ () => navigate('/account/create-account', { replace: true }) }
                            variant="dark"
                        >
                            { AUTHENTICATION.createAnAccount }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn
