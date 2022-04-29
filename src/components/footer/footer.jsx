import React, { useRef, useState } from 'react'
import { Button, Navbar, Overlay, Tooltip } from 'react-bootstrap'
import { PAGE_URL } from '../../helpers/constants'
import { getActiveGameId } from '../../store'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import './footer.scss'
import I18N from '../I18N/i18n'

const DndFooter = () => {
    const navigate = useNavigate()

    const triggerRef = useRef(null)

    const activeGameId = useSelector(getActiveGameId)

    const [copySuccess, setCopySuccess] = useState(false)
    const [shouldShowOverlay, setShouldShowOverlay] = useState(false)

    const date = new Date()

    const copyGameId = () => {
        navigator.clipboard.writeText(activeGameId)
            .then(() => setCopySuccess(true))
            .catch(() => setCopySuccess(false))
            .then(() => setShouldShowOverlay(true))
    }

    return (
        <Navbar bg="dark" className="footer" fixed="bottom">
            <Button
                onClick={ async () => await navigate(PAGE_URL.HOME_PAGE) }
                variant="link"
            >
                <img
                    alt="d20"
                    draggable={ false }
                    height="30"
                    src="/assets/media/d20.png"
                    width="30"
                />
            </Button>
            <div className="footer__copyright">
                <I18N name="common.copyright" />
                { ` ${date.getFullYear()} ` }
                <I18N name="common.myName" />
            </div>
            { activeGameId &&
        <span className="footer__active-game-id">
            <Button
                onClick={ copyGameId }
                ref={ triggerRef }
                variant="link"
            >
                <I18N name="footer.gameId" activeGameId={ activeGameId } />
            </Button>
            <Overlay
                onHide={ () => setShouldShowOverlay(false) }
                placement="top"
                rootClose
                show={ shouldShowOverlay }
                target={ triggerRef }
            >
                <Tooltip>
                    <I18N name={ copySuccess ? 'footer.copySuccess' : 'footer.copyFailure' } />
                </Tooltip>
            </Overlay>
        </span> }
        </Navbar>
    )
}

export default DndFooter
