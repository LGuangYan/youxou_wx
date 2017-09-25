// feedback_history.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedbackList:[],
    currentPage:0,
    maxPage:0,
    total:0
  },

  /**
   * 获取列表
   */
  getList:function(){
    let that = this
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: app.API_ROOT + 'feedback/view',
      data: {
        token:app.token,
        user_id: app.uid,
        role: 2,
        page: that.data.currentPage + 1
      },
      success: function(res){
        if (that.data.currentPage && 0){
          let arr = that.data.feedbackList
          arr = arr.concat(res.data.data.list)
          that.setData({
            maxPage: res.data.data.page_count,
            total: res.data.data.count,
            currentPage: that.data.currentPage + 1,
            feedbackList:arr
          })
        } else {
          that.setData({
            maxPage: res.data.data.page_count,
            total: res.data.data.count,
            currentPage: that.data.currentPage + 1,
            feedbackList: res.data.data.list
          })
        }
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
    this.setData({
      currentPage:0
    })
    this.getList()
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