// resume_detail.js
// import moment from '../../../utils/moment.min.js'
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resume_id:'',
    introDetailShowed: false,
    info:{},
    imgRoot:'',
    jobList:[],
    jobNameList:[],
    jobListShow:false,
    errorTips:'',
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
   * 点击查看头像大图
   */
  bindAvatarTap: function(){
    wx.previewImage({
      urls: [this.data.info.resume.header_url ? this.data.info.resume.header_url : '/assets/default/头像.png'],
    })
  },

  /**
   * 展开自我描述详情
   */
  toggleIntroDetail: function(){
    this.setData({
      introDetailShowed: !this.data.introDetailShowed
    })
  },


  /**
   * 显示职位列表
   */
  showJobList: function(){
    let that = this
    if (that.data.jobNameList.length == 0 || !that.data.jobNameList) {
      // return that.setData({
      //   errorTips: '请先发布职位'
      // })
      wx.showModal({
        title: '提示',
        content: '您还没有发布职位，是否前往发布？',
        success:function(res){
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/manage/create_job/create_job',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      that.setData({
        jobListShow: true,
        errorTips: ''
      })
    }
  },

  /**
   * 隐藏职位列表
   */
  hideJobList: function(){
    this.setData({
      jobListShow: false
    })
  },

  /**
   * 邀约面试
   */
  bindInviteTap: function(e){
    let job_id = e.currentTarget.dataset.jobid
    let that = this
    wx.request({
      url: app.API_ROOT + 'invitation/create',
      method:'post',
      data:{
        token:app.token,
        status:2,
        jober_id: this.data.info.resume.user_id,
        resume_id: this.data.info.resume.resume_id,
        job_id: job_id
      },
      success:function(res){
        if(res.data.error == 0){
          wx.redirectTo({
            url: '/pages/talk/talk_dialog/talk_dialog?job_id=' + job_id + '&uid=' + res.data.data.chatTheme.user_id
          })
        } else {
          that.showWarn(res.data.msg)
        }
      }
    })
  },

  /**
   * 获取简历详情
   */
  getDetail: function(){
    let that = this
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: app.API_ROOT + 'business/user_detail',
      data:{
        token:app.token,
        resume_id: that.data.resume_id
        // resume_id: 1
      },
      success: function(res){
        if(res.data&&res.data.error){
          that.setData({
            info: res.data.data
          })
          //处理头像
          let info = that.data.info
          if (!info.resume.header_url){
            info.resume.header_url = '/assets/default/头像.png'
            that.setData({
              info
            })
          }
        } else {
          that.showWarn(res.data.msg)
        }
      },
      fail:function(err){
        that.showWarn('网络错误，code'+err.statusCode)
      },
      complete: function(){
        wx.hideLoading()
      }
    })
  },

  /**
   * 获取职位列表
   */
  getJobList: function(){
    let that = this
    wx.request({
      url: app.API_ROOT + 'businessjob/shelves',
      data: {
        id: app.id,
        token: app.token
      },
      success: function(res){
        let list = res.data.data
        let arr = []
        list.forEach(item => {
          arr.push(item.job_name)
        })
        that.setData({
          jobList: list,
          jobNameList: arr
        })
        console.log()
        if (that.data.jobNameList.length == 0 || !that.data.jobNameList) {
          // return that.setData({
          //   errorTips: '请先发布职位'
          // })
        } else {
          return that.setData({
            errorTips: ''
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      resume_id: options.id,
      imgRoot:app.IMG_ROOT
    })
    this.getDetail()
    this.getJobList()
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