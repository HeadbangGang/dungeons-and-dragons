import React from 'react'
import PageTemplate from '../../components/page-template/page-template'
import Profile from '../../components/authentication/profile-page/profile'

export default class ProfilePage extends React.PureComponent {
    render() {
        return (
            <PageTemplate>
                <Profile />
            </PageTemplate>
        )
    }
}