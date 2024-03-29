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
    type: 0,
    typeName:"销售单",
    status:0,
    statusName:"申请",
    totalPrice:0.000,
    memo:"",
    freightCode:"",
    customer:{},
    productList:[],
    loadModal:false,
    showTypeSelect: false,
    submitText:"提交",
    customerUrl:"../customer/customer",
    productUrl:"../product/product",
    actions: [
      {
        type:'0',
        name: '销售单',
      },
      {
        type:'1',
        name: '零售单',
      },
      {
        type:'2',
        name: '调货销售单',
      },
      {
        type:'5',
        name: '销售退货单',
      },
      {
        type:'5',
        name: '销售退货单',
      }
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
  //输入赋值
  onFieldChange(e){
    this.setData({
      [e.target.dataset.key]:e.detail
    });
  },
  onSelect(event){
    if(that.data.isLook){
      return;
    }
    this.setData({ showTypeSelect: true });
    if(event.detail.type != null){
      this.setData({ typeName: event.detail.name ,type:event.detail.type});
    }
  },
  //修改数量
  handleChangeNumber (e) {
    if(that.data.isLook){
      return;
    }else{
      var index = e.target.dataset.index;
      var mText = 'productList['+ index +'].number';
      this.setData({
        [mText]: e.detail
      })
      this.calculateTotalPrice();
    }
  },
  //修改金额
  handleChangePrice (e) {
    if(that.data.isLook){
      return;
    }
    else{
      var index = e.target.dataset.index;
      var mText = 'productList['+ index +'].purchasePrice';
      this.setData({
        [mText]: e.detail
      })
      this.calculateTotalPrice();
    }
  },
  //计算总价
  calculateTotalPrice:function(){
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
    if(that.data.isLook){
      return;
    }
    this.setData({ showTypeSelect: false });
  },
  //修改单据日期
  DateChange(event) {
    if(that.data.isLook){
      return;
    }
    this.setData({
      orderDate: event.detail.value,
    });
  },
  //修改交货日期
  DateChange2(event) {
    if(that.data.isLook){
      return;
    }
    this.setData({
      deliveryDate: event.detail.value,
    });
  },
  //删除商品
  onCloseProduct(event) {
    if(that.data.isLook){
      return;
    }
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
    if(that.data.isLook){
      wx.navigateBack({//返回上一页
        delta: 1
        })
      return;
    }
    var data =that.data;
    if(data.type !=1&&data.customer.id == null){
      Notify({ type: 'warning', message: '请先选择客户' ,duration: 2000});
      return ;
    }
    if(data.productList.length<1){
      Notify({ type: 'warning', message: '请先增加商品',duration: 2000 });
      return ;
    }
    that.setData({
      loadModal: true
    })
    var input = {};
    var Apply ={};
    Apply.Id= data.id;
    Apply.Code = data.code;
    Apply.Type = data.type;
    Apply.CustomerId= data.customer.id;
    Apply.CustomerName =data.customer.name;
    Apply.CompanyName = data.customer.companyName;
    Apply.PhoneNumber =data.customer.phoneNumber;
    Apply.OrderDate = data.orderDate;
    Apply.DeliveryDate = data.deliveryDate;
    Apply.TotalPrice = data.totalPrice/100;
    Apply.LastPrice = data.totalPrice/100;
    Apply.Status = data.status;
    Apply.FreightCode = data.freightCode;
    if(data.freightCode != ''){
      Apply.Status = 1//待收款
    }
    if(data.freightCode != ""&&data.type==1){
      Apply.Status = 4//完成
    }
    Apply.Memo = data.memo == null?"":data.memo;
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
          customerUrl:"",
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
      customer.phoneNumber = apply.phoneNumber;
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
      var time2 = util.formatDateAdd(new Date(),0,3);
      this.setData({
        orderDate: time,
        deliveryDate: time2,
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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