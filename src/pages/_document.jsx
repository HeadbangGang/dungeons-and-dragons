import React from 'react'
import { Head, Html, Main, NextScript } from 'next/document'

const Document = () => {
    return (
        <Html>
            <Head>
                <meta charSet="utf-8" />
                <link rel="apple-touch-icon" sizes="180x180" href="/doc/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/doc/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/doc/favicon-16x16.png" />
                <link rel="manifest" href="/doc/site.webmanifest" />
                <link rel="mask-icon" href="/doc/safari-pinned-tab.svg" color="#5bbad5" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
                <meta name="description" content="Dungeons and Dragons Helper" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document