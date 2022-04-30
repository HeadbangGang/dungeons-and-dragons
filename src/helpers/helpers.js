import { FIREBASE_ERRORS, PAGE_ID, PAGE_URL } from './constants'
import { language } from '../components/I18N/i18n'
import { ERRORS } from './language-map'

const { errors, firebaseErrors } = language

export const numberValidation = (val) => {
    return !(!/^\d+$/.test(val) && val !== '')
}

export const convertSmallerToLargerFileSize = (bytes = 0, decimals = 2) => {
    const baseBytes = 1024
    const val = Math.floor(Math.log(bytes) / Math.log(baseBytes))

    return parseFloat((bytes / Math.pow(baseBytes, val)).toFixed(decimals))
}

export const validateFirstName = (value) => {
    if (!value) {
        return ERRORS.enterFirstName
    }
    if (!/^[a-z ,.'-]+$/i.test(value)) {
        return ERRORS.validFirstName
    }
    return null
}

export const validateLastName = (value) => {
    if (!value) {
        return ERRORS.enterLastName
    }
    if (!/^[a-z ,.'-]+$/i.test(value)) {
        return ERRORS.validLastName
    }
    return null
}

export const validateEmail = (value) => {
    if (!value) {
        return ERRORS.enterEmail
    }
    if (!/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}/i.test(value)) {
        return ERRORS.validEmail
    }
    return null
}

export const validatePassword = (value) => {
    if (!value) {
        return ERRORS.enterPassword
    }
    if (value.length < 6) {
        return ERRORS.passwordLength
    }
    return null
}

export const validateCharacterName = (value) => {
    if (!value) {
        return errors.enterCharacterName
    }
    return null
}

export const validateGameId = (value) => {
    if (!value) {
        return errors.enterGameId
    }
    return null
}

export const sanitizedVariable = (value, options) => {
    value = value.replaceAll(' ', '')
    if (options?.lowerCase) {
        value = value.toLowerCase()
    }
    return value
}

export const firebaseErrorResponse = (error, currentPageId = null) => {
    const { code, message } = error
    switch (code) {
    case (FIREBASE_ERRORS.EMAIL_ALREADY_IN_USE):
        return firebaseErrors.emailAlreadyExists
    case (FIREBASE_ERRORS.INVALID_EMAIL):
        return errors.enterEmail
    case (FIREBASE_ERRORS.USER_NOT_FOUND):
        if (currentPageId === PAGE_ID[PAGE_URL.PASSWORD_RESET_PAGE]) {
            return firebaseErrors.emailNotRegistered
        } else if (currentPageId === PAGE_ID[PAGE_URL.SIGN_IN_PAGE]) {
            return firebaseErrors.noUserFound
        } else {
            return message
        }
    case (FIREBASE_ERRORS.WRONG_PASSWORD):
        return firebaseErrors.incorrectPassword
    default:
        if (currentPageId === PAGE_ID[PAGE_URL.PASSWORD_RESET_PAGE]) {
            return firebaseErrors.issueSendingEmail
        } else if (currentPageId === PAGE_ID[PAGE_URL.SIGN_IN_PAGE]) {
            return firebaseErrors.signingIn
        } else {
            return message
        }
    }
}
