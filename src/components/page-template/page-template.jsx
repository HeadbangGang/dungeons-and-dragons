import i18n from 'i18next'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { auth, getUserDocument, streamGameData } from '../../database/firebase'
import { PAGE_ID } from '../../helpers/constants'
import ChangeLanguage from '../change-language/change-language'
import {
    getActiveGameId,
    getCurrentUser,
    getHasLoadedTemplate,
    setActiveGameData,
    setCurrentLanguage,
    setCurrentPageId,
    setErrors,
    setHasLoadedTemplate, setLocaleNames,
    setLocales,
    setUserAccount
} from '../../store'
import Footer from '../footer/footer'
import { changeCurrentLanguage, language } from '../I18N/i18n'
import Navbar from '../navbar/navbar'
import * as allLocales from '../../helpers/locales/'
import './page-template.scss'

const PageTemplate = ({ children }) => {
    const dispatch = useDispatch()

    const { pathname } = useLocation()

    const activeGameId = useSelector(getActiveGameId)
    const userData = useSelector(getCurrentUser)
    const hasLoadedTemplate = useSelector(getHasLoadedTemplate)


    useEffect(() => {
        const preferredLanguage = window.localStorage.getItem('preferredLanguage')

        dispatch(setLocales(Object.keys(allLocales)))

        if (!preferredLanguage) {
            dispatch(setCurrentLanguage(window.navigator.language))
        }
        if (preferredLanguage && preferredLanguage !== i18n.language) {
            changeCurrentLanguage(preferredLanguage, () => dispatch(setCurrentLanguage(preferredLanguage)))
        }
    }, [])

    useEffect(() => {
        dispatch(setCurrentPageId(PAGE_ID[pathname]))
        document.getElementById('dungeons-and-dragons').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    }, [pathname])

    useEffect(() => {
        if (!hasLoadedTemplate) {
            auth.onAuthStateChanged(async (userAuth) => {
                if (userAuth) {
                    await getUserDocument(userAuth.uid)
                        .then((res) => {
                            if (res) {
                                dispatch(setUserAccount(res))
                            }
                        })
                }
            })
            dispatch(setHasLoadedTemplate(true))
        }
    }, [])

    useEffect(() => {
        if (userData?.activeGameId) {
            return streamGameData(activeGameId, {
                next: querySnapshot => {
                    const playersList = querySnapshot.docs.map(docSnapshot => docSnapshot.data())
                    dispatch(setActiveGameData({ players: { ...playersList[0] } }))
                },
                error: () => dispatch(setErrors(language.firebaseErrors.updateFirebase))
            })
        }
    }, [setActiveGameData, userData])

    return (
        <div className="dnd-container">
            <Navbar />
            <div className="dnd-main-content">
                { children }
                <ChangeLanguage />
            </div>
            <Footer />
        </div>
    )
}

export default PageTemplate
