import WxAxios from './core/WxAxios'
import utils from './utils'
import deepClone from '../deepClone'
import { defaults } from './defaults'

function mergeConfig(c1, c2) {
  return Object.assign(deepClone(c1), c2)
}

/**
 * @template {{}} TExtraOptions, TResponseData
 * @typedef {(defaultConfig: Partial<import('./core/WxAxios').RequestConfig<TExtraOptions> & import('./core/WxAxios').RequestParam>) => WxAxios<TExtraOptions, TResponseData> & WxAxios<TExtraOptions, TResponseData>['request'] & { create: AxiosCreator<TExtraOptions, TResponseData>}} AxiosCreator
 */

/**
 * @template {{}} TExtraOptions
 * @template {{}} TResponseData
 * @type {AxiosCreator<TExtraOptions, TResponseData>}
 */
function createInstance(defaultConfig) {
  // @ts-ignore
  const context = new WxAxios(defaultConfig)
  const instance = utils.bind(WxAxios.prototype.request, context)

  // Copy axios.prototype to instance
  utils.extendFunctionsFromProto(instance, WxAxios.prototype, context)

  // Copy context to instance
  utils.extendProps(instance, context)

  // @ts-ignore
  return instance
}

// Create the default instance to be exported

const axios = createInstance(defaults)

// Expose Axios class to allow class inheritance
// axios.Axios = WxAxios

// Factory for creating new instances
/**
 * @template {{}} TExtraOptions, TResponseData
 * @type {AxiosCreator<TExtraOptions, TResponseData>}
 */
function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig))
}

// Expose Cancel & CancelToken
// axios.Cancel = require('./cancel/Cancel')
// axios.CancelToken = require('./cancel/CancelToken')
// axios.isCancel = require('./cancel/isCancel')

// Expose all/spread
function all(promises) {
  return Promise.all(promises)
}
// axios.spread = require('./helpers/spread')

// Expose isAxiosError
// axios.isAxiosError = require('./helpers/isAxiosError')

// /**
//  * @template {import('./core/WxAxios').RequestMethods} T
//  * @typedef {Parameters<WxAxios[T]>} FetchRequestParams
//  */
// /**
//  * @template {import('./core/WxAxios').RequestMethods} T
//  * @typedef {(...args: FetchRequestParams<T>) => ReturnType<WxAxios[T]>} FetchRequest
//  */

// /**
//  * 封闭axios的请求方法和URL,使用时直接传递参数和配置即可调用
//  * @param {import('./core/WxAxios').RequestMethods} method
//  * @param {string} url
//  * @returns {(data: FetchRequestParams<method>[1], config: FetchRequestParams<method>[2]) => ReturnType<WxAxios[method]>}
//  */
// export function wrap(method, url) {
//   // @ts-ignore
//   return (data, config) => WxAxios[method](url, data, config)
// }

export default {
  ...axios,
  Axios: WxAxios,
  create,
  all,
  // wrap,
}
