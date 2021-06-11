import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navbar } from 'react-bootstrap'
import d20 from '../../media/d20.png'
import { GENERAL } from '../../language-map'
import './dnd-footer.css'
import { getCurrentUser } from '../../store/store'

export default function DndFooter () {
    const history = useHistory()
    const userData = useSelector(getCurrentUser)
    const date = new Date

    return (
        <Navbar bg="dark" fixed='bottom' className="navbar-container-footer">
            <a
                className='navbar-brand'
                href='#'
                onClick={ (e) => {
                    e.preventDefault()
                    history.push('/') }
                }
            >
                <img
                    src={ d20 }
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    alt=''
                    draggable={ false }
                />
            </a>
            <span className='footer-copyright'>{ GENERAL.copyright + ' ' + date.getFullYear() + ' ' + GENERAL.name }</span>
            { userData?.get('activeGameId') && <span className='footer-active-game-id'>{ `Game ID: ${ userData.get('activeGameId') }`}</span> }
        </Navbar>
    )
}
