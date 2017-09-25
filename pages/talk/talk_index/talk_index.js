// talk_index.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doudou:{},
    chatList:[],
    loading:false,
    timer:null
  },
  /**
   * 获取列表
   */
  getList: function(callback){
    if(this.data.loading) return
    
    this.setData({
      loading:true
    })
    let that = this
    wx.request({
      url: app.API_ROOT + 'interview/chatlist',
      data: {
        business_id: app.id, 
        token: app.token
      },
      success: function(res){
        let arr = res.data.data
        let doudou = arr.splice(0,1)[0]
        that.setData({
          chatList: arr,
          doudou
        })
      },
      complete: function(){
        that.setData({
          loading: false
        })
        callback && callback()
      }
    })
  },

  /**
   * 定时器
   */
  setGetListInterval: function(){
    let that = this
    let timer = setInterval(function(){
      that.getList()
    },3000)
    this.setData({
      timer
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
    wx.showLoading({
      title: '正在加载',
    })
    this.getList(function(){
      wx.hideLoading()
    })
    this.setGetListInterval()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer)
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