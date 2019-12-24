// pages/ordersModule/ordersModule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户openid
    const db = wx.cloud.database();
    var openid;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'login',
      // 传给云函数的参数
      success: function (res) {
        openid = res.result.openId;
      }
    })
    //查询用户订单信息
    db.collection('order').where({
      _openid: getApp().globalData.openid  // 填入当前用户 openid
    }).get({
        success: function (res) {
          console.log(res.data);
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