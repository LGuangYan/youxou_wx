// about_me.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    bgImage:'',
    nickName:'',
    companyName:'',
    infoShowed:false,
    info:{}
  },


  /**
   * 点击查看头像大图
   */
  bindAvatarTap: function () {
    wx.previewImage({
      urls: [this.data.avatar || '/assets/default/头像.png'],
    })
  },

  /**
   * 显示主页
   */
  showCompanyInfo: function(){
    this.setData({
      infoShowed: !this.data.infoShowed
    })
  },

  /**
   * 显示设置
   */
  showOption: function(){
    wx.navigateTo({
      url: '/pages/me/option/option',
    })
  },

  /**显示图片 */
  showBigImage: function(e){
    let arr = []
    this.data.info.businfo_img.forEach(item=> {
      arr.push(item.file_path)
    })
    wx.previewImage({
      current: arr[e.currentTarget.dataset.idx],
      urls: arr
    })
  },

  /**
   * 初始化数据
   */
  initData:function(){
    this.setData({
      info: app.userInfo.detail,
      avatar: app.userInfo.detail.logo,
      nickName: app.userInfo.detail.user_person,
      // nickName: app.userInfo.base.nickName,
      bgImage: app.userInfo.detail.businfo_img ? app.userInfo.detail.businfo_img[0].file_path : '',
      companyName: app.userInfo.detail.business_name
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
    this.initData()
    app.updateCompanyInfo(this.initData)
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