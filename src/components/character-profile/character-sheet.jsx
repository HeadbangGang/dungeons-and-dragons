import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Document, Page } from 'react-pdf'
import monk from '../../test-data/monk.pdf'


export const CharacterSheet = () => {
    const [pageNumber, setPageNumber] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [numPages, setNumPages] = useState(null)

    const CharacterSheetPDF = () => (
        <Document className='character-profile-pdf-document' file={ monk } onLoadSuccess={ ({ numPages }) => setNumPages(numPages) } options={{ workerSrc: '/pdf.worker.js' }}>
            <Page className='character-profile-pdf-page' pageNumber={ pageNumber } width={ 750 } height={ 800 } />
        </Document>
    )

    return (
        <>
            <button onClick={ () => setShowModal(true) }>Show</button>
            <Modal
                className='character-sheet-modal'
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
                    <Button disabled={ pageNumber < 2 } onClick={ () => setPageNumber(pageNumber-1) }>Previous Page</Button>
                    <span>{pageNumber} of {numPages}</span>
                    <Button disabled={ pageNumber === numPages } onClick={ () => setPageNumber(pageNumber+1) }>Next Page</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

