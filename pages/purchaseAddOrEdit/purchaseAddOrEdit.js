var util = require('../../utils/util.js');
const config = require("../../configurl");
import Notify from '../../dist/notify/notify';
var header;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 3,
    typeName:"采购单",
    totalPrice:0.000,
    customer:{},
    productList:[],
    loadModal:false,
    showTypeSelect: false,
    actions: [
      {
        type:'3',
        name: '采购单',
      },
      {
        type:'4',
        name: '调拨采购单',
      },
      {
        type:'6',
        name: '采购退货单',
      },
      {
        type:'6',
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
  onSelect(event){
    this.setData({ showTypeSelect: true });
    if(event.detail.type != null){
      this.setData({ typeName: event.detail.name ,type:event.detail.type});
    }
  },
  //修改数量
  handleChangeNumber (e) {
    console.log(e);
    var index = e.target.dataset.index;
    var mText = 'productList['+ index +'].number';
    this.setData({
      [mText]: e.detail
    })
    this.calculateTotalPrice();
  },
  //修改金额
  handleChangePrice (e) {
    console.log(e);
    var index = e.target.dataset.index;
    var mText = 'productList['+ index +'].purchasePrice';
    this.setData({
      [mText]: e.detail
    })
    this.calculateTotalPrice();
  },
  //计算总价
  calculateTotalPrice:function(){
    var that = this;
    var list = that.data.productList;
    if( list.length>0){
      var total=Number(0.000);
      list.forEach(e => {
        total+= (Number(e.purchasePrice)*Number(e.number));
      });
      console.log(total);
      that.setData({
        totalPrice : total*100
      })
    }else{
      that.setData({
        totalPrice : 0.000  
      })
    }
  },
  //关闭类型选择
  onClose() {
    this.setData({ showTypeSelect: false });
  },
  //修改单据日期
  DateChange(event) {
    this.setData({
      orderDate: event.detail.value,
    });
  },
  //修改交货日期
  DateChange2(event) {
    this.setData({
      deliveryDate: event.detail.value,
    });
  },
  //删除商品
  onCloseProduct(event) {
    var that = this;
    console.log(event);
    var id = event.currentTarget.dataset.id;
    var list =that.data.productList;
    var re = [];
    var index = 0;
    list.forEach(e => {
      if(e.id!= id){
        e.index =index;
        re.push(e);
        index++;
      }
    });
    that.setData({ productList: re });
    that.calculateTotalPrice();
  },
  //提交
  onSubmit:function(){
      var that = this;
      var data =that.data;
      if(data.productList.length<1){
        Notify({ type: 'warning', message: '请先增加商品',duration: 2000 });
        return ;
      }
      if(data.customer == {}){
        Notify({ type: 'warning', message: '请先选择供应商' ,duration: 2000});
        return ;
      }
      that.setData({
        loadModal: true
      })
      var input = {};
      var Apply ={};
      Apply.Code = data.code;
      Apply.Type = data.type;
      Apply.CustomerId= data.customer.id;
      Apply.CustomerName =data.customer.name;
      Apply.CompanyName = data.customer.companyName;
      Apply.PhoneNumber =data.customer.phoneNumber;
      Apply.OrderDate = data.orderDate;
      Apply.DeliveryDate = data.deliveryDate;
      Apply.TotalPrice = data.totalPrice/100;
      Apply.LastPrice = data.totalPrice;
      Apply.FreightCode = data.freightCode==null?"":data.freightCode;
      Apply.Memo = data.memo==null?"":data.memo;
      input.Apply=Apply;
      var ApplyItemList = [];
      data.productList.forEach(e => {
        var item = {};
        item.ProductId = e.id;
        item.ProductName = e.name;
        item.Code = e.code;
        item.Spec = e.spec;
        item.Unit = e.unit;
        item.Number = e.number;
        item.Price = e.purchasePrice;
        item.TotalPrice = e.number*Number(e.purchasePrice)
        ApplyItemList.push(item);
      });
      input.ApplyItemList=ApplyItemList ;
      console.log(input);
      wx.request({
        url: config.saveApply_url,
        method: 'post',
        dataType: "json",
        header: header,//传在请求的header里
        data:JSON.stringify(input),
        success(res) {
          if(res.data.success){
            that.setData({
              loadModal: false
            })
            wx.showToast({
              title: '添加成功',//提示文字
              duration:2000,//显示时长
              mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false  
              icon:'success', //图标，支持"success"、"loading"  
              success:function(){ 
                setTimeout(function(){ 
                  wx.navigateBack({//返回上一页
                  delta: 1
                 })
                },2000);
              },//接口调用成功
              fail: function () { },  //接口调用失败的回调函数  
              complete: function () { } //接口调用结束的回调函数  
           })
          }
          else{
            that.setData({
              loadModal: false
            })
            Notify({ type: 'warning', message: res.data.message ,duration: 2000});
          }
        }
      })
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
    var time = util.formatDate(new Date());
    this.setData({
      orderDate: time,
      deliveryDate: time,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
      //'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
  
      'sessionKey':key//读取cookie
    };
    this.calculateTotalPrice();
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