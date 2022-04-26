import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import store from '../store/store'
import Head from 'next/head'

import '../common.scss'

export default class App extends React.PureComponent {
    render () {
        const { Component, pageProps } = this.props

        return (
            <>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Dungeons and Dragons</title>
                </Head>
                <Provider store={ store }>
                    <Component { ...pageProps } />
                </Provider>
            </>
        )
    }
}

App.propTypes = {
    Component: PropTypes.func,
    pageProps: PropTypes.object
}
