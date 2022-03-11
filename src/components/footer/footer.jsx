import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { Navbar, Overlay, Tooltip } from 'react-bootstrap'
import { GENERAL } from '../../helpers/language-map'
import { getActiveGameId } from '../../store/store'

const DndFooter = () => {
    const router = useRouter()

    const triggerRef = useRef(null)

    const activeGameId = useSelector(getActiveGameId)

    const [copySuccess, setCopySuccess] = useState(false)
    const [copyFailure, setCopyFailure] = useState(false)

    const date = new Date()

    return (
        <Navbar bg="dark" fixed="bottom" className="footer">
            <a
                href="#"
                onClick={ async () => await router.push('/') }
            >
                <img
                    src="/media/d20.png"
                    width="30"
                    height="30"
                    alt=""
                    draggable={ false }
                />
            </a>
            <div className="footer__copyright">{ `${GENERAL.copyright} ${date.getFullYear()} ${GENERAL.myName}` }</div>
            { activeGameId &&
        <span className="footer__active-game-id">
            <a
                href="#"
                onClick={ () => {
                    navigator.clipboard.writeText(activeGameId)
                        .then(() => setCopySuccess(true))
                        .catch(() => setCopyFailure(true))
                } }
                ref={ triggerRef }
            >
                { `Game ID: ${activeGameId}` }
            </a>
            <Overlay
                onHide={ () => {
                    setCopySuccess(false)
                    setCopyFailure(false)
                } }
                placement="top"
                rootClose
                show={ copySuccess || copyFailure }
                target={ triggerRef }
            >
                <Tooltip>
                    { copySuccess ? 'Copied Game ID!' : 'There was an error. Please try again.' }
                </Tooltip>
            </Overlay>
        </span> }
        </Navbar>
    )
}

export default DndFooter