export default Behavior({
  data: {
    hasTestBehavior: true,
  },
  lifetimes: {
    attached() {},
  },
  methods: {
    testBehavior() {
      console.log('testBehavior')
    },
  },
})
