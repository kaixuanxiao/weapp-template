export default Behavior({
  data: {
    statusBarHeight: 20,
    statusBarHeightRpx: 20,
    statusBarVariableStyle: '',
  },

  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync()
      const { screenWidth, statusBarHeight } = systemInfo
      const statusBarHeightRpx = (statusBarHeight * 750) / screenWidth
      const statusBarVariableStyle = `--status-bar-height: ${statusBarHeightRpx}rpx;`
      this.setData({ statusBarHeight, statusBarHeightRpx, statusBarVariableStyle })
    },
  },
})
