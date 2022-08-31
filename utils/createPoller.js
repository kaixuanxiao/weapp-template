import deepAssign from './deepAssign'
/**
 * 轮询选项，可设置轮询间隔、是否立即触发一次轮询方法，是否自动开始轮询
 * @typedef {Object} PollerOptions
 * @property {boolean} [autorun=true] 自动开始，相当于自动调用一次start
 * @property {number} [interval=3000] 轮询间隔，默认值 `3000` 毫秒
 * @property {boolean} [immediate=false] 是否立即触发一次，默认否
 */

/**
 * @typedef {Object} Poller
 * @property {(immediate: boolean) => Poller} run 开始轮询
 * @property {() => Poller} stop 停止轮询
 */

/**
 * @type {PollerOptions}
 */
const defaultPollerOptions = {
  autorun: true,
  interval: 3000,
  immediate: false,
}

/**
 * 创建轮询器，默认会自动运行run，然后按设置的轮询间隔自动轮询
 * @param {() => Promise<any>} pollMethod
 * @param {PollerOptions} options
 */
export default function createPoller(pollMethod, options = defaultPollerOptions) {
  if (!pollMethod) {
    throw Error('invalid arguments')
  }
  options = deepAssign({}, defaultPollerOptions, options)
  let timer = undefined
  let running = false
  let fetching = false

  function pollOnce() {
    if (fetching) return

    fetching = true
    const pollStart = Date.now()
    pollMethod().finally(() => {
      timer = undefined
      fetching = false
      if (running) {
        const pollCost = Date.now() - pollStart
        timer = setTimeout(pollOnce, Math.max(0, options.interval - pollCost))
      }
    })
  }

  const poller = {
    run(immediate = true) {
      running = true
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }
      options.immediate || immediate ? pollOnce() : (timer = setTimeout(pollOnce, options.interval))
      return poller
    },
    stop() {
      running = false
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }
      return poller
    },
  }
  if (options.autorun) {
    poller.run()
  }
  return poller
}
