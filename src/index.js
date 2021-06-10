import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { DndContainer } from './components/dnd-container'

ReactDOM.render(
    <Router basename='/'>
        <DndContainer />
    </Router>,
    document.getElementById('root')
)
