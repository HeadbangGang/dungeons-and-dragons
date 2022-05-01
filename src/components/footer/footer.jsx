import React, { useRef, useState } from 'react'
import { Button, Navbar, Overlay, Tooltip } from 'react-bootstrap'
import { PAGE_URL } from '../../helpers/constants'
import { getActiveGameId, setShowChangeLanguage } from '../../store'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import './footer.scss'
import I18N from '../I18N/i18n'

const DndFooter = () => {
    const dispatch = useDispatch()
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
            <div className="footer__copyright-container">
                <button className="footer__img-button" onClick={ async () => await navigate(PAGE_URL.HOME_PAGE) }>
                    <img
                        alt="d20"
                        draggable={ false }
                        height="30"
                        src="/assets/media/d20.png"
                        width="30"
                    />
                </button>
                <div className="footer__copyright">
                    <I18N name="common.copyright" />
                    { ` ${date.getFullYear()} ` }
                    <I18N name="common.myName" />
                </div>
            </div>
            <div>
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
                <button className="footer__img-button" onClick={ () => dispatch(setShowChangeLanguage(true)) }>
                    <img alt="" className="footer__i18n-img" src="/assets/media/i18n-symbol.png" title="Change Language" />
                </button>
            </div>
        </Navbar>
    )
}

export default DndFooter
