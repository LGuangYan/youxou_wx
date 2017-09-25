// register.js
let app = getApp();
let md5 = require('../../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTips: '',
    getCodeMessage: '获取验证码',
    canGetCode: true,
    form: {
      phone: '',
      checkcode: '',
      password: ''
    },
    checkPass: '',
    warn: {
      phone: false,
      phoneText: '',
      code: false,
      codeText: '',
      password: false,
      passwordText: '',
      checkPass: false,
      checkPassText: ''
    },
    topTips:''
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
      'warn.phoneText': '',
      'warn.phone': false,
      topTips: ''
    })
    return true
  },

  /**
   * 验证码失去焦点
   */
  codeInputBlur: function (e) {
    if (e) {
      this.setData({
        'form.checkcode': e.detail.value,
      })
    }
    let val = this.data.form.checkcode


    if (!val) {
      this.setData({
        'warn.code': true,
        'warn.codeText': '验证码不能为空',
        topTips: ''
      })
      return false
    } else if (val.length != 4) {
      this.setData({
        'warn.code': true,
        'warn.codeText': '验证码格式不正确',
        topTips: ''
      })
      return false
    } else {
      this.setData({
        'warn.codeText': '',
        'warn.code': false,
        topTips: ''
      })
      return true
    }
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
        'warn.passwordText': '密码格式不正确',
        topTips: ''
      })
      return false
    } else if (this.data.checkPass && val != this.data.checkPass) {
      this.setData({
        'warn.checkPass': true,
        'warn.checkPassText': '两次密码输入不一样',
        topTips: ''
      })
      return false
    }
    this.setData({
      'warn.passwordText': '',
      'warn.password': false,
      topTips: ''
    })
    return true
  },

  /**
   * 二次密码失去焦点
   */
  checkPassInputBlur: function (e) {
    if (e) {
      this.setData({
        'checkPass': e.detail.value
      })
    }
    let val = this.data.checkPass
    if (!val) {
      this.setData({
        'warn.checkPass': true,
        'warn.checkPassText': '请再次输入密码',
        topTips: ''
      })
      return false
    } else if (val.length < 8 || val.length > 16) {
      this.setData({
        'warn.checkPass': true,
        'warn.checkPassText': '密码格式不正确',
        topTips: ''
      })
      return false
    } else if (this.data.checkPass && val != this.data.checkPass) {
      this.setData({
        'warn.checkPass': true,
        'warn.checkPassText': '两次密码输入不一样',
        topTips: ''
      })
      return false
    }
    this.setData({
      'warn.checkPassText': '',
      'warn.checkPass': false,
      topTips: ''
    })
    return true
  },

  /**
   * 查看错误信息
   */
  getErrorInfo: function (e) {
    this.setData({
      topTips: this.data.warn[e.currentTarget.dataset.warn + 'Text']
    })
  },

  /**
   * 获取验证码
   */
  getCode: function () {
    let that = this
    if (!this.data.canGetCode) return;
    if (!this.phoneInputBlur()) return;
    wx.request({
      url: app.API_ROOT +'companyuser/userexist',
      method:'post',
      data:{
        telephone:this.data.form.phone,
      },
      success: function(res){
        if (res.data.error && res.data.error === '0'){
          that.getCodeRequest()
        } else if (res.data.error && res.data.error === '10004'){
          that.setData({
            'warn.phone': true,
            'warn.phoneText': '手机号不存在',
            topTips: ''
          })
        } else if (res.data.error) {
          that.setData({
            topTips: res.data.msg
          })
        } else {
          that.setData({
            topTips: '未知错误，code：'+res.code
          })
        }
      },
      fail: function(){
        that.setData({
          topTips: '网络错误'
        })
      }
    })
  },

  /**
   * 获取验证码请求
   */
  getCodeRequest: function(){
    let that = this
    wx.request({
      url: app.API_ROOT + 'companyuser/verifycode',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        telephone: that.data.form.phone,
        token: app.token
      },
      success: function (res) {
        console.log(res)
      },
      fail: function () {
        console.log('fail')
      }
    })
    let count = 30;
    this.setData({
      getCodeMessage: '重新获取(' + count + ')',
      canGetCode: false
    })
    let timer = setInterval(() => {
      count--;
      if (count < 0) {
        clearInterval(timer)
        return this.setData({
          getCodeMessage: '重新获取',
          canGetCode: true
        })
      }
      this.setData({
        getCodeMessage: '重新获取(' + count + ')',
      })
    }, 1000)
  },

  /**
   * 提交
   */
  submit: function () {
    let that = this
    if (!this.phoneInputBlur() || !this.codeInputBlur() || !this.passwordInputBlur() || !this.checkPassInputBlur()) return
    wx.showLoading({
      title: '正在提交'
    })
    wx.request({
      url: app.API_ROOT + 'companyuser/changepwd',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        telephone: this.data.form.phone,
        checkcode: this.data.form.checkcode,
        password: md5.hexMD5(this.data.form.password),
        token: app.token
      },
      success: function (res) {
        if (res.data.error === '10020') {
          that.setData({
            'warn.code': true,
            'warn.codeText': '验证码不正确',
            topTips: ''
          })
          return wx.hideLoading()
        } else if (res.data.error === '10004'){
          that.setData({
            topTips: '用户不存在'
          })
          return wx.hideLoading()
        } else if (res.data.error !== '0' ) {
          that.setData({
            topTips: res.data.msg||'未知错误，code：'+res.code
          })
          return wx.hideLoading()
        }
        
        wx.showToast({
          title: '已完成',
          icon: 'success',
          duration: 2000
        });
        setTimeout(function(){
          wx.navigateBack()
        },2000)
      },
      fail: function(err){
        that.setData({
          topTips: '网络错误'
        })
        return wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'form.token': app.token
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