//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    openid: 'oAKqa5eSKu3zARLS4MhBzR9HtB9E',
  },
   //跳转工具栏页面
  onChangeTabbar: function (event) {
    console.log(event.detail);
    var flag = event.detail;
    if (flag = 1) {
      wx.navigateTo({
        url: 'page/ordersModule/ordersModule',
      })
    } else if (flag = 2) {
      wx.navigateTo({
        url: 'page/personinfo/personinfo',
      })
    } else if (flag = 0) {
      wx.navigateTo({
        url: 'page/index/index',
      })
    }
  },
})
