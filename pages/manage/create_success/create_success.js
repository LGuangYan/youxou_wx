// create_success.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area:'',
    count:0,
    education:0,
    experience:0,
    job:'',
    city:''
  },

  /**
   * 瞅瞅有谁适合
   */
  lookonelook: function(){
    app.resumeFilter = {
      preset:1,
      education: this.data.education,
      experience: this.data.experience,
      job: this.data.job,
      city: this.data.city,
      cityName: this.data.area 
    }
    wx.switchTab({
      url: '/pages/main/candidate_list/candidate_list'
    })
  },


  /**
   * 点击取消
   */
  bindCancelTap:function(){
    wx.switchTab({
      url: '/pages/manage/manage_index/manage_index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      count: options.count,
      education: options.education,
      experience:options.experience,
      job:options.job,
      area:options.area,
      city: options.city
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