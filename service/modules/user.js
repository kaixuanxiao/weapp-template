import { getBaseURL } from '../../common/config'
import ServerTypes from '../../common/ServerTypes'
import { fetch } from '../fetch'
// 非默认API地址才配置baseURL
const userRequestConfig = { baseURL: getBaseURL(ServerTypes.USER) }

export const getUserInfo = fetch.wrap('post', '/getUserInfo', {}, userRequestConfig)

export const getUserInfo2 = fetch.wrap('get', '/getUserInfo')

const someGetApi = fetch.getWrap('url', {}, {})
someGetApi({}, { dataType: 'json' })

const someDeleteApi = fetch.deleteWrap('url', {})
someDeleteApi({ baseURL: 'http://www.baidu.com' })
