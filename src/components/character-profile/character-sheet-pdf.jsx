/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector } from 'react-redux'
import { getIsSmallView, getSelectedCharacter } from '../../store/store'
import resumePdf from '../../test-data/monk.pdf'

import { SpecialZoomLevel, Viewer, Icon, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core'
import { getFilePlugin } from '@react-pdf-viewer/get-file'
import { printPlugin } from '@react-pdf-viewer/print'
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen'
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation'

import '@react-pdf-viewer/print/lib/styles/index.css'
import '@react-pdf-viewer/full-screen/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import '@react-pdf-viewer/page-navigation/lib/styles/index.css'

export default function CharacterSheetPDF () {
    const isSmallView = useSelector(getIsSmallView)
    const selectedCharacter = useSelector(getSelectedCharacter)

    const getFilePluginInstance = getFilePlugin({ fileNameGenerator: () => { return `${ selectedCharacter }_Character_Sheet` } })
    const { DownloadButton } = getFilePluginInstance
    const printPluginInstance = printPlugin()
    const { PrintButton } = printPluginInstance
    const fullScreenPluginInstance = fullScreenPlugin({
        onEnterFullScreen: (zoom) => {
            zoom(SpecialZoomLevel.PageFit)
        },
        onExitFullScreen: (zoom) => {
            zoom(SpecialZoomLevel.PageFit)
        }
    })
    const { EnterFullScreenButton } = fullScreenPluginInstance
    const pageNavigationPluginInstance = pageNavigationPlugin()
    const { GoToNextPage, GoToPreviousPage } = pageNavigationPluginInstance
    const plugins = [getFilePluginInstance, printPluginInstance, fullScreenPluginInstance, pageNavigationPluginInstance]

    return (
        <div
            style={{
                backgroundColor: '#fff',

                /* Fixed position */
                left: 0,
                position: 'fixed',
                top: 0,

                /* Take full size */
                height: '100%',
                width: '100%',

                /* Displayed on top of other elements */
                zIndex: 9999,

                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Viewer fileUrl={ resumePdf } />
        </div>
    )
}