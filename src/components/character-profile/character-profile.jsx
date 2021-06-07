import React, { useState } from 'react'
import chika from '../../test-data/chika.png'
import { pdfjs, Document, Page } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${ pdfjs.version }/pdf.worker.min.js`
import './character-profile.css'
import monk from '../../test-data/monk.pdf'

export const CharacterProfile = () => {
    const [pageNumber, setPageNumber] = useState(0)
    return (
        <>
            <img
                alt=''
                className='profile-character-img'
                draggable={ false }
                src={ chika }
            />
            {pageNumber > 0
                ?
                <>
                    <button onClick={ () => setPageNumber(pageNumber-1) }>{pageNumber === 1 ? 'Close Character Sheet' : 'Down' }</button>
                    <button onClick={ () => setPageNumber(pageNumber+1) }>Up</button>
                    <Document
                        file={ monk }
                        // onLoadSuccess={ this.onDocumentLoadSuccess }
                    >
                        <Page pageNumber={ pageNumber } width={ 1000 } />
                    </Document>
                </>
                : <div>
                    <button onClick={ () => setPageNumber(1) }>Show Character Sheet</button>
                </div>
            }
        </>
    )
}