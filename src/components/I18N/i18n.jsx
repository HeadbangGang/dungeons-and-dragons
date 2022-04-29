import PropTypes from 'prop-types'
import React from 'react'
import i18n from 'i18next'
import enUS from '../../helpers/locales/en-US.json'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next, useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

const mergedLanguageMap = { resources: {} }

const addLanguageMapTranslation = (languageMap, language) => {
    mergedLanguageMap.resources[language] = {
        translation: { ...languageMap }
    }
}

addLanguageMapTranslation(enUS, 'en-US')

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        ...mergedLanguageMap,
        fallbackLng: 'en-US',
        interpolation: {
            escapeValue: false
        }
    })
    .then(() => {})

const getCurrentLanguageMap = () => {
    return mergedLanguageMap.resources[i18n.language].translation
}

export const language = getCurrentLanguageMap()

export const I18N = (props) => {
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
