import React, { useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import {
    getActiveGameId,
    getCurrentUser,
    getHasLoadedTemplate,
    setActiveGameData,
    setError,
    setHasLoadedTemplate,
    setIsSmallView,
    setUserAccount
} from '../../store/store'
import { auth, getUserDocument, streamGameData } from '../../database/firebase'
import Navbar from '../navbar/navbar'
import Footer from '../footer/footer'
import Alerts from '../alerts/alerts'

const PageTemplate = ({ children }) => {
    const dispatch = useDispatch()

    const activeGameId = useSelector(getActiveGameId)
    const userData = useSelector(getCurrentUser)
    const hasLoadedTemplate = useSelector(getHasLoadedTemplate)

    const isSmallView = useMediaQuery({ query: '(max-width: 1224px)' })

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
            dispatch(setIsSmallView(isSmallView))
            dispatch(setHasLoadedTemplate(true))
        }
    }, [])

    useEffect(() => {
        if (userData?.activeGameId) {
            const unsubscribe = streamGameData(activeGameId, {
                next: querySnapshot => {
                    const playersList = querySnapshot.docs.map(docSnapshot => docSnapshot.data())
                    dispatch(setActiveGameData({ players: { ...playersList[0] } }))
                },
                error: () => dispatch(setError('Error while updating new data.'))
            })
            return unsubscribe
        }
    }, [setActiveGameData, userData])

    return (
        <>
            <div className="dnd-container">
                <Alerts />
                <Navbar />
                <div className="dnd-main-content">
                    { children }
                </div>
                <Footer />
            </div>
        </>
    )
}

export default PageTemplate