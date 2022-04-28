import React from 'react'
import ReactDOM from 'react-dom'
import RoutesController from './routes'
import store from './store'
import { Provider } from 'react-redux'
import './common.scss'

ReactDOM.render(
    <Provider store={ store }>
        <RoutesController />
    </Provider>,
    document.getElementById('dungeons-and-dragons')
)
