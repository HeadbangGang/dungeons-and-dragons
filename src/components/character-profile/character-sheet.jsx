import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { pdfjs, Document, Page } from 'react-pdf'
import { PDFDownloadLink } from '@react-pdf/renderer'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${ pdfjs.version }/pdf.worker.min.js`
import monk from '../../test-data/monk.pdf'


export const CharacterSheet = () => {
    const [pageNumber, setPageNumber] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [numPages, setNumPages] = useState(null)


    const characterSheetPDF = () => (
        <Document file={ monk } onLoadSuccess={ ({ numPages }) => setNumPages(numPages) } options={{ workerSrc: '/pdf.worker.js' }}>
            <Page pageNumber={ pageNumber } width={ 750 } />
        </Document>
    )

    // const downloadCharacterSheet = () => (
    //     <div>
    //         <PDFDownloadLink document={ characterSheetPDF() } fileName="somename.pdf">
    //             {({ blob, url, loading, error }) =>
    //             { loading ? 'Loading document...' : 'Download now!'
    //                 error ? 'Error Loading Document' : '' }
    //             }
    //         </PDFDownloadLink>
    //     </div>
    // )

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
                    { characterSheetPDF() }
                </Modal.Body>
                <Modal.Footer>
                    {/* {downloadCharacterSheet()} */}
                    { pageNumber > 1 && <Button onClick={ () => setPageNumber(pageNumber-1) }>Page Down</Button> }
                    <span>{pageNumber} of {numPages}</span>
                    { pageNumber < numPages && <Button onClick={ () => setPageNumber(pageNumber+1) }>Page Up</Button> }
                    <Button onClick={ () => setShowModal(false) }>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

