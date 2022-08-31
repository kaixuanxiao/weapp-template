import utils from '../utils'
import InterceptorManager from './InterceptorManager'
import { obj2Param } from '../../url'

const NoDataParamRequestMethods = ['options', 'head', 'delete']

/**
 * @typedef {'options' | 'head' | 'delete'} NoDataParamRequestMethods
 */

function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

function isCancel(value) {
  return !!(value && value.__CANCEL__)
}

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with '<scheme>://' or '//' (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  // eslint-disable-next-line no-useless-escape
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL)
  }
  return requestedURL
}

/**
 * @param {any} data
 * @param {any} header
 * @param {any} fns
 */
function transformData(data, header, fns) {
  // console.log('transformData', data, header, fns)
  utils.forEach(fns, (fn) => {
    data = fn(data, header)
  })

  return data
}

/**
 * @template TExtraOptions
 * @param {RequestAllConfig<TExtraOptions>} config
 * @returns {Promise<any>}
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config)

  config.header = config.header || {}
  ;['delete', 'get', 'head', 'post', 'put', 'patch', 'common'].forEach((method) => {
    delete config.header[method]
  })
  for (const key in config) {
    if (config[key] === null || config[key] === undefined) {
      delete config[key]
    }
  }

  let task
  return new Promise((resolve, reject) => {
    const { data, header, timeout, method, dataType, responseType } = config
    const url = buildFullPath(config.baseURL, config.url)
    const reqestConfig = { url, data, header, timeout, method, dataType, responseType }
    Object.keys(reqestConfig).forEach((key) => {
      reqestConfig[key] === undefined && delete reqestConfig[key]
    })
    // @ts-ignore
    task = wx.request({
      ...reqestConfig,
      success: (res) => {
        resolve(res)
      },
      fail: (res) => {
        console.warn(res)
        reject(res)
      },
    })
  })
    .then((res) => {
      throwIfCancellationRequested(config)

      res.config = config
      res.task = task

      return res
    })
    .catch((reason) => {
      // { errMsg }
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config)

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(reason.response.data, reason.response.header, config.transformResponse)
        }
      }

      reason.config = config
      reason.task = task

      return Promise.reject(reason)
    })
}

/**
 * Determine if a value is a plain Object
 *
 * @param {object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(val)
  return prototype === null || prototype === Object.prototype
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456})
 * console.log(result.foo) // outputs 456
 * ```
 *
 */

/**
 * @template T, U, V
 * @type {(t: T, u: U, v?: V) => T & U & V}
 */
function merge(...args) {
  const result = {}
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val)
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val)
    } else if (Array.isArray(val)) {
      result[key] = val.slice()
    } else {
      result[key] = val
    }
  }

  for (let i = 0, l = args.length; i < l; i++) {
    utils.forEach(args[i], assignValue)
  }
  // @ts-ignore
  return result
}

/**
 * @typedef {'get'|'head'|'post'|'options'|'delete'|'put'|'patch'} RequestMethods
 * @typedef {(data: any, headers?: any) => any} AxiosTransformer
 * @typedef {{header: any, timeout: number, dataType?: string, responseType?: 'text'|'arraybuffer', baseURL?: string, transformRequest: AxiosTransformer | AxiosTransformer[], transformResponse: AxiosTransformer | AxiosTransformer[] }} BaseRequestConfig
 * @typedef {{ url: string, method: RequestMethods | Uppercase<RequestMethods>, data?: Record<string, any> }} RequestParam
 */

/**
 * @template {{}} TExtraOptions
 * @typedef { BaseRequestConfig & TExtraOptions} RequestConfig
 */

/**
 * @template {{}} TExtraOptions
 * @typedef { RequestConfig<TExtraOptions> & RequestParam } RequestAllConfig
 */

/**
 * @template {{}} TExtraOptions
 * @template {{}} TResponseData
 */
class WxAxios {
  /**
   * @type {Partial<RequestConfig<TExtraOptions>>}
   */
  defaults = {}
  interceptors = {
    /**
     * @type {InterceptorManager<RequestAllConfig<TExtraOptions>, Error>}
     */
    request: new InterceptorManager(),
    /**
     * @type {InterceptorManager<{ statusCode: number, data: any, config: RequestAllConfig<TExtraOptions> }, { statusCode: number, config: RequestAllConfig<TExtraOptions>}>}
     */
    response: new InterceptorManager(),
  }
  /**
   * @param {RequestAllConfig<TExtraOptions> } instanceConfig
   */
  constructor(instanceConfig) {
    this.defaults = instanceConfig || this.defaults
  }

