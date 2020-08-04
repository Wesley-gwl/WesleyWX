var util = require('../../utils/util.js');
const config = require("../../configurl");
import Notify from '../../dist/notify/notify';
var header;
var that;
Page({
  data: {
    current:1,//分页页数
    total:0,//总页数
    rows:5,//一页的行数
    show:false,
    searchText:'',
    product:{},
    inventoryList:[],
    showStorageSelect:false,
    storageList:[],
    storage:{},
    storageLocation:{}
  },
  //查询
  onSearch(){
    this.setData({ show: false });
    this.getInventortyList();
  },
   //选择仓库
  onSelectStorage:function(event){
    that.setData({ showStorageSelect: true });
    if(event.detail.type != null){
      var storage = {
        id : event.detail.type,
        name : event.detail.name 
      }
      that.setData({ 
        storage: storage,
        storageLocation: {}
      })
    }
  },
  //选择货架
  onSelectStorageLocation:function(){
    var url="../storageLocationSelect/storageLocationSelect"
    wx.navigateTo({
      url: url,
    })
  },
  //关闭类型选择
  onClose() {
    this.setData({ 
      showStorageSelect: false 
    });
  },
  //修改search控件值
  onChangeSearch(e){
    this.setData({ searchText: e.detail });
  },
  //展示更多条件筛选
  onShowMore(e){
    this.setData({ show: true });
  },
  //重置条件筛选
  clearMore(){
    this.setData({
      searchText: '',
      product:{},
      storage:{},
      storageLocation:{}
    });
  },
  //关闭更多条件筛选
  onCloseMore() {
    this.setData({ show: false });
    this.getInventortyList();
  },
  //分页按钮
  onPaged ({ detail }) {
    const type = detail.type;
    if (type === 'next') {
        this.setData({
            current: this.data.current + 1
        });
    } else if (type === 'prev') {
        this.setData({
            current: this.data.current - 1
        });
    }
    this.getInventortyList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getInventortyList();
    this.getStorageList();
  },
  //获取仓库下拉框
  getStorageList:function(){
    wx.request({
      url: config.getStorageCombobox_url,
      method: 'get',
      header: header,//传在请求的header里
      success(res) {
        if(res.data.success){
          that.setData({
            storageList : res.data.data,
          })
        }
      }
    })
  },
  //获取信息
  getInventortyList:function(){
    var data = that.data;
    var input ={};
    input.Filter = data.searchText;
    input.Page = data.current;
    input.Rows= data.rows;
    if(data.product.id!=null){
      input.productId = data.product.id;
    }
    wx.request({
      url: config.getInventoryList_url,
      method: 'post',
      dataType: "json",
      header: header,//传在请求的header里
      data:JSON.stringify(input),
      success(res) {
        if(res.data.success){
          var total = parseInt(res.data.data.total/data.rows);
          if(res.data.data.total%data.rows!=0){
            total++;
          }
          that.setData({
            inventoryList : res.data.data.rows,
            total:total
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that=this;
    if(header==null){
      var key = wx.getStorageSync("key");
      console.log(key);
      if(!key){
        wx.switchTab({
          url:'/pages/login/login'
        })
        wx.showModal({
          title: '提示',
          content: '请先登入',
          duration: 2000
        })
      }
      header = {
        'sessionKey':key//读取cookie
      };
    }

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