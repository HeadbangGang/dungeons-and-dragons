import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
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

const DndNavbar = () => {
    const router = useRouter()

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

    const handleProfileClick = async () => {
        await router.push('/account/profile')
    }

    const handleSignInClick = async () => {
        await router.push('/account/sign-in')
    }

    const handleHomeButton = async () => {
        await router.push('/')
    }

    const handleInitiativeOrder = async () => {
        await router.push('/initiative-order')
    }

    const handleDiceRoller = async () => {
        await router.push('/dice-roller')
    }

    const renderAccountButton = () => {
        if (userData?.email && userData?.uid && userData?.fullName) {
            if (isSmallView) {
                return (
                    <Button
                        onClick={ async () => await handleProfileClick() }
                        variant="dark"
                    >
                        Account
                    </Button>
                )
            }

            return (
                <button
                    className="navbar__account-button"
                    onClick={ async () => await handleProfileClick() }
                    title="Account"
                >
                    <span className="material-icons">account_circle</span>
                </button>
            )
        }

        return (
            <Button
                onClick={ async () => await handleSignInClick() }
                variant="dark"
            >
                { AUTHENTICATION.signIn } / Sign Up
            </Button>
        )
    }

    return (
        <Navbar bg="light" expand="lg" fixed="top" expanded={ navbarExpanded } onToggle={ () => setNavbarExpanded(!navbarExpanded) }>
            <button
                className="navbar__icon"
                onClick={ async () => await handleHomeButton() }
            >
                <img
                    alt="dnd-logo"
                    className="navbar__icon__img"
                    src="/media/d20.png"
                    draggable={ false }
                />
            </button>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <div className={ `navbar__buttons ${isSmallView ? 'small' : 'large'}` }>
                    { activeGameId && (totalPlayers > 0 || isDM) &&
                        <Button
                            onClick={ async () => await handleInitiativeOrder() }
                            variant="link"
                        >
                            Initiative Order
                        </Button>
                    }
                    <Button
                        onClick={ async () => await handleDiceRoller() }
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
