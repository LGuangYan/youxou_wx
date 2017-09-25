// register.js
let app = getApp();
let md5 = require('../../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTips:'',
    getCodeMessage: '获取验证码',
    canGetCode: true,
    form:{
      phone:'',
      checkcode:'',
      password:''
    },
    checkPass:'',
    clauseAgree:false,
    warn:{
      phone:false,
      phoneText:'',
      code:false,
      codeText:'',
      password:false,
      passwordText:'',
      checkPass:false,
      checkPassText:''
    }
  },

  /**
   * 手机号失去焦点
   */
  phoneInputBlur: function (e) {

    if(e) {
      this.setData({
        'form.phone': e.detail.value,
      })
    }
    let val = this.data.form.phone


    if (!val) {
      this.setData({
        'warn.phone':true,
        'warn.phoneText':'手机号不能为空',
        topTips:''
      })
      return false
    } else if(val.length!=11) {
      this.setData({
        'warn.phone': true,
        'warn.phoneText': '手机号格式不正确',
        topTips:''
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
    if(e){
      this.setData({
        'form.checkcode': e.detail.value,
      })
    }
    let val = this.data.form.checkcode


    if (!val) {
      this.setData({
        'warn.code': true,
        'warn.codeText': '验证码不能为空',
        topTips:''
      })
      return false
    } else if (!val) {
      this.setData({
        'warn.code': true,
        'warn.codeText': '验证码格式不正确',
        topTips:''
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
    if(e){
      this.setData({
        'form.password':e.detail.value
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
    if(e){
      this.setData({
        'checkPass':e.detail.value
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
    } else if (this.data.form.password && val != this.data.form.password) {
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
  getErrorInfo:function(e){
    this.setData({
      topTips: this.data.warn[e.currentTarget.dataset.warn+'Text']
    })
  },

  /**
   * 获取验证码
   */
  getCode: function () {
    if (!this.data.canGetCode) return;
    if (!this.phoneInputBlur()) return
    wx.request({
      url: app.API_ROOT + 'companyuser/verifycode',
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        telephone:this.data.form.phone,
        token:app.token
      },
      success: function(res) {
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
   * 相关条款
   */
  clauseChange:function(e){
    this.setData({
      clauseAgree: !this.data.clauseAgree,
      topTips: ''
    })
  },

  /**
   * 提交
   */
  submit: function () {
    let that = this
    if (!this.phoneInputBlur() || !this.codeInputBlur() || !this.passwordInputBlur() || !this.checkPassInputBlur()) return
    if (!this.data.clauseAgree) return this.setData({ topTips:'阅读并同意《相关条款》方可注册'})
    wx.showLoading({
      title:'正在注册'
    })
    wx.request({
      url: app.API_ROOT + 'companyuser/register',
      method:'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        telephone: this.data.form.phone,
        checkcode: this.data.form.checkcode,
        password: md5.hexMD5(this.data.form.password),
        token: app.token
      },
      success: function(res) {
        if (res.data.error === '10021'){
          that.setData({
            'warn.code': true,
            'warn.codeText': '验证码不正确',
            topTips: ''
          })
        } else if (res.data.error === '10008') {
          that.setData({
            'warn.phone': true,
            'warn.phoneText': '用户名已存在'
          })
        } else if (res.data.error !== '0'){
          that.setData({
            topTips: '未知错误，code：'+res.code
          })
        } else {
          //缓存手机号
          wx.setStorageSync('tempPhone', that.data.form.telephone)
          
          wx.reLaunch({
            url: '/pages/login/complete_info/complete_info'
          })
        }
        // app.id = res.data.data.id
        // app.uid = res.data.data.uid
        wx.setStorageSync('uid', res.data.data.u_id)
        app.uid = res.data.data.u_id
        app.token = res.data.data.token
        console.log('tokn', app.token, res.data.data)
        // app.updateCompanyInfo()
      },
      fail: function(){
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'form.token':app.token
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