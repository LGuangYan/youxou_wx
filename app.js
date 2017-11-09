//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.userInfo.base) {
      typeof cb == "function" && cb(this.userInfo.base)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.userInfo.base = res.userInfo
          typeof cb == "function" && cb(that.userInfo.base)
        }
      })
    }
  },

  /**
   * 获取公司信息
   */

  updateCompanyInfo: function(callback,fail) {
    let that = this
    wx.request({
      url: this.API_ROOT + 'business/view',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: this.token,
        business_id: this.id
      },
      success: function (info) {
        if (info.data.error === '0'){
          that.userInfo.detail = info.data.data
          return callback && callback()
        } else {
          return fail && fail()
        }
        
      },
      fail: function(err){
        console.log(err)
        return fail && fail()
      }
    })
  },

  /**
   * 获取选项
   */
  getRadioInfo: function () {
    let that = this
    wx.request({
      url: this.API_ROOT + 'businessjob/info',
      method: 'get',
      data: {
        token: this.token
      },
      success: function (res) {
        that.jobRadio = res.data.data
        console.log('app.jobRadio', that.jobRadio)
      }
    })
  },


  /**
   * @param title 提示信息
   * @param time  跳转时间
   * @param firstbtn  第一个按钮
   * @param firsturl  第一个按钮路径
   */
  showSuccessMsg: function(obj){
    if(!obj||!obj.title||!obj.firstbtn||!obj.firsturl){
      return console.error('参数不完整')
    }
    let str = ''
    for(let key in obj){
      str+= (key + '=' + obj[key])+'&'
    }
    str = str.slice(0,-1)
    wx['redirectTo' || obj.type]({
      url: '/pages/msg/msg_success/msg_success?'+str
    })
  },


  userInfo: {
    base: null,
    detail:null
  },
  id:'',
  API_ROOT: 'http://192.168.199.191/?r=',  
  // API_ROOT: 'http://192.168.3.106/?r=',
  // API_ROOT: 'http://192.168.3.44/?r=',
  // API_ROOT: 'https://youdou.taorenke.com/?r=',
  // API_ROOT: 'https://demo.taorenke.com/?r=',
  // IMG_ROOT: 'http://192.168.3.48/elephant_recruitment_php/backend/web/',
  // IMG_ROOT:'https://demo.taorenke.com/',
  token:'',
  latitude:'',
  longitude:'',
  resumeFilter:{}
})
