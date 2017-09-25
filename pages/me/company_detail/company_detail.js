// company_detail.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taplock: false,
    companyInfo: {},
    images: [],
    imagesProgress: [],
    imgRoot: '',
    logo:'',
  },

  /**
   * 上传logo
   */
  uploadLogo: function () {
    let that = this
    wx.chooseImage({
      count: 1,
      success: function (img) {
        wx.showLoading({
          title: '正在上传',
        })
        let url = img.tempFilePaths[0]
        wx.uploadFile({
          url: app.API_ROOT + 'businessimg/create',
          filePath: url,
          name: 'files[0]',
          formData: {
            'token': app.token
          },
          success: function (res) {
            console.log('uploadLogo',res)
            wx.request({
              url: app.API_ROOT + 'business/update',
              method:'post',
              data:{
                token:app.token,
                id:app.id,
                logo: JSON.parse(res.data).data[0].imgId
              },
              success: function(){
                that.unpdateInfo(function () {
                  wx.hideLoading()
                })
              },
              fail: function(){
                wx.hideLoading()
              }
            })
          },
          fail: function (res) {
            console.log(res)
            wx.hideLoading()
          }
        })
      }
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
          arr.push({ img_id: 0, file_path: item })
        })

        that.setData({
          images: arr
        });
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.API_ROOT + 'businessimg/create',
            filePath: res.tempFilePaths[i],
            name: 'files[0]',
            // header: { "Content-Type": "multipart/form-data" },
            formData: {
              'token': app.token
            },
            success: function (res) {
              let arr = that.data.images
              arr[index + i].img_id = JSON.parse(res.data).data[0].imgId
              that.setData({
                'images': arr
              })
              that.updataImages()
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
            url: app.API_ROOT + 'businessimg/delete',
            method: 'post',
            data: {
              token: app.token,
              id: that.data.images[index]
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
   * 更新图片
   */
  updataImages: function () {
    let arr = []
    let that = this
    that.data.images.forEach(item => {
      arr.push(item.img_id)
    })
    wx.request({
      url: app.API_ROOT + 'business/update',
      method: 'post',
      data: {
        token: app.token,
        id: app.id,
        businfo_img: arr
      }
    })
  },

  /**
   * 初始化
   */
  init: function () {
    let that = this
    let imagesProgress = that.data.imagesProgress
    let images = that.data.images || []
    images.forEach(item => {
      imagesProgress.push(100)
    })
    that.setData({
      imagesProgress
    })
  },


  /**
   * 更新公司信息
   */
  unpdateInfo: function (callback){
    let that = this
    app.updateCompanyInfo(function () {
      let images = app.userInfo.detail.businfo_img || []
      images.forEach(item => {
        item.file_path = item.file_path
      })
      that.setData({
        companyInfo: app.userInfo.detail,
        logo: app.userInfo.detail.logo,
        images: images,
      })
      that.init()
      callback && callback()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      companyInfo: app.userInfo.detail,
      imgRoot: app.IMG_ROOT
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
    this.unpdateInfo()
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