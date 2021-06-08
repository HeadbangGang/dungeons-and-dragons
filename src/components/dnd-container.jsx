import React from 'react'
import PlayersProvider from '../providers/players-provider'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { CharacterProfile } from './character-profile/character-profile'
import { DndHome } from './homepage/dnd-home'
import { DndNavbar } from './navbar/dnd-navbar'
import { InitiativeOrder } from './initiative-order/initiative-order'

export const DndContainer = () => {
    return (
        <PlayersProvider>
            <Router basename='/'>
                <DndNavbar />
                <Switch>
                    <Route exact path='/' component={ DndHome } />
                    <Route exact path='/profile' component={ CharacterProfile } />
                    <Route exact path='/initiative-order' component={ InitiativeOrder } />
                </Switch>
            </Router>
        </PlayersProvider>
    )
}