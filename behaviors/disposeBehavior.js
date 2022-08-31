export default Behavior({
  lifetimes: {
    attached() {
      !this.disposes && (this.disposes = [])
    },
    detached() {
      while (this.disposes && this.disposes.length >= 0) {
        const fn = this.disposes.pop()
        if (typeof fn === 'function') {
          fn()
        }
      }
    },
  },
})
