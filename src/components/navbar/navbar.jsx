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
import './navbar.scss'
import I18N from '../I18N/i18n'

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
                    <div className="material-icons">account_circle</div>
                    <I18N name="navbar.account" />
                </Button>
            )
        }

        return (
            <Button
                onClick={ () => handleSignInClick() }
                variant="dark"
            >
                <I18N name="navbar.signInSignUp" />
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
            <Navbar.Toggle onBlur={ () => setTimeout(() => setNavbarExpanded(false), 100)  } />
            <Navbar.Collapse>
                <div className="navbar__buttons">
                    { activeGameId && (totalPlayers > 0 || isDM) &&
                        <Button
                            onClick={ () => handleInitiativeOrder() }
                            variant="link"
                        >
                            <I18N name="navbar.initiativeOrder" />
                        </Button>
                    }
                    <Button
                        onClick={ () => handleDiceRoller() }
                        variant="link"
                    >
                        <I18N name="navbar.diceRoller" />
                    </Button>
                    { renderAccountButton() }
                </div>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default DndNavbar
