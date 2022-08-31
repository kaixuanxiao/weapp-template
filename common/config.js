import EnvTypes from './EnvTypes'
import ServerTypes from './ServerTypes'

/**
 * 配置不同环境下，不同服务器的API地址
 * @type {Record<EnvTypes, Record<ServerTypes, string>>}
 */
const BaseURLConfig = {
  [EnvTypes.DEV]: {
    [ServerTypes.DEFAULT]: 'https://weapp-api-dev.golden.com/api/v1/',
    [ServerTypes.USER]: 'https://weapp-api-dev2.golden.com/api/v1/',
  },
  [EnvTypes.TEST]: {
    [ServerTypes.DEFAULT]: '',
    [ServerTypes.USER]: '',
  },
  [EnvTypes.UAT]: {
    [ServerTypes.DEFAULT]: '',
    [ServerTypes.USER]: '',
  },
  [EnvTypes.PROD]: {
    [ServerTypes.DEFAULT]: '',
    [ServerTypes.USER]: '',
  },
}

/** @type {EnvTypes} */
let env = EnvTypes.PROD

/**
 * 设置当前环境
 * @param {EnvTypes} $env 当前环境
 */
export function setEnv($env) {
  env = $env
}

/**
 * @returns {EnvTypes}
 */
export function getEnv() {
  return env
}

/**
 * 获取接口路径
 * @param {ServerTypes} [serverType=ServerTypes.DEFAULT]
 */
export function getBaseURL(serverType = ServerTypes.DEFAULT) {
  return BaseURLConfig[env][serverType]
}
