import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreateAccount from './components/authentication/create-account'
import ResetPassword from './components/authentication/reset-password'
import SignIn from './components/authentication/sign-in'
import DiceRoller from './components/dice-roller/dice-roller'
import DndHome from './components/homepage/dnd-home'
import InitiativeRoller from './components/initiative-order/initiative-roller'
import PageTemplate from './components/page-template/page-template'
import Profile from './components/authentication/profile-page/profile'
import PageNotFound from './components/page-not-found/page-not-found'

const RoutesController = () => {
    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route element={ <PageTemplate /> } path="/">
                    <Route element={ <DndHome /> } index />
                    <Route element={ <CreateAccount /> } path="account/create-account" />
                    <Route element={ <ResetPassword /> } path="account/password-reset" />
                    <Route element={ <Profile /> } path="account/profile" />
                    <Route element={ <SignIn /> } path="account/sign-in" />
                    <Route element={ <DiceRoller /> } path="dice-roller" />
                    <Route element={ <InitiativeRoller /> } path="initiative-order" />
                    <Route element={ <PageNotFound /> } path="*" />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesController
