import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { db } from '../../../database/firebase'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { ERRORS, AUTHENTICATION } from '../../../language-map'
import './profile-page.css'
import { getCurrentUser, updateUserAccount, updateActiveGameData } from '../../../store/store'


export default function AddToGame ({ setError }) {
    const history = useHistory()
    const dispatch = useDispatch()

    const userData = useSelector(getCurrentUser)

    const [gameId, setGameId] = useState()
    const [characterName, setCharacterName] = useState()

    const createGame = async () => {
        const gameIds = []
        const userAccount = db.collection('users').doc(userData.get('uid'))
        const accountDataCall = await userAccount.get()
        const userAccountData = accountDataCall.data()
        const games = db.collection('games')
        const gamesSnapshot = await games.get()
        gamesSnapshot.forEach(game => {
            gameIds.push(game.id)
        })

        const existingGameDataUserAccount = userAccountData.games

        if (gameId && !gameIds.includes(gameId)) {
            dispatch(updateUserAccount(gameId, characterName, existingGameDataUserAccount))
            dispatch(updateActiveGameData(gameId, characterName, true))
            history.push('/')
        } else {
            setError(ERRORS.gameAlreadyExists)
        }
    }

    const joinGame = async () => {
        const gameIds = []
        const userAccount = db.collection('users').doc(userData.get('uid'))
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
                            characterName: characterName,
                            player: userData.get('fullName'),
                            playerProfileImg: userData.get('photoURL', null)
                        }
                    }
                })
                await games.doc(gameId).update({
                    players: { ...existingGlobalGameData,
                        [userData.get('uid')]: {
                            characterName: characterName,
                            owner: userData.get('fullName'),
                            ownerProfileImg: userData.get('photoURL', null)
                        }
                    }
                }).then(() => {
                    history.push('/')
                })
            } catch (e) {
                setError(e)
            }
        } else {
            const userGames = Object.keys(userData.get('games'))
            switch(userGames){
            case userGames.includes(gameId):
                setError(ERRORS.playerExists)
                break
            default:
                setError(ERRORS.gameDoesNotExist)
            }
        }
    }

    return (
        <div style={{ marginTop: '25px', border: '1px solid black', padding: '10px' }}>
            <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-sm">
                        { AUTHENTICATION.gameId }
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    onChange={ (e) => setGameId(e.target.value) }
                />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-sm">
                        { AUTHENTICATION.characterName }
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    type='tel'
                    onChange={ (e) => setCharacterName(e.target.value) }
                />
            </InputGroup>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button variant='dark' onClick={ () => joinGame() }>
                    { AUTHENTICATION.joinGame }
                </Button>
                <Button variant='dark' onClick={ () => createGame() }>
                    { AUTHENTICATION.createGame }
                </Button>
            </div>
        </div>
    )
}

AddToGame.propTypes={
    setError: PropTypes.func
}