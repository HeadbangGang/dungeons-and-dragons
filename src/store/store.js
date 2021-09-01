import { createStore, applyMiddleware, compose } from 'redux'
import { db } from '../database/firebase'
import { createLogger } from 'redux-logger'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({})

const logger = createLogger({
    collapsed: true,
    stateTransformer: state => state.toJS(),
    diff: true
})

// Reducer
const dndState = (currentState = initialState, action) => {
    switch(action.type) {
    case SET_ERROR: {
        return currentState.set('error', action.errorData)
    }
    case SET_IS_SMALLVIEW: {
        return currentState.set('smallView', action.isSmallView)
    }
    case SET_USER_ACCOUNT: {
        return currentState.set('user', Immutable.fromJS(action.userData))
    }
    case UPDATE_USER_ACCOUNT: {
        const updatedUserAccount = updateCurrentUserAccount(action.gameId, action.characterName, action.currentGameData, currentState)
        return currentState.set('user', updatedUserAccount)
    }
    case SET_ACTIVE_GAME_DATA: {
        return currentState.set('activeGameData', Immutable.fromJS(action.gameData))
    }
    case UPDATE_ACTIVE_GAME_DATA: {
        const updatedGameData = updateCurrentActiveGameData(action.gameId, action.characterName, action.isNPC, action.initiativeValue, action.isNewGame, action.isDM, currentState)
        return currentState.set('activeGameData', updatedGameData)
    }
    case UPDATE_PHOTO_URL: {
        return currentState.setIn(['user', 'photoURL'], action.url)
    }
    case SET_SELECTED_CHARACTER: {
        return currentState.set('selectedCharacter', action.character)
    }
    case UPDATE_CHOSEN_INITIATIVE: {
        const updatedGameData = updateInitiative(action.initiative, action.id, currentState)
        return currentState.setIn(['activeGameData', action.id], updatedGameData)
    }
    case RESET_INITIATIVE: {
        const resetGameInitiative = resetCurrentInitiative(action.group, currentState)
        return currentState.set('activeGameData', Immutable.fromJS(resetGameInitiative))
    }
    case REMOVE_NPC: {
        const removedNPC = removeCurrentNPC(action.npc, currentState)
        return currentState.setIn(['activeGameData', 'players'], removedNPC)
    }
    case UPDATE_ACTIVE_GAME_ID: {
        const updatedActiveGameId = updateCurrentActiveGameID(action.id, currentState)
        return currentState.set('user', updatedActiveGameId)
    }
    case UPDATE_DICE_VALUES: {
        const updatedDiceValues = updateCurrentDiceValues(action.die, action.values, currentState)
        return currentState.set('diceValues', updatedDiceValues)
    }
    case RESET_DICE_VALUES: {
        return currentState.set('diceValues', Immutable.fromJS({ '4': [], '6': [], '8': [], '10': [], '12': [], '20': [] }))
    }
    default:
        return currentState
    }
}

// Content Creators
export const setError = errorData => ({ type: SET_ERROR, errorData })
export const SET_ERROR = 'setError'

export const setIsSmallView = isSmallView => ({ type: SET_IS_SMALLVIEW, isSmallView })
export const SET_IS_SMALLVIEW = 'setIsSmallView'

export const setUserAccount = userData => ({ type: SET_USER_ACCOUNT, userData })
export const SET_USER_ACCOUNT = 'user'

export const updateUserAccount = (gameId, characterName, currentGameData) => ({ type: UPDATE_USER_ACCOUNT, gameId, characterName, currentGameData })
export const UPDATE_USER_ACCOUNT = 'updateUserData'

export const setActiveGameData = gameData => ({ type: SET_ACTIVE_GAME_DATA, gameData })
export const SET_ACTIVE_GAME_DATA = 'activeGameData'

export const updateActiveGameData = (gameId, characterName, isNPC, initiativeValue, isNewGame, isDM) =>
    ({ type: UPDATE_ACTIVE_GAME_DATA, gameId, characterName, isNPC, initiativeValue, isNewGame, isDM })
export const UPDATE_ACTIVE_GAME_DATA = 'updateActiveGameData'

export const updateChosenInitiative = (initiative, id) => ({ type: UPDATE_CHOSEN_INITIATIVE, initiative, id })
export const UPDATE_CHOSEN_INITIATIVE = 'updatePlayerInitiative'

export const updatePhotoUrl = url => ({ type: UPDATE_PHOTO_URL, url })
export const UPDATE_PHOTO_URL = 'user/photoURL'

