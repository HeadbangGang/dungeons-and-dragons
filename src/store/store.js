import { createStore } from 'redux'
import Immutable from 'immutable'
import { composeWithDevTools } from 'redux-devtools-extension'


const initialState = Immutable.fromJS({})

const dndState = (currentState = initialState, action) => {
    switch(action.type) {
    case SET_USER_ACCOUNT:
        return currentState.set('user', Immutable.fromJS(action.userData))
    case SET_ACTIVE_GAME_PLAYERS:
        return currentState.set('activeGamePlayers', Immutable.fromJS(action.players))
    case UPDATE_PHOTO_URL:
        return currentState.setIn(['user', 'photoURL'], action.url)
    default:
        return currentState
    }
}

//Content Creators
export const setUserAccount = userData => ({ type: SET_USER_ACCOUNT, userData })
export const SET_USER_ACCOUNT = 'user'

export const setActiveGamePlayers = players => ({ type: SET_ACTIVE_GAME_PLAYERS, players })
export const SET_ACTIVE_GAME_PLAYERS = 'activeGamePlayers'

export const updatePhotoUrl = url => ({ type: UPDATE_PHOTO_URL, url })
export const UPDATE_PHOTO_URL = 'user/photoURL'

//Selectors
export const getCurrentUser = state => state.get('user', Immutable.Map())
export const getActiveGamePlayers = state => state.get('activeGamePlayers', Immutable.List())

// Initialize
const store = createStore(dndState, composeWithDevTools())
export default store