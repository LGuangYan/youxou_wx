// pages/form/identity/identity.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitType:'',
    name: '',
    param: 'identity',
    value: '',
    buttonResult: '',
    inputResult: ''
  },

  /**
   * 输入框变化
   */
  identityInput: function(e){
    this.setData({
      inputResult: e.detail.value
    })
  },

  /**
   * 按钮变化
   */
  buttonTap: function(e){
    this.setData({
      buttonResult: e.currentTarget.dataset.val
    })
  },

  /**
   * 提交
   */
  submit: function(){
    let result = ''
    if (this.data.buttonResult == '自定义'){
      result = this.data.inputResult
    } else {
      result = this.data.buttonResult
    }

    if (this.data.submitType == 'form'){
      let pages = getCurrentPages()
      pages[pages.length - 2].setData({
        ['form.' + this.data.param]: result,
        ['warn.' + this.data.param]: ''
      })
      wx.navigateBack()
    } else {
      wx.request({
        url: app.API_ROOT + 'business/update',
        method: 'post',
        data: {
          token: app.token,
          id:app.id,
          identity:result
        },
        success: function (res) {
          console.log(res.data.error, res.data.data)
          wx.navigateBack()
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: options.name,
      param: options.param,
      value: options.value,
      buttonResult: options.value,
      submitType: options.submitType,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})