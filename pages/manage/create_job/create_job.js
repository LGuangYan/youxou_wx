// create_job.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexList: ['不限', '男', '女'],
    sexIndex: 0,
    jobTypeList: ['不限','全职', '兼职'],
    jobTypeIndex: 0,
    categoryData: [],
    // categoryList: [[{ value: 0, name: '请选择职位类别', index:-1 }], [{ value: 0, name: '' }], [{ value: 0, name: '' }]],
    // categoryIndex: [0, 0,0],
    categoryName:'请选择职位类别',
    educationList: [],
    educationIndex: 0,
    salaryChecked:false,
    numberChecked:false,
    treatmentList: [],
    treatmentIndex: 0,
    experienceList: [],
    experienceIndex: 0,
    max_salary: 0,
    min_salary:0,
    form: {
      job_name: '',
      job_desc: '',
      sex: 0,
      number: '',
      // treatment: '',
      max_salary: 0,
      min_salary:0,
      education: 0,
      experience: 0,
      job_label: '',
      job_type: 0,
      address: '',
      category: '',
      job_info:[]
    },
    topTips:'',
    warn: {
      job_name: '',
      job_desc: '',
      sex: '',
      number: '',
      treatment: '',
      education: '',
      experience: '',
      job_label: '',
      job_type: '',
      category: ''
    }
  },
  /**
   * 职位名称
   */
  jobNameInputBlur: function (e) {
    if (e) {
      this.setData({
        'form.job_name': e.detail.value,
      })
    }
    let val = this.data.form.job_name
    if (!val) {
      this.setData({
        topTips: '',
        'warn.job_name': '职位名称不能为空'
      })
      return false
    }
    this.setData({
      'warn.job_name': '',
      'topTips': ''
    })
    return true
  },

  /**
   * 岗位类型
   */
  jobTypeChange: function (e) {
    if (e) {
      this.setData({
        jobTypeIndex: e.detail.value,
        'form.job_type': e.detail.value
        //!!
      })
    }

    // let val = this.data.jobTypeIndex
    // if (val == 0) {
    //   this.setData({
    //     topTips: '',
    //     'warn.job_type': '请选择岗位类型'
    //   })
    //   return false
    // }
    // this.setData({
    //   'warn.job_type': '',
    // })
    return true
  },

  /**
   * 职位类别
   */
  categoryChange: function (e) {
    let index = e.detail.value
    this.setData({
      categoryName: this.data.categoryList[2][index[2]].name,
      'form.category': this.data.categoryList[1][this.data.categoryIndex[1]].value,
    })
  },


  /**
   * 性别要求
   */
  sexChange: function (e) {
    if (e) {
      this.setData({
        sexIndex: e.detail.value,
        'form.sex': e.detail.value
        // 'form.sex': this.data.sexList[e.detail.value]
        //!!
      })
    }
    return true
  },

  /**
   * 学历要求
   */
  educationChange: function (e) {
    if (e) {
      this.setData({
        educationIndex: e.detail.value,
        'form.education': this.data.educationList[e.detail.value].value
        //!!
      })
    }
    return true
  },

  /**
   * 薪资福利
   */
  minSalaryInput: function(e){
    this.setData({
      'min_salary': e.detail.value,
      'warn.treatment': ''
    })
  },

  maxSalaryInput: function (e) {
    this.setData({
      'max_salary': e.detail.value,
      'warn.treatment': ''
    })
  },

  /**
   * 点击面议
   */
  chengeSalaryChecked: function(){
    this.setData({
      salaryChecked: !this.data.salaryChecked
    })
  },

  /**
   * 点击不限人数
   */
  chengeNumberChecked:function(){
    this.setData({
      numberChecked: !this.data.numberChecked,
      'form.number': 0,
      'warn.number': '',
      'topTips': ''
    })
  },

  /**
   * 工作经验
   */
  experienceChange: function (e) {
    if (e) {
      this.setData({
        experienceIndex: e.detail.value,
        'form.experience': this.data.experienceList[e.detail.value].value
        //!!
      })
    }
    return true
  },

  /**
   * 招聘人数
   */
  numberInputBlur: function (e) {
    if (e) {
      this.setData({
        'form.number': parseInt(e.detail.value),
      })
    }
    let val = this.data.form.number
    if (!val && !this.data.numberChecked) {
      this.setData({
        topTips: '',
        'warn.number': '招聘人数不能为空',
        'topTips': ''
      })
      return false
    }
    this.setData({
      'warn.number': '',
      'topTips': ''
    })
    return true
  },

  /**
   * 改变地址
   */
  changeAddress: function () {
    let that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          'form.latitude': res.latitude,
          'form.longitude': res.longitude,
          'form.address': res.address,
          'warn.address': ''
        })
      }
    })
  },

  /**
   * 长按删除公司信息
   */
  deleteInfoItem: function(e){
    let self = this
    wx.showActionSheet({
      itemList: ['删除'],
      success: function (res) {
        if (res.tapIndex == 0){
          let info = self.data.form.job_info
          info.splice(e.currentTarget.dataset.idx,1)
          self.setData({
            'form.job_info': info
          })
        }
      }
    })
  },

  /**
   * 编辑公司信息
   */
  editInfoItem: function(e){
    wx.navigateTo({
      url: '/pages/form/job_info/job_info?idx=' + e.currentTarget.dataset.idx,
    })
  },

  /**
   * 职位描述
   */
  jobDescInputBlur: function (e) {
    if (e) {
      this.setData({
        'form.job_desc': e.detail.value,
      })
    }
    let val = this.data.form.job_desc
    if (!val) {
      this.setData({
        topTips: '',
        'warn.job_desc': '职位描述不能为空',
        'topTips': ''
      })
      return false
    } else {
      this.setData({
        'warn.job_desc': '',
        'topTips': ''
      })
    }
    
  },

  /**
   * 提交
   */
  submit: function () {
    let that = this
    if (!this.jobNameInputBlur() || !this.numberInputBlur()) return
    if (!this.data.form.address) {
      return this.setData({
        'warn.address': '请选择工作地址'
      })
    }
    if (!this.data.form.job_desc) {
      return this.setData({
        'warn.job_desc': '请输入职位描述'
      })
    }
    if (this.data.form.category == 0) {
      return this.setData({
        'warn.category': '请选择职位类别'
      })
    }

    if (!this.data.salaryChecked && (!this.data.max_salary || !this.data.max_salary)) {
      return this.setData({
        'warn.treatment': '薪资不能为空'
      })
    }  else if (this.data.salaryChecked) {
      this.setData({
        'form.max_salary': 0,
        'form.min_salary': 0
      })
    } else {
      let max = +this.data.max_salary < +this.data.min_salary ? parseInt(this.data.min_salary) : parseInt(this.data.max_salary)
      let min = +this.data.max_salary < +this.data.min_salary ? parseInt(this.data.max_salary) :parseInt(this.data.min_salary)
      this.setData({
        'form.max_salary': max,
        'form.min_salary': min
      })
    }


    wx.showLoading({
      title: '正在创建',
      mask: true
    })
    wx.request({
      url: app.API_ROOT + 'businessjob/create',
      data: this.data.form,
      method: 'post',
      success: function (res) {
        console.log(res.data)
        if(res.data.error === '0'){
          wx.navigateTo({
            url: '/pages/manage/create_success/create_success?count=' + res.data.data.count + 
            '&education=' + that.data.form.education + 
            '&experience=' + that.data.form.experience +
            '&job=' + that.data.categoryName + 
            '&city=' + res.data.data.city_code +
            '&area=' + res.data.data.city_name
          })
        } else {
          that.setData({
            'topTips': '提交失败，code：' + res.statusCode
          })
        }
      },
      fail: function(err){
        that.setData({
          'topTips': '提交失败，code：' + err.statusCode
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })

  },

  /**
   * 选框选项处理
   */
  handleJobRadio: function(){
    // let categoryList = this.data.categoryList
    // app.jobRadio.category.forEach((item,index) => {
    //   categoryList[0].push({
    //     name:item.name,
    //     value:item.value,
    //     index:index
    //   })
    // })
    this.setData({
      'form.id': app.id,
      'form.token': app.token,
      educationList: app.jobRadio.education,
      'form.education': app.jobRadio.education[0].value,
      treatmentList: app.jobRadio.treatment,
      'form.treatment': app.jobRadio.treatment[0].value,
      experienceList: app.jobRadio.experience,
      'form.experience': app.jobRadio.experience[0].value,
      // categoryList: categoryList
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleJobRadio()
    // let that = this
    // wx.request({
    //   url: app.API_ROOT + 'businessjob/info',
    //   method: 'get',
    //   data: {
    //     token: app.token
    //   },
    //   success: function (res) {
    //     let categoryList = that.data.categoryList
    //     categoryList[0] = categoryList[0].concat(res.data.data.category)
    //     that.setData({
    //       'form.id': app.id,
    //       'form.token': app.token,
    //       educationList: res.data.data.education,
    //       'form.education': res.data.data.education[0].value,
    //       treatmentList: res.data.data.treatment,
    //       'form.treatment': res.data.data.treatment[0].value,
    //       experienceList: res.data.data.experience,
    //       'form.experience': res.data.data.experience[0].value,
    //       categoryList: categoryList
    //     })
    //   }
    // })


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