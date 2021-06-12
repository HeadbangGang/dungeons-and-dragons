import React from 'react'
import { LANDSCAPE_PAGE } from '../../language-map'
import './landscape-page.css'

export const LandscapePage = () => {
    return(
        <div className="landscape-page-container">
            <div className="landscape-box">
                <div className="landscape-header">
                    <h1>
                        { LANDSCAPE_PAGE.header }
                    </h1>
                </div>
                <h4>
                    { LANDSCAPE_PAGE.description }
                </h4>
            </div>
        </div>
    )
}

export default LandscapePage