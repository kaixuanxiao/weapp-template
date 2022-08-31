import { behavior as computedBehavior } from 'miniprogram-computed'
Page({
  behaviors: [computedBehavior],

  data: {
    base: 2,
    count: 1,
  },

  computed: {
    totalCount(data) {
      return data.base + data.count
    },
  },

  onIncrease() {
    this.setData({ count: this.data.count + 1 })
  },

  onDecrease() {
    this.setData({ count: Math.max(0, this.data.count - 1) })
  },
})
