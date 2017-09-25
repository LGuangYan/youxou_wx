// auth_legal.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardPhoto: '',
    cardPhotoUrl:'',
    halfPhoto: '',
    halfPhotoUrl:'',
    warn:'',
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
   * 选择身份证头部照
   */
  chooseCardPhoto: function(){
    let that = this
    wx.chooseImage({
      count: 1,
      success: function (img) {
        that.uploadCardPhoto(img.tempFilePaths[0])
      }
    })
  },


  /**
   * 上传身份证头部照
   */
  uploadCardPhoto: function (path) {
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
        console.log('uploadCardPhoto', res)
        wx.hideLoading()
        let data = JSON.parse(res.data)
        if (data.error == 0) {
          that.setData({
            cardPhoto: data.data[0].imgId,
            cardPhotoUrl: data.data[0].filePath
          })
        } else {
          that.showWarn('上传失败，' + data.msg)
        }
      },
      fail: function (err) {
        wx.hideLoading()
        that.showWarn('上传失败，' + err.statusCode)
      }
    })
  },


  /**
   * 选择半身照
   */
  chooseHalfPhoto: function(){
    let that = this
    wx.chooseImage({
      count: 1,
      success: function (img) {
        that.uploadHalfPhoto(img.tempFilePaths[0])
      }
    })
  },

  /**
   * 上传半身照
   */
  uploadHalfPhoto: function(path){
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
        console.log('uploadhalfPhoto', res)
        wx.hideLoading()
        let data = JSON.parse(res.data)
        if(data.error == 0){
          that.setData({
            halfPhoto: data.data[0].imgId,
            halfPhotoUrl: data.data[0].filePath
          })
        } else {
          that.showWarn('上传失败，' + data.msg)
        }
        
      },
      fail: function (err) {
        wx.hideLoading()
        that.showWarn('上传失败，' + err.statusCode)
      }
    })
  },

  /**
   * 数据提交
   */
  submit:function(form){
    let that = this
    let data = form.detail.value
    if (!data.enterprises){
      return that.showWarn('请输入企业名称')
    } else if (!data.number) {
      return that.showWarn('请输入企业注册号')
    } else if (!data.corporation) {
      return that.showWarn('请输入法人姓名')
    } else if (!data.identity_card) {
      return that.showWarn('请输入法人身份证')
    } else if (!this.data.cardPhoto) {
      return that.showWarn('请上传法人手持身份证头部照')
    } else if (!this.data.halfPhoto) {
      return that.showWarn('请上传法人半身照')
    } 
    wx.showLoading({
      title: '正在提交',
    })
    data.token = app.token
    data.business_id = app.id
    data.top_img = this.data.cardPhoto
    data.body_img = this.data.halfPhoto
    wx.request({
      url: app.API_ROOT +'business/senior',
      method:'post',
      data:data,
      success:function(res){
        if(res.data.error == 0){
          wx.navigateBack()
        } else {
          that.showWarn(res.msg)
        }
      },
      fail: function(err){
        that.showWarn('提交失败，code：'+err.statusCode)
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