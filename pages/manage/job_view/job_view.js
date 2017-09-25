// job_view.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    job_id: '',
    info: {},
    deliver: 0,
    introList:[],
    companyImage:'',
    welfareList:[],

    warn: '',
    warnTimer: null
  },

  /**
   * 警告提示
   */
  showWarn: function (title) {
    let that = this
    clearTimeout(this.data.warnTimer)
    let warnTimer = setTimeout(function () {
      that.setData({
        warn: ''
      })
    }, 1500)
    this.setData({
      warn: title,
      warnTimer
    })
  },

  /**
   * 获取信息
   */
  getInfo: function () {
    wx.showLoading({
      title: '正在加载',
    })
    let that = this
    wx.request({
      url: app.API_ROOT + 'businessjob/detail',
      method: 'post',
      data: {
        business_id: app.id,
        job_id: this.data.job_id,
        token: app.token,
      },
      success: function (res) {
        if(res.data.error == 0){
          that.setData({
            info: res.data.data,
            deliver: res.data.data.deliver
          })
          that.getIntroList(res.data.data.job_desc)
        } else {
          that.showWarn(res.data.msg)
        }
      },
      fail:function(err){
        that.showWarn('网络错误，code：'+err.statusCode)
      },
      complete: function(){
        wx.hideLoading()
      }
    })
  },

  /**
   * 处理换行
   */
  getIntroList: function(content){
    this.setData({
      introList: content.split('\n')
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      job_id: options.id,
      companyImage: app.userInfo.detail.businfo_img[0] ? app.userInfo.detail.businfo_img[0].file_path:'',
      welfareList: app.userInfo.detail.welfare
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
    this.getInfo()
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