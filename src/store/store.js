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
        const updatedGameData = updateCurrentActiveGameData(action.gameId, action.characterName, action.isNewGame, action.isDM, action.existingGameData, currentState)
        return currentState.set('activeGameData', updatedGameData)
    }
    case UPDATE_PHOTO_URL: {
        return currentState.setIn(['user', 'photoURL'], action.url)
    }
    case SET_SELECTED_CHARACTER: {
        return currentState.set('selectedCharacter', action.character)
    }
    case UPDATE_PLAYER_INITIATIVE: {
        const updatedPlayerGameData = updateCurrentPlayerInitiative(action.initiative, action.id, currentState)
        return currentState.setIn(['activeGameData', action.playerType, action.id], updatedPlayerGameData)
    }
    case UPDATE_NPC_INITIATIVE: {
        const updatedNPCInitiative = updateChosenNPCInitiative(action.initiative, action.name, currentState)
        return currentState.setIn(['activeGameData', 'NPCs', action.name], updatedNPCInitiative)
    }
    case SET_NPC: {
        const addedNPC = setNewNPC(action.name, action.initiative, currentState)
        return currentState.setIn(['activeGameData', 'NPCs'], addedNPC)
    }
    case RESET_INITIATIVE: {
        const resetGameInitiative = resetCurrentInitiative(action.group, currentState)
        return currentState.set('activeGameData', Immutable.fromJS(resetGameInitiative))
    }
    case SET_CONSOLIDATED_PLAYERS: {
        return currentState.set('allPlayers', action.players)
    }
    case REMOVE_NPC: {
        const removedNPC = removeCurrentNPC(action.npc, currentState)
        return currentState.setIn(['activeGameData', 'NPCs'], removedNPC)
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

export const updateActiveGameData = (gameId, characterName, isNewGame, isDM, existingGameData) =>
    ({ type: UPDATE_ACTIVE_GAME_DATA, gameId, characterName, isNewGame, isDM, existingGameData })
export const UPDATE_ACTIVE_GAME_DATA = 'updateActiveGameData'

export const updatePlayerInitiative = (initiative, playerType, id) => ({ type: UPDATE_PLAYER_INITIATIVE, initiative, playerType, id })
export const UPDATE_PLAYER_INITIATIVE = 'updatePlayerInitiative'

export const updateNPCInitiative = (initiative, name) => ({ type: UPDATE_NPC_INITIATIVE, initiative, name })
export const UPDATE_NPC_INITIATIVE = 'updateNPCInitiative'

export const updatePhotoUrl = url => ({ type: UPDATE_PHOTO_URL, url })
export const UPDATE_PHOTO_URL = 'user/photoURL'

export const setSelectedCharacter = character => ({ type: SET_SELECTED_CHARACTER, character })
export const SET_SELECTED_CHARACTER = 'selectedCharacter'

export const setNPC = (name, initiative) => ({ type: SET_NPC, name, initiative })
export const SET_NPC = 'setNPC'

export const resetInitiative = group => ({ type: RESET_INITIATIVE, group })
export const RESET_INITIATIVE = 'resetInitiative'

export const setConsolidatedPlayers = players => ({ type: SET_CONSOLIDATED_PLAYERS, players })
export const SET_CONSOLIDATED_PLAYERS = 'setConsolidatedPlayers'

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
export const getConsolidatedPlayers = state => state.get('allPlayers', Immutable.Map())
export const getAllUserGames = state => getCurrentUser(state).get('games')
export const getDiceValues = state => state.get('diceValues', Immutable.fromJS({ '4': [], '6': [], '8': [], '10': [], '12': [], '20': [] }))

// Redux Functions
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

const updateCurrentActiveGameData = (gameId, characterName, isNewGame, isDM, existingGameData, state) => {
    const uid = getCurrentUser(state).get('uid')
    const playerName = getCurrentUser(state).get('fullName')
    const profileImg = getCurrentUser(state).get('photoURL', null)
    let newData = {}
    newData = {
        players: { ...existingGameData ?? undefined,
            [uid]: {
                characterName: characterName,
                gameMaster: isDM,
                player: playerName,
                playerProfileImg: profileImg
            }
        }
    }
    updateExistingGameDB(newData, gameId, isNewGame)
    return Immutable.fromJS(newData)
}

const updateCurrentPlayerInitiative = (value, id, state) => {
    const gameId = getCurrentUser(state).get('activeGameId')
    let currentValue = getActiveGameData(state).getIn(['players', id])
    currentValue = currentValue.merge(Immutable.fromJS({ initiativeValue: value }))
    const dbPath = `players.${ id }.initiativeValue`
    const dbData = { [dbPath]: value }
    updateExistingGameDB(dbData, gameId)
    return currentValue
}

const updateChosenNPCInitiative = (value, name, state) => {
    const gameId = getCurrentUser(state).get('activeGameId')
    let currentValue = getActiveGameData(state).getIn(['NPCs', name])
    currentValue = currentValue.merge(Immutable.fromJS({ initiativeValue: value }))
    const dbPath = `NPCs.${ name }.initiativeValue`
    const dbData = { [dbPath]: value }
    updateExistingGameDB(dbData, gameId)
    return currentValue
}

const setNewNPC = (name, initiative, state) => {
    let dbData
    let currentState = getActiveGameData(state)
    const npcData = getActiveGameData(state).get('NPCs', undefined)
    const gameId = getCurrentUser(state).get('activeGameId')
    const path = Immutable.fromJS({ [name]: { characterName: name, initiativeValue: initiative, NPC: true } })
    if (currentState.keySeq().includes('NPCs')) {
        currentState = currentState.get('NPCs').merge(path)
    } else {
        currentState = path
    }

    if (npcData?.size > 0 && npcData?.keySeq().includes(name)) {
        dbData = { NPCs: { [name]: { characterName: name, initiativeValue: initiative, NPC: true } } }
    } else {
        dbData = { NPCs: { ...npcData?.toJS(), [name]: { characterName: name, initiativeValue: initiative, NPC: true } } }
    }
    updateExistingGameDB(dbData, gameId)
    return currentState
}

const resetCurrentInitiative = (group, state) => {
    const currentState = getActiveGameData(state)
    const gameId = getCurrentUser(state).get('activeGameId')
    let playerData = currentState.get('players')
    const npcData = currentState.get('NPCs')
    const players = playerData.keySeq()
    let newData
    if (group === 'npcs'){
        newData = { 'NPCs': {}, players: playerData.toJS() }
    } else if (group ==='players') {
        players.forEach(player => {
            const currentPlayerData = playerData.setIn([player, 'initiativeValue'], null)
            playerData = playerData.merge(currentPlayerData)
        })
        newData = { 'NPCs': npcData.toJS(), 'players': playerData.toJS() }
    } else {
        players.forEach(player => {
            const currentPlayerData = playerData.setIn([player, 'initiativeValue'], null)
            playerData = playerData.merge(currentPlayerData)
        })
        newData = { 'NPCs': {}, 'players': playerData.toJS() }
    }
    updateExistingGameDB(newData, gameId)
    return newData
}

const removeCurrentNPC = (npc, state) => {
    const gameId = getCurrentUser(state).get('activeGameId')
    let currentState = getActiveGameData(state).get('NPCs')
    currentState = currentState.delete(npc)
    const path = { NPCs: currentState.toJS() }
    updateExistingGameDB(path, gameId)
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
const updateExistingGameDB = async (data, gameId, isNewGame) => {
    const games = db.collection('games')
    try {
        if (isNewGame) {
            await games.doc(gameId).set(data)
        } else {
            await games.doc(gameId).update(data)
        }
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