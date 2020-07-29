const config = require("../../configurl");
import Notify from '../../dist/notify/notify';
var header;
var that;
Page({
  data: {
    searchText:'',
    accountList:[],//加载行
    radio: '',//选中数据
  },
  //选中
  onSelect(event){
    var data= event.currentTarget.dataset;
    if(data.id == that.data.radio){
      this.setData({
        radio:''
      });
    }else{
      this.setData({
        radio:data.id
      });
    }
  },
  //查询
  onSearch(){
    this.getAccountList();
  },
  //修改search控件值
  onChangeSearch(e){
    this.setData({ searchText: e.detail });
  },
  //提交
  onSubmit:function(){
    var data = that.data;
    var account = that.data.accountList;
    if(data.radio!=''||account.length>0){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      var  selectAccount;
      for (let index = 0; index < account.length; index++) {
        const e = account[index];
        if(e.id== data.radio){
          selectAccount =  e;
          break;
        }
      }
      prevPage.setData({
        account: selectAccount
      })
    }
    wx.navigateBack({//返回上一页
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
      'sessionKey':key
    };
    this.getAccountList();
  },
  //获取信息
  getAccountList:function(){
    var data = that.data;
    var input ={};
    input.Filter = data.searchText;
    wx.request({
      url: config.getAccountList_url,
      method: 'post',
      dataType:"json",
      header: header,//传在请求的header里
      data:input,
      success(res) {
        if(res.data.success){
          if( res.data.data.length == 0){
            Notify({ type: 'primary', message: '无数据',duration: 2000 });
          }
          else{
            that.setData({
              accountList : res.data.data.rows,
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     that = this;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if(options.customerId!=null){
      that.setData({
        customerId: options.customerId
      })
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