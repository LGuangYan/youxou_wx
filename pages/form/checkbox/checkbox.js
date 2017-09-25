// checkbox.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    checkboxItems: [],
    type: '',
    name: '',
    param: '',
    value: '',
    showNewItem: false,
    newItem: '',
    checkboxUrl: {
      job: 'businessjob/info',
      company: 'business/businfo'
    },
    result:[],

    warn: '',
    warnTimer: null
  },

  /**
   * 警告提示
   */
  showWarn: function (title) {
    let that = this
    clearTimeout(this.data.warnTimer)
    let warnTimer = setTimeout(function () {
      that.setData({
        warn: ''
      })
    }, 1500)
    this.setData({
      warn: title,
      warnTimer
    })
  },

  /**
 * 获取选项
 */
  getCheckboxItems: function (callback) {
    let that = this
    wx.request({
      url: app.API_ROOT + that.data.checkboxUrl[that.data.type],
      method: 'get',
      data: {
        token: app.token
      },
      success: function (res) {
        if(res.data.error == 0){
          that.setData({
            checkboxItems: res.data.data[that.data.param]
          })
        } else {
          that.showWarn(res.data.msg)
        }
      },
      fail:function(err){
        that.showWarn('网络错误，code：'+err.statusCode)
      },
      complete: function(){
        callback && callback()
      }
    })
  },


  /**
   * 多选框变化
   */
  checkboxChange: function (e) {
    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    let arr = []
    let result = this.data.result
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          arr.push(checkboxItems[i].name)
          break;
        }
      }
    }
    result = arr
    this.setData({
      checkboxItems: checkboxItems,
      result
    });
  },

  /**
   * 自定义标签变化
   */
  newItemChange: function (e) {
    this.setData({
      newItem: e.detail.value
    })
  },


  /**
   * 添加选项
   */
  addItem: function () {
    this.setData({
      showNewItem: true
    })
  },

  /**
   * 添加选项提交
   */
  addItemSubmit: function () {
    let arr = this.data.checkboxItems
    arr.push({ value: this.data.checkboxItems.length, name: this.data.newItem, checked: true })


    let result = []
    for (let item of arr) {
      if (item.checked) {
        result.push(item.name)
      }
    }
    this.setData({
      checkboxItems: arr,
      showNewItem: false,
      result
    })
  },

  /**
   * 提交
   */
  submit: function () {
    let pages = getCurrentPages()
    pages[pages.length - 2].setData({
      ['form.' + this.data.param]: this.data.result,
      ['warn.'+this.data.param]: ''
    })
    wx.navigateBack()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      type: options.type,
      name: options.name,
      param: options.param,
      value: options.value
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.getCheckboxItems(function () {
      let value = that.data.value.split(',')
      that.setData({
        result: value
      })
      for (let item of value) {
        let flag = false
        for (let i = 0; i < that.data.checkboxItems.length; i++) {
          if (that.data.checkboxItems[i].name == item) {
            
            let arr = that.data.checkboxItems
            arr[i].checked = true
            that.setData({
              checkboxItems: arr
            })
            flag = true
          }
        }
        if (!flag && item) {
          let arr = that.data.checkboxItems
          arr.push({ value: that.data.checkboxItems.length, name: item, checked: true })
          that.setData({
            checkboxItems: arr
          })
        }
      }
      wx.hideLoading()
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