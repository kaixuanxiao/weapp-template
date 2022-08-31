/**
 * 是否是非空数组
 * @param {Array.<any>} value
 */
export function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0
}

/**
 * 是数组且长度为0
 * @param {Array.<any>} value
 */
export function isEmptyArray(value) {
  return Array.isArray(value) && value.length === 0
}

/**
 * 打平数组（把多层数组变成一层）
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function flatArr(arr) {
  return arr.reduce((pre, item) => {
    Array.isArray(item) ? pre.push(...flatArr(item)) : pre.push(item)
    return pre
  }, [])
}

/**
 * 返回不重复元素组成的数组
 * @template {number | string} T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function toUniqArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * 两个数组取交集
 * @template T
 * @param {T[]} a1
 * @param {T[]} a2
 * @returns {T[]}
 */
export function arrIntersection(a1, a2) {
  return a1.filter((item) => a2.includes(item))
}

/**
 * 从一个数组中减去另外一个数组中有的元素，返回结果。不会改变原数组
 * @param {Array} a1
 * @param {Array} a2
 * @returns { Array}
 */
export function arrSubtract(a1, a2) {
  return a1.filter((value) => !a2.includes(value))
}

/**
 * 判断一个数组a1是否包含另外一个数组a2
 * @param {Array} a1
 * @param {Array} a2
 * @returns {boolean}
 */
export function arrContains(a1, a2) {
  return a2.every((value) => a1.includes(value))
}

/**
 * 把数据元素顺序打乱
 * @param {any[]} a
 * @returns {any[]}
 */
export function shuffle(a) {
  const copyA = a.concat()
  for (let i = copyA.length; i; i--) {
    const j = Math.floor(Math.random() * i)
    ;[copyA[i - 1], copyA[j]] = [copyA[j], copyA[i - 1]]
  }
  return copyA
}

/**
 * 从数组删除元素
 * @template T
 * @param {T[]} arr 数组
 * @param {T} item 要删除的元素，或者findIndex的函数
 */
export function removeItem(arr, item) {
  const index = arr.indexOf(item)
  if (index !== -1) {
    arr.splice(index, 1)
  }
}

/**
 * 从数组删除元素(会删除所有相同的元素)
 * @template T
 * @param {T[]} arr 数组
 * @param {T} item 要删除的元素，或者findIndex的函数
 */
export function removeAllItem(arr, item) {
  let index
  index = arr.indexOf(item)
  while (index !== -1) {
    arr.splice(index, 1)
    index = arr.indexOf(item)
  }
}
