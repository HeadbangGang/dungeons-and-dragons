import React from 'react'
import { Button } from 'react-bootstrap'
import { PAGE_URL } from '../../helpers/constants'
import { useNavigate } from 'react-router'
import './page-not-found.scss'
import I18N from '../I18N/i18n'

const PageNotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="page-not-found">
            <img alt="" src="/assets/media/d20-1.png" />
            <I18N name="pageNotFound.header" markdown />
            <I18N name="pageNotFound.subHeader" markdown />
            <Button
                onClick={ () => navigate(PAGE_URL.HOME_PAGE, { replace: true }) }
                variant="link"
            >
                <I18N name="pageNotFound.goToHomepage" />
            </Button>
        </div>
    )
}

export default PageNotFound
