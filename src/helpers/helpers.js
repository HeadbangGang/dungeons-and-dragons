import { FIREBASE_ERRORS, PAGE_ID, PAGE_URL } from './constants'
import { ERRORS } from './language-map'

export const numberValidation = (val) => {
    return !(!/^\d+$/.test(val) && val !== '')
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

export const firebaseErrorResponse = (error, currentPageId = null) => {
    const { code, message } = error
    switch (code) {
    case (FIREBASE_ERRORS.EMAIL_ALREADY_IN_USE):
        return ERRORS.emailAlreadyExists
    case (FIREBASE_ERRORS.INVALID_EMAIL):
        return ERRORS.enterEmail
    case (FIREBASE_ERRORS.USER_NOT_FOUND):
        if (currentPageId === PAGE_ID[PAGE_URL.PASSWORD_RESET_PAGE]) {
            return ERRORS.emailNotRegistered
        } else if (currentPageId === PAGE_ID[PAGE_URL.SIGN_IN_PAGE]) {
            return ERRORS.noUserFound
        } else {
            return message
        }
    case (FIREBASE_ERRORS.WRONG_PASSWORD):
        return ERRORS.wrongPassword
    default:
        if (currentPageId === PAGE_ID[PAGE_URL.PASSWORD_RESET_PAGE]) {
            return ERRORS.errorSendingEmail
        } else if (currentPageId === PAGE_ID[PAGE_URL.SIGN_IN_PAGE]) {
            return ERRORS.signingIn
        } else {
            return message
        }
    }
}
