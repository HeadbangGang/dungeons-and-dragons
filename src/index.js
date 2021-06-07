import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { DndContainer } from './components/dnd-container'

ReactDOM.render(
    <React.StrictMode>
        <DndContainer />
    </React.StrictMode>,
    document.getElementById('root')
)
