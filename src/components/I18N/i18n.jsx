import React from 'react'
import * as allLocales from '../../helpers/locales/'
import LanguageDetector from 'i18next-browser-languagedetector'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import XHR from 'i18next-http-backend'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

const mergedLanguageMap = { resources: {} }

Object.keys(allLocales).forEach(language => {
    mergedLanguageMap.resources[language] = {
        translation: { ...allLocales[language] }
    }
})

i18n
    .use(XHR)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        ...mergedLanguageMap,
        detection: {
            order: ['querystring', 'navigator'],
            lookupQuerystring: 'lng'
        },
        fallbackLng: {
            default: ['en']
        },
        interpolation: {
            escapeValue: false
        }
    })
    .then(() => {
        console.info(`Browser Language: ${i18n.language}`)
    })

const getCurrentLanguageMap = () => {
    const currentLangMap = mergedLanguageMap.resources[i18n.language]?.translation
    const enLangMap = mergedLanguageMap.resources.en.translation

    return currentLangMap ?? enLangMap
}

export const language = getCurrentLanguageMap()

export const changeCurrentLanguage = async (language, callback) => {
    i18n.changeLanguage(language)
        .then(() => {
            window.localStorage.setItem('preferredLanguage', language)
            callback && callback()
            console.info(`Language Changed: ${language}`)
        })
}

const I18N = (props) => {
    const { t } = useTranslation()

    const { blockLevel, className, markdown, name, ...options } = props

    const text = t(name, options)
    if (markdown) {
        return <ReactMarkdown className={ className }>{ text }</ReactMarkdown>
    }
    if (blockLevel) {
        return <div className={ className }>{ text }</div>
    }
    return <span className={ className }>{ text }</span>
}

I18N.propTypes = {
    blockLevel: PropTypes.bool,
    className: PropTypes.string,
    markdown: PropTypes.bool,
    name: PropTypes.string
}

export default I18N
