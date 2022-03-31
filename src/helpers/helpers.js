export const numberValidation = (val) => {
    let valid = true
    if (!/^[0-9]+$/.test(val) && val !== '') {
        valid = false
    }
    return valid
}
