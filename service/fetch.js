import axios from '../utils/axios/axios'
import log from '../utils/log'
import { safeJSONParse } from '../utils/object'
import { isRawType } from '../utils/type'
import { showToast } from '../utils/wxWrapper'
import { createPageInfo } from './pageInfo'
import StatusCodeMsg from './StatusCodeMsg'

/**
 * @typedef {import('../utils/axios/core/WxAxios').RequestMethods} RequestMethods
 */

/** @param {string} msg */
function showErrorToast(msg) {
  showToast(msg)
}

/**
 * 对服务器返回的数据做一些处理，比较整理分页信息
 * @param {Record<string, any>} data
 */
function transformData(data) {
  if (data == null) return data
  if (Array.isArray(data.content) && 'numberOfElements' in data) {
    const { number, size, totalElements: totalCount, totalPages } = data
    return Object.assign(data, {
      pageInfo: createPageInfo({
        page: number,
        size,
        totalCount,
        totalPages,
      }),
    })
  }
  return data
}

function arrayBufferToString(buffer) {
  const encodedStr = String.fromCharCode.apply(null, new Uint8Array(buffer))
  try {
    return decodeURIComponent(escape(encodedStr))
  } catch (error) {
    return encodedStr
  }
}

/**
 * @typedef {(result:any) => string} ResultValidator 返回数据结果检查器,检查不通过自动走错误流程。
 * @typedef {Object} CustomRequestConfig
 * @property {boolean} [handleError=true] 是否自动处理错误，默认`true`
 * @property {boolean} [showLoading=true] 是否显示loading状态，默认`false`
 * @property {string} [loadingMsg] loading状态的文字内容
 * @property {boolean} [log] 记录请求日志，关闭时不记录成功日志，默认`false`
 * @property {boolean | ResultValidator} [resultValidator=true] 返回数据结果检查器,检查不通过自动走错误流程。
 */

/**
 * @type {ReturnType<import('../utils/axios/axios').AxiosCreator<CustomRequestConfig, {data: any}>>}}
 */
const service = axios.create({
  baseURL: '',
  timeout: 6 * 1000,
  handleError: true,
  showLoading: false,
  loadingMsg: '',
  log: false,
  resultValidator: undefined,
})

service.interceptors.request.use((config) => {
  console.log('[NET]request', config.method, config.url, config)

  if (config.showLoading) {
    wx.showLoading({
      title: config.loadingMsg || '加载中...',
      mask: true,
    })
  }
  if (config.data == null) {
    config.data = {}
  }

  return config
})

// res字段: errorCode: Number, errorMsg: String, statusCode: Number, result: Object
// err字段: handleError: Boolean, errorCode?: Number, errorMsg: String, statusCode?: Number
service.interceptors.response.use(
  (response) => {
    const { statusCode, config } = response
    let { data = {} } = response
    if (config.showLoading) {
      wx.hideLoading()
    }

    // 错误处理
    if (isRawType(data, 'ArrayBuffer') && statusCode >= 400) {
      // 如果config.responseType设置成了arrayBuffer，数据会被自动转成ArrayBuffer。
      // 而有时候（返回错误信息）又需要把数据再转成JSON对象
      const strData = arrayBufferToString(data)
      const parseData = safeJSONParse(strData)
      if (parseData !== undefined) {
        data = parseData
      }
    } else if (statusCode === 401) {
      data = { errorMsg: '账号不存在或密码错误' }
    } else if (typeof data === 'string') {
      // 正常情况下目前没有直接返回字符串的情况
      data = { errorMsg: '数据格式错误' }
    }
    const statusCodeErrorMsg = statusCode >= 400 ? StatusCodeMsg[statusCode] || '网络请求错误' : ''
    const validateErrorMsg = typeof config.resultValidator === 'function' ? config.resultValidator(data.data) : ''
    const errorMsg = data.error || data.errorMsg || statusCodeErrorMsg || validateErrorMsg || ''
    if (errorMsg) {
      const err = { statusCode, config, ...data, errorMsg }
      if (config.handleError) {
        showErrorToast(err.errorMsg)
      }
      log.error('[NET]response error', err)
      return Promise.reject(err)
    }

    const logFn = config.log ? log.info : console.log
    logFn('[NET]response success', statusCode, config.url, data, config)
    if ('data' in data) {
      return transformData(data.data)
    }
    return data
  },
  (reason) => {
    log.error('[NET]request failed', reason) // clonePartial(reason, [], []))
    if (reason.config.showLoading) {
      wx.hideLoading()
    }
    showErrorToast('网络连接异常，请检查网络')
    return Promise.reject(reason)
  },
)

export const fetch = service
