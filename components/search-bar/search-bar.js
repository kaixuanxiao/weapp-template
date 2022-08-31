import systemInfoBehavior from '../../behaviors/systemInfoBehavior'

Component({
  options: {
    styleIsolation: 'page-isolated',
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  behaviors: [systemInfoBehavior],

  properties: {
    placeholder: String,
    value: String,
    maxlength: {
      type: Number,
      value: 50,
    },
  },

  data: {
    focus: false,
    searchInput: '',
    styleText: '',
  },

  observers: {
    value(value) {
      this.setData({ searchInput: value })
    },
  },

  lifetimes: {
    created() {
      const styleText = '' // `margin-top: calc(var(--height) + ${this.data.statusBarHeight}px);`
      this.setData({ styleText })
    },
  },

  methods: {
    onSearchInput(e) {
      let { value: searchInput } = e.detail
      searchInput = searchInput.trim()
      this.setData({ searchInput })
      this.triggerEvent('input', searchInput)
    },
    onClear() {
      this.setData({ searchInput: '' })
      this.triggerEvent('input', '')
      this.onBlur()
    },
    onFocus() {
      this.setData({ focus: true })
    },
    onBlur() {
      this.setData({ focus: false })
    },
  },
})
