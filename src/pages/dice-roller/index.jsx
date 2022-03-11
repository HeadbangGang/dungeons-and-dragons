import React from 'react'
import PageTemplate from '../../components/page-template/page-template'
import DiceRoller from '../../components/dice-roller/dice-roller'

export default class DiceRollerPage extends React.PureComponent {
    render () {
        return (
            <PageTemplate>
                <DiceRoller />
            </PageTemplate>
        )
    }
}