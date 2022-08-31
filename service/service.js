// 为什么不是index.js呢，其他地方自动import会不包含/index，但是编译的时候又不自动加上/index

import * as home from './modules/home'
import * as user from './modules/user'
import * as list from './modules/list'

export default {
  home,
  user,
  list,
}
