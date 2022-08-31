// components/page-top-bg/page-top-bg.js
Component({
  options: {
    styleIsolation: 'isolated',
  },
  properties: {
    /** 除statusBar以外的（设计）高度 */
    height: {
      type: Number | String,
      value: 88,
    },
    background: {
      type: String,
      value: '#00cd96',
    },
    bgUrl: String,
  },

  data: {
    style: '',
  },

  computed: {
    height() {
      this.updateStyle()
    },
  },

  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync()
      const { screenWidth, statusBarHeight } = systemInfo
      const statusBarHeightRpx = (statusBarHeight * 750) / screenWidth
      this.setData({ statusBarHeight, statusBarHeightRpx })
      this.updateStyle()
    },
  },

  methods: {
    updateStyle() {
      const { height, background, bgUrl, statusBarHeightRpx } = this.data
      const styles = [`height: ${statusBarHeightRpx + parseFloat(height)}rpx;`]
      if (!bgUrl && background) {
        styles.push(`background: ${background}`)
      }
      const style = styles.join('')
      this.setData({ style })
    },
  },
})
