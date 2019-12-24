/*
 * 
 * 快剪发微信小程序
 * author: Thomas
 */
var app = getApp();
Page({
  data: {
    openid: '',
    shopListFetched: false,
    shopList: [],
    filtered: false,
    loading: false,
    totalCount: 0,
    pageSize: 5,
    imgUrls: [],
    imageURL: [
      '../../images/1.jpg'
    ],
    iconImgUrl: [
      '../../images/8.png'
    ],

    active: 1,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    active: 0,
    onChange(event) {
      wx.showToast({
        icon: 'none',
        title: `切换至第${event.detail}项`
      });
    },
    show: false,
    company: {
      loc: '东大街20号'
    }
  },

  onLoad: function() {
    this.queryshopList();
    this.queryshowimg();
    // if (!wx.cloud) {
    //   wx.redirectTo({
    //     url: '../chooseLib/chooseLib',
    //   })
    //   return
    // }
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },

  queryshopList: function() {
    wx.showLoading({
      title: '正在查询...'
    })
    const db = wx.cloud.database()
    db.collection('shop').count({
      success: res => {
        this.data.totalCount = res.total;
      }
    })
    db.collection('shop').limit(5).get({
      success: res => {
        this.setData({
          shopListFetched: true,
          shopList: res.data,
          filtered: false
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var temp = [];
    // 获取后面十条
    if (this.data.shopList.length < this.data.totalCount) {
      try {
        const db = wx.cloud.database();
        db.collection('shop')
          .skip(5)
          .limit(that.data.pageSize) // 限制返回数量为 5 条
          .orderBy('_id', 'desc') // 排序
          .get({
            success: function(res) {
              // res.data 是包含以上定义的两条记录的数组
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var tempShop = res.data[i];
                  temp.push(tempShop);
                }
                var totalTopic = [];
                totalTopic = that.data.shopList.concat(temp);
                that.setData({
                  shopList: totalTopic,
                })
              } else {
                wx.showToast({
                  title: '没有更多店铺了',
                })
              }
            },
            fail: function(event) {
              console.log("======" + event);
            }
          })
      } catch (e) {
        console.error(e);
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
      })
    }

  },

  /**
   * 查询标题展示的图片
   */
  queryshowimg: function() {
    var that =this;
    var temp =[];
    const db = wx.cloud.database();
    db.collection('showimg')
      .get({
        success: function(res) {
          // res.data 是包含以上定义的两条记录的数组
          if (res.data.length > 0) {
            for (var i = 0; i < res.data.length; i++) {
              var tempShop = res.data[i];
              temp.push(tempShop);
            }
            var totalTopic = [];
            totalTopic = that.data.imgUrls.concat(temp);
            that.setData({
              imgUrls: totalTopic,
            })
           
          }
        }
      })
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onShareAppMessage() {
    return {
      title: "快速剪发",
      path: "page/index/index",
    }
  },
  // //跳转工具栏页面
  // onChangeTabbar: function (event) {
  //   console.log(event.detail);
  //   var flag = event.detail;
  //   if (flag = 1) {
  //     wx.navigateTo({
  //       url: '../ordersModule/ordersModule',
  //     })
  //   } else if (flag = 2) {
  //     wx.navigateTo({
  //       url: '../personinfo/personinfo',
  //     })
  //   } else if (flag = 0) {
  //     wx.navigateTo({
  //       url: '../index/index',
  //     })
  //   }
  // },
  //跳转至详情页
  linkToStoreInfo: function (e) {
    wx.navigateTo({
      url: '../storeInfo/index?_id=' + e.currentTarget.dataset.zbid,
    })
  }
});