import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar } from 'react-bootstrap'
import d20 from '../../media/d20.png'
import { GENERAL } from '../../language-map'
import './dnd-footer.css'
import { setSelectedCharacter, getActiveGameId, getSelectedCharacter } from '../../store/store'

export default function DndFooter () {
    const history = useHistory()
    const dispatch = useDispatch()

    const hasSelectedCharacter = useSelector(getSelectedCharacter)
    const activeGameId = useSelector(getActiveGameId)
    const date = new Date

    return (
        <Navbar bg="dark" fixed='bottom' className="navbar-container-footer">
            <a
                className='navbar-brand'
                href='#'
                onClick={ (e) => {
                    e.preventDefault()
                    { hasSelectedCharacter && dispatch(setSelectedCharacter(undefined)) }
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
            <span className='footer-copyright'>{ GENERAL.copyright + ' ' + date.getFullYear() + ' ' + GENERAL.myName }</span>
            { activeGameId && <span className='footer-active-game-id'>{ `Game ID: ${ activeGameId }`}</span> }
        </Navbar>
    )
}
