import React, { useEffect, useState } from 'react'
import { Button, Collapse, Form } from 'react-bootstrap'
import { PAGE_URL } from '../../helpers/constants'
import { auth, generateUserDocument } from '../../database/firebase'
import { firebaseErrorResponse, validateEmail, validateFirstName, validateLastName, validatePassword } from '../../helpers/helpers'
import { getCurrentPageId, setErrors, setUserAccount } from '../../store'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import I18N, { language } from '../I18N/i18n'
import './authentication.scss'

const CreateAccount = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [passwordMatches, setPasswordMatches] = useState(false)
    const [shouldShowPasswordConfirmation, setShouldShowPasswordConfirmation] = useState(false)
    const [shouldShowPassword, setShouldShowPassword] = useState(false)

    const currentPageId = useSelector(getCurrentPageId)

    useEffect(() => {
        if (password === passwordConfirmation && !passwordMatches) {
            setPasswordMatches(true)
        }
        if (password !== passwordConfirmation && passwordMatches) {
            setPasswordMatches(false)
        }
    }, [password, passwordConfirmation])

    const validateForm = () => {
        const firstNameError = validateFirstName(firstName)
        const lastNameError = validateLastName(lastName)
        const emailError = validateEmail(email)
        const passwordError = validatePassword(password)

        if (firstNameError) {
            return handleError(firstNameError)
        } else if (lastNameError){
            return handleError(lastNameError)
        } else if (emailError) {
            return handleError(emailError)
        } else if (!password) {
            return handleError(passwordError)
        } else {
            return true
        }
    }

    const handleError = (error) => {
        dispatch(setErrors(error))
        return false
    }

    const createAccountHandler = async () => {
        event.preventDefault()
        if (validateForm()) {
            !shouldShowPasswordConfirmation && setShouldShowPasswordConfirmation(true)
            if (passwordMatches) {
                const fullName = `${firstName} ${lastName}`
                await auth.createUserWithEmailAndPassword(email, password)
                    .then(async (res) => {
                        const{ user } = res
                        await generateUserDocument(user, { fullName })
                            .then((data) => {
                                dispatch(setUserAccount(data))
                            })
                            .then(() => {
                                navigate(PAGE_URL.PROFILE_PAGE,  { replace: true })
                            })
                    })
                    .catch((err) => {
                        dispatch(setErrors(firebaseErrorResponse(err, currentPageId)))
                    })
            } else {
                if (shouldShowPasswordConfirmation) {
                    dispatch(setErrors(language.errors.passwordsDoNotMatch))
                }
            }
        }
    }

    return (
        <div className="authentication__page-container">
            <div className="authentication__box">
                <I18N blockLevel className="authentication__header" name="authentication.createAnAccount" />
                <Form
                    className="authentication__form-container"
                    onSubmit={ async () => await createAccountHandler() }
                >
                    <div className="authentication__users-name__container">
                        <Form.Group>
                            <Form.Label>
                                <I18N name="authentication.firstName" />
                            </Form.Label>
                            <Form.Control
                                autoComplete="given-name"
                                data-lpignore="true"
                                id="first-name"
                                maxLength="20"
                                onChange={ ({ target }) => setFirstName(target.value) }
                                placeholder="Samwise"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                <I18N name="authentication.lastName" />
                            </Form.Label>
                            <Form.Control
                                autoComplete="family-name"
                                data-lpignore="true"
                                id="last-name"
                                maxLength="20"
                                onChange={ ({ target }) => setLastName(target.value) }
                                placeholder="Gamgee"
                            />
                        </Form.Group>
                    </div>
                    <Form.Group className="authentication__group-wrapper">
                        <Form.Label>
                            <I18N name="authentication.email" />
                        </Form.Label>
                        <Form.Control
                            autoComplete="email"
                            data-lpignore="true"
                            id="email"
                            maxLength="30"
                            onChange={ ({ target }) => setEmail(target.value) }
                            placeholder="example@gmail.com"
                            type="email"
                        />
                        <Form.Text className="text-muted">
                            <I18N name="authentication.noShareInfo" />
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="authentication__group-wrapper">
                        <Form.Label>
                            <I18N name="authentication.password" />
                        </Form.Label>
                        <Form.Control
                            autoComplete="current-password"
                            data-lpignore="true"
                            id="password"
                            maxLength="15"
                            onChange={ ({ target }) => setPassword(target.value) }
                            placeholder="Password"
                            type={ shouldShowPassword ? 'text' : 'password' }
                        />
                        <a
                            className="authentication__display-password"
                            href="#"
                            onClick={ () => setShouldShowPassword(!shouldShowPassword) }
                        >
                            <span className="material-icons"  id="mask-password">
                                { shouldShowPassword ? 'visibility' : 'visibility_off' }
                            </span>
                        </a>
                    </Form.Group>
                    <Collapse in={ shouldShowPasswordConfirmation }>
                        <Form.Group className="authentication__group-wrapper">
                            <Form.Label>
                                <I18N name="authentication.confirmPassword" />
                            </Form.Label>
                            <Form.Control
                                autoComplete="current-password"
                                data-lpignore="true"
                                id="confirm-password"
                                maxLength="15"
                                onChange={ ({ target }) => setPasswordConfirmation(target.value) }
                                placeholder="Password"
                                type={ shouldShowPassword ? 'text' : 'password' }
                            />
                        </Form.Group>
                    </Collapse>
                    <div className="authentication__submit">
                        <Button
                            onClick={ async () => await createAccountHandler() }
                            type="submit"
                            variant="outline-dark"
                        >
                            <I18N name="authentication.createAnAccount" />
                        </Button>
                    </div>
                </Form>
                <div className="authentication__alt-option__container">
                    <span className="authentication__or">or</span>
                    <div className="authentication__alt-option">
                        <Button
                            onClick={ () => navigate(PAGE_URL.SIGN_IN_PAGE) }
                            variant="dark"
                        >
                            <I18N name="authentication.signIn" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount
