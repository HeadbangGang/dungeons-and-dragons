import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { auth, getUserDocument, streamGameData } from '../../database/firebase'
import { PAGE_ID } from '../../helpers/constants'
import {
    getActiveGameId,
    getCurrentUser,
    getHasLoadedTemplate,
    setActiveGameData,
    setCurrentPageId,
    setErrors,
    setHasLoadedTemplate,
    setUserAccount
} from '../../store'
import Alerts from '../alerts/alerts'
import Footer from '../footer/footer'
import { language } from '../I18N/i18n'
import Navbar from '../navbar/navbar'
import './page-template.scss'

const PageTemplate = ({ children }) => {
    const dispatch = useDispatch()

    const { pathname } = useLocation()

    const activeGameId = useSelector(getActiveGameId)
    const userData = useSelector(getCurrentUser)
    const hasLoadedTemplate = useSelector(getHasLoadedTemplate)

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

    useEffect(() => {
        dispatch(setCurrentPageId(PAGE_ID[pathname]))
    }, [pathname])

    return (
        <div className="dnd-container">
            <Alerts />
            <Navbar />
            <div className="dnd-main-content">
                { children }
            </div>
            <Footer />
        </div>
    )
}

export default PageTemplate
