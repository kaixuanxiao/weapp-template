import { promisifyAll } from 'miniprogram-api-promise'
/**
 * promise版wx对象
 * @type {WechatMiniprogram.Wx}
 */
const wxp = {}
promisifyAll(wx, wxp)

export default wxp
