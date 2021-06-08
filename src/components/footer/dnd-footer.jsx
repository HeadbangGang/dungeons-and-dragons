import React from 'react'
import { useHistory } from 'react-router-dom'
import { Navbar } from 'react-bootstrap'
import d20 from '../../media/d20.png'
import { GENERAL } from '../../language-map'
import './dnd-footer.css'

export default function DndFooter () {
    const history = useHistory()
    const date = new Date

    return (
        <Navbar bg="dark" fixed="bottom" className="navbar-container-footer">
            <a href='' className='navbar-brand' onClick={ () => history.push('/') }>
                <img
                    src={ d20 }
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    alt=''
                    draggable={ false }
                />
            </a>
            { GENERAL.copyright + ' ' + date.getFullYear() + ' ' + GENERAL.name }
        </Navbar>
    )
}