import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { getErrors, removeErrors } from '../../store'
import { Toast, ToastContainer } from 'react-bootstrap'
import { connect } from 'react-redux'
import { MAX_ERROR_QUANTITY } from '../../helpers/constants'
import I18N from '../I18N/i18n'
import './alerts.scss'

class Alerts extends PureComponent {

    componentDidMount() {
        this.props.errors.length && this.props.removeErrors(true)
    }

    componentDidUpdate(prevProps) {
        const { errors } = this.props
        if (errors.length !== prevProps.errors.length && errors.length > 0 && errors.length <= MAX_ERROR_QUANTITY) {
            for (let i = 0; i < errors.length - prevProps.errors.length; i++) {
                setTimeout(() => {
                    this.props.removeErrors()
                    this.forceUpdate()
                }, 5000)
            }
        }
    }

    render() {
        const { errors } = this.props
        return (
            <div className="alerts">
                <ToastContainer className="alerts__toast-container">
                    { errors.map((errorMessage, idx) => (
                        <Toast key={ idx }>
                            <Toast.Header closeButton={ false }>
                                <strong>
                                    <I18N name="errors.error" />
                                </strong>
                            </Toast.Header>
                            <Toast.Body>{ errorMessage }</Toast.Body>
                        </Toast>
                    )) }
                </ToastContainer>
            </div>
        )
    }
}

Alerts.propTypes = {
    errors: PropTypes.array,
    removeErrors: PropTypes.func
}

const mapStateToProps = state => {
    return {
        errors: getErrors(state)
    }
}

export default connect(mapStateToProps, { removeErrors })(Alerts)
