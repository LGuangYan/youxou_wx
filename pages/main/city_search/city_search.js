// city_search.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    searchResult: '',
    currentCity: '',
    currentCityIndex: 0,
    hotCity: [],
    param: '',
    cityList: {}
  },


  /**
   * 搜索框输入
   */
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    if (e.detail.value) {
      this.getSearchResult(e.detail.value)
    }
  },

  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  /**
   * 获取城市搜索结果
   */
  getSearchResult: function (keyword) {
    let arr = []
    let cityList = this.data.cityList
    for (let key in cityList) {
      cityList[key].forEach(city => {
        if (city.name.indexOf(keyword) != -1 || city.name_en.indexOf(keyword) != -1) {
          arr.push(city)
        }
      })
    }
    this.setData({
      searchResult: arr
    })
  },

  /**
   * 选择城市
   */
  bindCityTap: function (e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
      [this.data.param]: e.currentTarget.dataset.city,
      [this.data.param + 'Index']: e.currentTarget.dataset.idx
    })
    wx.navigateBack()
  },

  /**
   * 重新定位
   */
  getLocalCity: function () {
    let that = this
    wx.showLoading({
      title: '正在定位',
    })
    wx.getLocation({
      success: function (location) {
        wx.request({
          url: app.API_ROOT + 'nearby/location',
          data: {
            token: app.token,
            id: app.id,
            latitude: location.latitude,
            longitude: location.longitude
          },
          success: function (res) {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]
            prevPage.setData({
              [that.data.param]: res.data.data.name,
              [that.data.param + 'Index']: res.data.data.value,
            })
            wx.hideLoading()
            wx.navigateBack()
          }
        })
      }
    })
  },

  /**
   * 获取城市列表
   */
  getCityList: function () {
    let that = this
    wx.request({
      url: app.API_ROOT + 'nearby/city',
      data: {
        token: app.token
      },
      success: function (res) {
        that.setData({
          hotCity: res.data.data.hot_city,
          cityList: res.data.data.areaall
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentCity: options.value,
      param: options.param,
      currentCityIndex: options.index
    })
    this.getCityList()
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