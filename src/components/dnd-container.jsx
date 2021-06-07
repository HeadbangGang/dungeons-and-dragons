import React from 'react'
import PlayersProvider from '../providers/players-provider'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { CharacterProfile } from './character-profile/character-profile'
import { DndHome } from './homepage/dnd-home'
import { DndNavbar } from './navbar/dnd-navbar'

export const DndContainer = () => {
    return (
        <PlayersProvider>
            <Router basename='/'>
                <DndNavbar />
                <Switch>
                    <Route exact path='/' component={ DndHome } />
                    <Route exact path='/profile' component={ CharacterProfile } />
                </Switch>
            </Router>
        </PlayersProvider>
    )
}