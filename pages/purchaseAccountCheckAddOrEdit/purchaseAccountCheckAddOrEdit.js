var util = require('../../utils/util.js');
const config = require("../../configurl");
import Notify from '../../dist/notify/notify';
var header;
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    isLook:false,
    isEdit:false,
    title:"",
    type: 1,
    typeName:"采购对账单",
    status:0,
    statusName:"新建",
    totalAmount:0.000,
    lastAmount:0.000,
    memo:"",
    customer:{},
    applyList:[],
    loadModal:false,
    showTypeSelect: false,
    submitText:"提交",
    supplierUrl:"../supplier/supplier",
    purchaseUrl:"../purchaseNotCheckList/purchaseNotCheckList",
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
   //输入赋值
   onFieldChange(e){
    this.setData({
      [e.target.dataset.key]:e.detail
    });
  },
  //验证输入金额
  inputTotalPrice:function(e){
    var reg=new RegExp('^[0-9]+.?[0-9]*$');
    var istrue=reg.test(e.detail);
    that.setData({
      totalAmount:istrue?e.detail:0,
    })
  },
  //计算总价
  calculateTotalPrice:function(){
    var list = that.data.applyList;
    if( list.length>0){
      var total=Number(0.000);
      list.forEach(e => {
        total+= e.totalPrice;
      });
      that.setData({
        lastAmount : total*100,
        totalAmount:total
      })
    }else{
      that.setData({
        lastAmount : 0.000 ,
        totalAmount:0.000
      })
    }
  },
  //修改单据日期
  dateChange(event) {
    if(that.data.isLook){
      return;
    }
    this.setData({
      date: event.detail.value,
    });
  },
  //选择单据按钮
  onSelectApply(){
    if(that.data.customer.id==null){
      Notify({ type: 'warning', message: '请先选择供应商',duration: 2000 });
      return
    }else{
      if(that.data.purchaseUrl!=""){
        var url =that.data.purchaseUrl+"?customerId="+that.data.customer.id;
        wx.navigateTo({
          url:url
        })
      }
    }
  },
  //删除单据
  onCloseApply(event) {
    if(that.data.isLook){
      return;
    }
    var id = event.currentTarget.dataset.id;
    var list =that.data.applyList;
    var re = [];
    list.forEach(e => {
      if(e.applyItemId!= id){
        re.push(e);
      }
    });
    that.setData({ applyList: re });
    that.calculateTotalPrice();
  },
  //提交
  onSubmit:function(){
    if(that.data.isLook){
      wx.navigateBack({//返回上一页
        delta: 1
        })
      return;
    }
    var data =that.data;
    console.log(data);
    if(data.title == ''){
      Notify({ type: 'warning', message: '请填写标题' ,duration: 2000});
      return ;
    }
    if(data.customer.id == null ){
      Notify({ type: 'warning', message: '请先选择供应商' ,duration: 2000});
      return ;
    }
    if(data.applyList.length<1){
      Notify({ type: 'warning', message: '请先增加单据',duration: 2000 });
      return ;
    }
    that.setData({
      loadModal: true
    })
    var input = {};
    var AccountCheck ={};
    AccountCheck.Id= data.id;
    AccountCheck.Code = data.code;
    AccountCheck.Title = data.title;
    AccountCheck.Type = data.type;
    AccountCheck.CustomerId= data.customer.id;
    AccountCheck.CustomerName =data.customer.name;
    AccountCheck.CompanyName = data.customer.companyName;
    AccountCheck.PhoneNumber =data.customer.phoneNumber;
    AccountCheck.Date = data.date;
    AccountCheck.TotalAmount = data.totalAmount;
    AccountCheck.LastAmount = data.lastAmount/100;
    AccountCheck.Status = data.status;
    AccountCheck.Memo = data.memo == null?"":data.memo;
    input.AccountCheck=AccountCheck;
    var AccountCheckDetails = [];
    data.applyList.forEach(e => {
      var item = {};
      item.applyId = e.applyId;
      item.applyCode=e.applyCode;
      item.applyType = e.applyType;
      item.CustomerName =e.name;
      item.CompanyName = e.companyName;
      item.ApplyItemId = e.applyItemId;
      item.ProductId = e.productId;
      item.ProductName = e.productName;
      item.ProductCode = e.productCode;
      item.ProductSpec = e.productSpec;
      item.Unit = e.unit;
      item.Number = e.number;
      item.Price = e.price;
      item.TotalPrice = e.totalPrice;
      item.OrderDate = e.orderDate;
      item.DeliveryDate =e.deliveryDate;
      item.FreightCode = e.freightCode;
      AccountCheckDetails.push(item);
    });
    input.AccountCheckDetails=AccountCheckDetails;
    console.log(input);
    wx.request({
      url: config.saveAccountCheck_url,
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
            title: '操作成功',//提示文字
            duration:1000,//显示时长
            mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false  
            icon:'success', //图标，支持"success"、"loading"  
            success:function(){ 
              setTimeout(function(){ 
                wx.navigateBack({//返回上一页
                delta: 1
                })
              },1500);
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
    that = this;
    that.setHeader();
    that.setData({
      loadModal: true
    })
    if(options.id!=null){
      that.getApplyInfo(options.id);
    }
    that.setData({
      loadModal: false
    })
  },
  getApplyInfo:function(id){
    wx.request({
      url: config.getApplyInfo_url,
      method: 'get',
      header: header,//传在请求的header里
      data:{id:id},
      success(res) {
        if(res.data.success){
          return that.loadData(res.data.data);
        }
        else{
          Notify({ type: 'warning', message: res.data.message ,duration: 2000});
          return null;
        }
      }
    })
  },
  loadData:function(output){
    if(output!=null){
      var apply = output.apply;
      if(apply.status!=0){
        that.setData({
          submitText:"返回",
          isLook:true,
          supplierUrl:"",
          productUrl:""
        })
      }
      else{
        that.setData({
          isEdit:true
        })
      }
      var customer = {};
      customer.id = apply.customerId;
      customer.name = apply.customerName;
      customer.companyName = apply.companyName;
      var productList = [];
      var index = 0;
      output.applyItemList.forEach(e => {
        var product = {};
        product.id = e.productId;
        product.spec = e.spec;
        product.code = e.code;
        product.name = e.productName;
        product.unit = e.unit;
        product.number = e.number;
        product.purchasePrice = e.price;
        product.totalPrice = e.totalPrice;
        product.memo = e.memo;
        product.index = index;
        productList.push(product);
        index++;
      });
      that.setData({
        id:apply.id,
        customer:customer,
        code:apply.code,
        type:apply.type,
        typeName:apply.typeName,
        freightCode:apply.freightCode,
        memo:apply.memo,
        orderDate:apply.orderDate.substring(0,10),
        deliveryDate:apply.deliveryDate.substring(0,10),
        productList :productList,
        stutas:apply.status,
        statusName : apply.statusName
      })
      that.calculateTotalPrice();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(!(that.data.isEdit||that.data.isLook)){
      var time = util.formatDate(new Date());
      this.setData({
        date: time,
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(that.data.applyList);
    this.setHeader();
    this.calculateTotalPrice();
  },
  setHeader:function(){
    if(header==null||header=={}){
      var key = wx.getStorageSync("key");
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