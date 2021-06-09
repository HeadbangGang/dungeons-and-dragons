import React, { useContext } from 'react'
import { Navbar, NavDropdown, Nav, Button, Toast } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import d20 from '../../media/d20.png'
import { PlayersContext } from '../../providers/players-provider'
import { UserContext } from '../../providers/userprovider'
import { AUTHENTICATION, ERRORS } from '../../language-map'
import userIcon from '../../media/d20.png'
import './dnd-navbar.css'

export const DndNavbar = ({ error, setError }) => {
    const history = useHistory()
    const players = useContext(PlayersContext)
    const userContext = useContext(UserContext)

    return (
        <Navbar bg="light" expand="lg">
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
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    { userContext?.activeGameId && players.length > 0 &&
                    <>
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
                                        // href=''
                                        key={ index }
                                        onClick={ () => console.log(player) }
                                    >
                                        { player }
                                    </a>
                                )
                            })}
                        </NavDropdown>
                    </>}
                </Nav>
                { userContext?.email || userContext?.username
                    ? <div className='navbar-user-wrapper'>
                        <input
                            className="navbar-user-icon"
                            onClick={ () => history.push('/account/profile') }
                            src={ userContext?.photoURL || userIcon }
                            type="image"
                        />
                    </div>
                    : <Button variant="outline-dark"
                        className="navbar-sign-in-button"
                        onClick={ () => {
                            history.push('/account/sign-in')
                        } }
                    >
                        { AUTHENTICATION.signIn }
                    </Button>
                }
            </Navbar.Collapse>
        </Navbar>
    )
}