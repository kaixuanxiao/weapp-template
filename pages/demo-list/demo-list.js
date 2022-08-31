import createListPageBehavior from '../../behaviors/createListPageBehavior'
import service from '../../service/service'

const listPageBehavior = createListPageBehavior(service.list.fetchDemoList, {
  getFetchParamMethod() {
    return { name: this.data.searchInput, size: 20 }
  },
})

Component({
  behaviors: [listPageBehavior],

  data: {},

  methods: {
    onLoad: function (options) {
      console.log('demo-list options', options)
      this.refreshListData()
    },
  },
})
