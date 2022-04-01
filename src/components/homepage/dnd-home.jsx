import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUserGames, getCurrentUser, updateActiveGameID } from '../../store/store'
import { GENERAL } from '../../helpers/language-map'

const DndHome = () => {
    const dispatch = useDispatch()

    const allUserGames = useSelector(getAllUserGames)
    const userData = useSelector(getCurrentUser)

    return (
        <Container fluid style={{ marginTop: '25px' }}>
            <Col xl={ 12 } lg={ 12 } md={ 12 } sm={ 12 } xs={ 12 }>
                <Row style={{ placeContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <img
                            alt="d20"
                            className="dnd-home-img"
                            draggable={ false }
                            src="/media/d20-vector-good.png"
                        />
                    </div>
                </Row>
                <Row>
                    <div className="dnd-home-title">
                        <strong>
                            { GENERAL.dungeonsAndDragons }
                        </strong>
                    </div>
                </Row>
                { allUserGames && Object.keys(allUserGames).length > 1 &&
                <Row style={{ marginTop: '25px' }}>
                    <h2>Other Games:</h2>
                </Row> }
                <Row>
                    { allUserGames && Object.keys(allUserGames).map((gameId) => {
                        const gameData = allUserGames[gameId]
                        if (gameId !== userData.activeGameId) {
                            return (
                                <div key={ gameId } style={{ margin: '10px' }}>
                                    <Card className="dnd-home-card">
                                        <Card.Body>
                                            <Card.Title>
                                                { gameData.characterName }
                                            </Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">
                                                { `ID: ${ gameId }` }
                                            </Card.Subtitle>
                                        </Card.Body>
                                        <a className="stretched-link" href="#" onClick={ async () => {
                                            await dispatch(updateActiveGameID(gameId))
                                        } }
                                        >{ '' }</a>
                                    </Card>
                                </div>
                            )
                        }
                    }) }
                </Row>
            </Col>
        </Container>
    )
}

export default DndHome
