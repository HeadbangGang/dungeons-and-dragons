import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { PAGE_URL } from '../../helpers/constants'
import { auth, getUserDocument } from '../../database/firebase'
import { firebaseErrorResponse, validateEmail, validatePassword } from '../../helpers/helpers'
import { getCurrentPageId, setErrors, setUserAccount } from '../../store'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import './authentication.scss'
import I18N from '../I18N/i18n'

const SignIn  = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const currentPageId = useSelector(getCurrentPageId)

    const validate = () => {
        const emailError = validateEmail(email)
        const passwordError = validatePassword(password)

        if (emailError) {
            return handleError(emailError)
        } else if (passwordError) {
            return handleError(passwordError)
        } else {
            return true
        }
    }

    const handleError = (error) => {
        dispatch(setErrors(error))
        return false
    }

    const signInToAccountHandler = async () => {
        event.preventDefault()
        if (validate()) {
            await auth.signInWithEmailAndPassword(email, password)
                .then(async (res) => {
                    const { uid } = res.user
                    await getUserDocument(uid)
                        .then(async (userData) => {
                            const { games, activeGameId } = userData
                            setUserAccount(userData)
                            Object.keys(games).length > 0 || activeGameId
                                ? await navigate(PAGE_URL.HOME_PAGE, { replace: true })
                                : await navigate(PAGE_URL.PROFILE_PAGE, { replace: true })
                        })
                })
                .catch((err) => {
                    console.log(err)
                    dispatch(setErrors(firebaseErrorResponse(err, currentPageId)))
                })
        }
    }

    return (
        <div className="authentication__page-container">
            <div className="authentication__box">
                <I18N blockLevel className="authentication__header" name="authentication.signIn" />
                <Form
                    className="authentication__form-container"
                    onSubmit={ async () => await signInToAccountHandler() }
                >
                    <Form.Group className="authentication__group-wrapper">
                        <Form.Label>
                            <I18N name="authentication.email" />
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
                            <I18N name="authentication.password" />
                        </Form.Label>
                        <Form.Control
                            autoComplete="current-password"
                            data-lpignore="true"
                            onChange={ ({ target }) => setPassword(target.value) }
                            placeholder="Password"
                            type="password"
                        />
                        <div className="authentication__forgot-password">
                            <Button onClick={ () => navigate(PAGE_URL.PASSWORD_RESET_PAGE) } variant="link">
                                <I18N name="authentication.forgotPassword" />
                            </Button>
                        </div>
                    </Form.Group>
                    <div className="authentication__submit">
                        <Button
                            onClick={ async () => await signInToAccountHandler() }
                            type="submit"
                            variant="outline-dark"
                        >
                            <I18N name="authentication.signIn" />
                        </Button>
                    </div>
                </Form>
                <div className="authentication__alt-option__container">
                    <span className="authentication__or">or</span>
                    <div className="authentication__alt-option">
                        <Button
                            onClick={ () => navigate(PAGE_URL.CREATE_ACCOUNT_PAGE, { replace: true }) }
                            variant="dark"
                        >
                            <I18N name="authentication.createAnAccount" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn
