/**
 * 环境变量: PROD 线上，UAT 预发布，TEST 测试，DEV 开发
 * @enum {'DEV' | 'TEST' | 'UAT' | 'PROD'}
 */
const EnvTypes = {
  /**
   * 开发环境
   * @type {'DEV'}
   */
  DEV: 'DEV',
  /**
   * 测试环境
   * @type {'TEST'}
   */
  TEST: 'TEST',
  /**
   * 预发布环境
   * @type {'UAT'}
   */
  UAT: 'UAT',
  /**
   * 生产环境
   * @type {'PROD'}
   */
  PROD: 'PROD',
}

export default EnvTypes
