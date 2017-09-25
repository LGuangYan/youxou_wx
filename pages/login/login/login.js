// login.js
let md5 = require('../../../utils/md5.js')
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topTips: '',
    form:{
      phone: '',
      password: ''
    },
    warn: {
      phone: false,
      phoneText: '',
      password: false,
      passwordText: ''
    }
  },

  /**
 * 手机号失去焦点
 */
  phoneInputBlur: function (e) {

    if (e) {
      this.setData({
        'form.phone': e.detail.value,
      })
    }
    let val = this.data.form.phone


    if (!val) {
      this.setData({
        'warn.phone': true,
        'warn.phoneText': '手机号不能为空',
        topTips: ''
      })
      return false
    } else if (val.length != 11) {
      this.setData({
        'warn.phone': true,
        'warn.phoneText': '手机号格式不正确',
        topTips: ''
      })
      return false
    }
    this.setData({
      topTips: '',
      'warn.phoneText': '',
      'warn.phone': false
    })
    return true
  },



  /**
   * 密码失去焦点
   */
  passwordInputBlur: function (e) {
    if (e) {
      this.setData({
        'form.password': e.detail.value
      })
    }
    let val = this.data.form.password
    if (!val) {
      this.setData({
        'warn.password': true,
        'warn.passwordText': '密码不能为空',
        topTips: ''
      })
      return false
    } else if (val.length < 8 || val.length > 16) {
      this.setData({
        'warn.password': true,
        'warn.passwordText': '密码长度必须为8-16位',
        topTips: ''
      })
      return false
    }
    this.setData({
      topTips: '',
      'warn.passwordText': '',
      'warn.password': false
    })
    return true
  },

  /**
   * 手机登陆
   */
  bindQuickLoginTap: function () {
    wx.navigateTo({
      url: '../quick_login/quick_login'
    })
  },

  /**
   * 找回密码
   */
  bindResetPasswordTap: function () {
    wx.navigateTo({
      url: '../reset_password/reset_password',
    })
  },

  /**
   * 登陆
   */
  submit: function (e) {
    let that = this
    if (!this.phoneInputBlur() || !this.passwordInputBlur()) return
    this.setData({
      topTips: ''
    })
    wx.showLoading({
      title: '正在登陆'
    })
    wx.request({
      url: app.API_ROOT + 'companyuser/login',
      method: 'post',
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded'
      // },
      data: {
        telephone: this.data.form.phone,
        password: md5.hexMD5(this.data.form.password),
        token: app.token
      },
      success: function (res) {
        if (res.data.error === '10003') {
          that.setData({
            topTips: '用户不存在或密码错误'
          })
          return wx.hideLoading()
        } else if (res.data.error != '0') {
          that.setData({
            topTips: '未知错误，code：' + res.statusCode
          })
        } 
        if (res.data.data.is_business == 0) {
          app.token = res.data.data.token
          app.id = res.data.data.business_id
          app.uid = res.data.data.u_id
          app.getRadioInfo()
          //缓存手机号
          wx.setStorageSync('tempPhone',that.data.form.phone)
          wx.reLaunch({
            url: '/pages/login/complete_info/complete_info'
          })
        } else {
          app.token = res.data.data.token
          app.id = res.data.data.business_id
          app.uid = res.data.data.u_id
          app.getRadioInfo()
          app.updateCompanyInfo()
          wx.reLaunch({
            url: '/pages/main/candidate_list/candidate_list',
          })
        }
      },
      fail: function(err){
        that.setData({
          topTips: '网络错误'
        })
      },
      complete: function(){
        wx.hideLoading()
      }
    })
  },

  /**
   * 注册
   */
  bindRegisterTap: function () {
    wx.navigateTo({
      url: '/pages/login/register/register',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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