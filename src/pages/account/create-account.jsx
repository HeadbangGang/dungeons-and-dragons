import React from 'react'
import PageTemplate from '../../components/page-template/page-template'
import CreateAccount from '../../components/authentication/create-account'

export default class CreateAccountPage extends React.PureComponent {
    render() {
        return (
            <PageTemplate>
                <CreateAccount />
            </PageTemplate>
        )
    }
}