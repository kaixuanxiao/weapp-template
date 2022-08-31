import userStore from '../../../store/userStore'
import createStoreBehavior from '../../../utils/createStoreBehavior'

Component({
  behaviors: [
    createStoreBehavior(userStore, { props: ['userInfo'], actions: [] }),
    createStoreBehavior(userStore, { key: 'shallowUser', deep: false, actions: [] }),
  ],

  properties: {},

  data: {},

  lifetimes: {},

  methods: {},
})
