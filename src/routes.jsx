import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageTemplate from './components/page-template/page-template'
import SuspenseLoading from './components/suspense-loading/suspense-loading'
import { PAGE_URL, SPINNER_DEFAULT } from './helpers/constants'

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
    import('./components/profile-page/profile'),
    new Promise(resolve => setTimeout(resolve, SPINNER_DEFAULT))
]).then(([moduleExports]) => moduleExports))

const PageNotFound = React.lazy(() => Promise.all([
    import('./components/page-not-found/page-not-found'),
    new Promise(resolve => setTimeout(resolve, SPINNER_DEFAULT))
]).then(([moduleExports]) => moduleExports))

const ROUTES = [
    { element: <DndHome />, path: PAGE_URL.HOME_PAGE },
    { element: <CreateAccount />, path: PAGE_URL.CREATE_ACCOUNT_PAGE },
    { element: <ResetPassword />, path: PAGE_URL.PASSWORD_RESET_PAGE },
    { element: <Profile />, path: PAGE_URL.PROFILE_PAGE },
    { element: <SignIn />, path: PAGE_URL.SIGN_IN_PAGE },
    { element: <DiceRoller />, path: PAGE_URL.DICE_ROLLER_PAGE },
    { element: <InitiativeOrder />, path: PAGE_URL.INITIATIVE_ORDER_PAGE },
    { element: <PageNotFound />, path: '*' }
]

const renderRoutes = () => {
    return ROUTES.map((routeData, idx) => (
        <Route key={ idx }  { ...routeData } />
    ))
}

const RoutesController = () => {
    return (
        <BrowserRouter basename={ PAGE_URL.HOME_PAGE }>
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
