import { createStore, applyMiddleware, compose } from 'redux'
import { db } from '../database/firebase'
import { logger } from 'redux-logger'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({})

// Reducer
const dndState = (currentState = initialState, action) => {
    switch(action.type) {
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
        const updatedGameData = updateCurrentActiveGameData(action.gameId, action.characterName, action.isNewGame, action.existingGameData, currentState)
        return currentState.set('activeGameData', updatedGameData)
    }
    case UPDATE_PHOTO_URL: {
        return currentState.setIn(['user', 'photoURL'], action.url)
    }
    case SET_SELECTED_CHARACTER: {
        return currentState.set('selectedCharacter', action.character)
    }
    default:
        return currentState
    }
}

// Content Creators
export const setUserAccount = userData => ({ type: SET_USER_ACCOUNT, userData })
export const SET_USER_ACCOUNT = 'user'

export const updateUserAccount = (gameId, characterName, currentGameData) => ({ type: UPDATE_USER_ACCOUNT, gameId, characterName, currentGameData })
export const UPDATE_USER_ACCOUNT = 'updateData'

export const setActiveGameData = gameData => ({ type: SET_ACTIVE_GAME_DATA, gameData })
export const SET_ACTIVE_GAME_DATA = 'activeGameData'

export const updateActiveGameData = (gameId, characterName, isNewGame, existingGameData) => ({ type: UPDATE_ACTIVE_GAME_DATA, gameId, characterName, isNewGame, existingGameData })
export const UPDATE_ACTIVE_GAME_DATA = 'updateActiveGameData'

export const updatePhotoUrl = url => ({ type: UPDATE_PHOTO_URL, url })
export const UPDATE_PHOTO_URL = 'user/photoURL'

export const setSelectedCharacter = character => ({ type: SET_SELECTED_CHARACTER, character })
export const SET_SELECTED_CHARACTER = 'selectedCharacter'

// Selectors
export const getCurrentUser = state => state.get('user', Immutable.Map())
export const getActiveGameData = state => state.get('activeGameData', Immutable.Map())
export const getSelectedCharacter = state => state.get('selectedCharacter', null)
export const getProfilePicture = state => getCurrentUser(state)?.get('photoURL', null)
export const getActiveGameId = state => getCurrentUser(state)?.get('activeGameId', undefined)

const updateCurrentUserAccount = (gameId, characterName, currentGameData, state) => {
    const uid = getCurrentUser(state).get('uid')
    const playerName = getCurrentUser(state).get('fullName')
    const profileImg = getCurrentUser(state).get('photoURL', null)
    const newData = {
        activeGameId: gameId,
        games: { ...currentGameData,
            [gameId]: {
                characterName: characterName,
                player: playerName,
                playerProfileImg: profileImg
            }
        }
    }
    let userAccountState = getCurrentUser(state)
    userAccountState = userAccountState.mergeDeep(Immutable.fromJS(newData))
    updateDBUserAccount(uid, newData)
    return userAccountState
}

const updateCurrentActiveGameData = (gameId, characterName, isNewGame, existingGameData, state) => {
    const uid = getCurrentUser(state).get('uid')
    const playerName = getCurrentUser(state).get('fullName')
    const profileImg = getCurrentUser(state).get('photoURL', null)
    let newData = {}
    newData = {
        players: { ...existingGameData ?? undefined,
            [uid]: {
                characterName: characterName,
                player: playerName,
                playerProfileImg: profileImg
            }
        }
    }
    updateExistingGameDB(newData, gameId, isNewGame)
    return Immutable.fromJS(newData)
}

const updateExistingGameDB = async (data, gameId, isNewGame) => {
    const games = db.collection('games')
    if (isNewGame) {
        await games.doc(gameId).set(data)
    } else {
        await games.doc(gameId).update(data)
    }
}

const updateDBUserAccount = async (uid, data) => {
    const userAccount = db.collection('users').doc(uid)
    try {
        await userAccount.update(data)
    } catch (e) {
        console.log(e)
    }
}

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      }) : compose
const enhancer = composeEnhancers(
    applyMiddleware(logger),
)
// Initialize
const store = createStore(
    dndState,
    enhancer
)
export default store