import { areaList } from '@vant/area-data'
import { FormRules } from '@gd/weui/gd-form/form-rules'

Page({
  data: {
    areaList,
    shopTypes: [
      { label: '个体工商户', value: 1 },
      { label: '流动摊贩', value: 2 },
    ],
    formData: {
      shopId: 'A12351351',
      shopName: '',
      shopType: undefined,
      area: '山东省-菏泽市-曹县',
      idcard: '',
      age: '',
      opened: false,
      openedDisabled: true,
      accessed: false,
      interest: [],
      password: '',
      passwordRepeat: '',
      code: '',
      note: '不可描述不可描述不可描述不可描述',
    },
    rules: FormRules({
      shopName: [{ required: true, message: '请输入门店名称' }, { minlength: 5 }],
      shopType: { required: '门店类型' },
      idcard: {
        required: '身份证号码',
        pattern: /(^d{15}$)|(^d{18}$)|(^d{17}(d|X|x)$)/,
        message: '身份证号码格式错误',
      },
      age: { required: '年龄', range: [18, 45] },
      password: { required: '密码', lengthrange: [6, 12] },
      passwordRepeat: { required: '确认密码', equalTo: ['password', '密码'] },
      code: { required: undefined, message: '请输入验证码' },
    }),
    selectedShopTypeName: '',
  },

  onFormItemChange(e) {
    console.log('form item change', e)
    const { prop, value } = e.detail
    this.setData({ ['formData.' + prop]: value })
  },
  onShopTypeChange(e) {
    this.setData({ 'formData.shopType': e.detail.value, selectedShopTypeName: e.detail.label })
  },
  onAreaConfirm(e) {
    const selectedArea = e.detail.map((a) => a.name).join('-')
    this.setData({ 'formData.area': selectedArea })
  },
  onSendSms() {
    this.selectComponent('#countdownBtn').start()
  },
  onSubmit() {
    this.selectComponent('#form')
      .validate()
      .then((result) => {
        console.log('validate result', result)
        if (!result.isValid) return
        wx.showLoading({ title: '提交中...' })
        setTimeout(() => {
          wx.hideLoading()
          wx.showToast({ title: '修改成功' })
        }, 1000)
      })
  },
})
