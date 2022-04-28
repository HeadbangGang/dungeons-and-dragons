import React, { useState } from 'react'
import { AUTHENTICATION } from '../../helpers/language-map'
import { Button, Form } from 'react-bootstrap'
import { PAGE_URL } from '../../helpers/constants'
import { auth } from '../../database/firebase'
import { firebaseErrorResponse, validateEmail } from '../../helpers/helpers'
import { getCurrentPageId, setErrors } from '../../store'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import './authentication.scss'

const ResetPassword = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [emailHasBeenSent, setEmailHasBeenSent] = useState(false)

    const currentPageId = useSelector(getCurrentPageId)

    const validate = () => {
        let valid = true
        const emailError = validateEmail(email)

        if (emailError) {
            dispatch(setErrors(emailError))
            valid = false
        }
        return valid
    }

    const passwordResetHandler = () => {
        event.preventDefault()
        if (validate()) {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    setEmailHasBeenSent(true)
                })
                .catch((err) => {
                    dispatch(setErrors(firebaseErrorResponse(err, currentPageId)))
                })
        }
    }

    return (
        <div className="authentication__page-container">
            <div className="authentication__box">
                <div className="authentication__header">
                    { AUTHENTICATION.resetPassword }
                </div>
                <Form
                    className="authentication__form-container"
                    onSubmit={ passwordResetHandler }
                >
                    <Form.Group>
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
                        { emailHasBeenSent &&
                        <div>
                            { AUTHENTICATION.resetEmailSent }
                        </div> }
                    </Form.Group>
                    <div className="authentication__submit">
                        <Button
                            variant="outline-dark"
                            type="submit"
                            onClick={ passwordResetHandler }
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
                            onClick={ () => navigate(PAGE_URL.CREATE_ACCOUNT_PAGE) }
                        >
                            { AUTHENTICATION.createAnAccount }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
