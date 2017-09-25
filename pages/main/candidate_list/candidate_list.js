// candidate_list.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    currentPage: 0,
    maxPage: 0,
    total: 0,
    candidateList: [],
    imgRoot: '',
    city: '未知',
    cityIndex: 0,

    hotJobList: [],
    searchPageShowed: false,

    inputShowed: false,
    inputVal: "",

    filterPickerShow: false,
    sortList: [],
    sortIndex: 0,
    educationList: [],
    educationIndex: 0,
    expList: [],
    expIndex: 0,
    treatmentList: [],
    treatmentIndex: 0,
    activeName: '',
    activeList: [],
    activeIndex: 0,

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
   * 搜索框相关
   */
  showInput: function () {
    this.setData({
      inputShowed: true,
      searchPageShowed: true,
      filterPickerShow: false
    });
  },
  hideInput: function () {
    let value = this.data.inputVal
    if (value) {
      this.setData({
        searchPageShowed: false
      });
    } else {
      this.setData({
        inputVal: "",
        searchPageShowed: false,
        inputShowed: false
      });
    }

  },
  clearInput: function () {
    let pageShowed = this.data.searchPageShowed
    if (pageShowed) {
      this.setData({
        inputVal: ""
      });
    } else {
      this.setData({
        inputVal: "",
        inputShowed: false
      });
    }
    if (!this.data.searchPageShowed) {
      this.getNewList()
    }

  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
   * 筛选相关
   */

  bindShowFilterPicker: function (e) {
    let target = e.currentTarget.dataset.filter
    if (target === this.data.activeName && this.data.filterPickerShow === true) {
      return this.setData({
        filterPickerShow: false
      })
    }
    this.setData({
      activeName: target,
      activeList: this.data[target + 'List'],
      activeIndex: this.data[target + 'Index'],
      filterPickerShow: true
    })
  },
  /**
   * 点击遮罩
   */
  bindModalTap: function () {
    this.setData({
      filterPickerShow: false
    })
  },
  /**
   * 选择筛选选项
   */
  bindFilterChose: function (e) {
    this.setData({
      [this.data.activeName + 'Index']: e.currentTarget.dataset.value,
      filterPickerShow: false,
      currentPage: 0
    })
    this.getList()
  },


  hotJobTap: function (e) {
    this.setData({
      inputVal: e.currentTarget.dataset.job,
      searchPageShowed: false,
      inputShowed: true
    });
    this.getNewList();
  },


  /**
   * 滑动列表时执行
   */
  scrollList: function () {
    if (this.data.inputShowed) {
      this.hideInput()
    }
    // this.getList()
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.setData({
      currentPage: 0
    })
    this.getList(function () {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 获取列表
   */
  getList: function (callback, failCallback) {
    if (this.data.loading || this.data.currentPage != 0 && this.data.currentPage >= this.data.maxPage) return
    let value = this.data.inputVal

    wx.showLoading({
      title: '正在加载',
    })
    let that = this
    this.setData({
      currenPage: ++that.data.currentPage
    })
    let form = {
      token: app.token,
      business_id: app.id,
      page: that.data.currentPage,
      sort: that.data.sortIndex,
      exper: that.data.expIndex,
      treatment: that.data.treatmentIndex,
      education: that.data.educationIndex,
      longitude: app.longitude,
      latitude: app.latitude,
      city: that.data.cityIndex,
      job: that.data.inputVal
    }


    wx.request({
      url: app.API_ROOT + 'nearby/jobseeker',
      data: form,
      success: function (res) {
        let list = that.data.candidateList
        if (that.data.currentPage == 1) {
          list = res.data.data.list ? res.data.data.list : []
        } else {
          list = res.data.data.list ? list.concat(res.data.data.list) : list
        }

        that.setData({
          loading: false,
          total: res.data.data.count || 0,
          maxPage: res.data.data.page_count || 0,
          candidateList: list
        })
        typeof callback == 'function' && callback()
      },
      fail: function () {
        failCallback && failCallback()
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  /**
   * 获取新列表
   */
  getNewList: function () {
    this.setData({
      currentPage: 0
    })
    this.getList()
  },

  /**
   * 搜索
   */
  bindSearchTap: function(){
    this.setData({
      currentPage: 0,
      searchPageShowed:false
    })
    this.getList()
  },

  /**
   * 获取热招职位
   */
  getHotJobList: function () {
    let that = this;
    wx.request({
      url: app.API_ROOT + 'nearby/hotjob',
      data: {
        token: app.token
      },
      success: function (res) {
        if (res.data.error == 0) {
          that.setData({
            hotJobList: res.data.data.hotjob
          })
        }
      }
    })
  },

  /**
   * 获取城市
   */
  getLocalCity: function (callback) {

    wx.showLoading({
      title: '获取定位信息',
    })
    let that = this
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
            that.setData({
              city: res.data.data.name,
              cityIndex: res.data.data.value,
            })
            callback && callback()
          },
          complete: function () {
            wx.hideLoading()
          }
        })
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '正常使用需要授权有豆访问您的地理位置，请在右上角→关于有豆→右上角→设置→勾选“允许使用地理位置”',
          showCancel: false
        })
      }
    })

  },
  // test

  // getLocalCity: function (callback) {
  //   let that = this
  //   wx.getLocation({
  //     success: function (location) {
  //       wx.request({
  //         url: app.API_ROOT + 'nearby/location',
  //         data: {
  //           token: app.token,
  //           id: app.id,
  //           latitude: location.latitude,
  //           longitude: location.longitude
  //         },
  //         success: function (res) {
  //           that.setData({
  //             city: res.data.data.name,
  //             cityIndex: res.data.data.value,
  //           })
  //           callback && callback()
  //         }
  //       })
  //     }
  //   })

  // test
  // that.setData({
  //   city: '上海市',
  //   cityIndex: 289,
  // })
  // callback && callback()
  // },


  /**
   * 获取选项
   */
  getSearchOptions: function () {
    let that = this
    wx.request({
      url: app.API_ROOT + 'nearby/info',
      data: {
        token: app.token,
        id: app.id
      },
      success: function (res) {
        if (res.data.error === '0') {
          console.log('getSearchOptions',res.data)
          that.setData({
            sortList: res.data.data.sort,
            educationList: res.data.data.education,
            expList: res.data.data.exper,
            treatmentList: res.data.data.salary,
            hotJobList: res.data.data.hotjob
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getSearchOptions()
    // this.getList()
    // this.getHotJobList();
    if (this.data.cityIndex == 0) {
      this.getLocalCity(this.getNewList)
    } else {
      this.getNewList()
    }
    
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
    // if (app.resumeFilter.preset) {
    //   this.setData({
    //     educationIndex: app.resumeFilter.education,
    //     expIndex: app.resumeFilter.experience,
    //     inputVal: app.resumeFilter.job,
    //     cityIndex: app.resumeFilter.city,
    //     city: app.resumeFilter.cityName,
    //     inputShowed: true
    //   })
    //   console.log(1,app.resumeFilter)
    //   app.resumeFilter = {}
    // }
    // console.log(2,app.resumeFilter)
    // console.log(3,this.data)
    // if (this.data.cityIndex == 0) {
    //   this.getLocalCity(this.getNewList)
    // } else {
    //   this.getNewList()
    // }
    if (app.resumeFilter.preset) {
      this.setData({
        educationIndex: app.resumeFilter.education,
        expIndex: app.resumeFilter.experience,
        inputVal: app.resumeFilter.job,
        cityIndex: app.resumeFilter.city,
        city: app.resumeFilter.cityName,
        inputShowed: true
      })
      app.resumeFilter = {}
      if (this.data.cityIndex == 0) {
        this.getLocalCity(this.getNewList)
      } else {
        this.getNewList()
      }
    }

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