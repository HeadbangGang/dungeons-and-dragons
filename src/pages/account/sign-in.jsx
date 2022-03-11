import React from 'react'
import SignIn from '../../components/authentication/sign-in'
import PageTemplate from '../../components/page-template/page-template'

export default class SignInPage extends React.PureComponent {
    render () {
        return (
            <PageTemplate>
                <SignIn />
            </PageTemplate>
        )
    }
}