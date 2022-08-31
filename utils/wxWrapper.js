import wxp from './wxp'

const defaultStyle = {
  colorPrimary: '#00cd96',
  colorSecondaryBtn: '#b3b3b3',
}

const defaultModalOptions = {
  /** 取消按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
  cancelColor: defaultStyle.colorSecondaryBtn,
  /** 取消按钮的文字，最多 4 个字符 */
  cancelText: '取消',
  /** 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
  confirmColor: defaultStyle.colorPrimary,
  /** 确认按钮的文字，最多 4 个字符 */
  confirmText: '确定',
  /** 提示的内容 */
  content: '',
  showCancel: true,
  /** 提示的标题 */
  title: '',
}
const defaultConfirmModalOptions = Object.assign({}, defaultModalOptions, { showCancel: false })

/**
 * 显示确认对话框，默认不显示取消按钮
 * @param {string} content 提示的内容
 * @param {typeof defaultModalOptions} [options]
 * @returns {Promise<{confirm: boolean, cancel: boolean}>} 确认时返回resolved状态的Promise，参数true，取消时返回rejected状态的Promise，参数false
 */
export function showConfirmModal(content, options) {
  return wxp.showModal(Object.assign({}, defaultConfirmModalOptions, { content }, options))
}

/**
 * 显示确认对话框，默认会显示取消按钮
 * @param {string} content 提示的内容
 * @param {typeof defaultModalOptions} [options]
 * @returns {Promise<{confirm: boolean, cancel: boolean}>} 确认时返回resolved状态的Promise，参数true，取消时返回rejected状态的Promise，参数false
 */
export function showModal(content, options) {
  return wxp.showModal(Object.assign({}, defaultModalOptions, { content }, options))
}

/**
 * 显示带有mask的 loading 提示框
 * @param {string} title 提示的内容
 */
export function showMaskLoading(title) {
  return wx.showLoading({
    title,
    mask: true,
  })
}

const defaultToastOptions = {
  /** @type {Parameters<typeof wx.showToast>[0]['icon']} */
  icon: 'none',
  mask: false,
  image: '',
}

/**
 * 显示没有图标的消息提示框
 * @param {string} title 提示的内容
 * @param {number} [duration=2000] 提示的延迟时间
 * @param {typeof defaultToastOptions} [options] 其他选项
 */
export function showToast(title, duration = 2000, options = defaultToastOptions) {
  wx.showToast(Object.assign({}, defaultToastOptions, { title, duration }, options))
}

/**
 * 显示成功的消息提示框
 * @param {string} title 提示的内容
 * @param {number} [duration=2000] 提示的延迟时间
 * @param {boolean} [mask=false] 是否显示透明蒙层，防止触摸穿透
 */
export function showSuccessToast(title, duration = 2000, mask = false) {
  wx.showToast({ title, duration, mask, icon: 'success' })
}

/**
 * 显示错误的消息提示框
 * @param {string} title 提示的内容
 * @param {number} [duration=2000] 提示的延迟时间
 * @param {boolean} [mask=false] 是否显示透明蒙层，防止触摸穿透
 */
export function showErrorToast(title, duration = 2000, mask = false) {
  wx.showToast({ title, duration, mask, icon: 'error' })
}

/**
 * 显示loading中的消息提示框
 * @param {string} title 提示的内容
 * @param {boolean} [mask=false] 是否显示透明蒙层，防止触摸穿透
 */
export function showLoading(title, mask = true) {
  wx.showLoading({ title, mask, icon: 'loading' })
}
