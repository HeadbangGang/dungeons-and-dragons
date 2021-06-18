import React, { useEffect } from 'react'
import Immutable from 'immutable'
import { useMediaQuery } from 'react-responsive'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser, setUserAccount, setActiveGameData, getSelectedCharacter } from '../store/store'
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
    const history = useHistory()
    const dispatch = useDispatch()

    const userData = useSelector(getCurrentUser)
    const selectedCharacter = useSelector(getSelectedCharacter)

    const isSmallView = useMediaQuery({
        query: '(max-device-width: 991px)'
    })

    useEffect(() => {
        auth.onAuthStateChanged(async userAuth => {
            const user = await generateUserDocument(userAuth)
            dispatch(setUserAccount(user || Immutable.Map()))
        })
    }, [])

    useEffect(() => {
        if (selectedCharacter) {
            history.push(`/profile/${ selectedCharacter }`)
        }
    }, [selectedCharacter])

    useEffect(() => {
        async function getPlayers () {
            const activeGameId = userData.get('activeGameId')
            const gameDataByActiveGameId = db.collection('games').doc(activeGameId)
            await gameDataByActiveGameId.get()
                .then((res) => {
                    dispatch(setActiveGameData(res.data()))
                })
        }
        if (userData?.get('activeGameId')) {
            getPlayers()
        }
    }, [userData])

    return (
        <div>
            <div className='dnd-container'>
                <DndNavbar isSmallView={ isSmallView } />
                <div className='dnd-main-content'>
                    <Switch>
                        <Route exact path='/'>
                            <DndHome />
                        </Route>
                        <Route exact path={ `/profile/${ selectedCharacter }` }>
                            <CharacterProfile />
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
                    </Switch>
                </div>
                <DndFooter isSmallView={ isSmallView } />
            </div>
            <LandscapePage />
        </div>
    )
}