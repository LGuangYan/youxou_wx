// pages/form/job_info/job_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeType:'default',
    defaultList: [
      { 
        name: '工作时间',
        placehoder:'例：09:00-18:00' 
      }, 
      {
        name: '工作时长',
        placehoder: '例：8小时'  
      }, 
      {
        name: '是否双休',
        placehoder: '例：双休'
      }, 
      {
        name: '试用工资',
        placehoder: '例：80%'
      }, 
      {
        name: '薪酬水平',
        placehoder: '例：13月'
      },  
      {
        name: '试用时长',
        placehoder: '例：3个月'
      }, 
      {
        name: '实习生',
        placehoder: '例：不接受'
      }, 
      {
        name: '应届生',
        placehoder: '例：接受'
      }, 
    ],
    nameIndex:0,
    currentPlacehoder: '例：09:00-18:00',
    defaultContent:{
      name:'工作时间',
      value:''
    },
    customContent:{
      name:'',
      value:''
    },
    result:[]
  },

  /**
   * 预设项切换
   */
  nameChange: function(e){
    this.setData({
      nameIndex: e.detail.value,
      currentPlacehoder: this.data.defaultList[e.detail.value].placehoder,
      'defaultContent.name': this.data.defaultList[e.detail.value].name
    })
  },

  /**
   * 预设内容输入
   */
  defaultContentInput: function (e) {
    this.setData({
      'defaultContent.value': e.detail.value
    })
  },

  /**
   * 自定义项名输入
   */
  customNameInput: function (e) {
    this.setData({
      'customContent.name': e.detail.value
    })
  },

  /**
   * 自定义内容输入
   */
  customContentInput: function (e) {
    this.setData({
      'customContent.value': e.detail.value
    })
  },

  /**
   * 切换预设自定义
   */
  bindTypeTap: function(e){
    this.setData({
      activeType: e.currentTarget.dataset.type
    })
  },

  /**
   * 提交
   */
  submit: function(){
    let item = this.data.activeType == 'default' ? this.data.defaultContent : this.data.customContent
    if (item.name && item.value){
      let result = this.data.result
      result.push(item)
      let pages = getCurrentPages()
      pages[pages.length - 2].setData({
        'form.job_info': result
      })
      wx.navigateBack()
    }
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
    let pages = getCurrentPages()
    this.setData({
      result: pages[pages.length - 2].data.form.job_info
    })
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