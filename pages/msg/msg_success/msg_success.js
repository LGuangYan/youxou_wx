// msg_success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:0,
    title:'',
    msg:'',
    firstbtn:'',
    firsturl:'',
    firsttype:'switchTab',
    secondbtn:'',
    secondurl: '',
    secondtype: 'switchTab',
    timer:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'title': options.title,
      'time': options.time || 0,
      'msg': options.msg || '',
      'firstbtn': options.firstbtn,
      'firsturl': options.firsturl,
      'firsttype': options.firsttype,
      'secondbtn': options.secondbtn || '',
      'secondurl': options.secondurl || ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    let timer = setInterval(function(){
      if(that.data.time>0){
        that.setData({
          time: that.data.time - 1
        })
      } else {
        clearInterval(timer)
        wx.redirectTo({
          url: that.data.firsturl,
        })
        wx.switchTab({
          url: that.data.firsturl,
        })
      }
    },1000)
    this.setData({
      timer:timer
    })
  },

  firstTap: function() {
    clearInterval(this.data.timer)
    wx[this.data.firsttype]({
      url:this.data.firsturl
    })
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