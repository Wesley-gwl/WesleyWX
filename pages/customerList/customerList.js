const config = require("../../configurl");
import Dialog from '../../dist/dialog/dialog';
import Notify from '../../dist/notify/notify';
var header;
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //左侧分类
    customerTypeList: [],
    //商品列表
    customerList:[],
    idx:1000,
    customerIndex:-1,
    show:false
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
    });
  },
  //关闭更多条件筛选
  onCloseMore() {
    this.setData({ show: false });
    this.onSearch();
  },
  //分类d点击
  getCustomerList(re){
    var index = re.currentTarget.dataset.index;
    that.setData({ idx: index })
    var e = re.currentTarget.dataset.id;
    wx.request({
      url: config.customerList_url,
      method: 'post',
      header: header,//传在请求的header里
      data:{
        CustomerTypeId:e,
        Type:0,
        IsLoadMerchants:false
      },
      success(res) {
        if(res.data.success){
          that.setData({
            customerList:res.data.data,
            customerIndex:-1,
            radio: '1'
          });
        }
      }
    })
  },
  //查询
  onSearch:function(e){//回车触发
    var searchtext = "";
    if(e!=null){
      searchtext= e.detail;
    }
    var that = this;
    wx.request({
      url: config.customerList_url,
      method: 'post',
      header: header,//传在请求的header里
      data:{
        Filter:searchtext,
        Type:0,
        IsLoadMerchants:false
      },
      success(res) {
        if(res.data.success){
          that.setData({
            customerList:res.data.data
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.data.config = wx.getStorageSync('config');
    wx.createSelectorQuery().selectAll('.position').boundingClientRect(function (rects) {
      that.setData({ positions:rects })
    }).exec();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that =this;
    var key = wx.getStorageSync("key");
    console.log(key);
    if(!key){
      wx.switchTab({
        url:'/pages/login/login'
      })
      wx.showToast({
        title: '请先登入',
        duration: 2000
      })
    }
    header = {
      'content-type': 'application/x-www-form-urlencoded',
      'sessionKey':key//读取cookie
    };
    that.GetCustomerType();
    that.onSearch();
  },
  //获取分类
  GetCustomerType:function(){
    wx.request({
      url: config.getCustomerTypeList_url,
      method: 'get',
      header: header,//传在请求的header里
      data:{type:0},
      success(res) {
        if(res.data.success){
          that.setData({
            customerTypeList:res.data.data
          });
        }
      //请求成功的处理
      }
    })
  },
  onSwichCheck:function(event){
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
        that.deleteCustomer(event);
        break;
      case 'cell':
        break;
      case 'right':
        that.onLookCustomerInfo(event);
        break;
    }
    instance.close();
  },
  //删除
  deleteCustomer:function(event){
    var id = event.currentTarget.dataset.id;
    Dialog.confirm({
      title: '提示',
      message: '是否要删除这条数据'
    }).then(() => {
      that.DeleteCustomer(id);
      Dialog.close();
    }).catch(() => {
      Dialog.close();
    });;
  },
  DeleteCustomer:function(id){
    var key = wx.getStorageSync("key");
    wx.request({
      url: config.deleteCustomer_url,
      method: 'post',
      dataType:"json",
      header: {
        'sessionKey':key
      },
      data:JSON.stringify({id:id}),
      success(res) {
        if(res.data.success){
          Notify({ type: 'success', message: '删除成功' ,duration: 2000});
          that.onSearch();
        }
      }
    })
  },
  //新增
  addCustomer:function(){
    this.setData({ show: false });
    wx.navigateTo({
      url: '/pages/customerAddOrEdit/customerAddOrEdit',
    })
  },
  //新增
  addCustomerType:function(){
    this.setData({ show: false });
    wx.navigateTo({
      url: '/pages/customerTypeAddOrEdit/customerTypeAddOrEdit?customer='+JSON.stringify({type:0,typeName:'客户'}),
    })
  },
  //查看编辑详情
  onLookCustomerInfo:function(event){
    var id = event.currentTarget.dataset.id;
    var customer ={};
    for (let index = 0; index < that.data.customerList.length; index++) {
      const e =  that.data.customerList[index];
      if(e.id == id){
        customer=e;
        break;
      }
    }
    if(customer!={}){
      wx.navigateTo({
        url: '/pages/customerAddOrEdit/customerAddOrEdit?customer=' + JSON.stringify(customer),
      })
    }
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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