var app = getApp();
var util = require("../../utils/util.js")

Page({
  data: {
   barberInfo:{
     name:'',
     photo:'',
     waitfont:'',
     price:'',
     _id:''
   },
   shopid:'',
   shopname:'',
   radio: '1',
   show: false,
   reservationNumber:0
  },

  onClose: function() {
    this.setData({ show: false });
  },
  onLoad: function (options) {
    this.setData({
      barberInfo:{
        name: options.name,
        photo: options.photo,
        waitfont: options.waitfont,
        _id: options._id
      },
      shopid: options.shopid,
      shopname: options.shopid
    })
  },
  //选择服务项
  onChange:function(e){
    this.setData({
      radio: e.detail
    })
  },
  //确认取号按钮
  confirmNum:function(){
    //新增订单列表
    this.addOrderList();
  },
  
  /**
    *  增加订单列表
    */
  addOrderList: function () {
    var self = this;
    var time = util.formatTime(new Date());
    const db = wx.cloud.database();
   
    db.collection('order').add({
      data: {
        shopid: self.data.shopid,
        shopname: self.data.shopname,
        barber: self.data.barberInfo.name,
        price: self.data.barberInfo.price,
        item: self.data.radio,
        queue: self.data.barberInfo.waitfont,
        status: '待消费',
        date: time,
        openid: getApp().globalData.openid
      }
    }).then(res => {
     this.updateQueue();
    })
      .catch(console.error)
  },


  /**
   *  更新取号列表
   */
  updateQueue: function () {
    util.showBusy('请求中...')
    var that = this;
    var temp = [];
    const db = wx.cloud.database();
    wx.cloud.callFunction({
      // 云函数名称
      name: 'updateBarberWaitnum',
      // 传给云函数的参数
      data: {
        _id: that.data.barberInfo._id,
        newCount:that.data.barberInfo.waitfont,
      },
      success: function (res) {
        console.log('调用云函数成功，正在跳转页面');
        wx.switchTab({
          url: '../ordersModule/ordersModule',
        })
      },
      fail: console.error
    })
  },
  

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name
    })
  },

  //  // 获取用户openid
  getOpenid: function () {
    let that = this;
    //获取openid不需要授权
    wx.login({
      success: function (res) {
        //请求自己后台获取用户openid
        wx.request({
          url: 'https://30paotui.com/user/wechat',
          data: {
            appid: '你的小程序appid',
            secret: '你的小程序secret',
            code: res.code
          },
          success: function (response) {
            var openid = response.data.openid;
            console.log('请求获取openid:' + openid);
            //可以把openid存到本地，方便以后调用
            wx.setStorageSync('openid', openid);
            that.setData({
              openid: "获取到的openid：" + openid
            })
          }
        })  
      }
    })
  },
});