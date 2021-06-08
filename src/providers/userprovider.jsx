import React, { createContext, useEffect, useState } from 'react'
import { auth, generateUserDocument } from '../database/firebase'

export const UserContext = createContext({ user: null })

export default function UserProvider (props) {
    const [userAccount, setUserAccount] = useState([])

    useEffect(() => {
        auth.onAuthStateChanged(async userAuth => {
            const user = await generateUserDocument(userAuth)
            setUserAccount(user)
        })
    }, [])

    return (
        <UserContext.Provider value={ userAccount }>
            { props.children }
        </UserContext.Provider>
    )
}