// complete_info.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempPhone:'',
    pickerLock: false,
    taplock: false,
    industryList: [{ value: 0, name: '请选择行业类型' }],
    industryIndex: [0],
    industryTitle: ['行业一', '行业二', '行业三'],
    propertyList: [{ name: '请选择公司性质' }],
    propertyIndex: 0,
    scaleList: [{ name: '请选择公司规模' }],
    scaleIndex: 0,
    welfareList: [],
    logoInfo:{
      url:'',
      progress:0
    },
    form: {
      logo:'',
      industry: [0],        //行业分类
      welfare: [],         //工作福利
      business_name: '',   //公司名称
      short_name:'',
      introduction: '',    //公司简介
      scale: '',           //公司规模
      property: '',        // 公司性质
      user_person: '',     //联系人
      user_number: '',     //联系电话
      identity:'',        //联系人身份
      traffic: '',         //交通情况
      address: '',         //详细地址
      longitude: '',       //经度
      latitude: '',         //维度
      businfo_img: []
    },
    images: [],
    imagesProgress: [],
    checkboxItems: [
      { name: 'standard is dealt for u.', value: '0', checked: true },
      { name: 'standard is dealicient for u.', value: '1' }
    ],
    topTips: '',
    warn: {
      companyName: '',
      companyShortName:'',
      industry: [],
      property: '',
      scale: '',
      userPerson: '',
      userNumber: '',
      identity:'',
      traffic: '',
      introduction: '',
      address: '',
      welfare: ''
    }
  },


  /**
   * 公司名称失去焦点
   */
  companyNameInputBlur: function (e) {
    if (e) {
      this.setData({
        'form.business_name': e.detail.value,
      })
    }
    let val = this.data.form.business_name
    if (!val) {
      this.setData({
        topTips: '',
        'warn.companyName': '公司名称不能为空'
      })
      return false
    }
    this.setData({
      'warn.companyName': '',
      topTips: ''
    })
    return true
  },

  /**
   * 公司简称失去焦点
   */
  companyShortNameInputBlur: function (e) {
    if (e) {
      this.setData({
        'form.short_name': e.detail.value,
      })
    }
    let val = this.data.form.short_name
    if (!val) {
      this.setData({
        topTips: '',
        'warn.companyShortName': '公司简称不能为空'
      })
      return false
    }
    this.setData({
      'warn.companyShortName': '',
      topTips: ''
    })
    return true
  },

  /**
   * 性质失去焦点
   */
  propertyInputChange: function (e) {
    if (e) {
      this.setData({
        'propertyIndex': e.detail.value,
        'form.property': this.data.propertyList[e.detail.value].value,
      })
    }
    let val = this.data.propertyIndex
    if (val == 0) {
      this.setData({
        topTips: '',
        'warn.property': '请选择公司性质'
      })
      return false
    } 
    this.setData({
      'warn.property': '',
      topTips: ''
    })
    return true
  },

  /**
   * 规模失去焦点
   */
  scaleInputChange: function (e) {
    if (e) {
      this.setData({
        scaleIndex: e.detail.value,
        'form.scale': this.data.scaleList[e.detail.value].value
      })
    }
    let val = this.data.scaleIndex
    if (val == 0) {
      this.setData({
        topTips: '',
        'warn.scale': '请选择公司性质'
      })
      return false
    }
    this.setData({
      'warn.scale': '',
      topTips: ''
    })
    return true
  },


  /**
   * 联系人失去焦点
   */
  userPersonInputBlur: function (e) {
    if (e) {
      this.setData({
        'form.user_person': e.detail.value,
      })
    }
    let val = this.data.form.user_person

    if (!val) {
      this.setData({
        topTips: '',
        'warn.userPerson': '公司联系人不能为空'
      })
      return false
    }
    this.setData({
      'warn.userPerson': '',
      topTips: ''
    })
    return true
  },

  /**
   * 联系电话失去焦点
   */
  userNumberInputBlur: function (e) {
    if (e) {
      this.setData({
        'form.user_number': e.detail.value,
      })
    }
    let val = this.data.form.user_number
    if (!val) {
      this.setData({
        topTips: '',
        'warn.userNumber': '联系电话不能为空'
      })
      return false
    }
    this.setData({
      'warn.userNumber': '',
      topTips: ''
    })
    return true
  },

  /**
   * 联系人身份失去焦点
   */
  // identityInputBlur: function(e){

  //   if (e) {
  //     this.setData({
  //       'form.identity': e.detail.value,
  //     })
  //   }
  //   let val = this.data.form.identity
    // if (!val) {
    //   this.setData({
    //     topTips: '',
    //     'warn.identity': '联系人身份不能为空'
    //   })
  //     return 
  //   }
  //   this.setData({
  //     'warn.identity': '',
  //     topTips: ''
  //   })
  // },

  /**
   * 交通失去焦点
   */
  trafficInputBlur: function (e) {
    this.setData({
      'form.traffic': e.detail.value
    })
  },

  /**
   * 简介失去焦点
   */
  // introductionInputBlur: function (e) {
  //   if (e) {
  //     this.setData({
  //       'form.introduction': e.detail.value,
  //     })
  //   }
  //   let val = this.data.form.introduction
  //   if (!val) {
  //     this.setData({
  //       topTips: '',
  //       'warn.introduction': '公司简介不能为空'
  //     })
  //     return false
  //   }
  //   this.setData({
  //     'warn.introduction': '',
  //     topTips: ''
  //   })
  // },

  /**
   * 长按行业
   */
  deleteIndustry: function (e) {
    if (this.data.industryIndex.length < 2) return
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
          let industryIndex = that.data.industryIndex
          let industry = that.data.form.industry
          industryIndex.splice(index,1)
          industry.splice(index,1)
          that.setData({
            industryIndex,
            'form.industry': industry
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
  industryChange: function (e) {
    let that = this
    if (e) {
      let arr = this.data.industryIndex
      let arr2 = this.data.form.industry
      arr[e.currentTarget.dataset.idx] = +e.detail.value
      arr2[e.currentTarget.dataset.idx] = this.data.industryList[+e.detail.value].value
      this.setData({
        'industryIndex': arr,
        'form.industry': arr2
      })
    }
    let val = this.data.form.industry

    let flag = true
    this.data.form.industry.forEach((item,index) => {
      if (item == 0) {
        let industryWarn = that.data.warn.industry
        industryWarn[index] = '请选择行业类型'
        that.setData({
          topTips: '',
          'warn.industry': industryWarn
        })
        flag =  false
      }
    })


    if (flag) {
      this.setData({
        'warn.industry': [],
        topTips: ''
      })
      return true
    }


  },

  /**
   * 增加行业
   */
  addIndustry: function () {
    if (this.data.industryIndex.length >= 3) return
    let arr = this.data.industryIndex
    let arr2 = this.data.form.industry
    arr.push(0)
    arr2.push(this.data.industryList[0].value)
    this.setData({
      'industryIndex': arr,
      'form.industry': arr2
    })
  },

  
  /**
   * 地图选址
   */
  chooseAddress: function () {
    let that = this
    wx.chooseLocation({
      success: function (address) {
        console.log(address)
        that.setData({
          'form.address': address.address,
          'form.longitude': address.longitude,
          'form.latitude': address.latitude
        })
      }
    })
  },

  /**
   * 更改地址
   */
  handleChangeAddress: function (e) {
    this.setData({
      'form.address': e.detail.value
    })
  },
  //公司福利
  // welfareChange: function (e) {
  //   let arr = []
  //   let welfareList = this.data.welfareList, values = e.detail.value;
  //   for (let i = 0, lenI = welfareList.length; i < lenI; ++i) {
  //     welfareList[i].checked = false;

  //     for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
  //       if (welfareList[i].value == values[j]) {
  //         welfareList[i].checked = true;
  //         arr.push(welfareList[i].name)
  //         break;
  //       }
  //     }
  //   }
  //   this.setData({
  //     'form.welfare': arr,
  //     welfareList: welfareList
  //   })
  // },

  /**
   * 上传logo
   */
  uploadLogo: function(){
    let that = this
    wx.chooseImage({
      count: 1,
      success: function(img){
        let url = img.tempFilePaths[0]
        that.setData({
          'logoInfo.url':url
        })
        wx.uploadFile({
          url: app.API_ROOT + 'businessimg/create',
          filePath: url,
          name: 'files[0]',
          formData: {
            'token': app.token
          },
          success: function (res) {
            console.log('uploadLogo', res)
            that.setData({
              'form.logo': JSON.parse(res.data).data[0].imgId
            })
          },
          fail: function(res){
            console.log(res)
          }
        })
          .onProgressUpdate((res) => {
            that.setData({
              'logoInfo.progress': res.progress
            })
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
        let indexList = {}
        that.setData({
          images: that.data.images.concat(res.tempFilePaths)
        });

        let imagesProgress = that.data.imagesProgress
        for (let item of res.tempFilePaths) {
          indexList[item] = index++
          wx.uploadFile({
            url: app.API_ROOT + 'businessimg/create',
            filePath: item,
            name: 'files[0]',
            // header: { "Content-Type": "multipart/form-data" },
            formData: {
              'token': app.token
            },
            success: function (res) {
              console.log('uploadImage', res)
              let arr = that.data.form.businfo_img
              arr.push(JSON.parse(res.data).data[0].imgId)
              that.setData({
                'form.businfo_img': arr
              })

              //do something
            },

            fail: function (err) {
              console.log(err)
              let imagesProgress = that.data.imagesProgress
              imagesProgress[indexList[item]] = -1
              that.setData({
                imagesProgress: imagesProgress
              })
            }
          })
            .onProgressUpdate((res) => {
              imagesProgress[indexList[item]] = res.progress
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
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
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
              id: that.data.form.businfo_img[index]
            }
          })
          //本地删除
          let images = that.data.images
          let businfo_img = that.data.form.businfo_img
          let imagesProgress = that.data.imagesProgress
          images.splice(index,1)
          businfo_img.splice(index, 1)
          imagesProgress.splice(index,1)
          that.setData({
            images: images,
            'form.businfo_img': businfo_img,
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

  submit: function () {
    let that = this
    this.setData({
      topTips: ''
    })
    if (!this.companyNameInputBlur() || !this.propertyInputChange() || !this.scaleInputChange() || !this.userPersonInputBlur() || !this.userNumberInputBlur() || !this.industryChange()){
      return
    }
    if(!this.data.form.address){
      return this.setData({
        'warn.address': '请选择公司地址'
      })
    }else{
      this.setData({
        'warn.address': ''
      })
    }
    if (!this.data.form.identity) {
      this.setData({
        topTips: '',
        'warn.identity': '联系人身份不能为空'
      })
    } else {
      this.setData({
        'warn.identity': ''
      })
    }
    if (!this.data.form.introduction) {
      return this.setData({
        'warn.introduction': '请输入公司简介'
      })
    } else {
      this.setData({
        'warn.introduction': ''
      })
    }

    if (this.data.form.welfare.length < 1){
      return this.setData({
        'warn.welfare': '请选择公司福利'
      })
    } else {
      this.setData({
        'warn.welfare': ''
      })
    }
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.API_ROOT + 'business/create',
      method:'post',
      data:this.data.form,
      success:function(res){
        if (res.data.error === '0') {
          app.id = res.data.data.business_id
          // app.uid = res.data.data.u_id
          app.updateCompanyInfo()
          app.getRadioInfo()
          wx.switchTab({
            url: '/pages/main/candidate_list/candidate_list'
          })
        } else if (res.data.error && res.data.error !== 0){
          that.setData({
            topTips: res.data.msg
          })
        } else {
          that.setData({
            topTips: '未知错误，code：' + res.statusCode
          })
        }
        
      },
      complete: function(){
        wx.hideLoading()
      }
    })
    // test

    // app.showSuccessMsg({
    //   title: '公司信息已完善',
    //   time: 5,
    //   firstbtn: '立即跳转',
    //   firsturl: '/pages/main/candidate_list/candidate_list'
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let tempPhone = wx.getStorageSync('tempPhone')
    this.setData({
      tempPhone,
      'form.user_number': tempPhone
    })
    //获取选项列表
    wx.request({
      url: app.API_ROOT + 'business/businfo',
      method: 'get',
      data: {
        token: app.token,
        // u_id:app.uid
      },
      success: function (res) {
        //行业列表
        let industryList = res.data.data.industry
        for (let item of industryList) {
          item.checked = false
        }
        industryList = that.data.industryList.concat(industryList)

        //福利列表
        let welfareList = res.data.data.welfare
        for (let item of welfareList) {
          item.checked = false
        }

        //公司性质列表
        let propertyList = that.data.propertyList.concat(res.data.data.property)

        //公司规模列表
        let scaleList = that.data.scaleList.concat(res.data.data.scale)

        that.setData({
          industryList,
          welfareList,
          propertyList,
          scaleList,
          'form.token': app.token
        })
      }
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