export const setSelectedCharacter = character => ({ type: SET_SELECTED_CHARACTER, character })
export const SET_SELECTED_CHARACTER = 'selectedCharacter'

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

// Selectors
export const getError = state => state.get('error', null)
export const getIsSmallView = state => state.get('smallView', false)
export const getCurrentUser = state => state.get('user', Immutable.Map())
export const getActiveGameData = state => state.get('activeGameData', Immutable.Map())
export const getSelectedCharacter = state => state.get('selectedCharacter', null)
export const getProfilePicture = state => getCurrentUser(state)?.get('photoURL', null)
export const getActiveGameId = state => getCurrentUser(state)?.get('activeGameId', undefined)
export const getAllUserGames = state => getCurrentUser(state).get('games')
export const getDiceValues = state => state.get('diceValues', Immutable.fromJS({ '4': [], '6': [], '8': [], '10': [], '12': [], '20': [] }))

// Redux Functions
const updateCurrentUserAccount = (gameId, characterName, currentGameData, state) => {
    const uid = getCurrentUser(state).get('uid')
    const player = getCurrentUser(state).get('fullName')
    const playerProfileImg = getCurrentUser(state).get('photoURL', null)
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
    let userAccountState = getCurrentUser(state)
    userAccountState = userAccountState.mergeDeep(Immutable.fromJS(newData))
    updateDBUserAccount(uid, newData)
    return userAccountState
}

const updateCurrentActiveGameData = (gameId, characterName, isNPC, initiativeValue, isNewGame, gameMaster, state) => {
    const uid = getCurrentUser(state).get('uid')
    const player = getCurrentUser(state).get('fullName')
    const playerProfileImg = getCurrentUser(state).get('photoURL', null)
    let newData = {}
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
    updateExistingGameDB(newData, gameId, isNewGame)
    return Immutable.fromJS(newData)
}

const updateInitiative = (value, id, state) => {
    const gameId = getCurrentUser(state).get('activeGameId')
    let currentValue = getActiveGameData(state).getIn(['players', id])
    currentValue = currentValue.merge(Immutable.fromJS({ initiativeValue: value }))
    const dbPath = `${ id }.initiativeValue`
    const dbData = [{ [dbPath]: value }]
    updateExistingGameDB(dbData, gameId)
    return currentValue
}

const resetCurrentInitiative = (group, state) => {
    const currentState = getActiveGameData(state)
    const gameId = getCurrentUser(state).get('activeGameId')
    let data = currentState.get('players')
    const players = data.keySeq()

    switch (group) {
    case 'npcs': {
        players.forEach(player => {
            if (data.getIn([player, 'NPC'])) {
                data = data.delete(player)
            }
        })
    }
        break
    case 'players': {
        players.forEach(player => {
            if (!data.getIn([player, 'NPC'])) {
                data = data.setIn([player, 'initiativeValue'], null)
            }
        })
    }
        break
    default : {
        players.forEach(player => {
            data.getIn([player, 'NPC'])
                ? data = data.delete(player)
                : data = data.setIn([player, 'initiativeValue'], null)
        })
    }
    }
    updateExistingGameDB([data.toJS()], gameId, false, true)
    return data
}

const removeCurrentNPC = (npc, state) => {
    const gameId = getCurrentUser(state).get('activeGameId')
    let currentState = getActiveGameData(state).get('players')
    currentState = currentState.delete(npc)
    updateExistingGameDB([currentState.toJS()], gameId, false, true)
    return currentState
}

const updateCurrentActiveGameID = (gameId, state) => {
    let currentState = getCurrentUser(state)
    const uid = currentState.get('uid')
    currentState = currentState.merge(Immutable.fromJS({ activeGameId: gameId }))
    updateDBUserAccount(uid, currentState.toJS())
    return currentState
}

const updateCurrentDiceValues = (die, values, state) => {
    let currentState = getDiceValues(state)
    const dieValue = die[0]
    currentState = currentState.mergeDeep(Immutable.fromJS({ [dieValue]: values }))
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
        setError(e.message)
    }
}

const updateDBUserAccount = async (uid, data) => {
    const userAccount = db.collection('users').doc(uid)
    try {
        await userAccount.update(data)
    } catch (e) {
        setError(e.message)
    }
}

// Create Store
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      }) : compose
let enhancer
if (process.env.NODE_ENV === 'production') {
    enhancer = composeEnhancers(
        applyMiddleware(),
    )
} else {
    enhancer = composeEnhancers(
        applyMiddleware(logger),
    )
}

// Initialize
const store = createStore(
    dndState,
    enhancer
)
export default store