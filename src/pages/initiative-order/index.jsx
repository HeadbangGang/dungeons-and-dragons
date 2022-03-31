import React from 'react'
import PageTemplate from '../../components/page-template/page-template'
import InitiativeOrder from '../../components/initiative-order/initiative-order'

export default class InitiativeOrderPage extends React.PureComponent {
    render () {
        return (
            <PageTemplate>
                <InitiativeOrder />
            </PageTemplate>
        )
    }
}
