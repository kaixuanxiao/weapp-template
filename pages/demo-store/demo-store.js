import userStore from '../../store/userStore'
import createStoreBehavior from '../../utils/createStoreBehavior'
import { reaction } from 'mobx-miniprogram'
import createPoller from '../../utils/createPoller'

Component({
  behaviors: [createStoreBehavior(userStore, { key: 'user' })],

  data: {
    info: {},
  },

  methods: {
    onNameInput: function (e) {
      console.log(e)
      this['user.setName'](e.detail)
    },
    onAgeInput: function (e) {
      this['user.setAge'](e.detail)
    },
  },

  lifetimes: {
    attached() {
      console.log(this['user.reset'])
      this.disposes.push(
        reaction(
          () => userStore.userInfo.age,
          (userInfo) => {
            console.log('userInfo changed', userInfo)
          },
        ),
      )
      userStore.setAge(10)
      this._poller = createPoller(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              console.log('poll once')
              resolve()
            }, 3000)
          }),
        {
          immediate: false,
          interval: 5000,
        },
      ).run()
    },

    detached() {
      this._poller.stop()
      this._poller = null
    },
  },
})
