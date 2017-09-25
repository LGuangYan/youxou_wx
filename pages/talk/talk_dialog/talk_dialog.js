// talk_dialog.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobId:'',
    userId:'',
    themeId:'',

    mark: '',
    contentPaddingBottom: '110rpx', 

    quickMessageShowed: false,    //快捷回复
    messageEditorShowed: false,   //快捷回复编辑页
    controlPageShowed:false,      //控制流程页
    controlType:'',                 
    controlStep:1,
    inviteForm:{},

    inputValue:'',

    quickMessageList: [],
    editingMessageList: [],

    upperLoading:false,     //上拉获取旧消息
    getNewLoading:false,
    myId:'',
    oppId:'',
    baseInfo:{},
    chatList:[],
    myAvatar:'',
    oppAvatar:'',
    address:'',
    longitude:'',
    latitude:'',

    nowDate:'',
    nowTime:'',

    firstContacts:'',
    firstTelephone:'',

    warn:'',
    warnTimer:null
  },

  /**
   * 获取当前时间
   */
  getNowTime: function(){
    let date = new Date()
    let nowDate = date.getFullYear() + '-' + (+date.getMonth() + 1) + '-' + date.getDate()
    let nowTime = (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + date.getMinutes()
    this.setData({
      nowDate,
      nowTime
    })
  },

  /**表单处理 */
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindAddressChange: function(e) {
    let that = this
    console.log(e)
    // if(!this.data.address) {
      wx.chooseLocation({
        success: function(res){
          console.log(res)
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude,
            address: res.address
          })
        }
      })
    // }
  },

  /**
   * 警告提示
   */
  showWarn:function(title){
    let that = this
    clearTimeout(this.data.warnTimer)
    let warnTimer = setTimeout(function(){
      that.setData({
        warn: ''
      })
    },1500)
    this.setData({
      warn:title,
      warnTimer
    })
  },

  /**
   * 面试邀约按钮
   */
  bindInviteTap: function(){
    this.setData({
      controlPageShowed: true,
      controlType:'invite',
      controlStep: 1
    })
  },

  /**
   * 发放offer按钮
   */
  bindOfferTap: function(){
    this.setData({
      controlPageShowed: true,
      controlType: 'offer',
      controlStep: 1
    })
  },

  /**
   * 确定面试邀约
   */
  inviteStepTwo: function (){
    this.setData({
      controlType: 'invite',
      controlStep: 2,
      // address: ''
    })
  },

  /**
   * 确定发放offer
   */
  offerStepTwo: function () {
    this.setData({
      controlType: 'offer',
      controlStep: 2,
      // address:''
    })
  },
  /**
   * 面试未通过
   */
  offerStepThree: function () {
    this.setData({
      controlType: 'offer',
      controlStep: 3
    })
  },
  /**
   * 邀请面试提交
   */
  inviteRequest: function(e){
    let that = this
    let form = e.detail.value
    if (!form.contacts){
      return this.showWarn('请输入联系人')
    } else if (!form.telephone){
      return this.showWarn('请输入联系人电话')
    } else if (!form.date) {
      return this.showWarn('请输入面试日期')
    } else if (!form.time) {
      return this.showWarn('请输入面试时间')
    } else if (!form.address) {
      return this.showWarn('请输入面试地址')
    }
    wx.request({
      url: app.API_ROOT + 'interview/create',
      method:'post',
      data:{
        token:app.token,
        business_id:app.id,
        user_id: that.data.userId,
        job_id:that.data.jobId,
        status:3,
        contacts: form.contacts,
        telephone: form.telephone,
        address: form.address,
        interview_time:form.date+ ' ' + form.time,
        user_name:that.data.baseInfo.name,
        longitude: that.data.longitude,
        latitude: that.data.latitude
      },
      success: function(res){
        console.log(res)
        if(res.data.error == 0){
          that.setData({
            controlPageShowed:false
          })
        } else {
          that.showWarn('操作失败,' + res.data.msg)
        }
      },
      fail: function (err) {
        that.showWarn('操作失败,' + err.statusCode)
      }
    })
  },

  /**
   * offer发放提交
   */
  offerRequest: function(e){
    let that = this
    let form = e.detail.value
    if (!form.contacts) {
      return this.showWarn('请输入联系人')
    } else if (!form.telephone) {
      return this.showWarn('请输入联系人电话')
    } else if (!form.date) {
      return this.showWarn('请输入职日期')
    } else if (!form.time) {
      return this.showWarn('请输入入职时间')
    } else if (!form.address) {
      return this.showWarn('请输入入职地址')
    }
    wx.request({
      url: app.API_ROOT + 'interview/create',
      method: 'post',
      data: {
        token: app.token,
        business_id: app.id,
        user_id: that.data.userId,
        job_id: that.data.jobId,
        status: 4,
        contacts: form.contacts,
        telephone: form.telephone,
        address: form.address,
        interview_time: form.date + ' ' + form.time,
        user_name: that.data.baseInfo.name,
        longitude: that.data.longitude,
        latitude: that.data.latitude
      },
      success: function (res) {
        if (res.data.error == 0) {
          that.setData({
            controlPageShowed: false
          })
        } else {
          that.showWarn('操作失败,'+res.data.msg)
        }
      },
      fail: function (err) {
        that.showWarn('操作失败,' + err.statusCode)
      }
    })
  },

  /**
   * 面试未通过提交
   */
  refuseRequest: function(e){
    let that = this
    let form = e.detail.value
    if (!form.remark) {
      return this.showWarn('请输入拒绝理由')
    }
    wx.request({
      url: app.API_ROOT + 'interview/create',
      method: 'post',
      data: {
        token: app.token,
        business_id: app.id,
        user_id: that.data.userId,
        job_id: that.data.jobId,
        status: 5,
        remark: form.remark,
        user_name: that.data.baseInfo.name
      },
      success: function (res) {
        if (res.data.error == 0) {
          that.setData({
            controlPageShowed: false
          })
        } else {
          that.showWarn('操作失败,' + res.data.msg)
        }
      },
      fail:function(err){
        that.showWarn('操作失败,' + err.statusCode)
      }
    })
  },


  /**
   * 取消按钮
   */
  cancelControlPage: function(){
    this.setData({
      controlPageShowed: false,
      time:"",
      date:""
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
   * 聊天内容滑动
   */
  bindContentScroll: function(){
    
  },
  /**
   * 点击聊天内容
   */
  bindContentScrollTap: function(){
    this.setData({
      quickMessageShowed: false
    })
  },

  /**
   * 显示快捷回复
   */
  showQuickMessage: function () {
    if (this.data.quickMessageShowed) {
      this.setData({
        quickMessageShowed: false
      })
      this.scrollToBottom()
    } else {
      this.setData({
        quickMessageShowed: true
      })
      this.scrollToBottom()
    }
  },

  /**
   * 重置padding
   */
  resetContentPaddingBottom: function(){
    this.setData({
      contentPaddingBottom: this.data.quickMessageList.length * 70 + 180 + 'rpx'
    })
  },

  /**
   * 显示编辑快捷回复
   */
  showMessageEditor: function () {
    this.setData({
      messageEditorShowed: true,
      editingMessageList: JSON.parse(JSON.stringify(this.data.quickMessageList))
    })
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
          that.setData({
            messageEditorShowed: false,
            quickMessageList: JSON.parse(JSON.stringify(list))
          })
          that.resetContentPaddingBottom()
          that.scrollToBottom()
        }
      })
    } else {
      this.setData({
        messageEditorShowed: false
      })
    }
  },

  /**
   * 首次获取聊天列表
   */
  getChatDetail: function(callback){
    wx.showLoading({
      title: '正在加载',
    })
    let that = this
    wx.request({
      url: app.API_ROOT +'interview/chatdetail',
      data:{
        token:app.token,
        job_id:that.data.jobId,
        user_id:that.data.userId
      },
      success: function(res){
        that.setData({
          baseInfo: res.data.data.userInfo,
          chatList: res.data.data.chats,
          // myId: res.data.data.business_id,
          oppId: res.data.data.userInfo.user_id,
          // myAvatar: res.data.data.businessInfo.logo_url,
          oppAvatar: res.data.data.userInfo.header_url,
          themeId: res.data.data.theme_id
        })
        that.getChatInterval()
        that.scrollToBottom()
        callback && callback()
      },
      fail: function (err) {
        that.showWarn('加载失败,' + err.statusCode)
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  /**
   * 获取新消息
   */
  getNewChats: function () {
    if(this.data.getNewLoading) return
    this.setData({
      getNewLoading:true
    })
    let that = this
    wx.request({
      url: app.API_ROOT + 'interview/chatdetail',
      data: {
        token: app.token,
        job_id: that.data.jobId,
        user_id: that.data.userId,
        chat_id: that.data.chatList.length ? that.data.chatList[that.data.chatList.length - 1].chat_id : '',
        pull_way: that.data.chatList.length ? 1 : ''
      },
      success: function (res) {
        let list = that.data.chatList
        let newList = res.data.data.chats
        // list.forEach(item => {
        //   if (item.is_read == -1) {
        //     newList.forEach(newItem => {
        //     })
        //   }
        // })
        that.setData({
          baseInfo: res.data.data.userInfo,
          chatList: that.data.chatList.concat(res.data.data.chats),
          // myId: res.data.data.business_id,
          // myAvatar: res.data.data.businessInfo.logo_url,
          oppAvatar: res.data.data.userInfo.header_url
        })
        if (res.data.data.chats.length) {
          that.scrollToBottom()
        }

      },
      complete:function(){
        that.setData({
          getNewLoading:false
        })
      }
    })
  },

  /**
   * 刷新已读未读
   */
  getChatStatus: function(){
    if (this.data.getNewLoading) return
    let that = this
    this.setData({
      getNewLoading: true
    })
    let id = ""
    let arr = []
    for(let item of this.data.chatList){
      if (item.is_read == 0) {
        break;
      }
      id = item.chat_id
      arr.push(item)
    }
    let lefLength = this.data.chatList.length - arr
    wx.request({
      url: app.API_ROOT + 'interview/chatdetail',
      data: {
        token: app.token,
        job_id: that.data.jobId,
        user_id: that.data.userId,
        chat_id: id,
        pull_way: id ? 1 :''
      },
      success: function (res) {
        let list = that.data.chatList
        let newList = res.data.data.chats
        that.setData({
          baseInfo: res.data.data.userInfo,
          chatList: arr.concat(res.data.data.chats),
          // myId: res.data.data.business_id,
          // myAvatar: res.data.data.businessInfo.logo_url,
          oppAvatar: res.data.data.userInfo.header_url
        })
        if (res.data.data.chats.length > lefLength) {
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
   * 刷新列表
   */
  getChatInterval: function(){
    let that = this
    let timer = setInterval(function(){
      that.getChatStatus()
    },2000)
    this.setData({
      timer
    })
  },

  /**
   * 清除定时
   */
  clearChatInterval: function(){
    clearInterval(this.data.timer)
  },

  /**
   * 获取旧消息
   */
  getOldChat: function(e){
    let that = this
    let firstId = that.data.chatList[0].chat_id
    if (!that.data.upperLoading){
      this.setData({
        upperLoading: true
      })
      wx.request({
        url: app.API_ROOT + 'interview/chatdetail',
        data: {
          token: app.token,
          job_id: that.data.jobId,
          user_id: that.data.userId,
          chat_id: firstId,
          pull_way: 0
        },
        success: function (res) {
          that.setData({
            baseInfo: res.data.data.userInfo,
            chatList: res.data.data.chats.concat(that.data.chatList),
            // myId: res.data.data.business_id,
            // myAvatar: res.data.data.businessInfo.logo_url,
            oppAvatar: res.data.data.userInfo.header_url,
            upperLoading:false
          })
          that.setData({
            mark: 'chat' + firstId
          })
        }
      })
    }
    
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
      data:{
        token: app.token,
        business_id:app.id,
        theme_id: this.data.themeId,
        type:1,
        content: e.detail.value,
        receive_id: this.data.oppId,
        receive_role:1
      },
      success:function(){
        that.setData({
          getNewLoading: false
        })
        that.getNewChats()
      }
    })
    this.setData({
      inputValue:''
    })
  },

  /**
   * 发送快捷回复
   */
  sendQuickMessage: function(e){
    let that = this
    this.showQuickMessage()
    wx.request({
      url: app.API_ROOT + 'chat/create',
      method: 'post',
      data: {
        token: app.token,
        business_id: app.id,
        theme_id: this.data.themeId,
        type: 1,
        content: e.currentTarget.dataset.text,
        receive_id: this.data.oppId,
        receive_role: 1
      },
      success: function () {
        that.getNewChats()
      }
    })
    // this.setData({
    //   inputValue: ''
    // })
  },

  /**
   * 获取快捷回复
   */
  getLocalMessage: function(){
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
      complete: function () {
        that.resetContentPaddingBottom()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      jobId: options.job_id,
      userId: options.uid,
      myId:app.uid,
      firstContacts: app.userInfo.detail.user_person,
      firstTelephone: app.userInfo.detail.user_number,
      address: app.userInfo.detail.address,
      latitude: app.userInfo.detail.latitude,
      longitude: app.userInfo.detail.longitude
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
    let that = this
    this.getChatDetail(function () {
      that.scrollToBottom()
    })
    this.getLocalMessage()
    this.getNowTime()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.clearChatInterval()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.clearChatInterval()
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