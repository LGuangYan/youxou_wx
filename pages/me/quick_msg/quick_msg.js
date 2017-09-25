// quick_msg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quickMessageList: [],
    editingMessageList: [],
  },

  /**
  * 输入快捷回复
  */
  bindMessageInput: function (e) {
    let arr = this.data.editingMessageList
    let index = e.currentTarget.dataset.idx
    arr[index].text = e.detail.value
    this.setData({
      editingMessageList: arr
    })
  },

  /**
   * 显示删除按钮
   */
  bindDelTap: function (e) {
    this.setData({
      ['editingMessageList[' + e.currentTarget.dataset.idx + '].showDel']: true
    })
  },

  /**
   * 隐藏删除按钮
   */
  hideDelButton: function (e) {
    this.setData({
      ['editingMessageList[' + e.currentTarget.dataset.idx + '].showDel']: false
    })
  },

  /**
   * 删除快捷消息
   */
  deleteMessage: function (e) {
    let arr = this.data.editingMessageList
    let index = e.currentTarget.dataset.idx
    arr.splice(index, 1)
    this.setData({
      editingMessageList: arr
    })
  },

  /**
   * 添加新快捷消息
   */
  addNewMessage: function () {
    let arr = this.data.editingMessageList
    arr.push({ text: '' })
    this.setData({
      editingMessageList: arr
    })
  },

  /**
   * 编辑提交
   */
  editSubmit: function (e) {
    let that = this
    if (e.currentTarget.dataset.type == 'submit') {
      let list = this.data.editingMessageList
      wx.setStorage({
        key: 'quickMessageList',
        data: list,
        success: function () {
          wx.navigateBack()
        }
      })
    } else {
      wx.navigateBack()
    }
  },

  /**
   * 获取快捷回复
   */
  getLocalMessage: function () {
    let that = this
    wx.getStorage({
      key: 'quickMessageList',
      success: function (res) {
        that.setData({
          quickMessageList: res.data
        })
      },
      fail: function () {
        that.setData({
          quickMessageList: [
            {
              text: '我已经看了你的简历，可以详细聊聊。'
            },
            {
              text: '看了你的简历，想跟你了解一些更多具体情况。'
            },
            {
              text: '你符合我们要求，什么时候可以过来面试？'
            }
          ]
        })
      },
      complete:function(){
        that.setData({
          editingMessageList: that.data.quickMessageList
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocalMessage()
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