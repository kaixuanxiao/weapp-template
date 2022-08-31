import { getCurrentRouteUrl } from '../../utils/wxPages'

Component({
  data: {
    currentPagePath: '',
    activeTabIndex: 0,
    tabbarList: [
      {
        pagePath: 'pages/demo-home/demo-home',
        text: '首页',
        iconPath: '/images/icon-home.png',
        selectedIconPath: '/images/icon-home-on.png',
      },
      {
        pagePath: 'pages/demo-personal/demo-personal',
        text: '我的',
        iconPath: '/images/icon-personal.png',
        selectedIconPath: '/images/icon-personal-on.png',
      },
    ],
  },

  lifetimes: {
    attached() {
      const currentPagePath = getCurrentRouteUrl()
      const activeTabIndex = this.data.tabbarList.findIndex((item) => item.pagePath === currentPagePath)
      this.setData({ currentPagePath, activeTabIndex })
    },
  },

  pageLifetimes: {
    show() {
      // console.log('custom-tabbar owner page show', this)
    },
  },

  methods: {
    onChange(e) {
      const tabbarItem = this.data.tabbarList[e.detail]
      if (tabbarItem) {
        wx.switchTab({
          url: '/' + tabbarItem.pagePath,
        })
      }
    },
  },
})
