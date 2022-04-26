import React, { useEffect, useState } from 'react'
import { Button, Collapse, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { auth, generateUserDocument } from '../../database/firebase'
import { setErrors, setUserAccount } from '../../store/store'
import { AUTHENTICATION, ERRORS } from '../../helpers/language-map'
import { useNavigate } from 'react-router'
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

    useEffect(() => {
        if (password === passwordConfirmation && !passwordMatches) {
            setPasswordMatches(true)
        }
        if (password !== passwordConfirmation && passwordMatches) {
            setPasswordMatches(false)
        }
    }, [password, passwordConfirmation])

    const createAccountHandler = async () => {
        event.preventDefault()
        if (email && password.length > 5 && firstName && lastName && password) {
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
                                navigate('/account/profile', { replace: true })
                            })
                    })
                    .catch((err) => {
                        switch(err) {
                        case('auth/email-already-in-use') :
                            dispatch(setErrors(ERRORS.emailAlreadyExists))
                            break
                        default:
                            dispatch(setErrors(err.message))
                        }
                    })
            } else {
                shouldShowPasswordConfirmation && dispatch(setErrors('password broke boi')) // fix this
            }
        } else {
            if (!firstName) {
                dispatch(setErrors(ERRORS.enterFirstName))
            } else if (!lastName){
                dispatch(setErrors(ERRORS.enterLastName))
            } else if (!email) {
                dispatch(setErrors(ERRORS.enterEmail))
            } else if (!password) {
                dispatch(setErrors(ERRORS.enterPassword))
            } else if (password.length < 6) {
                dispatch(setErrors('password needs to be longer'))
            }
        }
    }

    return (
        <div className="authentication__page-container">
            <div className="authentication__box">
                <div className="authentication__header">
                    { AUTHENTICATION.createAnAccount }
                </div>
                <Form
                    className="authentication__form-container"
                    onSubmit={ async () => await createAccountHandler() }
                >
                    <div className="authentication__users-name__container">
                        <Form.Group>
                            <Form.Label>
                                { AUTHENTICATION.firstName }
                            </Form.Label>
                            <Form.Control
                                autoComplete="given-name"
                                data-lpignore="true"
                                id="first-name"
                                onChange={ ({ target }) => setFirstName(target.value) }
                                placeholder="Samwise"
                                maxLength="20"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                { AUTHENTICATION.lastName }
                            </Form.Label>
                            <Form.Control
                                autoComplete="family-name"
                                data-lpignore="true"
                                id="last-name"
                                onChange={ ({ target }) => setLastName(target.value) }
                                placeholder="Gamgee"
                                maxLength="20"
                            />
                        </Form.Group>
                    </div>
                    <Form.Group className="authentication__group-wrapper">
                        <Form.Label>
                            { AUTHENTICATION.email }
                        </Form.Label>
                        <Form.Control
                            autoComplete="email"
                            data-lpignore="true"
                            id="email"
                            onChange={ ({ target }) => setEmail(target.value) }
                            placeholder="example@gmail.com"
                            maxLength="30"
                            type="email"
                        />
                        <Form.Text className="text-muted">
                            { AUTHENTICATION.noShareInfo }
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="authentication__group-wrapper">
                        <Form.Label>{ AUTHENTICATION.password }</Form.Label>
                        <Form.Control
                            autoComplete="current-password"
                            data-lpignore="true"
                            id="password"
                            onChange={ ({ target }) => setPassword(target.value) }
                            placeholder="Password"
                            maxLength="15"
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
                            <Form.Label>{ AUTHENTICATION.confirmPassword }</Form.Label>
                            <Form.Control
                                autoComplete="current-password"
                                data-lpignore="true"
                                id="confirm-password"
                                onChange={ ({ target }) => setPasswordConfirmation(target.value) }
                                placeholder="Password"
                                maxLength="15"
                                type={ shouldShowPassword ? 'text' : 'password' }
                            />
                        </Form.Group>
                    </Collapse>
                    <div className="authentication__submit">
                        <Button
                            variant="outline-dark"
                            type="submit"
                            onClick={ async () => await createAccountHandler() }
                        >
                            { AUTHENTICATION.createAnAccount }
                        </Button>
                    </div>
                </Form>
                <div className="authentication__alt-option__container">
                    <span className="authentication__or">or</span>
                    <div className="authentication__alt-option">
                        <Button
                            variant="dark"
                            onClick={ () => {
                                navigate('/account/sign-in')
                            } }
                        >
                            { AUTHENTICATION.signIn }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount
