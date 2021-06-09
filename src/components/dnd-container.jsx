import React from 'react'
import PlayersProvider from '../providers/players-provider'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
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
    return (
        <div className='dnd-container'>
            <UserProvider>
                <PlayersProvider>
                    <Router basename='/'>
                        <DndNavbar />
                        <Switch>
                            <Route exact path='/' component={ DndHome } />
                            <Route exact path='/profile' component={ CharacterProfile } />
                            <Route exact path='/initiative-order' component={ InitiativeOrder } />
                            <Route exact path='/account/sign-in' component={ SignIn } />
                            <Route exact path='/account/sign-up' component={ SignUp } />
                            <Route exact path='/account/password-reset' component={ PasswordReset } />
                            <Route exact path='/account/profile' component={ ProfilePage } />
                        </Switch>
                        <DndFooter />
                    </Router>
                </PlayersProvider>
            </UserProvider>
        </div>
    )
}