import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
    getActiveGameId,
    getAllGamePlayers,
    getCurrentUser, getCurrentUserIsDm,
    getIsSmallView,
    getProfilePicture
} from '../../store/store'
import { useSelector } from 'react-redux'
import { Button, Nav, Navbar } from 'react-bootstrap'
import { AUTHENTICATION } from '../../helpers/language-map'
import Link from 'next/link'

const DndNavbar = () => {
    const router = useRouter()

    const userData = useSelector(getCurrentUser)
    // const uid = useSelector(getCurrentUID)
    const activeGameId = useSelector(getActiveGameId)
    const profilePicture = useSelector(getProfilePicture)
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
        setNavbarExpanded(false)
        await router.push('/account/profile')
    }

    const handleHomeButton = async () => {
        setNavbarExpanded(false)
        await router.push('/')
    }

    const signInButton = () => {
        if (userData?.email && userData?.uid && userData?.fullName) {
            return (
                <div className="navbar__user-wrapper">
                    { profilePicture
                        ? <input
                            alt=""
                            className="navbar__user-icon"
                            onClick={ async () => await handleProfileClick() }
                            src={ profilePicture || '/media/d20.png' }
                            type="image"
                        />
                        :<a
                            href="#"
                            onClick={ async () => await handleProfileClick() }
                            style={{ color: 'black' }}
                        >
                            <span
                                className="material-icons"
                                style={{ fontSize: '43px' }}
                            >
                                account_circle
                            </span>
                        </a>
                    }
                </div>
            )
        }

        return (
            <Button variant="outline-dark"
                className="navbar__sign-in-button"
                onClick={ async () => {
                    setNavbarExpanded(false)
                    await router.push('/account/sign-in')
                } }
            >
                { AUTHENTICATION.signIn }
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
            { isSmallView && signInButton() }
            <>
                <div style={{ marginLeft: '12px' }}>
                    <Navbar.Toggle />
                </div>
                <Navbar.Collapse>
                    <Nav>
                        <>
                            { activeGameId && (totalPlayers > 0 || isDM) &&
                                <Link href="/initiative-order">
                                    <a
                                        href="#"
                                        className="nav-link"
                                        onClick={ () => setNavbarExpanded(false) }
                                    >
                                    Initiative Order
                                    </a>
                                </Link> }
                            <Link href="/dice-roller">
                                <a
                                    href="#"
                                    className="nav-link"
                                    onClick={ () => setNavbarExpanded(false) }
                                >
                                    Dice Roller
                                </a>
                            </Link>
                        </>
                    </Nav>
                </Navbar.Collapse>
            </>
            { !isSmallView && signInButton() }
        </Navbar>
    )
}

export default DndNavbar
