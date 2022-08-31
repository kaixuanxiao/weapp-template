const rtLogger = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
// const logger = wx.getLogManager ? wx.getLogManager({ level: 0 }) : null

let rtLoggerEnabled = false
const publicParams = []
let envFilterMsg = ''
/**
 * 开启微信小程序实时日志
 * @param {string} [env] 环境
 */
function enableRealTimeLogger(env = '') {
  rtLoggerEnabled = true
  if (env) {
    publicParams.push(`[ENV:${env}]`)
    envFilterMsg = env + ' '
  }
}

/**
 * 对 `RealtimeLogManager` 的封装，可从小程序管理后台查看日志信息
 * https://developers.weixin.qq.com/miniprogram/dev/framework/realtimelog/
 */
export default {
  enableRealTimeLogger,
  info() {
    console.info.apply(undefined, publicParams.concat(Array.from(arguments)))
    rtLoggerEnabled && rtLogger && rtLogger.info.apply(rtLogger, publicParams.concat(Array.from(arguments)))
  },
  warn() {
    console.warn.apply(undefined, publicParams.concat(Array.from(arguments)))
    rtLoggerEnabled && rtLogger && rtLogger.warn.apply(rtLogger, publicParams.concat(Array.from(arguments)))
  },
  error() {
    console.error.apply(undefined, publicParams.concat(Array.from(arguments)))
    rtLoggerEnabled && rtLogger && rtLogger.error.apply(rtLogger, publicParams.concat(Array.from(arguments)))
  },

  /**
   * setFilterMsg可以设置过滤的Msg。这个接口的目的是提供某个场景的过滤能力，例如setFilterMsg('scene1')，则在MP上可输入scene1查询得到该条日志。比如上线过程中，某个监控有问题，可以根据FilterMsg过滤这个场景下的具体的用户日志。FilterMsg仅支持大小写字母。如果需要添加多个关键字，建议使用addFilterMsg替代setFilterMsg。
   * @param {string} msg
   */
  setFilterMsg(msg) {
    if (typeof msg !== 'string') return
    // 从基础库2.7.3开始支持
    rtLogger && rtLogger.setFilterMsg && rtLogger.setFilterMsg(envFilterMsg + msg)
  },

  /**
   * 添加过滤关键字
   * @param {string} msg
   */
  addFilterMsg(msg) {
    if (typeof msg !== 'string') return
    // 从基础库2.8.1开始支持
    rtLogger && rtLogger.addFilterMsg && rtLogger.addFilterMsg(envFilterMsg + msg)
  },

  /**
   * 设置实时日志page参数所在的页面
   * @param {WechatMiniprogram.Page.Instance<Record<string, any>, Record<string, any>>} pageInstance
   */
  in(pageInstance) {
    rtLogger && rtLogger.in(pageInstance)
  },
}
