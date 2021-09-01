import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setError } from '../../../store/store'
import { db } from '../../../database/firebase'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { ERRORS, AUTHENTICATION } from '../../../language-map'
import * as firebaseParser from 'firestore-parser'
import './profile-page.css'
import { getCurrentUser, updateUserAccount, updateActiveGameData } from '../../../store/store'


export default function AddToGame () {
    const history = useHistory()
    const dispatch = useDispatch()

    const userData = useSelector(getCurrentUser)

    const [gameId, setGameId] = useState('')
    const [characterName, setCharacterName] = useState('')
    const [isDM, setIsDM] = useState(false)

    const gameQueryHandler = async (isNewGame) => {
        if (gameId) {
            if (characterName) {
                const gameIds = []
                let res = await fetch('https://firestore.googleapis.com/v1/projects/dungeons-and-dragons-30601/databases/(default)/documents/games/')
                if (res.status === 200) {
                    res = await res.json()
                    res = firebaseParser(res)
                    res.documents.forEach(doc => {
                        gameIds.push(doc.name.substr(doc.name.lastIndexOf('/') + 1))
                    })
                    const userAccount = db.collection('users').doc(userData.get('uid'))
                    const accountDataCall = await userAccount.get() // Need to migrate to the REST api
                    const userAccountData = accountDataCall.data()
                    const existingGameDataUserAccount = userAccountData.games
                    const cleanGameId = gameId.replaceAll(' ', '')
                    if (isNewGame) {
                        if (cleanGameId && !gameIds.includes(cleanGameId)) {
                            dispatch(updateUserAccount(cleanGameId, characterName, existingGameDataUserAccount))
                            dispatch(updateActiveGameData(cleanGameId, characterName, false, undefined, isNewGame, isDM))
                            history.push('/')
                        } else {
                            dispatch(setError(ERRORS.gameAlreadyExists))
                        }
                    } else {
                        const gameIndex = res.documents.findIndex(doc => doc.name.substr(doc.name.lastIndexOf('/') + 1) === cleanGameId)
                        const gameExists = gameIndex > -1
                        if (gameExists) {
                            try {
                                res = await fetch(`https://firestore.googleapis.com/v1/projects/dungeons-and-dragons-30601/databases/(default)/documents/games/${ cleanGameId }/data/players`)
                                if (res.status === 200) {
                                    res = await res.json()
                                    res = firebaseParser(res)
                                    const gameData = res.fields
                                    const listOfPlayers = Object.values(gameData)
                                    const hasDM = listOfPlayers.findIndex(player => player.gameMaster) > -1
                                    const playerAlreadyExists = listOfPlayers.findIndex(player => player.characterName === characterName) > -1
                                    if (cleanGameId && gameIds.includes(cleanGameId) && !Object.keys(userAccountData.games).includes(cleanGameId)) {
                                        dispatch(updateUserAccount(cleanGameId, characterName, existingGameDataUserAccount))
                                        dispatch(updateActiveGameData(cleanGameId, characterName, false, undefined, isNewGame, isDM))
                                        history.push('/')
                                    } else {
                                        if (playerAlreadyExists) {
                                            dispatch(setError(ERRORS.playerExists))
                                        } else if (hasDM && isDM) {
                                            dispatch(setError('This game already has a Game Master'))
                                            setIsDM(false)
                                        }
                                    }
                                }
                            } catch (e) {
                                dispatch(setError(e.message))
                            }
                        } else {
                            dispatch(setError(ERRORS.gameDoesNotExist))
                        }}
                } else {
                    dispatch(setError(`Status: ${ res.status }: There was an error with your request, please try again.`)) //Revisit this message
                }
            } else {
                dispatch(setError('Please enter a Character Name'))
            }
        } else {
            dispatch(setError('Please enter a Game ID'))
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
