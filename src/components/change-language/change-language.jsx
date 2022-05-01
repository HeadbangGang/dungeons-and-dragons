import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentLanguage, getLocaleNames, getLocales, getShowChangeLanguage, setCurrentLanguage, setLocaleNames, setShowChangeLanguage } from '../../store'
import { Button, Offcanvas } from 'react-bootstrap'
import I18N, { changeCurrentLanguage } from '../I18N/i18n'
import './change-language.scss'

const ChangeLanguage = () => {
    const dispatch = useDispatch()

    const showChangeLanguage = useSelector(getShowChangeLanguage)
    const locales = useSelector(getLocales)
    const currentLanguage = useSelector(getCurrentLanguage)
    const localeNames = useSelector(getLocaleNames)

    const handleCloseBehavior = () => {
        dispatch(setShowChangeLanguage(false))
    }

    const handleLanguageButton = async (language) => {
        await changeCurrentLanguage(language, () => dispatch(setCurrentLanguage(language)))
        dispatch(setLocaleNames(locales))
    }

    const shouldDisableLanguageButton = (code) => code === currentLanguage || (code === 'en' && currentLanguage === 'en-US')

    return (
        <Offcanvas onHide={ handleCloseBehavior } placement="bottom" show={ showChangeLanguage }>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                    <I18N name="changeLanguage.header" />
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className="change-language__body">
                    { localeNames.map(({ code, name }) => (
                        <Button disabled={ shouldDisableLanguageButton(code) } onClick={ () => handleLanguageButton(code) } key={ code } title={ name } variant="outline-dark">
                            { `${name} (${code})` }
                        </Button>
                    )) }
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    )
}

export default ChangeLanguage
