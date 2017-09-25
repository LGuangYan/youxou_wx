// feedback_detail.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedback_id:'',
    info:{},
    avatar:''
  },

  /**
   * 获取数据
   */
  getInfo:function(){
    let that = this
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: app.API_ROOT + 'feedback/detail',
      data:{
        token:app.token,
        feedback_id: this.data.feedback_id
      },
      success:function(res){
        if(res.data.error == 0){
          that.setData({
            info: res.data.data
          })
        } else {
          that.setData({
            warn:'获取数据失败，'+res.data.msg
          })
        }
      },
      fail:function(){
        that.setData({
          warn: '获取数据失败，code' + res.statusCode
        })
      },
      complete:function(){
        wx.hideLoading()
      }
    })
  },

  /**
   * 显示大图
   */
  showImage: function(e){
    let arr = []
    this.data.info.feedbackImg.forEach(item => {
      arr.push(item.filePath)
    })
    wx.previewImage({
      current: arr[e.currentTarget.dataset.idx],
      urls: arr
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      feedback_id:options.id,
      avatar: app.userInfo.detail.logo
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
    this.getInfo()
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