/**
 * 求和
 * @param {number[]} nums 数据列表
 */
export function sum(nums) {
  return nums.reduce((pre, cur) => pre + cur, 0)
}

/**
 * 求平均数
 * @param {number[]} nums 数据列表
 */
export function avg(nums) {
  if (!nums || nums.length === 0) return 0
  return sum(nums) / nums.length
}

/**
 * 比较数字是否在范围[min, max]内，包含min,max
 * @param {number} value 目标值
 * @param {number} min 最小值
 * @param {number} max 最大值
 */
export function between(value, min, max) {
  return value >= min && value <= max
}

/**
 * 比较数字是否在范围(min, max)内，不包含min,max
 * @param {number} value 目标值
 * @param {number} min 最小值
 * @param {number} max 最大值
 */
export function betweenExclude(value, min, max) {
  return value > min && value < max
}

/**
 * 比较版本号，类似比较数字
 * @param {string} v1 版本号v1
 * @param {string} v2 版本号v2
 * @returns {-1|0|1}
 */
export function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}
