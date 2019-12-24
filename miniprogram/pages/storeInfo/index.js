//index.js
Page({
  data: {
    shopdetail:[],
    barberList:[],
    commentList:[],
    shopid:''
  },

  onLoad: function (options) {
    this.onDrawCanvas();
    this.querybarberlist(options._id);
    this.querycommentslist(options._id);
    this.fetchDetailData(options._id);
    this.setData({
      shopid: options._id
    })

  },
  onDrawCanvas: function(){
    let that = this;
    var ctx = wx.createCanvasContext('shopCanvas');
    var width = wx.getSystemInfoSync().windowWidth;
    console.log((width - 20) / 4);
    // Draw guides
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.bezierCurveTo(width / 4, 20, width * 3 / 4, 80, width, 50)
    ctx.lineTo(0, 70);
    ctx.lineTo(width, 70);
    // ctx.setFillStyle('white')
    // ctx.fill()
    ctx.moveTo(width, 50);
    ctx.lineTo(width, 70);
    ctx.lineTo(0, 70);
    ctx.setFillStyle('white')
    ctx.moveTo(0, 50);
    ctx.lineTo(width, 70);
    ctx.lineTo(0, 70);
    ctx.setFillStyle('white')

    ctx.fill()
    ctx.clip()
    ctx.draw()
  },
  
  //查询理发店信息
  fetchDetailData: function(e){
    var self = this;
    const db = wx.cloud.database();
    db.collection('shop').where(
      {_id: e}).get({
      success: res => {
        self.setData({
          shopdetail : res.data
        })
      }
    })
  },

  //查询理发店发型师列表
  querybarberlist:function(e){
    var self = this;
    const db = wx.cloud.database();
    db.collection('barber').where
    ({shop:e}).get({
        success: res => {
          console.log(res.data)
          self.setData({
            barberList: res.data
          })
          console.log(self.data.barberList);
        }
      })
  },

  //查询理发店评论列表
  querycommentslist : function(e){
    var self = this;
    const db = wx.cloud.database();
    db.collection('comment').where(
      { shop: e }).limit(1).get({
        success: res => {
          self.setData({
            commentList: res.data
          })
          console.log(self.data.commentList);
        }
      })
  },

  /*跳转到理发师详情页面*/
  linkToBarberInfo: function () {
   
    wx.navigateTo({
      url: '../barberinfo/barberinfo',
    })
  },

  //跳转到取号页面
  linkToOrder: function(){
    var self = this;
    wx.navigateTo({
      url: '../order/order?name=' + self.data.barberList[0].name + '&shopid=' + self.data.shopdetail[0]._id + '&shopname=' + self.data.shopdetail[0].name + '&photo=' + self.data.barberList[0].photo + '&waitfont=' + self.data.barberList[0].waitfont 
        + '&price=' + self.data.barberList[0].waitfont ,
      
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  }

})
