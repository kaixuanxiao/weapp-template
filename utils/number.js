export function toEnNumString(n) {
  const num = Number(n)
  if (!isNaN(num)) {
    return num.toLocaleString('en-US')
  }
  return '0'
}

/**
 *
 * @param {number} value 数值
 * @param {boolean} [withSign=true] 是否添加`%`，默认添加
 */
export function toPercent(value, withSign = true) {
  if (typeof value === 'string') value = Number(value)
  return value * 100 + (withSign && '%')
}

/**
 * 转换精度，超出部分截断
 * @param {number|string} num 数字
 * @param {number} [precision] 小数位数，默认值 `2`
 * @returns {number}
 */
export function toPrecisionNum(num, precision = 2) {
  if (precision > 0) {
    const numStr = typeof num === 'number' ? num.toString() : num
    return Number(numStr.replace(new RegExp(`^(\\d+\\.\\d{${precision}})\\d+$`), '$1'))
  } else if (precision === 0) {
    if (typeof num === 'string') num = Number(num)
    if (isNaN(num)) num = 0
    return Math.trunc(num)
  } else {
    throw Error('Invalid precision. must be smaller than zero')
  }
}

/**
 * 转换精度，超出部分截断
 * @param {number|string} num 数字
 * @param {number} [precision] 小数位数，默认值 `2`
 * @returns {string}
 */
export function toPrecision(num, precision = 2) {
  num = toPrecisionNum(num, precision)
  let numStr = num.toString()
  if (precision === 0) return numStr
  let dotIndex = numStr.indexOf('.')
  if (dotIndex === -1) {
    numStr += '.'
    dotIndex = numStr.indexOf('.')
  }
  while (dotIndex + precision > numStr.length - 1) {
    numStr = numStr + '0'
    dotIndex = numStr.indexOf('.')
  }
  return numStr
}

/**
 * 格式成金额类型，超出位数采用截断的办法，如 `1,234.50`，如果需要四舍五入，请使用 `toMoneyOfFixed`
 * @param {number|string} num 数字
 * @param {number} precision 小数位数，默认值 `2`
 * @returns {string}
 */
export function toMoneyOfPrecision(num, precision = 2) {
  let numStr = toPrecision(num, precision)
  const reg = numStr.includes('.') ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+\$)/g
  numStr = numStr.replace(reg, function ($0, $1) {
    return $1 + ','
  })
  // console.log(numStr)
  if (precision === 0) return numStr
  while (numStr.length < numStr.lastIndexOf('.') + precision + 1) {
    numStr = numStr + '0'
  }
  return numStr
}

// TEST
// console.log(toMoneyOfPrecision(-1, 3))
// console.log(toMoneyOfPrecision(-1.002, 2))
// console.log(toMoneyOfPrecision(1531531.31651361, 0))
// console.log(toMoneyOfPrecision(1531531.31651361, 1))
// console.log(toMoneyOfPrecision(1531531.31651361, 2))
// console.log(toMoneyOfPrecision(1531531.31651361, 3))
// console.log(toMoneyOfPrecision(1531531.31651361, 4))
// console.log(toMoneyOfPrecision(1531531.31651361, 5))
// console.log(toMoneyOfPrecision(1531531.31651361, 6))
// console.log(toMoneyOfPrecision(1531531.31651361, 7))
// console.log(toMoneyOfPrecision(1531531.31651361, 8))
// console.log(toMoneyOfPrecision(1531531, 7))
// console.log(toMoneyOfPrecision(15315311361, 8))

/**
 * 把数字转为精度为 `precision` 的金额格式字符串，超出精度的小数会被四舍五入，如果需要截断，请使用 `toMoneyOfPrecision`
 * @param {number|string} num 数字
 * @param {number} precision 精度，默认值 `2`
 * @returns {string}
 */
export function toMoneyOfFixed(num, precision = 2) {
  if (typeof num !== 'number') {
    num = Number(num)
    if (isNaN(num)) {
      num = 0
    }
  }
  let numStr = num.toFixed(precision)
  const reg = numStr.includes('.') ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+\$)/g
  numStr = numStr.replace(reg, function ($0, $1) {
    return $1 + ','
  })
  return numStr
}

/**
 * 获取指定范围内的整数 [start, end]
 * @param {number} min
 * @param {number} max
 */
export function getIntListOfRange(min, max) {
  if (max < min) {
    throw Error('arguments error, end must not small than start')
  }
  const nums = []
  while (min <= max) {
    nums.push(min)
    min++
  }
  return nums
}
