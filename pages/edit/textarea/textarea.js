// textarea.js
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

  inputChange: function (e) {
    let form = this.data.form
    form[this.data.type][this.data.param] = e.detail.value

    this.setData({
      'form': form,
      'value': e.detail.value
    })
  },

  submit: function () {
    let that = this
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.API_ROOT + this.data.url[this.data.type],
      method: 'post',
      data: this.data.form[this.data.type],
      success: function (res) {
        if(res.data.error == 0){
          wx.navigateBack()
        } else {
          console.log(res.data.error, res.data.data)
          that.showWarn(res.data.msg)
        }
      },
      fail:function(err){
        that.showWarn('网络错误'+err.statusCode)
      },
      complete:function(){
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