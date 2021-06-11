import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { DndContainer } from './components/dnd-container'
import { Provider } from 'react-redux'
import store from './store/store'

ReactDOM.render(
    <Provider store={ store }>
        <Router basename='/'>
            <DndContainer />
        </Router>
    </Provider>,
    document.getElementById('root')
)
