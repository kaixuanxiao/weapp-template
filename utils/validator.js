const PhoneNumberRegExp = /^\d{11,11}$/

/**
 * @param {string} value
 */
export function isValidPhoneNumber(value) {
  return PhoneNumberRegExp.test(value)
}

/**
 * @param {string} value
 */
export function isValidPercentString(value) {
  return /^100(\.0)?%?$|^\d{1,2}(\.\d)?%?$/.test(value)
}

/**
 * @param {string} value
 */
export function isValidNumber(value) {
  return /^\d+(\.?\d*)$|^\d*(\.?\d+)$/.test(value)
}
