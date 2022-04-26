export const numberValidation = (val) => {
    return !(!/^[0-9]+$/.test(val) && val !== '')
}
