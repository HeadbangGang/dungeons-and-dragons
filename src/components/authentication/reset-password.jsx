import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setErrors } from '../../store/store'
import { Button, Form } from 'react-bootstrap'
import { withRouter } from 'next/router'
import { auth } from '../../database/firebase'
import { AUTHENTICATION, ERRORS } from '../../helpers/language-map'

class ResetPassword extends PureComponent {
    static propTypes = {
        router: PropTypes.object,
        setErrors: PropTypes.func
    }

    state = {
        email: '',
        emailHasBeenSent: false
    }

    render() {
        const { router } = this.props
        return (
            <div className="authentication__page-container">
                <div className="authentication__box">
                    <div className="authentication__header">
                        { AUTHENTICATION.resetPassword }
                    </div>
                    <Form
                        className="authentication__form-container"
                        onSubmit={ this.passwordResetHandler }
                    >
                        <Form.Group>
                            <Form.Label>
                                { AUTHENTICATION.email }
                            </Form.Label>
                            <Form.Control
                                autoComplete="email"
                                data-lpignore="true"
                                onChange={ (e) => {
                                    this.setState({
                                        email: e.target.value
                                    })
                                } }
                                placeholder="example@gmail.com"
                                type="email"
                            />
                            { this.state.emailHasBeenSent &&
                        <div>
                            { AUTHENTICATION.resetEmailSent }
                        </div> }
                        </Form.Group>
                        <div className="authentication__submit">
                            <Button
                                variant="outline-dark"
                                type="submit"
                                onClick={ this.passwordResetHandler }
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
                                onClick={ async () => {
                                    await router.push('/account/create-account')
                                } }
                            >
                                { AUTHENTICATION.createAnAccount }
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    passwordResetHandler = () => {
        event.preventDefault()
        const { setErrors } = this.props
        const { email } = this.state
        if (email) {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    this.setState({ emailHasBeenSent: true })
                })
                .catch((e) => {
                    switch(e){
                    case e.code === 'auth/user-not-found':
                        setErrors(ERRORS.emailNotRegistered)
                        break
                    case e.code === 'auth/invalid-email':
                        setErrors(ERRORS.enterEmail)
                        break
                    default:
                        setErrors(ERRORS.errorSendingEmail)
                    }
                })
        } else {
            setErrors(ERRORS.enterEmail)
        }
    }
}

export default connect(null, { setErrors })(withRouter(ResetPassword))