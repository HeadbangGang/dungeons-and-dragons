import React, { useContext } from 'react'
import { Navbar, NavDropdown, Nav } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import d20 from '../../media/d20.png'
import { PlayersContext } from '../../providers/players-provider'
import './dnd-navbar.css'

export const DndNavbar = () => {
    const history = useHistory()
    const players = useContext(PlayersContext)

    return (
        <Navbar bg="light" expand="lg">
            <a
                href=''
                onClick={ () => history.push('/') }
            >
                <img
                    alt='dnd-logo'
                    className='navbar-icon'
                    src={ d20 }
                />
            </a>
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
                                    // href=''
                                    key={ index }
                                    onClick={ () => console.log(player) }
                                >
                                    { player }
                                </a>
                            )
                        })}
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}