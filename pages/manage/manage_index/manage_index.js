// manage_index.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgRoot: '',
    tabs: ["职位管理", "招聘管理"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderWidth: 0,
    sliderLeft: 0,

    jobLoading: false,
    jobList: [],
    jobCurrentPage: 0,
    jobMaxPage: 0,
    jobTotal: 0,

    candidateLoading: false,
    candidateList: [],
    candidateCurrentPage: 0,
    candidateMaxPage: 0,
    candidateStatus: '1',
    candidateTotal: 0,

    warn: ''
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },


  /**
   * 获取职位列表
   */
  getJobList: function () {
    let that = this
    if (this.data.jobLoading || this.data.jobCurrentPage != 0 && this.data.jobCurrentPage >= this.data.jobMaxPage) return
    this.setData({
      jobLoading: true,
      jobCurrentPage: ++that.data.jobCurrentPage
    })
    wx.request({
      url: app.API_ROOT + 'businessjob/view',
      data: {
        business_id: app.id,
        token: app.token,
        page: that.data.jobCurrentPage
      },
      method: 'post',
      success: function (res) {
        if (res.data.error == 0) {
          let list = that.data.jobList
          if (that.data.jobCurrentPage == 1) {
            list = res.data.data.list ? res.data.data.list : []
          } else {
            list = res.data.data.list ? list.concat(res.data.data.list) : list
          }
          that.setData({
            jobList: list,
            jobTotal: res.data.data.count,
            jobMaxPage: res.data.data.page_count
          })
        } else {
          that.setData({
            warn: '获取职位列表失败,' + res.data.msg + '，code' + res.statusCode
          })
          setTimeout(function () {
            that.setData({
              warn: ''
            })
          }, 1500)
        }
      },
      complete: function () {
        that.setData({
          jobLoading: false
        })
      }

    })
  },

  /**
   * 获取求职者列表
   */
  getCandidateList: function () {
    if (this.data.candidateLoading || this.data.candidateCurrentPage != 0 && this.data.candidateCurrentPage >= this.data.candidateMaxPage) return
    let that = this
    this.setData({
      candidateLoading: true,
      candidateCurrentPage: ++that.data.candidateCurrentPage
    })
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: app.API_ROOT + 'nearby/jobhunter',
      data: {
        business_id: app.id,
        token: app.token,
        status: that.data.candidateStatus,
        page: that.data.candidateCurrentPage
      },
      success: function (res) {
        if (res.data && res.data.error == 0) {
          let list = that.data.candidateList
          if (that.data.candidateCurrentPage == 1) {
            list = res.data.data.list ? res.data.data.list : []
          } else {
            list = res.data.data.list ? list.concat(res.data.data.list) : list
          }
          that.setData({
            candidateList: list,
            candidateTotal: res.data.data.count,
            candidateMaxPage: res.data.data.page_count
          })
        } else {
          that.setData({
            warn: '获取求职者列表失败,' + res.data.msg + '，code' + res.statusCode
          })
          setTimeout(function () {
            that.setData({
              warn: ''
            })
          }, 1500)
        }
      },
      complete: function () {
        that.setData({
          candidateLoading: false
        })
        wx.hideLoading()
      }
    })
  },

  /**
   * 变更求职者状态
   */
  changeCandidateStatus: function (e) {
    let content = ''
    switch (this.data.candidateStatus) {
      case '1':
        content = '当前用户为投递状态，是否接受投递并邀约面试？';
        break;
      case '2':
        content = '当前用户为已邀约状态，是否通过面试并发放offer？';
        break;
      case '3':
        content = '';
        break;
      case '4':
        content = '当前用户为已offer状态，是否已经入职？';
        break;
    }
    wx.showModal({
      title: '变更状态',
      content: content,
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          wx.request({
            url: app.API_ROOT + 'invitation/update',
            method: 'post',
            data: {
              user_id: e.currentTarget.dataset.uid
            }
          })
        } else {
          console.log('用户点击辅助操作')
        }
      }
    });
  },

  /**
   * 求职者筛选条件变化
   */
  candidateFilterChange: function (e) {
    this.setData({
      candidateStatus: e.currentTarget.dataset.status,
      candidateCurrentPage: 0
    })
    this.getCandidateList();
  },

  /**
   * 置顶职位
   */
  moveToTop: function (e) {

  },

  /**
   * 更改岗位状态
   */
  changeJobStatus: function (e) {
    let status = e.currentTarget.dataset.status
    let that = this
    wx.request({
      url: app.API_ROOT + 'businessjob/update',
      method: 'post',
      data: {
        token: app.token,
        business_id: app.id,
        job_id: e.currentTarget.dataset.jobid,
        status: status == 1 ? 2 : 1
      },
      success: function () {
        that.setData({
          jobCurrentPage:0
        })
        that.getJobList()
      }
    })
  },

  /**
   * 
   */
  shareJob: function (e) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        let sliderWidth = res.windowWidth / that.data.tabs.length
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          sliderWidth: sliderWidth,
          imgRoot: app.IMG_ROOT
        });
      }
    });
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
    this.setData({
      jobCurrentPage:0,
      candidateCurrentPage:0
    })
    this.getJobList()
    this.getCandidateList()
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