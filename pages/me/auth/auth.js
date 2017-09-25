// auth.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    warn:'',
    warnTimer:null,

    status:{}
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
   * 点击人脸认证
   */
  bindFaceAuthTap: function(){
    let that = this
    wx.chooseImage({
      count:1,
      success:function(res){
        let tempFilePaths = res.tempFilePaths
        that.uploadImage(tempFilePaths[0])
      }
    })
  },

  /**
   * 上传人脸图片
   */
  uploadImage:function(path){
    let that = this
    wx.showLoading({
      title: '正在提交',
    })
    wx.uploadFile({
      url: app.API_ROOT + 'businessimg/create',
      filePath: path,
      name: 'files[0]',
      formData: {
        'token': app.token
      },
      success: function (res) {
        let data = JSON.parse(res.data)
        if(data.error == 0){
          that.submitFaceAuth(data.data[0].imgId)
        } else {
          wx.hideLoading()
          that.showWarn(data.msg)
        }
      },
      fail:function(){
        wx.hideLoading()
      }
    })

  },

  /**
   * 人脸认证提交
   */
  submitFaceAuth: function(id){
    let that = this
    wx.request({
      url: app.API_ROOT + 'business/senior',
      method:'post',
      data:{
        token:app.token,
        business_id:app.id,
        face_img:id
      },
      success:function(res){
        if(res.data.error == 0){
          wx.showToast({
            title: '提交成功',
          })
          that.getAuthStatus()
        } else {
          that.showWarn(res.data.msg)
        }
      },
      fail:function(){
        wx.hideLoading()
      }
    })
  },

  /**
   * 获取认证状态
   */
  getAuthStatus:function(){
    let that = this
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: app.API_ROOT + 'business/ident',
      data:{
        token:app.token,
        business_id: app.id
      },
      success:function(res){
        console.log(res)
        if(res.data.error==0){
          that.setData({
            status: res.data.data.tag
          })
        }
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
    this.getAuthStatus()
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