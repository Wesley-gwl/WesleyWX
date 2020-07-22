var util = require('../../utils/util.js');
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    totalPrice:0.000,
    customer:{},
    productList:[],
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
  onSelect(event){
    this.setData({ showTypeSelect: true });
    if(event.detail.type != null){
      this.setData({ typeName: event.detail.name ,type:event.detail.type});
    }
  },
  //修改数量
  handleChangeNumber (e) {
    var index = e.target.dataset.index;
    var mText = 'productList['+ index +'].number';
    this.setData({
      [mText]: e.detail.value
    })
    this.calculateTotalPrice();
  },
  //修改金额
  handleChangePrice (e) {
    var index = e.target.dataset.index;
    var mText = 'productList['+ index +'].purchasePrice';
    this.setData({
      [mText]: e.detail.value
    })
    this.calculateTotalPrice();
  },
  calculateTotalPrice:function(){
    var that = this;
    var list = that.data.productList;
    console.log(list);
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
  onClose() {
    this.setData({ showTypeSelect: false });
  },
  DateChange(event) {
    this.setData({
      orderDate: event.detail.value,
    });
  },
  DateChange2(event) {
    this.setData({
      deliveryDate: event.detail.value,
    });
  },
  onInput(event) {
    this.setData({
      deliveryDate: event.detail,
    });
  },
  //删除商品
  onCloseProduct(event) {
    var that = this;
    console.log(event);
    var id = event.currentTarget.dataset.id;
    var list =that.data.productList;
    var re = [];
    list.forEach(e => {
      if(e.id!= id){
        re.push(e);
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
        wx.showModal({
          title: '提示',
          content: '请先增加商品',
          duration: 2000
        })
      }
      if(data.customer == {}){
        wx.showModal({
          title: '提示',
          content: '请先选择供应商',
          duration: 2000
        })
      }
      var input = {};
      var apply ={};
      apply.code = data.code;
      apply.type = data.type;
      apply.customerId= data.customer.id;
      apply.customerName =data.customer.name;
      apply.conpanyName = data.customer.conpanyName;
      apply.phoneNumber =data.customer.phoneNumber;
      apply.orderDate = data.orderDate;
      apply.deliveryDate = data.deliveryDate;
      apply.totalPrice = data.totalPrice/100;
      apply.lastPrice = data.totalPrice;
      apply.freightCode = data.freightCode;
      apply.memo = data.memo;
      input.apply= apply;
      var applyItemList = [];
      data.productList.forEach(e => {
        var item = {};
        item.productId = e.id;
        item.productName = e.name;
        item.code = e.code;
        item.spec = e.spec;
        item.unit = e.unit;
        item.number = e.number;
        item.price = e.price;
        item.totalPrice = e.number*e.price
        applyItemList.push(item);
      });
      input.applyItemList=applyItemList;
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
    console.log(this.data.customer);
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