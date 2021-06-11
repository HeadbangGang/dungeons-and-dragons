import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser, setUserAccount, setActiveGamePlayers } from '../store/store'
import { auth, db, generateUserDocument } from '../database/firebase'
import { Route, Switch } from 'react-router-dom'
import { CharacterProfile } from './character-profile/character-profile'
import { DndHome } from './homepage/dnd-home'
import { DndNavbar } from './navbar/dnd-navbar'
import { InitiativeOrder } from './initiative-order/initiative-order'
import SignIn from './authentication/signin'
import SignUp from './authentication/signup'
import PasswordReset from './authentication/passwordreset'
import DndFooter from '../components/footer/dnd-footer'
import ProfilePage from './authentication/profile-page/profilepage'
import LandscapePage from './landscape-page/landscape-page'
import './dnd-container.css'

export const DndContainer = () => {
    const dispatch = useDispatch()
    const [error, setError] = useState(null)

    const userData = useSelector(getCurrentUser)

    const isSmallView = useMediaQuery({
        query: '(max-device-width: 991px)'
    })

    useEffect(() => {
        auth.onAuthStateChanged(async userAuth => {
            const user = await generateUserDocument(userAuth)
            dispatch(setUserAccount(user))
        })
    }, [])

    useEffect(() => {
        async function getPlayers () {
            const characterNames = []
            const activeGameId = userData.get('activeGameId')
            const gameDataByActiveGameId = db.collection('games').doc(activeGameId)
            const gameDataCall = await gameDataByActiveGameId.get()
            const gameData = gameDataCall.data().players
            for (const [key, value] of Object.entries(gameData)) {
                characterNames.push(value.characterName)
            }
            dispatch(setActiveGamePlayers(characterNames))
        }

        if (userData?.get('activeGameId')) {
            getPlayers()
        }
    }, [userData])

    return (
        <div>
            <div className='dnd-container'>
                <DndNavbar error={ error } isSmallView={ isSmallView } setError={ setError } />
                <div className='dnd-main-content'>
                    <Switch>
                        <Route exact path='/'>
                            <DndHome />
                        </Route>
                        <Route exact path='/profile'>
                            <CharacterProfile />
                        </Route>
                        <Route exact path='/initiative-order'>
                            <InitiativeOrder />
                        </Route>
                        <Route exact path='/account/sign-in'>
                            <SignIn setError={ setError } />
                        </Route>
                        <Route exact path='/account/sign-up'>
                            <SignUp setError={ setError } />
                        </Route>
                        <Route exact path='/account/password-reset'>
                            <PasswordReset setError={ setError } />
                        </Route>
                        <Route exact path='/account/profile'>
                            <ProfilePage setError={ setError } />
                        </Route>
                    </Switch>
                </div>
                <DndFooter isSmallView={ isSmallView } />
            </div>
            <div>
                <LandscapePage />
            </div>
        </div>
    )
}