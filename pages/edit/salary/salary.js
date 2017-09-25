// salary.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    min_salary: 0,
    max_salary: 0,
    salaryChecked: false,
    form: {
      min_salary: 0,
      max_salary: 0,
      token: '',
      job_id: '',
      id:''
    },
    url: 'businessjob/update',
    warn: ''
  },


  minSalaryInput: function (e) {
    this.setData({
      'form.min_salary': e.detail.value,
      'warn': ''
    })
  },

  maxSalaryInput: function (e) {
    this.setData({
      'form.max_salary': e.detail.value,
      'warn': ''
    })
  },

  /**
   * 点击面议
   */
  chengeSalaryChecked: function () {
    this.setData({
      salaryChecked: !this.data.salaryChecked
    })
  },


  /**
   * 提交
   */
  submit: function () {
    let that = this

    if (!this.data.salaryChecked && (!this.data.form.max_salary || !this.data.form.max_salary)) {
      return this.setData({
        'warn': '薪资不能为空'
      })
    } else if (+this.data.form.max_salary < +this.data.form.min_salary) {
      let max = this.data.form.min_salary
      let min = this.data.form.max_salary
      this.setData({
        'form.max_salary': max,
        'form.min_salary': min
      })
    } else if (this.data.salaryChecked) {
      this.setData({
        'form.max_salary': 0,
        'form.min_salary': 0
      })
    }


    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.API_ROOT + this.data.url,
      method: 'post',
      data: this.data.form,
      success: function (res) {
        if (res.data.error == 0) {
          wx.navigateBack()
        } else {
          that.setData({
            warn: '网络错误，code：' + res.data.error
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      },
      fail: function(){
        that.setData({
          warn: '未知错误'
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      salaryChecked: !!+options.salaryChecked,
      min_salary: options.min_salary,
      max_salary: options.max_salary,
      'form.min_salary': options.min_salary,
      'form.max_salary': options.max_salary,
      'form.token': app.token,
      'form.job_id': options.job_id,
      'form.id': app.id
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