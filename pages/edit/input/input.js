// input.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    name:'',
    param:'',
    value:'',
    inputType:'text',
    url:{
      job:'businessjob/update',
      company:'business/update'
    },
    form:{
      job:{
        token:'',
        job_id: ''
      },
      company:{
        token:''
      }
    }
  },

  inputChange: function(e){
    let form = this.data.form
    form[this.data.type][this.data.param] = e.detail.value

    this.setData({
      'form': form,
      'value': e.detail.value
    })
  },

  submit: function(){
    wx.request({
      url: app.API_ROOT + this.data.url[this.data.type],
      method:'post',
      data:this.data.form[this.data.type],
      success: function(res) {
        console.log(res.data.error,res.data.data)
        wx.navigateBack()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      name: options.name,
      param: options.param,
      value: options.value,
      inputType: options.inputType ||'text',
      'form.job.job_id': options.job_id || '',
      'form.job.token': app.token,
      'form.job.id': app.id,
      'form.company.token': app.token,
      'form.company.id': app.id
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