import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import PlayersProvider from '../providers/players-provider'
import { Route, Switch } from 'react-router-dom'
import { CharacterProfile } from './character-profile/character-profile'
import { DndHome } from './homepage/dnd-home'
import { DndNavbar } from './navbar/dnd-navbar'
import { InitiativeOrder } from './initiative-order/initiative-order'
import SignIn from './authentication/signin'
import SignUp from './authentication/signup'
import PasswordReset from './authentication/passwordreset'
import UserProvider from '../providers/userprovider'
import DndFooter from '../components/footer/dnd-footer'
import ProfilePage from './authentication/profilepage'
import './dnd-container.css'

export const DndContainer = () => {
    const [error, setError] = useState(null)

    const isSmallView = useMediaQuery({
        query: '(max-device-width: 991px)'
    })

    return (
        <div className='dnd-container'>
            <UserProvider location={ location }>
                <PlayersProvider>
                    <DndNavbar error={ error } isSmallView={ isSmallView } setError={ setError } />
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
                    <DndFooter />
                </PlayersProvider>
            </UserProvider>
        </div>
    )
}