export const DEFAULT_DICE_VALUES = { '4': [], '6': [], '8': [], '10': [], '12': [], '20': [] }
export const DEFAULT_DICE_SIDES = ['4', '6', '8', '10', '12', '20']
export const MAX_ERROR_QUANTITY = 10
export const SPINNER_DEFAULT = 750

export const FIREBASE_ERRORS = {
    EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
    USER_NOT_FOUND: 'auth/user-not-found',
    INVALID_EMAIL: 'auth/invalid-email',
    WRONG_PASSWORD: 'auth/wrong-password'
}

export const PAGE_ID = {
    '/': 'home-page',
    '/account/create-account': 'create-account-page',
    '/account/password-reset': 'password-reset-page',
    '/account/profile': 'profile-page',
    '/account/sign-in': 'sign-in-page',
    '/dice-roller': 'dice-roller-page',
    '/initiative-order-page': 'initiative-order-page'
}

export const PAGE_URL = {
    CREATE_ACCOUNT_PAGE: '/account/create-account',
    DICE_ROLLER_PAGE: '/dice-roller',
    HOME_PAGE: '/',
    INITIATIVE_ORDER_PAGE: '/initiative-order',
    PASSWORD_RESET_PAGE: '/account/password-reset',
    PROFILE_PAGE: '/account/profile',
    SIGN_IN_PAGE: '/account/sign-in'
}
