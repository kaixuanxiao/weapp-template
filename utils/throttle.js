/**
 * 返回一个节流函数：调用后wait毫秒之后执行一次，不管这中间调用了多少次
 * @param {Function} func 函数
 * @param {number} [wait=0] 延迟执行毫秒数
 * @returns {Function} 返回一个延迟执行函数
 */
export default function throttle(func, wait = 0) {
  let timeout
  return function () {
    const context = this
    const args = Array.from(arguments)
    if (timeout) return

    timeout = setTimeout(() => {
      func.apply(context, args)
      timeout = null
    }, wait)
  }
}
