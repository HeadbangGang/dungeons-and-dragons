import React, { useEffect } from 'react'
import Immutable from 'immutable'
import { useMediaQuery } from 'react-responsive'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveGameId, getCurrentUser, setUserAccount, setActiveGameData, getSelectedCharacter, setIsSmallView, setError } from '../store/store'
import { auth, generateUserDocument } from '../database/firebase'
import { Route, Switch } from 'react-router-dom'
import { DndHome } from './homepage/dnd-home'
import { DndNavbar } from './navbar/dnd-navbar'
import { InitiativeOrder } from './initiative-order/initiative-order'
import SignIn from './authentication/signin'
import SignUp from './authentication/signup'
import PasswordReset from './authentication/passwordreset'
import DndFooter from '../components/footer/dnd-footer'
import ProfilePage from './authentication/profile-page/profilepage'
import LandscapePage from './landscape-page/landscape-page'
import DiceRoller from './dice-roller/dice-roller'
import { streamGameData } from '../database/firebase'
import './dnd-container.css'

export const DndContainer = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const activeGameId = useSelector(getActiveGameId)
    const userData = useSelector(getCurrentUser)
    const selectedCharacter = useSelector(getSelectedCharacter)

    const isSmallView = useMediaQuery({ query: '(max-width: 1224px)' })

    useEffect(() => {
        auth.onAuthStateChanged(async userAuth => {
            const user = await generateUserDocument(userAuth)
            dispatch(setUserAccount(user || Immutable.Map()))
        })
        dispatch(setIsSmallView(isSmallView))
    }, [])

    useEffect(() => {
        if (selectedCharacter) {
            history.push(`/profile/${ selectedCharacter }`)
        }
    }, [selectedCharacter])

    useEffect(() => {
        if (userData?.get('activeGameId')) {
            const unsubscribe = streamGameData(activeGameId, {
                next: querySnapshot => {
                    const playersList = querySnapshot.docs.map(docSnapshot => docSnapshot.data())
                    dispatch(setActiveGameData(Immutable.fromJS({ players: { ...playersList[0] } })))
                },
                error: () => dispatch(setError('Error while updating new data.'))
            })
            return unsubscribe
        }
    }, [setActiveGameData, userData])

    return (
        <div>
            <div className='dnd-container'>
                <DndNavbar />
                <div className='dnd-main-content'>
                    <Switch>
                        <Route exact path='/'>
                            <DndHome />
                        </Route>
                        <Route exact path='/initiative-order'>
                            <InitiativeOrder />
                        </Route>
                        <Route exact path='/account/sign-in'>
                            <SignIn />
                        </Route>
                        <Route exact path='/account/sign-up'>
                            <SignUp />
                        </Route>
                        <Route exact path='/account/password-reset'>
                            <PasswordReset />
                        </Route>
                        <Route exact path='/account/profile'>
                            <ProfilePage />
                        </Route>
                        <Route exact path='/dice-roller'>
                            <DiceRoller />
                        </Route>
                    </Switch>
                </div>
                <DndFooter />
            </div>
            <LandscapePage />
        </div>
    )
}