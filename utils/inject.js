import { autorun, toJS, isObservableObject } from 'mobx-miniprogram'

// https://github.com/component/throttle
function throttle(func, wait) {
  let ctx, args, rtn, timeoutID // caching
  let last = 0

  function callback() {
    timeoutID = 0
    last = +new Date()
    rtn = func.apply(ctx, args)
    ctx = null
    args = null
  }

  return function throttled() {
    ctx = this
    args = arguments
    const delta = Date.now() - last
    if (!timeoutID)
      if (delta >= wait) callback()
      else timeoutID = setTimeout(callback, wait - delta)
    return rtn
  }
}

/**
 * 注入store
 * @template TData, TCustom
 * @template {WechatMiniprogram.Component.PropertyOption} TProperty, TMethods
 * @param {WechatMiniprogram.Page.Instance<TData, TCustom> | WechatMiniprogram.Component.Instance<TData, TProperty, TMethods>} context
 * @param {Record<string, any>} props
 */
function inject(context, props) {
  if (typeof props !== 'object') {
    throw new TypeError('props must be Object')
  }
  // @ts-ignore
  context.props = props
  const DELAY = 50
  let temp = {}
  // 节流setData
  const lazyUpdate = throttle(function () {
    try {
      context.setData(temp)
      temp = {}
    } catch (error) {
      console.error(error)
    }
  }, DELAY)
  const update = (store) => {
    Object.assign(temp, store)
    lazyUpdate()
  }
  const disposers = []
  Object.keys(props).forEach((key) => {
    const prop = props[key]
    if (!isObservableObject(prop)) {
      throw new TypeError('props must be ObservableObject')
    }
    disposers.push(
      autorun(() => {
        const data = {}
        const displayKeys = Object.getOwnPropertyNames(prop).filter(
          (key) => key !== '$mobx' && typeof prop[key] !== 'function' && key !== '__mobxDidRunLazyInitializers',
        )
        displayKeys.forEach((k) => {
          data[k] = toJS(prop[k])
        })
        update({
          [key]: data,
        })
      }),
    )
  })
  // @ts-ignore
  const onUnload = context.onUnload
  if (onUnload) {
    // @ts-ignore
    context.onUnload = function () {
      disposers.forEach((disposer) => disposer())
      onUnload.apply(context, arguments)
    }
  }
  return function () {
    disposers.forEach((disposer) => disposer())
  }
}

export default inject
