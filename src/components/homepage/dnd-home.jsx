import React from 'react'
import { useHistory } from 'react-router-dom'

export const DndHome = () => {
    const history = useHistory()
    return (
        <div>
            home
            <button onClick={ () => history.push('/profile') }>Click Me</button>
        </div>
    )
}