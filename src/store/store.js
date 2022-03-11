import { applyMiddleware, compose, createStore } from 'redux'
import { db } from '../database/firebase'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { DEFAULT_DICE_VALUES } from '../helpers/constants'
import { composeWithDevTools } from 'redux-devtools-extension'
import { MAX_ERROR_QUANTITY } from '../helpers/constants'

const initialState = {}

// Reducer
const dndState = (currentState = initialState, action) => {
    switch (action.type) {
    case SET_ERRORS: {
        let updatedErrors = getErrors(currentState)
        if (updatedErrors.length >= MAX_ERROR_QUANTITY) {
            updatedErrors = updateRemovedErrors(currentState)
        }
        return currentState = {
            ...currentState,
            errors: [action.errorData, ...updatedErrors]
        }
    }
    case REMOVE_ERRORS: {
        if (action.removeAll) {
            return currentState = {
                ...currentState,
                errors: []
            }
        }
        const updatedErrors = updateRemovedErrors(currentState)
        return currentState = {
            ...currentState,
            errors: updatedErrors
        }
    }
    case SET_IS_SMALLVIEW: {
        return currentState = {
            ...currentState,
            ui: {
                ...currentState.ui,
                smallView: action.isSmallView
            }
        }
    }
    case SET_USER_ACCOUNT: {
        return currentState = {
            ...currentState,
            user: action.userData
        }
    }
    case UPDATE_USER_ACCOUNT: {
        const updatedUserAccount = updateCurrentUserAccount(action.gameId, action.characterName, action.currentGameData, currentState)
        return currentState = {
            ...currentState,
            user: updatedUserAccount
        }
    }
    case SET_ACTIVE_GAME_DATA: {
        return currentState = {
            ...currentState,
            activeGameData: action.gameData
        }
    }
    case UPDATE_ACTIVE_GAME_DATA: {
        const updatedGameData = updateCurrentActiveGameData(action.gameId, action.characterName, action.isNPC, action.initiativeValue, action.isNewGame, action.isDM, currentState)
        return currentState = {
            ...currentState,
            activeGameData: updatedGameData
        }
    }
    case UPDATE_PHOTO_URL: {
        return currentState = {
            ...currentState,
            user : {
                ...currentState.user,
                photoURL: action.url
            }
        }
    }
    case UPDATE_CHOSEN_INITIATIVE: {
        const updatedGameData = updateInitiative(action.initiativeValue, action.id, currentState)
        return currentState = {
            ...currentState,
            activeGameData: {
                ...currentState.activeGameData,
                [action.id]: updatedGameData
            }
        }
    }
    case RESET_INITIATIVE: {
        const resetGameInitiative = resetCurrentInitiative(action.group, currentState)
        return currentState = {
            ...currentState,
            activeGameData: resetGameInitiative
        }
    }
    case REMOVE_NPC: {
        const removedNPC = removeCurrentNPC(action.npc, currentState)
        return currentState = {
            ...currentState,
            activeGameData: {
                ...currentState.activeGameData,
                players: removedNPC
            }
        }
    }
    case UPDATE_ACTIVE_GAME_ID: {
        const updatedActiveGameId = updateCurrentActiveGameID(action.id, currentState)
        return currentState = {
            ...currentState,
            user: {
                ...currentState.user,
                activeGameId: updatedActiveGameId
            }
        }
    }
    case UPDATE_DICE_VALUES: {
        const updatedDiceValues = updateCurrentDiceValues(action.die, action.values, currentState)
        return currentState = {
            ...currentState,
            diceValues: updatedDiceValues
        }
    }
    case RESET_DICE_VALUES: {
        return currentState = {
            ...currentState,
            diceValues: DEFAULT_DICE_VALUES
        }
    }
    case SET_HAS_LOADED_TEMPLATE: {
        return currentState = {
            ...currentState,
            ui: {
                ...currentState.ui,
                hasLoadedTemplate: action.hasLoadedTemplate
            }
        }
    }
    default:
        return currentState
    }
}

// Content Creators
export const setErrors = errorData => ({ type: SET_ERRORS, errorData })
export const SET_ERRORS = 'setErrors'

