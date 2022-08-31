import { createPageInfo } from '../service/pageInfo'
import isLoadingBehavior from './isLoadingBehavior'
import throttle from '../utils/throttle'

/**
 * @typedef {ReturnType<createPageInfo>} PageInfo
 * @typedef {Object} TOptions
 * @property {() => any} getFetchParamMethod 获取`fetchMethod`接口`data`参数的方法
 * @property {(item: any) => any} [dataItemConverter] 转换列表单项数据的函数
 * @property {boolean} [saveToStore=false] 是否把（全量）数据放到store中，需要设置`saveToStoreMethod` `retrieveMethod`
 * @property {(listData:  any[], pageInfo: PageInfo) => void} [saveToStoreMethod] 把数据放到store的方法
 * @property {() => { listData: any[], pageInfo: PageInfo }} [retrieveMethod] 把数据从store中取出的方法
 */

/**
 * @type {Partial<TOptions>}
 */
const defaultOptions = {}

/**
 * @param {(data: any) => Promise<{list: any[], pageInfo: PageInfo}>} fetchMethod 获取列表的方法
 * @param {Partial<TOptions>} [options] 选项：
 *
 * -`getFetchParamMethod` 获取`fetchMethod`接口`data`参数的方法
 *
 * -`dataItemConverter` 转换列表单项数据的函数
 *
 * -`saveToStore` 是否把（全量）数据放到store中，需要设置`saveToStoreMethod` `retrieveMethod`
 *
 * -`saveToStoreMethod` 把数据放到store的方法
 *
 * -`retrieveMethod` 把数据从store中取出的方法
 */
export default function createListPageBehavior(fetchMethod, options = defaultOptions) {
  options = Object.assign({}, defaultOptions, options)
  return Behavior({
    behaviors: [isLoadingBehavior],
    data: {
      /** 搜索输入框内容 */
      searchInput: '',
      /** 是否在加载更多（下一页） */
      isLoadingMore: false,
      listData: [],
      pageInfo: createPageInfo(),
    },

    lifetimes: {
      attached() {
        this.throttleFetchListData = throttle(this.fetchListData, 1000)
        if (options.saveToStore) {
          if (!options.retrieveMethod || !options.saveToStoreMethod) {
            throw Error('options error')
          }
          this.setData(options.retrieveMethod())
        } else {
          this.setData({ listData: [], pageInfo: createPageInfo() })
        }
      },
    },

    methods: {
      refreshListData() {
        return this.fetchListData({ page: 0, useCache: false, isAllData: true })
      },
      /**
       * 拉取列表数据
       * @param {} options 页数，从0开始
       * @param {number} [page] 页数，从0开始
       * @param {boolean} [useCache] 使用缓存
       * @param {boolean} [isAllData] 是否是全量数据，全量数据才会写入到store
       */
      fetchListData({ page = 0, useCache = false, isAllData = true }) {
        if (!options.getFetchParamMethod) {
          throw Error('Page need a getFetchParamMethod method')
        }
        // 使用缓存处理
        if (options.saveToStore && useCache && isAllData && page === 0) {
          const { listData, pageInfo } = options.retrieveMethod()
          if (listData.length) {
            this.setData({ listData, pageInfo })
            return Promise.resolve()
          }
        }

        const data = options.getFetchParamMethod.bind(this)() || {}
        data.page = page
        data.sort = 'createdDate,desc'
        return fetchMethod(data).then(({ list: listData, pageInfo }) => {
          if (options.dataItemConverter) {
            listData.forEach(options.dataItemConverter)
          }
          if (pageInfo.page > 0) {
            listData = this.data.listData.concat(listData)
          }
          if (options.saveToStore && isAllData) {
            options.saveToStoreMethod(listData, pageInfo)
            this.setData({ listData, pageInfo })
          } else {
            this.setData({ listData, pageInfo })
          }

          // 更新加载状态
          if (this.data.isLoading) {
            this.setIsLoading(false)
          }
          if (this.data.isRefreshRunning) {
            this.setIsRefreshRunning(false)
          }
          if (this.data.isLoadingMore) {
            this.setData({ isLoadingMore: false })
          }
        })
      },

      onSearchInput(e) {
        const searchInput = e.detail || ''
        if (searchInput !== this.data.searchInput) {
          this.setData({ searchInput })
          this.data.searchInput = searchInput
          const useCache = !searchInput
          const isAllData = !searchInput
          console.log('search input change', searchInput, useCache, isAllData)
          this.throttleFetchListData({ page: 0, useCache, isAllData })
        }
      },

      // 下拉刷新
      onPullDownRefresh() {
        this.setIsRefreshRunning()
        this.fetchListData({ page: 0, useCache: false, isAllData: true }).finally(wx.stopPullDownRefresh)
      },

      // 上滑加载更多
      onReachBottom() {
        console.log('onReachBottom', this)
        if (!this.data.pageInfo.allLoaded && !this.data.isLoadingMore) {
          // this.setIsLoading()
          this.setData({ isLoadingMore: true })
          const page = this.data.pageInfo.page + 1
          this.fetchListData({ page, useCache: false, isAllData: true })
        }
      },
    },
  })
}
