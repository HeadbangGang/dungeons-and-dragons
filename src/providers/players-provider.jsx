import React, { createContext, useState } from 'react'

export const PlayersContext = createContext(null)

export default function PlayersProvider (props) {
    const [players, setPlayers] = useState(['Chika', 'Aeris', 'Isla', 'Aheta'])

    return (
        <PlayersContext.Provider value={ players }>
            { props.children }
        </PlayersContext.Provider>
    )
}