import React from 'react'
import RoutesController from './routes'
import store from './store'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import './common.scss'

const root = createRoot(document.getElementById('dungeons-and-dragons'))

root.render(
    <Provider store={ store }>
        <RoutesController />
    </Provider>
)
