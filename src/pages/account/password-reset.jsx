import React from 'react'
import PageTemplate from '../../components/page-template/page-template'
import ResetPassword from '../../components/authentication/reset-password'

export default class PasswordResetPage extends React.PureComponent {
    render(){
        return (
            <PageTemplate>
                <ResetPassword />
            </PageTemplate>
        )
    }
}