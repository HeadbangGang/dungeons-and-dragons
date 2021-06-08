import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import d20Vector from '../../media/d20-vector.png'
import spinner from '../../media/spinner.webp'
import { db } from '../../database/firebase'
import './dnd-home.css'

export const DndHome = () => {
    const history = useHistory()
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    return (
        <>
            <div style={{ display: 'flex' }}>
                { isImageLoaded
                    ? <img
                        alt='d20'
                        className='dnd-home-img'
                        draggable={ false }
                        src={ d20Vector }
                    />
                    : <img
                        alt='spinner'
                        className='dnd-home-img'
                        draggable={ false }
                        onLoad={ () => setIsImageLoaded(true) }
                        src={ spinner }
                    />
                }
            </div>
            <div style={{ display: 'flex' }}>
                <span className='dnd-home-title'><strong>Dungeons and Dragons</strong></span>
            </div>
            <button onClick={ () => history.push('/profile') }>Click Me</button>
        </>
    )
}