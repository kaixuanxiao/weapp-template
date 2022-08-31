/**
 * @typedef {{page: number, size: number, totalPages: number, totalCount: number, allLoaded: boolean}} PageInfo
 */

const defaultPageInfo = {
  page: 0,
  size: 20,
  totalPages: 1,
  totalCount: 0,
}

/**
 * 创建分页信息
 * @param {typeof defaultPageInfo} [pageInfo] 不传创建默认分页信息
 * @returns {PageInfo}
 */
export function createPageInfo({
  page = 0,
  size = 20,
  totalPages = 1,
  totalCount = 0,
} = defaultPageInfo) {
  const allLoaded = page + 1 >= totalPages
  return {
    page,
    size,
    totalPages,
    totalCount,
    allLoaded,
  }
}
