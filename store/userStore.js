import createStore from '../utils/createStore'

export default createStore({
  userInfo: {
    id: 10086,
    name: 'test',
    age: 0,
  },
  loginStatus: '已登录',

  init() {},

  setName(name) {
    this.userInfo.name = name
  },

  setAge(age) {
    this.userInfo.age = age
  },

  reset() {
    console.log('reset')
    this.userInfo.name = ''
    this.userInfo.age = 0
  },
})
