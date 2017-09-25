// auth_licence.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    warn: '',
    warnTimer:null
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
   * 选择营业执照
   */
  chooseLicence: function(){
    let that = this
    wx.chooseImage({
      count:1,
      success: function (img){
        that.uploadLicence(img.tempFilePaths[0])
      }
    })
  },

  /**
   * 上传营业执照
   */
  uploadLicence: function(path){
    let that = this
    wx.showLoading({
      title: '正在上传',
    })
    wx.uploadFile({
      url: app.API_ROOT + 'businessimg/create',
      filePath: path,
      name: 'files[0]',
      formData: {
        'token': app.token
      },
      success: function (res) {
        console.log('uploadLicence', res)
        wx.request({
          url: app.API_ROOT + 'business/senior',
          method: 'post',
          data: {
            token: app.token,
            business_id: app.id,
            licence: JSON.parse(res.data).data[0].imgId
          },
          success: function (res2) {
            if(res2.data.error == 0){
              wx.hideLoading()
              wx.navigateBack()
            } else {
              that.showWarn('上传失败，' + res2.msg)
            }
          },
          fail: function (err) {
            wx.hideLoading()
            that.showWarn('上传失败，' + err.statusCode)
          }
        }) 
      },
      fail: function(err){
        wx.hideLoading()
        that.showWarn('上传失败，'+err.statusCode)
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