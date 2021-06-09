import React, { useContext, useState } from 'react'
import { auth, db } from '../../database/firebase'
import { InputGroup, FormControl, Col, Row, Button } from 'react-bootstrap'
import { UserContext } from '../../providers/userprovider'
import { useHistory } from 'react-router-dom'
import { AUTHENTICATION, GENERAL } from '../../language-map'
import './profile-page.css'


export default function ProfilePage () {
    const userContext = useContext(UserContext ?? '')
    const history = useHistory()

    const [gameId, setGameId] = useState()
    const [characterName, setCharacterName] = useState()

    const createGame = async () => {
        const gameIds = []
        const userAccount = db.collection('users').doc(userContext.uid)
        const accountDataCall = await userAccount.get()
        const userAccountData = accountDataCall.data()
        const games = db.collection('games')
        const gamesSnapshot = await games.get()
        gamesSnapshot.forEach(game => {
            gameIds.push(game.id)
        })

        const existingGameDataUserAccount = userAccountData.games

        if (gameId && !gameIds.includes(gameId)) {
            try {
                await userAccount.update({
                    activeGameId: gameId,
                    games: { ...existingGameDataUserAccount,
                        [gameId]: {
                            characterName: characterName
                        }
                    }
                })
                await games.doc(gameId).set({
                    players: {
                        [userContext.fullName]: {
                            characterName: characterName
                        }
                    }
                })
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log('game ID already exists')
        }
    }

    const joinGame = async () => {
        const gameIds = []
        const userAccount = db.collection('users').doc(userContext.uid)
        const accountDataCall = await userAccount.get()
        const userAccountData = accountDataCall.data()
        const games = db.collection('games')
        const gamesSnapshot = await games.get()
        gamesSnapshot.forEach(game => {
            gameIds.push(game.id)
        })

        const existingGameDataUserAccount = userAccountData.games

        if (gameId && gameIds.includes(gameId) && !Object.keys(userAccountData.games).includes(gameId)) {
            const globalGameData = games.doc(gameId)
            const globalGameDataCall = await globalGameData.get()
            const existingGlobalGameData = globalGameDataCall.data().players

            try {
                await userAccount.update({
                    activeGameId: gameId,
                    games: { ...existingGameDataUserAccount,
                        [gameId]: {
                            characterName: characterName
                        }
                    }
                })
                await games.doc(gameId).update({
                    players: { ...existingGlobalGameData,
                        [userContext.fullName]: {
                            characterName: characterName
                        }
                    }
                })
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log('game ID does not exist or user is already in game')
        }
    }

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
                                    console.log(e)
                                }
                            } }
                            >
                                { AUTHENTICATION.signOut }
                            </Button>
                        </div>
                    </Row>
                    <Row style={{ placeContent: 'center', minHeight: '150px' }}>
                        <div style={{ marginTop: '25px', border: '1px solid black', padding: '10px' }}>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">Game ID</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    onChange={ (e) => setGameId(e.target.value) }
                                />
                            </InputGroup>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">Character Name</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    onChange={ (e) => setCharacterName(e.target.value) }
                                />
                            </InputGroup>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <Button onClick={ () => joinGame() }>Join Game</Button>
                                <Button onClick={ () => createGame() }>Create Game</Button>
                            </div>
                        </div>
                    </Row>
                </Col>
                : <div>{ GENERAL.loading }</div>
            }
        </>
    )
}

