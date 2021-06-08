import React, { createContext, useEffect, useState } from 'react'
import { db } from '../database/firebase'

export const PlayersContext = createContext(null)

export default function PlayersProvider (props) {
    const [players, setPlayers] = useState([])

    useEffect(() => {
        const allPlayers = []
        async function getPlayers () {
            const playersRef = db.collection('users')
            const snapshot = await playersRef.get()
            snapshot.forEach(player => {
                allPlayers.push(player.data().characterName)
            })
        }
        getPlayers()
        setPlayers(allPlayers)
    }, [])

    return (
        <PlayersContext.Provider value={ players }>
            { props.children }
        </PlayersContext.Provider>
    )
}