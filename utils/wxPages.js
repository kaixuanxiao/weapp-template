export function getCurrentRouteUrl() {
  const pages = getCurrentPages()
  return pages.length ? pages[pages.length - 1].route : ''
}

/**
 * 重定向到url
 * @param {string} url
 */
export function redirectTo(url) {
  '/' + getCurrentRouteUrl() !== url && wx.redirectTo({ url })
}

/**
 * 重定向到url
 * @param {string} url
 */
export function navigateTo(url) {
  '/' + getCurrentRouteUrl() !== url && wx.navigateTo({ url })
}
