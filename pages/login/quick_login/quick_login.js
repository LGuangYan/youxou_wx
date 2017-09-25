// quick_login.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTips: '',
    getCodeMessage: '获取验证码',
    canGetCode: true,
    form: {
      telephone: '',
      checkcode: '',
    },
    warn: {
      phone: false,
      phoneText: '',
      code: false,
      codeText: '',
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
      topTips: '',      
      'warn.phoneText': '',
      'warn.phone': false
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
        topTips: '',        
        'warn.codeText': '',
        'warn.code': false
      })
      return true
    }

  },

  /**
   * 查看错误信息
   */
  getErrorInfo: function (e) {
    console.log(e.currentTarget.dataset.warn)
    this.setData({
      topTips: this.data.warn[e.currentTarget.dataset.warn + 'Text']
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
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        telephone: this.data.form.phone,
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
    if (!this.phoneInputBlur() || !this.codeInputBlur()) return
    wx.showLoading({
      title: '正在登陆'
    })
    wx.request({
      url: app.API_ROOT + 'companyuser/quicklogin',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        telephone: this.data.form.phone,
        checkcode: this.data.form.checkcode,
        token: app.token
      },
      success: function (res) {
        if (res.data.error === '10020') {
          that.setData({
            'warn.code': true,
            'warn.codeText': '验证码不正确',
            topTips: ''
          }) 
          
        } else if(res.data.error !== '0') {
          that.setData({
            topTips: '未知错误，code：' + res.statusCode
          }) 
        }
        if (res.data.data.is_business == 0) {
          //缓存手机号
          wx.setStorageSync('tempPhone', that.data.form.phone)
          app.token = res.data.data.token
          wx.hideLoading()
          app.getRadioInfo()
          wx.reLaunch({
            url: '/pages/login/complete_info/complete_info'
          })
        } else {
          app.token = res.data.data.token
          app.id = res.data.data.business_id
          app.uid = res.data.data.u_id
          wx.hideLoading()
          app.getRadioInfo()
          app.updateCompanyInfo()
          wx.reLaunch({
            url: '/pages/main/candidate_list/candidate_list',
          })
        }
        // console.log(321)
        // wx.showToast({
        //   title: '已完成',
        //   icon: 'success',
        //   duration: 2000
        // }); 
      },
      fail: function(err){
        console.log(err)
        that.setData({
          topTips: '网络错误'
        }) 
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