import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Document, Page, pdfjs } from 'react-pdf'
import monk from '../../test-data/monk.pdf'
import { GENERAL } from '../../language-map'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${ pdfjs.version }/pdf.worker.min.js`

export const CharacterSheet = () => {
    const [pageNumber, setPageNumber] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [numPages, setNumPages] = useState(null)

    const CharacterSheetPDF = () => (
        <Document className='character-profile-pdf-document' file={ monk } onLoadSuccess={ ({ numPages }) => setNumPages(numPages) }>
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
                        { GENERAL.characterSheet }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CharacterSheetPDF />
                </Modal.Body>
                <Modal.Footer>
                    <div className='dnd-modal-buttons'>
                        <Button className='dnd-modal-nav-button' disabled={ pageNumber < 2 } onClick={ () => setPageNumber(pageNumber-1) }>
                            { GENERAL.prevPage }
                        </Button>
                        <span>{pageNumber} of {numPages}</span>
                        <Button className='dnd-modal-nav-button' disabled={ pageNumber === numPages } onClick={ () => setPageNumber(pageNumber+1) }>
                            { GENERAL.nextPage }
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

