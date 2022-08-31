/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 * @template T
 * @param {Record<string | number | symbol, any>| any[]} obj The object to iterate
 * @param {(item: T, index: number, obj: Record<string | number | symbol, any>| any[]) => void} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /* eslint no-param-reassign:0*/
    obj = [obj]
  }

  if (Array.isArray(obj)) {
    // Iterate over array values
    for (let i = 0, l = obj.length; i < l; i++) {
      // eslint-disable-next-line no-useless-call
      fn.call(null, obj[i], i, obj)
    }
  } else {
    // Iterate over object keys
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // eslint-disable-next-line no-useless-call
        fn.call(null, obj[key], key, obj)
      }
    }
  }
}

function bind(fn, thisArg) {
  return function () {
    return fn.apply(thisArg, Array.from(arguments))
  }
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {object} a The object to be extended
 * @param {object} b The object to copy properties from
 * @param {object} thisArg The object to bind function to
 * @return {object} The resulting value of object a
 */
function extendFunctionsFromProto(a, b, thisArg) {
  Object.getOwnPropertyNames(b)
    .filter((key) => key !== 'constructor')
    .forEach((key) => {
      a[key] = bind(b[key], thisArg)
    })
  return a
}

function extendProps(a, b) {
  forEach(b, (val, key) => {
    if (typeof val !== 'function') {
      a[key] = val
    }
  })
  return a
}

export default {
  bind,
  forEach,
  extendFunctionsFromProto,
  extendProps,
}
