const leftList = require("leftList.js");
var that = '';
var query;
Page({
  data: {
    leftList: [],
    idx: 0,
    scrollTop: 0,
    toView:'position0'
  },
  onLoad: function (options) {
    that = this;
    this.setData({ leftList: leftList.leftList })
    query = wx.createSelectorQuery();
    wx.createSelectorQuery().selectAll('.position').boundingClientRect(function (rects) {
      that.setData({ positions:rects })
    }).exec();
  },
  switchClassfun(e){
    var e = e.currentTarget.dataset.index;
    this.setData({ idx: e, toView: 'position' + e })
  },
  bindscrollfunc(e){
    var arr = [];
    for(var item of this.data.positions){
      if (item.top <= e.detail.scrollTop + 2){
        arr.push(item)
      }
    }
    this.setData({ idx:arr[arr.length-1].dataset.index })
  }
})