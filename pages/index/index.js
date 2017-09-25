//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '欢迎使用有豆',
    userInfo: {}
  },
  /**
   * 登陆
   */
  login: function () {
    let that = this
    wx.login({
      success: function (loginData) {
        // return console.log(loginData)
        wx.getUserInfo({
          withCredentials: true,
          success: function (userInfo) {
            wx.request({
              url: getApp().API_ROOT + 'companyuser/wxcode',
              method: 'post',
              data: {
                code: loginData.code,
                encryptedData: userInfo.encryptedData,
                signature: userInfo.signature,
                iv: userInfo.iv
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (data) {
                if (data.data && data.data.error == '0') {
                  //获取token
                  app.token = data.data.data.token
                } else {
                  console.log('登录失败1',data)
                  wx.redirectTo({
                    url: '/pages/msg/msg_fail/msg_fail?title=登陆失败请检查网络&firstbtn=重新登陆&firsttype=redirectTo&firsturl=/pages/index/index&firsttype=redirect',
                  })
                }
                if (data.data.data && data.data.data.is_phone == '0') {
                  //进入登陆/注册页面
                  wx.redirectTo({
                    url: '../login/login/login'
                  })
                } else if (data.data.data && data.data.data.is_business == '0') {
                  app.uid = data.data.data.u_id
                  wx.setStorageSync('uid', data.data.data.u_id)
                  //进入公司信息完善页面
                  wx.redirectTo({
                    url: '../login/complete_info/complete_info'
                  })
                  app.getRadioInfo()
                } else if (data.data.error !== '0'){
                  console.log('登录失败2', data)
                  wx.redirectTo({
                    url: '/pages/msg/msg_fail/msg_fail?title=登陆失败请检查网络&firstbtn=重新登陆&firsttype=redirectTo&firsturl=/pages/index/index&firsttype=redirect',
                  })
                } else {
                  //进入主界面

                  wx.setStorageSync('token', data.data.data.token)
                  wx.setStorageSync('id', data.data.data.business_id)
                  wx.setStorageSync('uid', data.data.data.u_id)
                  app.id = data.data.data.business_id
                  app.uid = data.data.data.u_id
                  app.updateCompanyInfo(function(){
                    wx.switchTab({
                      url: '/pages/main/candidate_list/candidate_list',
                    })
                  })
                  app.getRadioInfo()
                }

              },
              //getUserInfo调用失败
              fail: function (data) {
                console.log('getUserInfo调用失败1', data)
                wx.redirectTo({
                  url: '/pages/msg/msg_fail/msg_fail?title=登陆失败请检查网络&firstbtn=重新登陆&firsttype=redirectTo&firsturl=\/pages\/index\/index&firsttype=redirect',
                })
              }
            })
          },
          //getUserInfo调用失败
          fail: function(err){
            console.log('getUserInfo调用失败2', err)
            wx.redirectTo({
              url: '/pages/msg/msg_fail/msg_fail?title=登陆失败请检查网络&firstbtn=重新登陆&firsttype=redirectTo&firsturl=\/pages\/index\/index&firsttype=redirect',
            })
          }
        })
      },
      //login调用失败
      fail: function(err){
        console.log('login调用失败', err)
        wx.redirectTo({
          url: '/pages/msg/msg_fail/msg_fail?title=登陆失败请检查网络&firstbtn=重新登陆&firsttype=redirectTo&firsturl=/pages/index/index&firsttype=redirect',
        })
      }
    })
  },

  // getRadioInfo:function(){
  //   wx.request({
  //     url: app.API_ROOT + 'businessjob/info',
  //     method: 'get',
  //     data: {
  //       token: app.token
  //     },
  //     success: function (res) {
  //       app.jobRadio = res.data.data
  //       console.log('app.jobRadio',app.jobRadio)
  //     }
  //   })
  // },

  onLoad: function () {
    //test
    // return wx.navigateTo({url: '/pages/me/feedback_detail/feedback_detail'})

    var that = this
    wx.getLocation({
      success: function(res) {
        app.latitude = res.latitude
        app.longitude = res.longitude
      },
    })

    //test
    wx.removeStorageSync('id')
    wx.removeStorageSync('uid')
    wx.removeStorageSync('token')


    wx.checkSession({
      success: function () {
        let id = wx.getStorageSync('id')
        let uid = wx.getStorageSync('uid')
        let token = wx.getStorageSync('token')
        if (token && id && uid) {
          app.id = id
          app.uid = uid
          app.token = token
          app.getRadioInfo()
          app.updateCompanyInfo(function(){
            console.log('登陆成功')
            wx.switchTab({
              url: '/pages/main/candidate_list/candidate_list',
            })
          },function(){
            that.login()
          })
        } else {
          wx.removeStorageSync('id')
          wx.removeStorageSync('uid')
          wx.removeStorageSync('token')
          that.login()
        }
      },
      fail: function () {
        that.login()
      }
    })
    // that.login()
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })



  }
})
