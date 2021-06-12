import React, { useState } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import d20Vector from '../../media/d20-vector-good.png'
import spinner from '../../media/spinner.webp'
import { GENERAL } from '../../language-map'
import './dnd-home.css'

export const DndHome = () => {
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
                    <div className='dnd-home-title'>
                        <strong>
                            { GENERAL.dungeonsAndDragons }
                        </strong>
                    </div>
                </Row>
            </Col>
        </Container>
    )
}