// feedback_form.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content	:'',
    contacts:'',
    images:[],
    imagesProgress:[],
    warn:''
  },

  /**
   * 反馈内容输入
   */
  bindContentType: function(e){
    this.setData({
      content:e.detail.value,
      warn:''
    })
  },

  /**
   * 联系方式输入
   */
  bindContactsType: function (e) {
    this.setData({
      contacts: e.detail.value
    })
  },

  /**
   * 选择图片
   */
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 8 - that.data.images.length,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let index = that.data.images.length
        let arr = that.data.images
        res.tempFilePaths.forEach(item => {
          arr.push({ imgId: 0, file_path: item })
        })

        that.setData({
          images: arr
        });
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.API_ROOT + 'feedback/establish',
            filePath: res.tempFilePaths[i],
            name: 'files[0]',
            formData: {
              'token': app.token
            },
            success: function (res) {
              let arr = that.data.images

              arr[index + i].imgId = JSON.parse(res.data).data[0].imgId
              that.setData({
                'images': arr
              })
              //do something
            },

            fail: function (err) {
              console.log(err)
              let imagesProgress = that.data.imagesProgress
              imagesProgress[index] = -1
              that.setData({
                imagesProgress: imagesProgress
              })
            }
          })
            .onProgressUpdate((res) => {
              // console.log('上传进度', res.progress)
              let imagesProgress = that.data.imagesProgress
              imagesProgress[index] = res.progress
              that.setData({
                imagesProgress: imagesProgress
              })
            })
        }
      }
    })
  },

  /**
   * 查看图片
   */
  previewImage: function (e) {
    if (this.data.taplock) return
    let images = []
    this.data.images.forEach(item => {
      images.push(item.file_path)
    })
    wx.previewImage({
      current: images[e.currentTarget.dataset.idx], // 当前显示图片的http链接
      urls: images // 需要预览的图片http链接列表
    })
  },

  /**
   * 长按删除图片
   */
  deleteImage: function (e) {
    let that = this
    that.setData({
      taplock: true
    })
    wx.showActionSheet({
      itemList: ['删除图片'],
      itemColor: "#d81e06",
      success: function (res) {
        if (!res.cancel) {
          let index = e.currentTarget.dataset.idx
          //服务器删除
          wx.request({
            url: app.API_ROOT + 'feedback/destroy',
            method: 'post',
            data: {
              token: app.token,
              img_id: that.data.images[index]
            }
          })
          //本地删除
          let images = that.data.images
          let imagesProgress = that.data.imagesProgress
          images.splice(index, 1)
          imagesProgress.splice(index, 1)
          that.setData({
            images,
            imagesProgress
          })
        }

      },
      complete: function () {
        that.setData({
          taplock: false
        })
      }
    });
  },

  /**
   * 提交
   */
  submit: function(){
    let that = this
    let arr = []
    this.data.images.forEach(item => {
      arr.push(item.imgId)
    })
    console.log('submit')
    if(!this.data.content) {
      return this.setData({
        warn:'请输入反馈内容'
      })
    } else if (this.data.content && this.data.warn){
      this.setData({
        warn: ''
      })
    }
    wx.request({
      url: app.API_ROOT + 'feedback/create',
      method:'post',
      data:{
        token:app.token,
        user_id:app.uid,
        content: that.data.content,
        contacts: that.data.contacts,
        feedback_img: arr,
        role:2
      },
      success: function(res){
        if (res.data.error == 0){
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500,
            success:function(){
              setTimeout(function(){
                wx.navigateBack()
              }, 1500)
            }
          })
        } else {
          this.setData({
            warn:'未知错误，code：res.data.error'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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