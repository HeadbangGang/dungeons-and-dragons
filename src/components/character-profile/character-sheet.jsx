import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Document, Page } from 'react-pdf'
import monk from '../../test-data/monk.pdf'


export const CharacterSheet = () => {
    const [pageNumber, setPageNumber] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [numPages, setNumPages] = useState(null)

    const CharacterSheetPDF = () => (
        <Document file={ monk } onLoadSuccess={ ({ numPages }) => setNumPages(numPages) } options={{ workerSrc: '/pdf.worker.js' }}>
            <Page pageNumber={ pageNumber } width={ 750 } height={ 800 } />
        </Document>
    )

    return (
        <>
            <button onClick={ () => setShowModal(true) }>Show</button>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={ showModal }
                onHide={ () => setShowModal(false) }
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Character Sheet
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CharacterSheetPDF />
                </Modal.Body>
                <Modal.Footer>
                    { pageNumber > 1 && <Button onClick={ () => setPageNumber(pageNumber-1) }>Previous Page</Button> }
                    <span>{pageNumber} of {numPages}</span>
                    { pageNumber < numPages && <Button onClick={ () => setPageNumber(pageNumber+1) }>Next Page</Button> }
                    <Button onClick={ () => setShowModal(false) }>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