export const removeErrors = (removeAll) => ({ type: REMOVE_ERRORS, removeAll })
export const REMOVE_ERRORS = 'removeErrors'

export const setIsSmallView = isSmallView => ({ type: SET_IS_SMALLVIEW, isSmallView })
export const SET_IS_SMALLVIEW = 'setIsSmallView'

export const setUserAccount = userData => ({ type: SET_USER_ACCOUNT, userData })
export const SET_USER_ACCOUNT = 'setUserAccount'

export const updateUserAccount = (gameId, characterName, currentGameData) => ({ type: UPDATE_USER_ACCOUNT, gameId, characterName, currentGameData })
export const UPDATE_USER_ACCOUNT = 'updateUserData'

export const setActiveGameData = gameData => ({ type: SET_ACTIVE_GAME_DATA, gameData })
export const SET_ACTIVE_GAME_DATA = 'activeGameData'

export const updateActiveGameData = (gameId, characterName, isNPC, initiativeValue, isNewGame, isDM) => ({ type: UPDATE_ACTIVE_GAME_DATA, gameId, characterName, isNPC, initiativeValue, isNewGame, isDM })
export const UPDATE_ACTIVE_GAME_DATA = 'updateActiveGameData'

export const updateChosenInitiative = (initiative, id) => ({ type: UPDATE_CHOSEN_INITIATIVE, initiative, id })
export const UPDATE_CHOSEN_INITIATIVE = 'updatePlayerInitiative'

export const updatePhotoUrl = url => ({ type: UPDATE_PHOTO_URL, url })
export const UPDATE_PHOTO_URL = 'updatePhotoUrl'

export const resetInitiative = group => ({ type: RESET_INITIATIVE, group })
export const RESET_INITIATIVE = 'resetInitiative'

export const removeNPC = npc => ({ type: REMOVE_NPC, npc })
export const REMOVE_NPC = 'removeNPC'

export const updateActiveGameID = id => ({ type: UPDATE_ACTIVE_GAME_ID, id })
export const UPDATE_ACTIVE_GAME_ID = 'updateActiveGameID'

export const updateDiceValues = (die, values) => ({ type: UPDATE_DICE_VALUES, die, values })
export const UPDATE_DICE_VALUES = 'updateDiceValues'

export const resetDiceValues = () => ({ type: RESET_DICE_VALUES })
export const RESET_DICE_VALUES = 'resetDiceValues'

export const setHasLoadedTemplate = (hasLoadedTemplate) =>({ type: SET_HAS_LOADED_TEMPLATE, hasLoadedTemplate })
export const SET_HAS_LOADED_TEMPLATE = 'setHasLoadedTemplate'

// Selectors
export const getErrors = state => state.errors ?? []
export const getUi = state => state.ui ?? {}
export const getIsSmallView = state => getUi(state).smallView ?? false
export const getCurrentUser = state => state.user ?? {}
export const getActiveGameData = state => state.activeGameData ?? {}
export const getAllGamePlayers = state => getActiveGameData(state).players ?? {}
export const getProfilePicture = state => getCurrentUser(state)?.photoURL ?? null
export const getAllUserGames = state => getCurrentUser(state)?.games
export const getDiceValues = state => state.diceValues ?? DEFAULT_DICE_VALUES
export const getActiveGameId = state => getCurrentUser(state).activeGameId ?? null
export const getCurrentUID = state => getCurrentUser(state).uid ?? null
export const getCurrentFullName = state => getCurrentUser(state).fullName ?? ''
export const getGamePlayerData = (state, uid) => getActiveGameData(state).players[uid] ?? undefined
export const getHasLoadedTemplate = state => getUi(state).hasLoadedTemplate ?? false
export const getCurrentEmail = state => getCurrentUser(state).email ?? ''

// Redux Functions
const updateRemovedErrors = (state) => {
    const updatedErrors = getErrors(state)
    updatedErrors.shift()
    return updatedErrors
}

