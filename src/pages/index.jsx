import React from 'react'
import PageTemplate from '../components/page-template/page-template'
import DndHome from '../components/homepage/dnd-home'

export default class DnDHomepage extends React.PureComponent {
    render () {
        return (
            <PageTemplate>
                <DndHome />
            </PageTemplate>
        )
    }
}
