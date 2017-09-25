// doudou.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme_id:'',

    chatList:[],

    getNewLoading:false,

    mark: 'mark',
    quickMessageShowed:false,

    inputValue:'',

    intervalTimer:null,

    warn:'',
    warnTimer:null
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
   * 切换
   */
  showQuickMessage: function(){
    this.setData({
      quickMessageShowed: !this.data.quickMessageShowed
    })
  },

  /**
   * 跳到底部
   */
  scrollToBottom: function () {
    this.setData({
      mark: 'mark'
    })
  },

  /**
   * 首次获取聊天详情
   */
  getChatList: function(){
    if (this.data.getNewLoading) return
    // wx.showLoading({
    //   title: '正在获取详情',
    // })
    let that = this
    that.setData({
      getNewLoading:true
    })
    wx.request({
      url: app.API_ROOT + 'chat/view',
      data:{
        token:app.token,
        theme_id: this.data.theme_id
      },
      success:function(res){
        if(res.data.error == 0){
          that.setData({
            chatList: res.data.data.chats
          })
          that.scrollToBottom()
        } else {
          that.showWarn(res.data.msg)
        }
      },
      fail: function(err){
        that.showWarn('网络错误' + err.statusCode)
      },
      complete:function(){
        that.setData({
          getNewLoading: false
        })
        // wx.hideLoading()
      }
    })
  },

  /**
 * 刷新已读未读
 */
  // getChatStatus: function () {
  //   if (this.data.getNewLoading) return
  //   let that = this
  //   this.setData({
  //     getNewLoading: true
  //   })
  //   let id = ""
  //   let arr = []
  //   for (let item of this.data.chatList) {
  //     if (item.is_read == 0) {
  //       break;
  //     }
  //     id = item.chat_id
  //     arr.push(item)
  //   }
  //   let lefLength = this.data.chatList.length - arr
  //   wx.request({
  //     url: app.API_ROOT + 'interview/chatdetail',
  //     data: {
  //       token: app.token,
  //       job_id: that.data.jobId,
  //       user_id: that.data.userId,
  //       chat_id: id,
  //       pull_way: 1
  //     },
  //     success: function (res) {
  //       let list = that.data.chatList
  //       let newList = res.data.data.chats
  //       that.setData({
  //         baseInfo: res.data.data.userInfo,
  //         chatList: arr.concat(res.data.data.chats),
  //         myId: res.data.data.business_id,
  //         myAvatar: res.data.data.businessInfo.logo_url,
  //         oppAvatar: res.data.data.userInfo.header_url
  //       })
  //       if (res.data.data.chats.length > lefLength) {
  //         that.scrollToBottom()
  //       }
  //     },
  //     complete: function () {
  //       that.setData({
  //         getNewLoading: false
  //       })
  //     }
  //   })
  // },


  /**
   * 获取新消息
   */
  getNewChat: function(){
    if (this.data.getNewLoading) return
    this.setData({
      getNewLoading: true
    })
    let that = this
    let list = this.data.chatList
    wx.request({
      url: app.API_ROOT + 'chat/view',
      data: {
        token: app.token,
        theme_id: this.data.theme_id,
        chat_id: list[list.length - 1].chat_id,
        pull_way: 1
      },
      success: function (res) {
        let newList = res.data.data.chats || []
        that.setData({
          chatList: list.concat(newList),
        })
        if (newList.length) {
          that.scrollToBottom()
        }

      },
      complete: function () {
        that.setData({
          getNewLoading: false
        })
      }
    })
  },

  /**
   * 发送消息
   */
  sendMessage: function(e){
    let that = this
    this.setData({
      getNewLoading: true
    })
    wx.request({
      url: app.API_ROOT + 'chat/create',
      method:'post',
      data: {
        token: app.token,
        business_id:app.id,
        theme_id: this.data.theme_id,
        type:1,
        receive_id:1,
        receive_role:3,
        content: e.detail.value
      },
      success: function () {
        that.setData({
          getNewLoading: false
        })
        that.getChatList()
      }
    })
    this.setData({
      inputValue: ''
    })
  },

  setGetListInterval:function(){
    let that = this
    let intervalTimer = setInterval(function(){
      that.getNewChat()
    },3000)
    that.setData({ intervalTimer})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      theme_id: options.theme_id
    })
    this.scrollToBottom()
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
    wx.setNavigationBarTitle({
      title:'有豆小助手'
    })
    this.getChatList()
    this.setGetListInterval()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.intervalTimer)
    console.log('clear')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.intervalTimer)
    console.log('clear')
    
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