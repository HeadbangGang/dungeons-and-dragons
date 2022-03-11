import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { setError } from '../../../store/store'
import { db } from '../../../database/firebase'
import { Button, FormControl, InputGroup } from 'react-bootstrap'
import { AUTHENTICATION, ERRORS } from '../../../helpers/language-map'
import { getCurrentUser, updateActiveGameData, updateUserAccount } from '../../../store/store'


const AddToGame =  () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const userData = useSelector(getCurrentUser)

    const [gameId, setGameId] = useState('')
    const [characterName, setCharacterName] = useState('')
    const [isDM, setIsDM] = useState(false)
    const [allGameIds, setAllGameIds] = useState([])

    const gameQueryHandler = async (isNewGame) => {
        if (gameId && characterName) {
            await db.collection('games').get()
                .then((allGames) => {
                    allGames.forEach((game) => {
                        setAllGameIds([...allGameIds, game.id])
                    })
                })
                .catch(() => dispatch(setError(ERRORS.generic)))
            const userAccount = db.collection('users').doc(userData.uid)
            const accountDataCall = await userAccount.get()
            const userAccountData = accountDataCall.data()
            const existingGameDataUserAccount = userAccountData.games
            const cleanGameId = gameId.replaceAll(' ', '')
            const gameExists = allGameIds.findIndex((gameId) => gameId === cleanGameId) > -1
            if (isNewGame) {
                if (!gameExists) {
                    dispatch(updateUserAccount(cleanGameId, characterName, existingGameDataUserAccount))
                    dispatch(updateActiveGameData(cleanGameId, characterName, false, undefined, isNewGame, isDM))
                    await router.push('/')
                } else {
                    dispatch(setError(ERRORS.gameAlreadyExists))
                }
            } else {
                if (gameExists) {
                    await db.collection('games').doc(cleanGameId).collection('data').doc('players')
                        .then((item) => {
                            console.log(item)
                        })
                    // const gameData = res.fields
                    // const listOfPlayers = Object.values(gameData)
                    // const hasDM = listOfPlayers.findIndex(player => player.gameMaster) > -1
                    // const playerAlreadyExists = listOfPlayers.findIndex(player => player.characterName === characterName) > -1
                    // if (cleanGameId && gameIds.includes(cleanGameId) && !Object.keys(userAccountData.games).includes(cleanGameId)) {
                    //     dispatch(updateUserAccount(cleanGameId, characterName, existingGameDataUserAccount))
                    //     dispatch(updateActiveGameData(cleanGameId, characterName, false, undefined, isNewGame, isDM))
                    //     await router.push('/')
                    // } else {
                    //     if (playerAlreadyExists) {
                    //         dispatch(setError(ERRORS.playerExists))
                    //     } else if (hasDM && isDM) {
                    //         dispatch(setError('This game already has a Game Master'))
                    //         setIsDM(false)
                    //     }
                    // }
                } else {
                    dispatch(setError(ERRORS.gameDoesNotExist))
                }}
        } else {
            let errorMessage = ERRORS.generic
            if (!gameId) errorMessage = 'Please enter a Game ID.'
            if (!characterName) errorMessage = 'Please enter a Character Name.'
            dispatch(setError(errorMessage))
        }
    }

    return (
        <div style={{ marginTop: '25px', border: '1px solid black', padding: '10px' }}>
            <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-sm">
                    { AUTHENTICATION.gameId }
                </InputGroup.Text>
                <FormControl
                    maxLength="10"
                    onChange={ (e) => setGameId(e.target.value) }
                />
            </InputGroup>
            { !isDM &&
            <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-sm">
                    { AUTHENTICATION.characterName }
                </InputGroup.Text>
                <FormControl
                    maxLength="15"
                    onChange={ (e) => setCharacterName(e.target.value) }
                />
            </InputGroup> }
            <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                <input
                    checked={ isDM }
                    id="dm-query"
                    onChange={ () => {
                        setIsDM(!isDM)
                        if (!isDM) {
                            setCharacterName('Game Master')
                        } else {
                            setCharacterName('')
                        }
                    } }
                    type="checkbox"
                />
                <label
                    className="ml-3"
                    htmlFor="dm-query"
                >
                    Are you the Game Master?
                </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button variant="dark" onClick={ () => gameQueryHandler(false) }>
                    { AUTHENTICATION.joinGame }
                </Button>
                <Button variant="dark" onClick={ () => gameQueryHandler(true) }>
                    { AUTHENTICATION.createGame }
                </Button>
            </div>
        </div>
    )
}

export default AddToGame
