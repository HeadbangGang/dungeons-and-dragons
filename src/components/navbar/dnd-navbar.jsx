import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Navbar, NavDropdown, Nav, Button, Toast } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import d20 from '../../media/d20.png'
import { PlayersContext } from '../../providers/players-provider'
import { UserContext } from '../../providers/userprovider'
import { AUTHENTICATION, ERRORS } from '../../language-map'
import userIcon from '../../media/d20.png'
import './dnd-navbar.css'

export const DndNavbar = ({ error, isSmallView, setError }) => {
    const history = useHistory()
    const players = useContext(PlayersContext)
    const userContext = useContext(UserContext)

    const signInButton = () => {
        if(userContext?.email || userContext?.username) {
            return (
                <div className='navbar-user-wrapper'>
                    <input
                        className="navbar-user-icon"
                        onClick={ () => history.push('/account/profile') }
                        src={ userContext?.photoURL || userIcon }
                        type="image"
                    />
                </div>
            )
        } else {
            return (
                <Button variant="outline-dark"
                    className="navbar-sign-in-button"
                    onClick={ () => {
                        history.push('/account/sign-in')
                    } }
                >
                    { AUTHENTICATION.signIn }
                </Button>
            )
        }
    }

    return (
        <>
            <Navbar bg="light" expand="lg">
                <a
                    href=''
                    onClick={ () => history.push('/') }
                >
                    <img
                        alt='dnd-logo'
                        className='navbar-icon'
                        src={ d20 }
                        draggable={ false }
                    />
                </a>
                { isSmallView && signInButton()}
                { userContext?.activeGameId && players.length > 0 &&
                    <>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <div className='mr-auto navbar-nav'>
                                    <a
                                        className='nav-link'
                                        onClick={ () => history.push('/initiative-order') }
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
                                                onClick={ () => setError(player) }
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
            </Navbar>
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
        </>
    )
}

DndNavbar.propTypes={
    error: PropTypes.string,
    isSmallView: PropTypes.bool,
    setError: PropTypes.func
}