var app = getApp();
Page({
  data: {
    steps: [
      {
        text: '九年剪发经验 ',
        desc: ''
      },
      {
        text: '广州天意',
        desc: '在职时间：2014-03-2017-06'
      },
      {
        text: '尚艺',
        desc: '在职时间：2011-08-2014-03'
      },
      {
        text: '首脑',
        desc: '在职时间：2008-02-2011-08'
      }
    ],
    imgUrls: [
      '../../images/1.jpg',
      '../../images/2.jpg',
      '../../images/3.jpg',
      '../../images/4.jpg',
      '../../images/5.jpg'
    ],
    active: 1,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    active: 0,
    
  },
  onLoad: function () {
    let that = this;
    var ctx = wx.createCanvasContext('firstCanvas');
    var width = wx.getSystemInfoSync().windowWidth;
    console.log((width - 20) / 4);
    // Draw guides
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.bezierCurveTo(width/4, 20, width * 3 / 4, 80, width, 50)
    ctx.lineTo(0, 70);
    ctx.lineTo(width, 70);
    // ctx.setFillStyle('white')
    // ctx.fill()
    ctx.moveTo(width,50);
    ctx.lineTo(width,70);
    ctx.lineTo(0, 70);
    ctx.setFillStyle('white')
    ctx.moveTo(0, 50);
    ctx.lineTo(width, 70);
    ctx.lineTo(0, 70);
    ctx.setFillStyle('white')

    ctx.fill()
    ctx.clip()
    ctx.draw()
  }
});