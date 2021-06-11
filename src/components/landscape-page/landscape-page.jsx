import React from 'react'
import './landscape-page.css'

export const LandscapePage = () => {
    return(
        <div className="landscape-page-container">
            <div className="landscape-box">
                <div className="landscape-header">
                    <h1>Landscape Detected</h1>
                </div>
                <h4>This content is best experienced with your device in portrait mode. Please rotate your device for the optimal experience.</h4>
            </div>
        </div>
    )
}

export default LandscapePage