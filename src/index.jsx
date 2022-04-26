import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import RoutesController from './routes'
import './common.scss'

ReactDOM.render(
    <Provider store={ store }>
        <RoutesController />
    </Provider>,
    document.getElementById('dungeons-and-dragons')
)
