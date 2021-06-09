import React, { createContext, useEffect, useState, useContext } from 'react'
import { UserContext } from './userprovider'
import { db } from '../database/firebase'

export const PlayersContext = createContext(null)

export default function PlayersProvider (props) {
    const userContext = useContext(UserContext)
    const [players, setPlayers] = useState([])

    useEffect(() => {
        async function getPlayers () {
            const characterNames = []
            const activeGameId = userContext.activeGameId
            const gameDataByActiveGameId = db.collection('games').doc(activeGameId)
            const gameDataCall = await gameDataByActiveGameId.get()
            const gameData = gameDataCall.data().players
            for (const [key, value] of Object.entries(gameData)) {
                characterNames.push(value.characterName)
            }
            setPlayers(characterNames)
        }

        if (userContext.activeGameId) {
            getPlayers()
        }
    }, [userContext])

    return (
        <PlayersContext.Provider value={ players }>
            { props.children }
        </PlayersContext.Provider>
    )
}