import React, { useState, useEffect } from 'react'
import { setError, getError, getIsSmallView } from '../../store/store'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar, NavDropdown, Nav, Button, Toast } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import d20 from '../../media/d20.png'
import { AUTHENTICATION, ERRORS } from '../../language-map'
import userIcon from '../../media/d20.png'
import './dnd-navbar.css'
import {
    getActiveGameData,
    getActiveGameId,
    getCurrentUser,
    getProfilePicture,
    getSelectedCharacter,
    setSelectedCharacter
} from '../../store/store'

export const DndNavbar = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const userData = useSelector(getCurrentUser)
    const activeGameData = useSelector(getActiveGameData)
    const activeGameId = useSelector(getActiveGameId)
    const profilePicture = useSelector(getProfilePicture)
    const hasSelectedCharacter = useSelector(getSelectedCharacter)
    const error = useSelector(getError)
    const isSmallView = useSelector(getIsSmallView)

    const [players, setPlayers] = useState([])
    const [navbarExpanded, setNavbarExpanded] = useState(false)

    const isDM = activeGameData.getIn(['players', userData.get('uid'), 'gameMaster'], false)

    useEffect(() => {
        if (activeGameId && activeGameData.size > 0) {
            activeGameData.get('players').forEach(player => {
                const name = player.get('characterName')
                const isDM = player.get('gameMaster')
                if (!players.includes(name) && !isDM) {
                    setPlayers([...players, name])
                }
            })
        }
    })


    const signInButton = () => {
        if(userData?.get('email') && userData?.get('uid') && userData?.get('fullName')) {
            return (
                <div className='navbar-user-wrapper'>
                    <input
                        className="navbar-user-icon"
                        onClick={ () => {
                            setNavbarExpanded(false)
                            { hasSelectedCharacter && dispatch(setSelectedCharacter(undefined)) }
                            history.push('/account/profile')
                        } }
                        src={ profilePicture || userIcon }
                        type="image"
                    />
                </div>
            )
        } else {
            return (
                <Button variant="outline-dark"
                    className="navbar-sign-in-button"
                    onClick={ () => {
                        setNavbarExpanded(false)
                        { hasSelectedCharacter && dispatch(setSelectedCharacter(undefined)) }
                        history.push('/account/sign-in')
                    } }
                >
                    { AUTHENTICATION.signIn }
                </Button>
            )
        }
    }

    return (
        <Navbar bg="light" expand="lg" fixed='top' expanded={ navbarExpanded } onToggle={ () => setNavbarExpanded(!navbarExpanded) }>
            <a
                href='#'
                onClick={ (e) => {
                    e.preventDefault()
                    setNavbarExpanded(false)
                    { hasSelectedCharacter && dispatch(setSelectedCharacter(undefined)) }
                    history.push('/') }
                }
            >
                <img
                    alt='dnd-logo'
                    className='navbar-icon'
                    src={ d20 }
                    draggable={ false }
                />
            </a>
            { isSmallView && signInButton()}
            <>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <div className='mr-auto navbar-nav'>
                            { activeGameId && (players.length > 0 || isDM) &&
                                    <a
                                        className='nav-link'
                                        onClick={ () => {
                                            setNavbarExpanded(false)
                                            { hasSelectedCharacter && dispatch(setSelectedCharacter(undefined)) }
                                            history.push('/initiative-order')
                                        } }
                                    >
                            Initiative Order
                                    </a>}
                            <a
                                className='nav-link'
                                onClick={ () => {
                                    setNavbarExpanded(false)
                                    history.replace('/dice-roller') }
                                }
                            >
                                Dice Roller
                            </a>
                            { players.length > 0 &&
                                <NavDropdown title="Characters" id="basic-nav-dropdown">
                                    { players.map((player, index) => {
                                        return (
                                            <a
                                                className='dropdown-item'
                                                key={ index }
                                                onClick={ () => {
                                                    setNavbarExpanded(false)
                                                    dispatch(setSelectedCharacter(player))
                                                } }
                                            >
                                                { player }
                                            </a>
                                        )
                                    })}
                                </NavDropdown> }
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </>
            { !isSmallView && signInButton() }
            <Toast
                autohide
                className="navbar-toast-container"
                delay={ 5000 }
                onClose={ () => dispatch(setError(null)) }
                show={ !!error }
            >
                <Toast.Header>
                    <strong className="mr-auto">
                        { ERRORS.error }
                    </strong>
                </Toast.Header>
                <Toast.Body>{ error }</Toast.Body>
            </Toast>
        </Navbar>
    )
}
