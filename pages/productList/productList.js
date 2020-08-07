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
    current:1,//分页页数
    total:0,//总页数
    rows:10,//一页的行数
    show:false,
    searchText:'',
    config:{},//url路径
    //左侧分类
    productTypeList: [],
    productTypeId:'',
    //商品列表
    productList:[],
    idx:1000,
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
  getProductList(re){
    var index = re.currentTarget.dataset.index;
    var e = re.currentTarget.dataset.id;
    that.setData({ 
      idx: index,
      productTypeId : e
     })
     that.onSearch();
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
    this.onSearch();
  },
  //查询
  onSearch:function(e){//回车触发
    var data = that.data;
    var searchtext = data.searchText;
    if(e!=null){
      searchtext= e.detail;
    }
    var input ={
      Filter:searchtext,
      ProductTypeId:data.productTypeId,
      Page : data.current,
      Rows: data.rows
    };
    wx.request({
      url: config.productListPage_url,
      method: 'post',
      header: header,//传在请求的header里
      dataType: "json",
      data: JSON.stringify(input),
      success(res) {
        if(res.data.success){
          var total = parseInt(res.data.data.total/data.rows);
          if(res.data.data.total%data.rows!=0){
            total++;
          }
          that.setData({
            productList:res.data.data.rows,
            total:total
          });
        }else{
          Notify({ type: 'warning', message: res.data.message,duration: 2000 });
        }
      }
    })
  },
  onSwichCheck:function(event){
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
        that.delete(event);
        break;
      case 'cell':
        break;
      case 'right':
        that.onLookInfo(event);
        break;
    }
    instance.close();
  },
  //删除
  delete:function(event){
    var id = event.currentTarget.dataset.id;
    Dialog.confirm({
      title: '提示',
      message: '是否要删除这条数据'
    }).then(() => {
      that.DeleteProduct(id);
      Dialog.close();
    }).catch(() => {
      Dialog.close();
    });;
  },
  DeleteProduct:function(id){
    wx.request({
      url: config.deleteProduct_url,
      method: 'post',
      dataType:"json",
      header: header,//传在请求的header里
      data:JSON.stringify({id:id}),
      success(res) {
        if(res.data.success){
          Notify({ type: 'success', message: '删除成功' ,duration: 2000});
          that.onSearch();
        }
      }
    })
  },
  //查看编辑详情
  onLookInfo:function(event){
    var id = event.currentTarget.dataset.id;
    var product = {};
    for (let index = 0; index < that.data.productList.length; index++) {
      const e = that.data.productList[index];
      if(e.id== id){
        product = e ;
         break;
      }
    }
    if(product!={}){
      wx.navigateTo({
        url: '/pages/productAddOrEdit/productAddOrEdit?product=' + JSON.stringify(product),
      })
    }
  },
  addProduct(){
    this.setData({ show: false });
    wx.navigateTo({
      url: '/pages/productAddOrEdit/productAddOrEdit' ,
    })
  },
  addProductType(){
    this.setData({ show: false });
    wx.navigateTo({
      url: '/pages/productTypeAddOrEdit/productTypeAddOrEdit',
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
      'sessionKey':key//读取cookie
    };
    that.GetProductType();
    that.onSearch();
  },
  GetProductType:function(){
    var that = this;
    wx.request({
      url: config.productType_url,
      method: 'get',
      header: header,//传在请求的header里
      success(res) {
        if(res.data.success){
          that.setData({
            productTypeList:res.data.data
          });
        }
      //请求成功的处理
      }
    })
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