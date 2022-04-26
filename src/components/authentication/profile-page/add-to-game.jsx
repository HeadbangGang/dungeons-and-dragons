import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setErrors } from '../../../store/store'
import { db } from '../../../database/firebase'
import { Button } from 'react-bootstrap'
import { AUTHENTICATION, ERRORS } from '../../../helpers/language-map'
import { getCurrentUser, updateActiveGameData, updateUserAccount } from '../../../store/store'
import { useNavigate } from 'react-router'
import './add-to-game.scss'

const AddToGame =  () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userData = useSelector(getCurrentUser)

    const [gameId, setGameId] = useState('')
    const [characterName, setCharacterName] = useState('')
    const [previousCharacterName, setPreviousCharacterName] = useState('')
    const [isDM, setIsDM] = useState(false)

    const gameHandler = async (isNewGame) => {
        if (gameId && characterName) {
            let gameExists = false

            await db.collection('games').get()
                .then(({ docs }) => {
                    gameExists = !!docs.find(game => game.id === gameId)
                })
                .catch(() => dispatch(setErrors(ERRORS.generic)))

            if (isNewGame) {
                if (!gameExists) {
                    await createNewGame(isNewGame)
                } else {
                    dispatch(setErrors(ERRORS.gameAlreadyExists))
                }
            } else {
                if (gameExists) {
                    await joinExistingGame(isNewGame)
                } else {
                    dispatch(setErrors(ERRORS.gameDoesNotExist))
                }}
        } else {
            if (!characterName) {
                dispatch(setErrors('Please enter a Character Name.'))
            }
            if (!gameId) {
                dispatch(setErrors('Please enter a Game ID.'))
            }
        }
    }

    const createNewGame = async (isNewGame) => {
        const { games } = userData
        await dispatch(updateUserAccount(gameId, characterName, games))
            .then(dispatch(updateActiveGameData(gameId, characterName, false, undefined, isNewGame, isDM)))
            .then(navigate('/'))
    }

    const joinExistingGame = async (isNewGame) => {
        const { games } = userData
        let gameData = {}

        await db.collection('games').doc(gameId).collection('data').doc('players').get()
            .then((item) => {
                gameData = item.data()
            })

        const allPlayersData = Object.values(gameData)
        const hasDM = allPlayersData.findIndex(player => player.gameMaster) > -1
        const playerAlreadyExists = allPlayersData.findIndex(player => player.characterName === characterName) > -1
        const userAlreadyPlayer = Object.keys(games).includes(gameId)

        if (!userAlreadyPlayer) {
            await dispatch(updateUserAccount(gameId, characterName, games))
                .then(dispatch(updateActiveGameData(gameId, characterName, false, undefined, isNewGame, isDM)))
                .then(navigate('/'))
        } else {
            if (playerAlreadyExists) {
                dispatch(setErrors(ERRORS.playerExists))
            }
            if (hasDM && isDM) {
                dispatch(setErrors('This game already has a Game Master'))
                setIsDM(false)
            }
            if (userAlreadyPlayer) {
                dispatch(setErrors('You are already apart of this game'))
            }
        }
    }

    const setGameIdHandler = ({ target }) => {
        setGameId(target.value.replaceAll(' ', ''))
    }

    const gameMasterCheckboxHandler = () => {
        if (!isDM) {
            setPreviousCharacterName(characterName)
            setCharacterName('Game Master')
        } else {
            setCharacterName(previousCharacterName)
            setPreviousCharacterName('')
        }
        setIsDM(!isDM)
    }

    return (
        <div className="add-to-game">
            <div className="add-to-game__inputs__container">
                <div className="styled-input__wrapper">
                    <div className="styled-input__label">
                        { AUTHENTICATION.gameId }
                    </div>
                    <input
                        maxLength="10"
                        onChange={ setGameIdHandler }
                    />
                </div>
                <div className="styled-input__wrapper">
                    <div className="styled-input__label">
                        { AUTHENTICATION.characterName }
                    </div>
                    <input
                        disabled={ isDM }
                        maxLength="15"
                        onChange={ (e) => setCharacterName(e.target.value) }
                        value={ characterName }
                    />
                </div>
            </div>
            <div className="add-to-game__checkbox">
                <input
                    checked={ isDM }
                    id="dm-query"
                    onChange={ gameMasterCheckboxHandler }
                    type="checkbox"
                />
                <label
                    htmlFor="dm-query"
                >
                    Are you the Game Master?
                </label>
            </div>
            <div className="add-to-game__buttons">
                <Button variant="dark" onClick={ async () => await gameHandler(false) }>
                    { AUTHENTICATION.joinGame }
                </Button>
                <Button variant="outline-dark" onClick={ async () => await gameHandler(true) }>
                    { AUTHENTICATION.createGame }
                </Button>
            </div>
        </div>
    )
}

export default AddToGame
