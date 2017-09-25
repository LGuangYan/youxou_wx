// category.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    asideShow: false,
    categoryList: [],
    categoryIndex: [-1, 0, 0],
    form:{
      token:'',
      job_id:'',
      business_id:'',
      category:''
    }
  },

  /**
   * 收起侧边栏
   */
  hideMask: function () {
    this.setData({
      asideShow: false,
      categoryIndex: [-1, 0, 0]
    })
  },

  /**
   * 点击第一项
   */
  tapFirstItem: function (e) {
    let categoryList = this.data.categoryList
    let arr = []
    let data = app.jobRadio.category[e.currentTarget.dataset.idx].child
    data.forEach(item => {
      arr.push({
        name: item.name,
        value: item.value
      })
    })
    categoryList[1] = arr
    categoryList[2] = data[0].sub
    this.setData({
      asideShow: true,
      categoryIndex: [e.currentTarget.dataset.idx, 0, 0],
      categoryList
    })
  },

  /**
   * 点击第二项
   *  */
  tapSecondItem: function (e) {
    let index = e.currentTarget.dataset.idx
    let categoryList = this.data.categoryList
    let categoryIndex = this.data.categoryIndex
    let data = app.jobRadio.category[categoryIndex[0]].child
    categoryList[2] = data[index].sub
    categoryIndex[1] = index
    this.setData({
      categoryList,
      categoryIndex
    })
  },

  /**
   * 点击第三项
   */
  tapThirdItem: function (e) {
    let data = this.data.categoryList[2]
    let index = e.currentTarget.dataset.idx
    this.setData({
      'form.category': data[index].value
    })
    wx.request({
      url: app.API_ROOT + 'businessjob/update',
      method:'post',
      data: this.data.form,
      success:function(res){
        if(res.data.error == 0){
          wx.navigateBack()
        } else {
          console.log(res)
        }
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let arr = []
    app.jobRadio.category.forEach(item => {
      arr.push({
        name: item.name,
        value: item.value
      })
    })
    let categoryList = this.data.categoryList
    categoryList[0] = arr
    this.setData({
      categoryList,
      'form.token': app.token,
      'form.job_id': options.job_id,
      'form.business_id': app.id
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