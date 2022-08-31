export default Behavior({
  data: {
    isLoading: false,
    isRefreshRunning: false,
  },
  methods: {
    setIsLoading(value = true) {
      this.setData({
        isLoading: value,
      })
    },
    setIsRefreshRunning(value = true) {
      this.setData({
        isRefreshRunning: value,
      })
    },
    toggleIsLoading() {
      this.setData({
        isLoading: !this.data.isLoading,
      })
    },
    toggleIsRefreshRunning() {
      this.setData({
        isRefreshRunning: !this.data.isRefreshRunning,
      })
    },
  },
})
