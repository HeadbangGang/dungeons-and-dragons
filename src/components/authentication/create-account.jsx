import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Collapse, Form } from 'react-bootstrap'
import { auth, generateUserDocument } from '../../database/firebase'
import { setErrors, setUserAccount } from '../../store/store'
import { AUTHENTICATION, ERRORS } from '../../helpers/language-map'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'

class CreateAccount extends PureComponent {
    static propTypes = {
        router: PropTypes.object,
        setErrors: PropTypes.func,
        setUserAccount: PropTypes.func
    }

    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        passwordMatches: false,
        shouldShowPasswordConfirmation: false,
        shouldShowPassword: false
    }

    render() {
        const { router } = this.props
        const { shouldShowPasswordConfirmation, shouldShowPassword } = this.state

        return (
            <div className="authentication__page-container">
                <div className="authentication__box">
                    <div className="authentication__header">
                        { AUTHENTICATION.createAnAccount }
                    </div>
                    <Form
                        className="authentication__form-container"
                        onSubmit={ this.createAccountHandler }
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
                                    onChange={ this.formInputHandler }
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
                                    onChange={ this.formInputHandler }
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
                                onChange={ this.formInputHandler }
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
                                onChange={ this.formInputHandler }
                                placeholder="Password"
                                maxLength="15"
                                type={ shouldShowPassword ? 'text' : 'password' }
                            />
                            <a
                                className="authentication__display-password"
                                href="#"
                                onClick={ this.formInputHandler }
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
                                    onChange={ this.formInputHandler }
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
                                onClick={ async () => await this.createAccountHandler() }
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
                                onClick={ async () => {
                                    await router.push('/account/sign-in')
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

    formInputHandler = () => {
        const { id, value } = event.target
        switch(id) {
        case('first-name'):
            this.setState({
                firstName: value
            })
            break
        case('last-name'): 
            this.setState({
                lastName: value
            })
            break
        case('email'):
            this.setState({
                email: value
            })
            break
        case('password'):
            this.setState({
                password: value
            })
            break
        case('mask-password'):
            this.setState({
                shouldShowPassword: !this.state.shouldShowPassword
            })
            break
        case('confirm-password'):
            this.setState({
                passwordConfirmation: value
            })
        }
    }

    createAccountHandler = async () => {
        const { router, setErrors, setUserAccount } = this.props
        const {
            firstName,
            lastName,
            email,
            password,
            passwordConfirmation,
            shouldShowPasswordConfirmation
        } = this.state

        event.preventDefault()
        if (email && password.length > 5 && firstName && lastName && password) {
            !shouldShowPasswordConfirmation && this.setState({ shouldShowPasswordConfirmation: true })
            if (password === passwordConfirmation) {
                const fullName = `${firstName} ${lastName}`
                await auth.createUserWithEmailAndPassword(email, password)
                    .then(async (res) => {
                        const{ user } = res
                        await generateUserDocument(user, { fullName })
                            .then((data) => {
                                setUserAccount(data)
                            })
                            .then(async () => {
                                await router.replace('/account/profile')
                            })
                    })
                    .catch((err) => {
                        switch(err) {
                        case('auth/email-already-in-use') :
                            setErrors(ERRORS.emailAlreadyExists)
                            break
                        default:
                            setErrors(err.message)
                        }
                    })
            } else {
                shouldShowPasswordConfirmation && setErrors('password broke boi')
            }
        } else {
            if (!firstName) {
                setErrors(ERRORS.enterFirstName)
            } else if (!lastName){
                setErrors(ERRORS.enterLastName)
            } else if (!email) {
                setErrors(ERRORS.enterEmail)
            } else if (!password) {
                setErrors(ERRORS.enterPassword)
            } else if (password.length < 6) {
                setErrors('password needs to be longer')
            }
        }
    }
}

export default connect(null, { setErrors, setUserAccount })(withRouter(CreateAccount))