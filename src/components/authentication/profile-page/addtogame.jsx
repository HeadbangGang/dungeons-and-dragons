import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setError } from '../../../store/store'
import { db } from '../../../database/firebase'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { ERRORS, AUTHENTICATION } from '../../../language-map'
import './profile-page.css'
import { getCurrentUser, updateUserAccount, updateActiveGameData } from '../../../store/store'


export default function AddToGame () {
    const history = useHistory()
    const dispatch = useDispatch()

    const userData = useSelector(getCurrentUser)

    const [gameId, setGameId] = useState()
    const [characterName, setCharacterName] = useState()
    const [isDM, setIsDM] = useState(false)

    const gameQueryHandler = async (isNewGame) => {
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
        const cleanGameId = gameId.replaceAll(' ', '')
        if (isNewGame) {
            if (cleanGameId && !gameIds.includes(cleanGameId)) {
                dispatch(updateUserAccount(cleanGameId, characterName, existingGameDataUserAccount))
                dispatch(updateActiveGameData(cleanGameId, characterName, isNewGame, isDM))
                history.push('/')
            } else {
                dispatch(setError(ERRORS.gameAlreadyExists))
            }
        } else {
            const globalGameData = games.doc(cleanGameId)
            const globalGameDataCall = await globalGameData.get()
            const existingGlobalGameData = globalGameDataCall.data().players
            const playersList = Object.keys(existingGlobalGameData)
            let gameHasDM
            playersList.forEach(player => {
                if (existingGlobalGameData[player].gameMaster) {
                    gameHasDM = true
                }
            })
            if (gameHasDM && isDM) {
                dispatch(setError('This game already has a Game Master'))
                setIsDM(false)
            } else {
                if (cleanGameId && gameIds.includes(cleanGameId) && !Object.keys(userAccountData.games).includes(cleanGameId)) {
                    dispatch(updateUserAccount(cleanGameId, characterName, existingGameDataUserAccount))
                    dispatch(updateActiveGameData(cleanGameId, characterName, isNewGame, isDM, existingGlobalGameData))
                    history.push('/')
                } else {
                    const userGames = Object.keys(userData.get('games'))
                    if (userGames.includes(cleanGameId)) {
                        dispatch(setError(ERRORS.playerExists))
                    } else {
                        dispatch(setError(ERRORS.gameDoesNotExist))
                    }
                }
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
                    type='tel'
                    maxLength='10'
                    onChange={ (e) => setGameId(e.target.value) }
                />
            </InputGroup>
            {!isDM &&
            <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-sm">
                        { AUTHENTICATION.characterName }
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    maxLength='15'
                    onChange={ (e) => setCharacterName(e.target.value) }
                />
            </InputGroup> }
            <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                <input
                    checked={ isDM }
                    id='dm-query'
                    onChange={ () => {
                        setIsDM(!isDM)
                        if (!isDM) {
                            setCharacterName('Game Master')
                        } else {
                            setCharacterName('')
                        }
                    } }
                    type='checkbox'
                />
                <label
                    className='ml-3'
                    htmlFor='dm-query'
                >
                    Are you the Game Master?
                </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button variant='dark' onClick={ () => gameQueryHandler(false) }>
                    { AUTHENTICATION.joinGame }
                </Button>
                <Button variant='dark' onClick={ () => gameQueryHandler(true) }>
                    { AUTHENTICATION.createGame }
                </Button>
            </div>
        </div>
    )
}
