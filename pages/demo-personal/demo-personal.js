import service from '../../service/service'
import userStore from '../../store/userStore'
import createStoreBehavior from '../../utils/createStoreBehavior'
import systemInfoBehavior from '../../behaviors/systemInfoBehavior'
import debounce from '../../utils/debounce'

Component({
  behaviors: [
    systemInfoBehavior,
    createStoreBehavior(userStore),
    Behavior({
      behaviors: [
        Behavior({
          data: {
            name: 'personal-behavior-behavior',
            hasPersonalBehaviorBehavior: true,
          },
        }),
      ],
      data: {
        name: 'personal-behavior',
        hasPersonalBehavior: true,
      },
      lifetimes: {
        attached() {
          console.log('personal behavior attached', this)
        },
        ready() {
          console.log('personal behavior ready', this)
        },
      },
      methods: {
        personalBehaviorMethods() {},
      },
    }),
  ],

  data: {
    name: 'personal',
  },

  methods: {
    onOpenDataError(e) {
      console.log(e)
    },
    navigateToDemoStore() {
      wx.navigateTo({
        url: '/pages/demo-store/demo-store',
      })
    },
    test() {
      console.log('test', this.data)
    },
  },

  lifetimes: {
    attached() {
      this.test = debounce(this.test)
      console.log('hasTestBehavior', this.data.hasTestBehavior)
      // this.testBehavior()
      service.user.getUserInfo()
    },
    ready() {
      this.test()
    },
  },
})
