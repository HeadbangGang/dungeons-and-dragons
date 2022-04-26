import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageTemplate from './components/page-template/page-template'
import SuspenseLoading from './components/suspense-loading/suspense-loading'
import { SPINNER_DEFAULT } from './helpers/constants'

const CreateAccount = React.lazy(() => Promise.all([
    import('./components/authentication/create-account'),
    new Promise(resolve => setTimeout(resolve, SPINNER_DEFAULT))
]).then(([moduleExports]) => moduleExports))

const ResetPassword = React.lazy(() => Promise.all([
    import('./components/authentication/reset-password'),
    new Promise(resolve => setTimeout(resolve, SPINNER_DEFAULT))
]).then(([moduleExports]) => moduleExports))

const SignIn = React.lazy(() => Promise.all([
    import('./components/authentication/sign-in'),
    new Promise(resolve => setTimeout(resolve, SPINNER_DEFAULT))
]).then(([moduleExports]) => moduleExports))

const DiceRoller = React.lazy(() => Promise.all([
    import('./components/dice-roller/dice-roller'),
    new Promise(resolve => setTimeout(resolve, SPINNER_DEFAULT))
]).then(([moduleExports]) => moduleExports))

const DndHome = React.lazy(() => Promise.all([
    import('./components/homepage/dnd-home'),
    new Promise(resolve => setTimeout(resolve, SPINNER_DEFAULT))
]).then(([moduleExports]) => moduleExports))

const InitiativeOrder = React.lazy(() => Promise.all([
    import('./components/initiative-order/initiative-order'),
    new Promise(resolve => setTimeout(resolve, SPINNER_DEFAULT))
]).then(([moduleExports]) => moduleExports))

const Profile = React.lazy(() => Promise.all([
    import('./components/authentication/profile-page/profile'),
    new Promise(resolve => setTimeout(resolve, SPINNER_DEFAULT))
]).then(([moduleExports]) => moduleExports))

const PageNotFound = React.lazy(() => Promise.all([
    import('./components/page-not-found/page-not-found'),
    new Promise(resolve => setTimeout(resolve, SPINNER_DEFAULT))
]).then(([moduleExports]) => moduleExports))

const ROUTES = [
    { element: <DndHome />, path: '/' },
    { element: <CreateAccount />, path: 'account/create-account' },
    { element: <ResetPassword />, path: 'account/password-reset' },
    { element: <Profile />, path: 'account/profile' },
    { element: <SignIn />, path: 'account/sign-in' },
    { element: <DiceRoller />, path: 'dice-roller' },
    { element: <InitiativeOrder />, path: 'initiative-order' },
    { element: <PageNotFound />, path: '*' }
]

const renderRoutes = () => {
    return ROUTES.map((routeData, idx) => (
        <Route key={ idx }  { ...routeData } />
    ))
}

const RoutesController = () => {
    return (
        <BrowserRouter basename="/">
            <PageTemplate>
                <Suspense fallback={ <SuspenseLoading /> }>
                    <Routes>
                        { renderRoutes() }
                    </Routes>
                </Suspense>
            </PageTemplate>
        </BrowserRouter>
    )
}

export default RoutesController
