import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { db } from '../../database/firebase'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { UserContext } from '../../providers/userprovider'
import './profile-page.css'


export default function AddToGame ({ setError }) {
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
                history.push('/')
            } catch (e) {
                setError(e)
            }
        } else {
            setError('Game ID already exists, please proceed to Join Game')
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
                }).then(() => {
                    history.push('/')
                })
            } catch (e) {
                setError(e)
            }
        } else {
            const userGames = Object.keys(userContext.games)
            switch(userGames){
            case userGames.includes(gameId):
                setError('You are already a player in this game.')
                break
            default:
                setError('The entered Game ID does not exist, please proceed to Create Game')
            }
        }
    }

    return (
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
    )
}

AddToGame.propTypes={
    setError: PropTypes.func
}