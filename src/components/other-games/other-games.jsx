import React from 'react'
import I18N from '../I18N/i18n'
import { Card } from 'react-bootstrap'
import { getAllUserGames, getCurrentUser, updateActiveGameID } from '../../store'
import { useDispatch, useSelector } from 'react-redux'
import './other-games.scss'

const OtherGames = () => {
    const dispatch = useDispatch()

    const allUserGames = useSelector(getAllUserGames)
    const userData = useSelector(getCurrentUser)

    return (
        <div className="other-games">
            <I18N blockLevel className="other-games__header" name="homepage.otherGames.header" />
            <div className="other-games__games-wrapper">
                { allUserGames && Object.keys(allUserGames).map((gameId) => {
                    const { characterName } = allUserGames[gameId]
                    if (gameId !== userData.activeGameId) {
                        return (
                            <Card className="other-games__card" key={ gameId }>
                                <Card.Body>
                                    <Card.Title>
                                        { characterName }
                                    </Card.Title>
                                    <Card.Subtitle className="text-muted">
                                        <I18N name="homepage.otherGames.cardGameId" gameId={ gameId } />
                                    </Card.Subtitle>
                                </Card.Body>
                                <a className="stretched-link" href="javascript:void(0)" onClick={ async () => await dispatch(updateActiveGameID(gameId)) }>
                                    { '' }
                                </a>
                            </Card>
                        )
                    }
                }) }
            </div>
        </div>
    )
}

export default OtherGames
