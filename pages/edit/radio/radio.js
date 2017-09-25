// radio.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [],
    localRadioItems: {
      job_type: [{ name: '不限',value:0 },{ name: '全职',value:1 },{ name: '兼职',value:2 }],
      sex: [{ name: '不限', value: 0 }, { name: '男', value: 1 }, { name: '女', value: 2 }]
    },
    type: '',
    name: '',
    param: '',
    value: '',
    radioUrl:{
      job:'businessjob/info',
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
   * 选项更改
   */
  radioChange: function (e) {
    let value = this.data.lavue
    let radioItems = this.data.radioItems;
    let form = this.data.form
    for (let i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
      value = radioItems[i].checked ? radioItems[i].value : value
      //！！
    }
    form[this.data.type][this.data.param] = value
    this.setData({
      radioItems: radioItems,
      value,
      form
    });
  },

  /**
   * 获取选项
   */
  getRadioItems: function(callback){
    let that = this
    for (let key in this.data.localRadioItems){
      if (this.data.param == key){
        this.setData({
          radioItems: this.data.localRadioItems[key]
        })
        return callback && callback()
      }
    }
    wx.request({
      url: app.API_ROOT + that.data.radioUrl[that.data.type],
      method:'get',
      data:{
        token:app.token
      },
      success: function(res) {
        that.setData({
          radioItems:res.data.data[that.data.param]
        })
        callback&&callback()
      }
    })
  },

  /**
   * 提交
   */
  submit: function(){
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.API_ROOT + this.data.url[this.data.type],
      method: 'post',
      data: this.data.form[this.data.type],
      success: function (res) {
        if (res.data.error == 0){
          wx.navigateBack()
        } else {
          
        }
        
      },
      complete: function(){
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
      value: options.value,
      'form.job.job_id': options.job_id || '',
      'form.job.token': app.token,
      'form.job.id': app.id,
      'form.company.token': app.token,
      'form.company.id': app.id
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.getRadioItems(function(){
      for (let i = 0; i < that.data.radioItems.length; i++){
        if (that.data.radioItems[i].name == that.data.value){
          let arr = that.data.radioItems
          arr[i].checked = true
          that.setData({
            radioItems: arr
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