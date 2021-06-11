import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Navbar, NavDropdown, Nav, Button, Toast } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import d20 from '../../media/d20.png'
import { AUTHENTICATION, ERRORS } from '../../language-map'
import userIcon from '../../media/d20.png'
import './dnd-navbar.css'
import { getCurrentUser, getActiveGamePlayers } from '../../store/store'

export const DndNavbar = ({ error, isSmallView, setError }) => {
    const history = useHistory()

    const userData = useSelector(getCurrentUser)
    const players = useSelector(getActiveGamePlayers)
    const [navbarExpanded, setNavbarExpanded] = useState(false)

    const signInButton = () => {
        if(userData?.get('email') && userData?.get('uid') && userData?.get('fullName')) {
            return (
                <div className='navbar-user-wrapper'>
                    <input
                        className="navbar-user-icon"
                        onClick={ () => {
                            setNavbarExpanded(false)
                            history.push('/account/profile')
                        } }
                        src={ userData?.get('photoURL') || userIcon }
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
            { userData?.get('activeGameId') && players.size > 0 &&
                    <>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <div className='mr-auto navbar-nav'>
                                    <a
                                        className='nav-link'
                                        onClick={ () => {
                                            setNavbarExpanded(false)
                                            history.push('/initiative-order')
                                        } }
                                    >
                            Initiative Order
                                    </a>
                                </div>
                                <NavDropdown title="Characters" id="basic-nav-dropdown">
                                    { players.map((player, index) => {
                                        return (
                                            <a
                                                className='dropdown-item'
                                                key={ index }
                                                onClick={ () => {
                                                    setNavbarExpanded(false)
                                                    setError(player)
                                                } }
                                            >
                                                { player }
                                            </a>
                                        )
                                    })}
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </>}
            { !isSmallView && signInButton() }
            <Toast
                autohide
                className="navbar-toast-container"
                delay={ 5000 }
                onClose={ () => setError(null) }
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

DndNavbar.propTypes={
    error: PropTypes.string,
    isSmallView: PropTypes.bool,
    setError: PropTypes.func
}