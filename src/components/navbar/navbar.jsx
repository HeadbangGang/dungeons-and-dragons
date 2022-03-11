import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
    getActiveGameData, 
    getActiveGameId,
    getCurrentUID,
    getCurrentUser,
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
    const UID = useSelector(getCurrentUID)
    const activeGameData = useSelector(getActiveGameData)
    const activeGameId = useSelector(getActiveGameId)
    const profilePicture = useSelector(getProfilePicture)
    const isSmallView = useSelector(getIsSmallView)

    const [players, setPlayers] = useState([])
    const [navbarExpanded, setNavbarExpanded] = useState(false)

    const isDM = activeGameData.players && activeGameData.players[UID]?.gameMaster || false

    const handleProfileClick = async () => {
        setNavbarExpanded(false)
        await router.push('/account/profile')
    }

    useEffect(() => {
        if (activeGameId && activeGameData.players && Object.keys(activeGameData.players).length > 0) {
            Object.keys(activeGameData.players).forEach(player => {
                const name = activeGameData.players[player].characterName
                const isDM = activeGameData.players[player].gameMaster
                if (players.findIndex(item => item.characterName ===[player][name]) === -1 && !isDM) {
                    setPlayers([...player, name])
                }
            })
        }
    }, [])

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
        } else {
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
    }

    return (
        <Navbar bg="light" expand="lg" fixed="top" expanded={ navbarExpanded } onToggle={ () => setNavbarExpanded(!navbarExpanded) }>
            <a
                href="#"
                onClick={ async (e) => {
                    e.preventDefault()
                    setNavbarExpanded(false)
                    await router.push('/')
                } }
            >
                <img
                    alt="dnd-logo"
                    className="navbar__icon"
                    src="/media/d20.png"
                    draggable={ false }
                />
            </a>
            { isSmallView && signInButton() }
            <>
                <div style={{ marginLeft: '12px' }}>
                    <Navbar.Toggle />
                </div>
                <Navbar.Collapse>
                    <Nav>
                        <div>
                            { activeGameId && (players.length > 0 || isDM) &&
                                <a
                                    href="#"
                                    className="nav-link"
                                    onClick={ async () => {
                                        setNavbarExpanded(false)
                                        await router.push('/initiative-order')
                                    } }
                                >
                                    Initiative Order
                                </a> }
                            <Link href="/dice-roller">
                                <a
                                    href="#"
                                    className="nav-link"
                                    onClick={ () => {
                                        setNavbarExpanded(false)
                                    } }
                                >
                                    Dice Roller
                                </a>
                            </Link>
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </>
            { !isSmallView && signInButton() }
        </Navbar>
    )
}

export default DndNavbar