import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { DndContainer } from './components/dnd-container'
import { Provider } from 'react-redux'
import { Worker } from '@react-pdf-viewer/core'
import store from './store/store'

ReactDOM.render(
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
        <Provider store={ store }>
            <Router basename='/'>
                <DndContainer />
            </Router>
        </Provider>
    </Worker>,
    document.getElementById('root')
)
