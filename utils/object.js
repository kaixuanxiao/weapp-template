import { arrSubtract } from './array'

/**
 * 判断是否是对象类型
 * @param {Object} value
 */
export function isObject(value) {
  return value !== null && typeof value === 'object'
}

/**
 * 是否是朴素对象，使用 `Object` constructor或者`[[Prototype]]` 为 `null`的对象创建
 * <br> 如 `{}` , `Object.create(null)`
 * @param {unknown} value
 */
export function isPlainObj(value) {
  if (value === null || typeof value !== 'object') return false
  let proto = value
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(value) === proto
}

/**
 * 克隆对象一部分属性（浅克隆）`includes`和`excludes`只取一个，优先`includes`
 * @param {Object} source 复制源对象
 * @param {string[]|null} [includes] 要复制的属性列表
 * @param {string[]|null} [excludes] 要忽略的属性列表
 * @param {Object} [target] 要复制到的目标对象，不传复制到新对象
 */
export function clonePartial(source, includes = [], excludes = [], target = {}) {
  if (includes && includes.length) {
    return includes.reduce((tar, key) => {
      tar[key] = source[key]
      return tar
    }, target)
  } else {
    return arrSubtract(Object.keys(source), excludes).reduce((tar, key) => {
      tar[key] = source[key]
      return tar
    }, target)
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty
/**
 * 判断目标对象是否有某(些)属性
 * @param {Object} target 目标对象
 * @param {string|symbol|string[]|symbol[]} keys 属性名（列表）
 */
export function ownKeys(target, keys) {
  /** @type {(string|symbol)[]} */
  const keysArr = Array.isArray(keys) ? keys : [keys]
  keysArr.every((key) => hasOwnProperty.call(target, key))
}

/**
 * 调用JSON.parse，并帮你try catch
 * @param {string} value 要parse的字符串
 * @returns {Object|undefined}
 */
export function safeJSONParse(value) {
  try {
    return JSON.parse(value)
  } catch (error) {
    undefined
  }
}
