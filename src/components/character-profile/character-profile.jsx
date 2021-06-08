import React from 'react'
import chika from '../../test-data/chika.png'
import { CharacterSheet } from './character-sheet'
import './character-profile.css'

export const CharacterProfile = () => {
    return (
        <>
            <img
                alt=''
                className='profile-character-img'
                draggable={ false }
                src={ chika }
            />
            <CharacterSheet />
        </>
    )
}