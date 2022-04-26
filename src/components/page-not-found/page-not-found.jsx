import React from 'react'
import { useNavigate } from 'react-router'
import './page-not-found.scss'
import { Button } from 'react-bootstrap'

const PageNotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="page-not-found">
            <img alt="" src="../../../assets/media/d20-1.png" />
            <h1>Critical Failure!</h1>
            <h2>It looks like the page you are looking for either is down for maintenance or does not exist.</h2>
            <Button onClick={ () => navigate('/', { replace: true }) } variant="link">Go To Homepage</Button>
        </div>
    )
}

export default PageNotFound
