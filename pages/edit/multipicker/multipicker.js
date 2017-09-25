// multipicker.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [],
    title:['一','二','三','四','五','六','七','八','九','十'],
    name:'',
    pickerLock:false,
    limit:3,
    indexList:[0],
    radioUrl: {
      job: 'businessjob/info',
      company: 'business/businfo'
    },
    url: {
      job: 'businessjob/update',
      company: 'business/update'
    },
    form: {
      job: {
        token: '',
        job_id: ''
      },
      company: {
        token: ''
      }
    }
  },


  /**
   * 长按行业
   */
  deleteItem: function (e) {
    if (this.data.indexList.length < 2) return
    let that = this
    this.setData({
      pickerLock: true
    })
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: "#d81e06",
      success: function (res) {
        if (res.tapIndex == 0) {
          let index = e.currentTarget.dataset.idx
          let indexList = that.data.indexList
          let item = that.data.form[that.data.type][that.data.param]
          indexList.splice(index, 1)
          item.splice(index, 1)
          that.setData({
            indexList,
            'form.industry': item
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      },
      complete: function () {
        that.setData({
          pickerLock: false
        })
      }
    })
  },

  /**
   * 选择行业
   */
  itemChange: function (e) {
    let that = this
    if (e) {
      let arr = this.data.indexList
      let arr2 = this.data.form
      arr[e.currentTarget.dataset.idx] = +e.detail.value
      arr2[this.data.type][this.data.param][e.currentTarget.dataset.idx] = this.data.radioItems[+e.detail.value].value
      this.setData({
        'indexList': arr,
        'form': arr2
      })
    }
    let val = this.data.form[this.data.type][this.data.param]

    let flag = true
    this.data.form[this.data.type][this.data.param].forEach((item, index) => {
      if (item == 0) {
        let industryWarn = that.data.warn.industry
        industryWarn[index] = '请选择'+this.data.name
        that.setData({
          topTips: '',
          'warn.industry': industryWarn
        })
        flag = false
      }
    })


    if (flag) {
      this.setData({
        'warn.industry': []
      })
      return true
    }


  },

  /**
 * 增加行业
 */
  addItem: function () {
    if (this.data.indexList.length >= 3) return
    let arr = this.data.indexList
    let arr2 = this.data.form
    arr.push(0)
    arr2[this.data.type][this.data.param].push(this.data.radioItems[0].value)
    this.setData({
      'indexList': arr,
      'form': arr2
    })
  },



  /**
 * 获取选项
 */
  getRadioItems: function (callback) {
    let that = this
    for (let key in this.data.localRadioItems) {
      if (this.data.param == key) {
        this.setData({
          radioItems: this.data.localRadioItems[key]
        })
        return callback && callback()
      }
    }
    wx.request({
      url: app.API_ROOT + that.data.radioUrl[that.data.type],
      method: 'get',
      data: {
        token: app.token
      },
      success: function (res) {
        let arr = res.data.data[that.data.param]
        arr.unshift({name:'请选择'+that.data.name,value:0})
        that.setData({
          radioItems: arr
        })
        callback && callback()
      }
    })
  },

  /**
   * 提交
   */
  submit: function () {
    wx.showLoading({
      title: '正在提交',
    })

    for (let item of this.data.form[this.data.type][this.data.param]){
      if(item == 0){
        return this.setData({
          warn:'请先选择，减少选项可长按删除'
        })
      }
    }
    wx.request({
      url: app.API_ROOT + this.data.url[this.data.type],
      method: 'post',
      data: this.data.form[this.data.type],
      success: function (res) {
        if (res.data.error == 0) {
          wx.navigateBack()
        } else {

        }

      },
      complete: function () {
        wx.hideLoading()
      }
    })
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
      value: options.value.split(","),
      'form.job.job_id': options.job_id || '',
      'form.job.token': app.token,
      'form.job.id': app.id,
      'form.company.token': app.token,
      'form.company.id': app.id
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.getRadioItems(function () {
      let form = that.data.form
      let indexList = that.data.indexList
      form[that.data.type][that.data.param] = []
      for(let i = 0;i < that.data.value.length;i++){
        for (let j = 0; j < that.data.radioItems.length; j++){
          if (that.data.radioItems[j].name == that.data.value[i]){
            form[that.data.type][that.data.param][i] = j
            indexList[i] = j
          }
        }
      }
      that.setData({
        form,
        indexList
      })

      // for (let i = 0; i < that.data.radioItems.length; i++) {
      //   if (that.data.radioItems[i].name == that.data.value) {
      //     let arr = that.data.radioItems
      //     arr[i].checked = true
      //     that.setData({
      //       radioItems: arr
      //     })
      //   }
      // }
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