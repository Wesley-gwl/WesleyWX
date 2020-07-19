var util = require('../../utils/util.js');
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    orderDate: '',
    deliveryDate: '',
    showTypeSelect: false,
    actions: [
      {
        type:'0',
        name: '采购单',
      },
      {
        type:'1',
        name: '调拨采购单',
      },
      {
        type:'2',
        name: '采购退货单',
      },
    ],
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
  DateChange(event) {
    console.log(event.detail);
    this.setData({
      orderDate: event.detail.value,
    });
  },
  DateChange2(event) {
    console.log(event.detail);
    this.setData({
      deliveryDate: event.detail.value,
    });
  },
  onInput(event) {
    this.setData({
      deliveryDate: event.detail,
    });
  },
  //提交
  onSubmit:function(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatDate(new Date());
    this.setData({
      orderDate: time,
      deliveryDate: time,
    });
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