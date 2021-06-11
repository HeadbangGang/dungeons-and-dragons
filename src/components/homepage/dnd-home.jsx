import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Col, Row } from 'react-bootstrap'
import d20Vector from '../../media/d20-vector-good.png'
import spinner from '../../media/spinner.webp'
import { db } from '../../database/firebase'
import './dnd-home.css'

export const DndHome = () => {
    const history = useHistory()
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    return (
        <Container fluid style={{ marginTop: '25px' }}>
            <Col xl={ 12 } lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                <Row style={{ placeContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        { isImageLoaded
                            ? <img
                                alt='d20'
                                className='dnd-home-img'
                                draggable={ false }
                                src={ d20Vector }
                            />
                            : <img
                                alt='spinner'
                                className='dnd-home-img-spinner'
                                draggable={ false }
                                onLoad={ () => setIsImageLoaded(true) }
                                src={ spinner }
                            />
                        }
                    </div>
                </Row>
                <Row>
                    <div className='dnd-home-title'><strong>Dungeons and Dragons</strong></div>
                    <button onClick={ () => history.push('/profile') }>Click Me</button>
                </Row>
            </Col>
        </Container>
    )
}