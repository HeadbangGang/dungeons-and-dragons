import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { auth } from '../../database/firebase'
import { Col, Row, Button } from 'react-bootstrap'
import { UserContext } from '../../providers/userprovider'
import { useHistory } from 'react-router-dom'
import { AUTHENTICATION, GENERAL } from '../../language-map'
import AddToGame from './addtogame'
import './profile-page.css'


export default function ProfilePage ({ setError }) {
    const userContext = useContext(UserContext ?? '')
    const history = useHistory()

    return (
        <>
            { userContext?.email && userContext?.fullName
                ? <Col xl={ 12 } lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                    <Row style={{ placeContent: 'center' }}>
                        <div style={{ margin: '25px', textAlign: 'center' }}>
                            <h2>{ userContext.fullName }</h2>
                            <h3>{ userContext.email }</h3>
                            <Button onClick={ async () => {
                                try {
                                    await auth.signOut()
                                        .then(history.push('/'))
                                } catch (e) {
                                    setError(e)
                                }
                            } }
                            >
                                { AUTHENTICATION.signOut }
                            </Button>
                        </div>
                    </Row>
                    <Row style={{ placeContent: 'center', minHeight: '150px' }}>
                        <AddToGame setError={ setError } />
                    </Row>
                </Col>
                : <div>{ GENERAL.loading }</div>
            }
        </>
    )
}

ProfilePage.propTypes={
    setError: PropTypes.func
}