import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PAGE_URL, TEST_ACCOUNT_DATA } from '../../helpers/constants'
import { sanitizedVariable, validateCharacterName, validateGameId } from '../../helpers/helpers'
import { getCurrentEmail, setErrors } from '../../store'
import { db } from '../../database/firebase'
import { Button } from 'react-bootstrap'
import { getCurrentUser, updateActiveGameData, updateUserAccount } from '../../store'
import { useNavigate } from 'react-router'
import I18N, { language } from '../I18N/i18n'
import './add-to-game.scss'

const AddToGame =  () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userData = useSelector(getCurrentUser)
    const isTestAccount = useSelector(getCurrentEmail) === TEST_ACCOUNT_DATA.EMAIL

    const [gameId, setGameId] = useState('')
    const [characterName, setCharacterName] = useState('')
    const [previousCharacterName, setPreviousCharacterName] = useState('')
    const [isDM, setIsDM] = useState(false)

    const validate = () => {
        const characterNameError = validateCharacterName(characterName)
        const gameIdError = validateGameId(gameId)

        if (characterNameError) {
            return handleError(characterNameError)
        } else if (gameIdError) {
            return handleError(gameIdError)
        } else {
            return true
        }
    }

    const handleError = (error) => {
        dispatch(setErrors(error))
        return false
    }

    const gameHandler = async (isNewGame) => {
        if (isTestAccount) {
            return dispatch(setErrors(language.errors.testAccount.joinCreateGame))
        }
        if (validate()) {
            let gameExists = false

            await db.collection('games').get()
                .then(({ docs }) => {
                    gameExists = !!docs.find(game => game.id === gameId)
                })
                .catch(() => dispatch(setErrors(language.errors.generic)))

            if (isNewGame) {
                if (!gameExists) {
                    await createNewGame(isNewGame)
                } else {
                    dispatch(setErrors(language.errors.gameAlreadyExists))
                }
            } else {
                if (gameExists) {
                    await joinExistingGame(isNewGame)
                } else {
                    dispatch(setErrors(language.errors.gameDoesNotExist))
                }}
        }
    }

    const createNewGame = async (isNewGame) => {
        const { games } = userData
        await dispatch(updateUserAccount(gameId, characterName, games))
            .then(dispatch(updateActiveGameData(gameId, characterName, false, undefined, isNewGame, isDM)))
            .then(navigate(PAGE_URL.HOME_PAGE))
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
        const characterAlreadyExists = allPlayersData.findIndex(player => {
            return sanitizedVariable(player.characterName, { lowerCase: true }) === sanitizedVariable(characterName, { lowerCase: true })
        }) > -1
        const userAlreadyPlayer = Object.keys(games).includes(gameId)

        if (!userAlreadyPlayer) {
            await dispatch(updateUserAccount(gameId, characterName, games))
                .then(dispatch(updateActiveGameData(gameId, characterName, false, undefined, isNewGame, isDM)))
                .then(navigate(PAGE_URL.HOME_PAGE))
        } else {
            if (characterAlreadyExists) {
                dispatch(setErrors(language.errors.characterExists.replace('{{characterName}}', characterName)))
            }
            if (hasDM && isDM) {
                dispatch(setErrors(language.errors.gameMasterExists))
                setIsDM(false)
            }
            if (userAlreadyPlayer) {
                dispatch(setErrors(language.errors.playerExists))
            }
        }
    }

    const gameMasterCheckboxHandler = () => {
        if (!isDM) {
            setPreviousCharacterName(characterName)
            setCharacterName(language.common.gameMaster)
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
                    <I18N blockLevel className="styled-input__label" name="authentication.gameId" />
                    <input
                        maxLength="10"
                        onChange={ ({ target }) => setGameId(sanitizedVariable(target.value)) }
                    />
                </div>
                <div className="styled-input__wrapper">
                    <I18N blockLevel className="styled-input__label" name="authentication.characterName" />
                    <input
                        disabled={ isDM }
                        maxLength="15"
                        onChange={ ({ target }) => setCharacterName(target.value) }
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
                    <I18N name="authentication.gameMasterQuery" />
                </label>
            </div>
            <div className="add-to-game__buttons">
                <Button variant="dark" onClick={ async () => await gameHandler(false) }>
                    <I18N name="authentication.joinGame" />
                </Button>
                <Button variant="outline-dark" onClick={ async () => await gameHandler(true) }>
                    <I18N name="authentication.createGame" />
                </Button>
            </div>
        </div>
    )
}

export default AddToGame
