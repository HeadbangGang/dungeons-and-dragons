import React, { useEffect, useState } from 'react'
import {
    getActiveGameId,
    getAllGamePlayers,
    getCurrentUser,
    getCurrentUserIsDm,
    getIsSmallView
} from '../../store/store'
import { useSelector } from 'react-redux'
import { Button, Navbar } from 'react-bootstrap'
import { AUTHENTICATION } from '../../helpers/language-map'
import { useNavigate } from 'react-router'
import './navbar.scss'

const DndNavbar = () => {
    const navigate = useNavigate()

    const userData = useSelector(getCurrentUser)
    const activeGameId = useSelector(getActiveGameId)
    const isSmallView = useSelector(getIsSmallView)
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
        navigate('account/profile')
    }

    const handleSignInClick = () => {
        navigate('account/sign-in')
    }

    const handleHomeButton = () => {
        navigate('/')
    }

    const handleInitiativeOrder = () => {
        navigate('initiative-order')
    }

    const handleDiceRoller = () => {
        navigate('dice-roller')
    }

    const renderAccountButton = () => {
        if (userData?.email && userData?.uid && userData?.fullName) {
            if (isSmallView) {
                return (
                    <Button
                        onClick={ () => handleProfileClick() }
                        variant="dark"
                    >
                        Account
                    </Button>
                )
            }

            return (
                <button
                    className="navbar__account-button"
                    onClick={ () => handleProfileClick() }
                    title="Account"
                >
                    <span className="material-icons">account_circle</span>
                </button>
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
        <Navbar onBlur={ () => setNavbarExpanded(false) } bg="light" expand="lg" fixed="top" expanded={ navbarExpanded } onToggle={ () => setNavbarExpanded(!navbarExpanded) }>
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
            <Navbar.Toggle />
            <Navbar.Collapse>
                <div className={ `navbar__buttons ${isSmallView ? 'small' : 'large'}` }>
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
