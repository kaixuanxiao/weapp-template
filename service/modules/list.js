import { createPageInfo } from '../pageInfo'

export const fetchDemoList = ({ name = '', page = 0, size = 20 }) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const list = []
      const totalPages = name ? 1 : page + 2
      const totalCount = name ? Math.ceil(Math.random() * 10) : size * (page + 2)
      const count = name ? totalCount : size
      while (list.length < count) {
        list.push(Math.random())
      }
      resolve({
        list,
        pageInfo: createPageInfo({ page, size, totalPages, totalCount }),
      })
    }, 1000)
  })
