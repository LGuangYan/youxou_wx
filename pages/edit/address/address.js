// address.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    name: '',
    param: '',
    value: '',
    url: {
      job: 'businessjob/update',
      company: 'business/update'
    },
    form: {
      job: {
        token: '',
        job_id: ''
      },
      company: {
        token: ''
      }
    },
    hasChoosen: false,
    warn: ''
  },
  /**
 * 地图选址
 */
  chooseAddress: function () {
    let that = this
    
    wx.chooseLocation({
      success: function (address) {
        let form = that.data.form
        form[that.data.type][that.data.param] = address.address
        form[that.data.type].longitude = address.longitude
        form[that.data.type].latitude = address.latitude
        that.setData({
          warn: '',
          hasChoosen:true,
          form
        })
      }
    })
    // wx.navigateTo({
    //   url: '../../login/map/map',
    // })
  },

  /**
   * 更改地址
   */
  handleChangeAddress: function (e) {
    let form = this.data.form
    form[this.data.type][this.data.param] = e.detail.value
    this.setData({
      form
    })
  },

  /**
   * 提交
   */
  submit: function () {
    if (!this.data.hasChoosen) return wx.navigateBack()
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.API_ROOT + this.data.url[this.data.type],
      method: 'post',
      data: this.data.form[this.data.type],
      success: function (res) {
        wx.navigateBack()
      },
      complete: function(){
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      name: options.name,
      param: options.param,
      value: options.value,
      'form.job.job_id': options.job_id || '',
      'form.job.token': app.token,
      'form.job.id': app.id,
      'form.company.token': app.token,
      'form.company.id': app.id
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