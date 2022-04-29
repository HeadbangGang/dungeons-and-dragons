import React from 'react'
import { useSelector } from 'react-redux'
import { getAllUserGames } from '../../store'
import I18N from '../I18N/i18n'
import OtherGames from '../other-games/other-games'
import './dnd-home.scss'

const DndHome = () => {
    const allUserGames = useSelector(getAllUserGames)

    return (
        <div className="dnd-home__container">
            <img
                alt="d20"
                className="dnd-home__img"
                draggable={ false }
                src="/assets/media/d20-vector-good.png"
            />
            <strong>
                <I18N blockLevel className="dnd-home__title" name="common.dungeonsAndDragons" />
            </strong>
            { Object.keys(allUserGames)?.length > 1 && <OtherGames /> }
        </div>
    )
}

export default DndHome
