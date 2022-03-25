import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ERRORS } from '../../helpers/language-map'
import { getErrors, removeErrors } from '../../store/store'
import { Toast, ToastContainer } from 'react-bootstrap'
import { connect } from 'react-redux'
import { MAX_ERROR_QUANTITY } from '../../helpers/constants'

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
                    { errors.map((item, idx) => (
                        <Toast key={ idx }>
                            <Toast.Header>
                                <strong>
                                    { ERRORS.error }
                                </strong>
                            </Toast.Header>
                            <Toast.Body>{ item }</Toast.Body>
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
