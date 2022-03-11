import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'next/router'
import { Button, Form } from 'react-bootstrap'
import { setErrors, setUserAccount } from '../../store/store'
import { auth, getUserDocument } from '../../database/firebase'
import { AUTHENTICATION, ERRORS } from '../../helpers/language-map'
import Link from 'next/link'
import { connect } from 'react-redux'

class SignIn extends PureComponent {
    static propTypes = {
        router: PropTypes.object,
        setErrors: PropTypes.func
    }

    state = {
        email: '',
        password: ''
    }

    render(){
        const { router } = this.props
        return (
            <div className="authentication__page-container">
                <div className="authentication__box">
                    <div className="authentication__header">
                        { AUTHENTICATION.signIn }
                    </div>
                    <Form
                        className="authentication__form-container"
                        onSubmit={ this.signInToAccountHandler }
                    >
                        <Form.Group className="authentication__group-wrapper">
                            <Form.Label>
                                { AUTHENTICATION.email }
                            </Form.Label>
                            <Form.Control
                                autoComplete="email"
                                data-lpignore="true"
                                onChange={ (e) => this.setState({
                                    email: e.target.value
                                }) }
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
                                onChange={ (e) => {
                                    this.setState({
                                        password: e.target.value
                                    })
                                } }
                                placeholder="Password"
                                type="password"
                            />
                            <Link href="/account/password-reset" >
                                { AUTHENTICATION.forgotPassword }
                            </Link>
                        </Form.Group>
                        <div className="authentication__submit">
                            <Button
                                onClick={ async () => {
                                    await this.signInToAccountHandler()
                                } }
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
                                onClick={ async () => {
                                    await router.push('/account/create-account')
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
    }

    signInToAccountHandler = async () => {
        event.preventDefault()
        const { email, password } = this.state
        const { router, setErrors } = this.props
        if (email && password) {
            await auth.signInWithEmailAndPassword(email, password)
                .then(async (res) => {
                    const { uid } = res.user
                    await getUserDocument(uid)
                        .then(async (userData) => {
                            const { games, activeGameId } = userData
                            setUserAccount(userData)
                            Object.keys(games).length > 0 || activeGameId
                                ? await router.replace('/')
                                : await router.replace('/account/profile')
                        })
                })
                .catch((err) => {
                    switch(err.code) {
                    case('auth/user-not-found'): 
                        setErrors(ERRORS.noUserFound)
                        break
                    case('auth/wrong-password'):
                        setErrors(ERRORS.wrongPassword)
                        break
                    default:
                        setErrors(ERRORS.signingIn)
                    }
                })
        } else {
            if (!email) {
                setErrors(ERRORS.enterEmail)
            } else if (!password) {
                setErrors(ERRORS.enterPassword)
            }
        }
    }
}

export default connect(null, { setErrors })(withRouter(SignIn))