import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { PAGE_URL } from '../../helpers/constants'
import {
    getActiveGameId,
    getAllGamePlayers,
    getCurrentUser,
    getCurrentUserIsDm
} from '../../store'
import { useSelector } from 'react-redux'
import { Button, Navbar } from 'react-bootstrap'
import { AUTHENTICATION } from '../../helpers/language-map'
import './navbar.scss'

const DndNavbar = () => {
    const navigate = useNavigate()

    const userData = useSelector(getCurrentUser)
    const activeGameId = useSelector(getActiveGameId)
    const gamePlayers = useSelector(getAllGamePlayers)
    const isDM = useSelector(getCurrentUserIsDm)

    const [totalPlayers, setTotalPlayers] = useState(0)
    const [navbarExpanded, setNavbarExpanded] = useState(false)

    useEffect(() => {
        if (activeGameId) {
            setTotalPlayers(Object.keys(gamePlayers)?.length)
        }
    }, [gamePlayers])

    const handleProfileClick = () => {
        navbarExpanded && setNavbarExpanded(false)
        navigate(PAGE_URL.PROFILE_PAGE)
    }

    const handleSignInClick = () => {
        navbarExpanded && setNavbarExpanded(false)
        navigate(PAGE_URL.SIGN_IN_PAGE)
    }

    const handleHomeButton = () => {
        navbarExpanded && setNavbarExpanded(false)
        navigate(PAGE_URL.HOME_PAGE)
    }

    const handleInitiativeOrder = () => {
        navbarExpanded && setNavbarExpanded(false)
        navigate(PAGE_URL.INITIATIVE_ORDER_PAGE)
    }

    const handleDiceRoller = () => {
        navbarExpanded && setNavbarExpanded(false)
        navigate(PAGE_URL.DICE_ROLLER_PAGE)
    }

    const renderAccountButton = () => {
        if (userData?.email && userData?.uid && userData?.fullName) {
            return (
                <Button
                    className="navbar__account-button"
                    onClick={ () => handleProfileClick() }
                    variant="dark"
                >
                    <div className="material-icons">account_circle</div> Account
                </Button>
            )
        }

        return (
            <Button
                onClick={ () => handleSignInClick() }
                variant="dark"
            >
                { AUTHENTICATION.signIn } / Sign Up
            </Button>
        )
    }

    return (
        <Navbar
            bg="light"
            expand="lg"
            expanded={ navbarExpanded }
            fixed="top"
            onToggle={ () => setNavbarExpanded(!navbarExpanded) }
        >
            <button
                className="navbar__icon"
                onClick={ () => handleHomeButton() }
            >
                <img
                    alt="dnd-logo"
                    className="navbar__icon__img"
                    src="/assets/media/d20.png"
                    draggable={ false }
                />
            </button>
            <Navbar.Toggle onBlur={ () => setNavbarExpanded(!navbarExpanded) } />
            <Navbar.Collapse>
                <div className="navbar__buttons">
                    { activeGameId && (totalPlayers > 0 || isDM) &&
                        <Button
                            onClick={ () => handleInitiativeOrder() }
                            variant="link"
                        >
                            Initiative Order
                        </Button>
                    }
                    <Button
                        onClick={ () => handleDiceRoller() }
                        variant="link"
                    >
                        Dice Roller
                    </Button>
                    { renderAccountButton() }
                </div>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default DndNavbar