  /**
   * @param {string|Partial<RequestAllConfig<TExtraOptions>>} urlOrConfig - url 或者 config
   * @param {Partial<RequestAllConfig<TExtraOptions>>} [config]
   * @returns {Promise<TResponseData>}
   */
  request(urlOrConfig, config = null) {
    if (typeof urlOrConfig === 'string') {
      config = config || {}
      // @ts-ignore
      config.url = urlOrConfig
    } else {
      config = urlOrConfig || {}
    }

    config = merge(this.defaults, config)
    if (config.method) {
      // @ts-ignore
      config.method = config.method.toUpperCase()
      // @ts-ignore
    } else if (this.defaults.method) {
      // @ts-ignore
      config.method = this.defaults.method.toUpperCase()
    } else {
      // @ts-ignore
      config.method = 'GET'
    }

    const chain = [dispatchRequest, undefined]
    /** @type {Promise<TResponseData>} */
    // @ts-ignore
    let promise = Promise.resolve(config)

    this.interceptors.request.forEachInterceptor(function unshiftRequestInterceptors(interceptor) {
      // @ts-ignore
      chain.unshift(interceptor.fulfilled, interceptor.rejected)
    })

    this.interceptors.response.forEachInterceptor(function pushResponseInterceptors(interceptor) {
      // @ts-ignore
      chain.push(interceptor.fulfilled, interceptor.rejected)
    })

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift())
    }
    return promise
  }

  /**
   * @param {string} url
   * @param {Object} [data]
   * @param {Partial<RequestAllConfig<TExtraOptions>>} [config]
   */
  get(url, data = {}, config = {}) {
    const urlParams = obj2Param(data)
    url += urlParams ? '?' + urlParams : ''
    return this.request(
      merge(config || {}, {
        method: 'GET',
        url,
        data: (config || {}).data,
      }),
    )
  }

  /**
   * @param {string} url
   * @param {RequestAllConfig<TExtraOptions>} config
   */
  options(url, config) {
    return this.request(
      merge(config || {}, {
        method: 'OPTIONS',
        url,
        data: (config || {}).data,
      }),
    )
  }

  /**
   * @param {string} url
   * @param {RequestAllConfig<TExtraOptions>} config
   */
  head(url, config) {
    return this.request(
      merge(config || {}, {
        method: 'HEAD',
        url,
        data: (config || {}).data,
      }),
    )
  }

  /**
   * @param {string} url
   * @param {RequestAllConfig<TExtraOptions>} config
   */
  delete(url, config) {
    return this.request(
      merge(config || {}, {
        method: 'DELETE',
        url,
        data: (config || {}).data,
      }),
    )
  }

  /**
   * @param {string} url
   * @param {Record<string, any>} data
   * @param {RequestAllConfig<TExtraOptions>} config
   */
  post(url, data, config) {
    return this.request(
      merge(config || {}, {
        method: 'POST',
        url,
        data,
      }),
    )
  }

  /**
   * @param {string} url
   * @param {Record<string, any>} data
   * @param {RequestAllConfig<TExtraOptions>} config
   */
  put(url, data, config) {
    return this.request(
      merge(config || {}, {
        method: 'PUT',
        url,
        data,
      }),
    )
  }

  /**
   * @param {string} url
   * @param {Record<string, any>} data
   * @param {RequestAllConfig<TExtraOptions>} config
   */
  patch(url, data, config) {
    return this.request(
      merge(config || {}, {
        method: 'patch',
        url,
        data,
      }),
    )
  }

  /**
   * 封闭axios的请求方法、URL，默认参数、默认配置等,使用时直接传递参数和配置即可调用
   *
   * 注意'options', 'head', 'delete' 方法返回的函数只有一个参数
   * @template {NoDataParamRequestMethods | Exclude<RequestMethods, NoDataParamRequestMethods>} T
   * @param {T} method
   * @param {string} url
   * @param {Record<string, any>} [defaultData]
   * @param {Partial<RequestAllConfig<TExtraOptions>>} [defaultConfig]
   * @returns {(...args: [data?: Record<string, any>, config?: Partial<RequestAllConfig<TExtraOptions>>] | [config?: Partial<RequestAllConfig<TExtraOptions>>]) => Promise<TResponseData>}
   */
  wrap(method, url, defaultData, defaultConfig) {
    if (NoDataParamRequestMethods.includes(method)) {
      /**
       * @type {(config?: Partial<RequestAllConfig<TExtraOptions>>) => ReturnType<this[RequestMethods]>}
       */
      return (config) => {
        return WxAxios.prototype[method].bind(this, url, Object.assign({}, defaultConfig, config))
      }
    }
    /**
     * @type {(data?: Record<string, any>, config?: Partial<RequestAllConfig<TExtraOptions>>) => ReturnType<this[RequestMethods]>}
     */
    return (data = {}, config = {}) => {
      return WxAxios.prototype[method].bind(
        this,
        url,
        Object.assign({}, defaultData, data),
        Object.assign({}, defaultConfig, config),
      )
    }
  }

  /**
   * @typedef {(url: string, defaultData?: Record<string, any>, defaultConfig?: Partial<RequestAllConfig<TExtraOptions>>) => ((data?: Record<string, any>, config?: Partial<RequestAllConfig<TExtraOptions>>) => Promise<TResponseData>)} DataWrap
   *
   */

  /** @type {DataWrap} */
  getWrap(url, defaultData, defaultConfig) {
    return this.wrap('get', url, defaultData, defaultConfig)
  }
  /** @type {DataWrap} */
  postWrap(url, defaultData, defaultConfig) {
    return this.wrap('post', url, defaultData, defaultConfig)
  }
  /** @type {DataWrap} */
  putWrap(url, defaultData, defaultConfig) {
    return this.wrap('put', url, defaultData, defaultConfig)
  }
  /** @type {DataWrap} */
  patchWrap(url, defaultData, defaultConfig) {
    return this.wrap('patch', url, defaultData, defaultConfig)
  }

  /**
   * @typedef {(url: string, defaultConfig?: Partial<RequestAllConfig<TExtraOptions>>) => (config?: Partial<RequestAllConfig<TExtraOptions>>) => Promise<TResponseData>} NoDataWrap
   */

  /** @type {NoDataWrap} */
  optionsWrap(url, defaultConfig) {
    return this.wrap('options', url, {}, defaultConfig)
  }

  /** @type {NoDataWrap} */
  headWrap(url, defaultConfig) {
    return this.wrap('head', url, {}, defaultConfig)
  }

  /** @type {NoDataWrap} */
  deleteWrap(url, defaultConfig) {
    return this.wrap('delete', url, null, defaultConfig)
  }
}

export default WxAxios
