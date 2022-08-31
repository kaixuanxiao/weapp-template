import { isPlainObj } from './object'

function isPlainObjectOrArray(value) {
  return isPlainObj(value) || Array.isArray(value)
}

/**
 * 合并2个对象
 * @param {Object} target
 * @param {Object} source
 */
function baseMerge(target, source) {
  Object.keys(target).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(source, key)) return
    const value = target[key]
    const sourceValue = source[key]
    if (isPlainObjectOrArray(value)) {
      if (Array.isArray(value) && Array.isArray(sourceValue)) {
        value.fill(sourceValue)
      }
      if (isPlainObjectOrArray(sourceValue)) {
        baseMerge(value, sourceValue)
      } else {
        target[key] = sourceValue
      }
    } else {
      target[key] = sourceValue
    }
  })

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key]
    if (!Object.prototype.hasOwnProperty.call(target, key)) {
      target[key] = sourceValue
      return
    }
  })
}

/**
 * `Object.assign` 的深度版，合并对象（不处理原型链上的key），深度合并
 * @param {Object} target 要merge到的对象
 * @param  {...any} sources 需要被merge的对象，可多个
 */
export default function deepAssign(target, ...sources) {
  if (!isPlainObjectOrArray(target)) throw Error('merge target is not a object or array')
  if (sources.length === 0) return target
  sources.forEach((source) => {
    if (!isPlainObjectOrArray(source)) return
    baseMerge(target, source)
  })
  return target
}