const updateCurrentUserAccount = async (gameId, characterName, currentGameData, state) => {
    const uid = getCurrentUID(state)
    const player = getCurrentFullName(state)
    const playerProfileImg = getProfilePicture(state)
    const newData = {
        activeGameId: gameId,
        games: {
            ...currentGameData,
            [gameId]: {
                characterName,
                player,
                playerProfileImg
            }
        }
    }
    const userAccountState = {
        ...getCurrentUser(state),
        ...newData
    }
    await updateDBUserAccount(uid, newData)
    return userAccountState
}

const updateCurrentActiveGameData = async (gameId, characterName, isNPC, initiativeValue, isNewGame, gameMaster, state) => {
    const uid = getCurrentUID(state)
    const player = getCurrentFullName(state)
    const playerProfileImg = getProfilePicture(state)
    let newData = []
    if (isNPC) {
        newData = [{
            [characterName]: {
                characterName,
                initiativeValue,
                NPC: true
            }
        }]
    } else {
        newData = [{
            [uid]: {
                characterName,
                gameMaster,
                player,
                playerProfileImg,
                uid
            }
        }]
    }
    await updateExistingGameDB(newData, gameId, isNewGame, false)
    return newData
}

const updateInitiative = async (value, uid, state) => {
    const gameId = getActiveGameId(state)
    let currentValue = getGamePlayerData(state, uid)
    currentValue = {
        ...currentValue,
        initiativeValue: value
    }
    const dbPath = `${uid}.initiativeValue`
    const dbData = [{ [dbPath]: value }]
    await updateExistingGameDB(dbData, gameId, false, false)
    return currentValue
}

const resetCurrentInitiative = async (group, state) => {
    const gameId = getActiveGameId(state)
    const data = getAllGamePlayers(state)

    switch (group) {
    case 'npcs': {
        Object.keys(data).forEach((player) => {
            if (data[player].NPC) {
                delete data[player]
            }
        })
    }
        break
    case 'players': {
        Object.keys(data).forEach(player => {
            if (!data[player].NPC) {
                data[player] = {
                    ...data[player],
                    initiativeValue: null
                }
            }
        })
    }
        break
    default : {
        Object.keys(data).forEach(player => {
            data[player].NPC
                ? delete data[player]
                : data[player] = {
                    ...data[player],
                    initiativeValue: null
                }
        })
    }
    }
    await updateExistingGameDB([data], gameId, false, true)
    return data
}

const removeCurrentNPC = async (npc, state) => {
    const gameId = getActiveGameId(state)
    const currentState = getAllGamePlayers(state)
    delete currentState[npc]
    await updateExistingGameDB([currentState], gameId, false, true)
    return currentState
}

const updateCurrentActiveGameID = async (gameId, state) => {
    let currentState = getCurrentUser(state)
    const uid = getCurrentUID(state)
    currentState = {
        ...currentState,
        activeGameId: gameId
    }
    await updateDBUserAccount(uid, currentState)
    return currentState
}

const updateCurrentDiceValues = (die, values, state) => {
    let currentState = getDiceValues(state)
    values.push(...currentState[die])
    currentState = {
        ...currentState,
        [die]: values
    }
    return currentState
}

// Firebase Functions
const updateExistingGameDB = (data, gameId, isNewGame, removeData) => {
    const games = db.collection('games')
    try {
        data.forEach(async item => {
            if (isNewGame) {
                await games
                    .doc(gameId)
                    .set({ gameId })
            }
            if (isNewGame || removeData) {
                await games
                    .doc(gameId)
                    .collection('data')
                    .doc('players')
                    .set(item)
            } else {
                await games
                    .doc(gameId)
                    .collection('data')
                    .doc('players')
                    .update(item)
            }
        })
    } catch (e) {
        setErrors(e.message)
    }
}

const updateDBUserAccount = async (uid, data) => {
    const userAccount = db.collection('users').doc(uid)
    try {
        await userAccount.update(data)
    } catch (e) {
        setErrors(e.message)
    }
}

// Create Store
const logger = createLogger({
    collapsed: true,
    diff: true
})

let composeEnhancers = compose

const middleware = [thunk]

if (process.env.NODE_ENV === 'development') {
    composeEnhancers = composeWithDevTools({})
    middleware.push(logger)
}

// Initialize
const store = createStore(
    dndState,
    composeEnhancers(
        applyMiddleware(...middleware)
    )
)

export default store
