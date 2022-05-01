import React, { useState } from 'react'
import { Container, Col, Row, Card } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { getAllUserGames, updateActiveGameID, getCurrentUser } from '../../store/store'
import d20Vector from '../../media/d20-vector-good.png'
import spinner from '../../media/spinner.webp'
import { GENERAL } from '../../language-map'
import './dnd-home.css'

export const DndHome = () => {
    const dispatch = useDispatch()
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    const allUserGames = useSelector(getAllUserGames)
    const userData = useSelector(getCurrentUser)

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
                {allUserGames?.keySeq().size > 1 &&
                <Row style={{ marginTop: '25px' }}>
                    <h2>Other Games:</h2>
                </Row> }
                <Row>
                    { allUserGames && allUserGames.keySeq().map((gameId, index) => {
                        const gameData = allUserGames.get(gameId)
                        if (gameId !== userData.get('activeGameId')) {
                            return (
                                <div key={ index } style={{ margin: '10px' }}>
                                    <Card className='dnd-home-card'>
                                        <Card.Body>
                                            <Card.Title>
                                                { gameData.get('characterName') }
                                            </Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">
                                                {`ID: ${ gameId }`}
                                            </Card.Subtitle>
                                        </Card.Body>
                                        <a className='stretched-link' onClick={ () => {
                                            dispatch(updateActiveGameID(gameId))
                                        } }
                                        ></a>
                                    </Card>
                                </div>
                            )
                        }
                    })
                    }
                </Row>
            </Col>
        </Container>
    )
}