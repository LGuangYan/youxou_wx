// remind.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      wx_remind:false,
      dx_remind:false,
      email_remind:false,
      setting_id:0
    }
  },

  /**
   * 设置更改
   */
  optionChange:function(e){
    let name = e.currentTarget.dataset.name
    let value = e.detail.value
    let that = this
    this.setData({
      [name]:value
    })
    wx.request({
      url: app.API_ROOT + 'appsetting/update',
      method:'post',
      data:{
        token:app.token,
        setting_id: this.data.setting_id ,
        [name]:+value
      },
      success:function(res){
        if(res.data.error!=0){
          that.getOption()
        }
      }
    })
  },

  /**
   * 获取设置
   */
  getOption:function(){
    let that = this
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: app.API_ROOT + 'appsetting/view',
      data: {
        token: app.token,
        company_uid: app.uid
      },
      success: function (res) {
        that.setData({
          setting_id: res.data.data.setting_id,
          wx_remind: !!+res.data.data.wx_remind,
          dx_remind: !!+res.data.data.dx_remind,
          email_remind: !!+res.data.data.email_remind,
        })
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
    this.getOption()
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