// option.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    warn: ''
  },

  /**
   * 解除绑定
   */
  unbind: function () {
    let that = this
    console.log('uid', app.uid, 'token', app.token)
    wx.showModal({
      title: '提示',
      content: '确定要解除当前账号与微信号的绑定吗？',
      confirmColor: '#ff9800',
      success: function (e) {
        if (e.confirm) {
          wx.request({
            url: app.API_ROOT + 'companyuser/unbund',
            method:'post',
            data: {
              token: app.token,
              uid: app.uid
            },
            success: function (res) {
              if (res.data.error == 0) {
                wx.removeStorageSync('id')
                wx.removeStorageSync('uid')
                wx.removeStorageSync('token')
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              } else {
                that.setData({
                  warn:'解绑失败，'+res.data.msg
                })
                setTimeout(function(){
                  that.setData({
                    warn: ''
                  })
                },1500)
              }
            },fail:function(err){
              that.setData({
                warn: '网络错误，' + err.statusCode
              })
              setTimeout(function () {
                that.setData({
                  warn: ''
                })
              }, 1500)
            }
          })
        }
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