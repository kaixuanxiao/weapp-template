/* eslint-disable no-multiple-empty-lines */
import './utils/polyfill/promise'
import { getBaseURL, getEnv, setEnv } from './common/config'
import EnvTypes from './common/EnvTypes'
import log from './utils/log'
import { fetch } from './service/fetch'
import { wxCheckUpdate } from './utils/wxCheckUpdate'
import userStore from './store/userStore'

/**
 * @enum {EnvTypes}
 * @type {Record<'develop' | 'trial' | 'release', EnvTypes>}
 */
const WeAppEnvToGdEnvMap = {
  develop: EnvTypes.DEV,
  trial: EnvTypes.TEST,
  release: EnvTypes.PROD,
}

/**
 * @param {WechatMiniprogram.App.LaunchShowOption} options
 * @param {string} platform
 */
function parseEnv(options, platform) {
  /** @type {EnvTypes} */
  let env
  if (platform === 'devtools') {
    env = EnvTypes.DEV
  } else if (options.query.env) {
    env = options.query.env
  } else {
    // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/account-info/wx.getAccountInfoSync.html
    // 获取当前帐号信息。2.1.0版本可以获取到当前是开发版、体验版还是正式版
    const {
      miniProgram: { envVersion },
    } = wx.getAccountInfoSync()
    env = WeAppEnvToGdEnvMap[envVersion] || EnvTypes.PROD
  }
  return env
}

App({
  onLaunch: function (options) {
    const systemInfo = wx.getSystemInfoSync()

    const env = parseEnv(options, systemInfo.platform)
    this.globalData.env = env
    setEnv(env)
    if (env !== EnvTypes.DEV) {
      log.enableRealTimeLogger()
    }

    log.info('onLaunch options', options)
    fetch.defaults.baseURL = getBaseURL()
    log.info('baseURL', fetch.defaults.baseURL)

    this.globalData.systemInfo = systemInfo
    log.info('system info', this.globalData.systemInfo)
    userStore.init()
  },


  globalData: {
    env: getEnv(),
    systemInfo: undefined,
  },

  onShow: function () {
    wxCheckUpdate()
  },

  onHide: function () {},

  onError: function () {},
})
