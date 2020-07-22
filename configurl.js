// var host="http://39.106.112.135:9000/";
var host="http://localhost:62115/";
var config={
   host,
   loginAuto_url:host+"api/WXLogin/WXAutoLogin",
   login_url:host+"api/WXLogin/WXLogin",
   //商品相关
   productType_url:host+"api/ProductTypeWX/GetList",
   productList_url:host+"api/ProductWX/GetProductList",
   //供应商客户相关
   supplierType_url:host+"api/CustomerTypeWX/GetTypeListOfPurchare",
   supplierList_url:host+"api/CustomerWX/GetCustomerListByType",
   customerType_url:host+"api/CustomerTypeWX/GetTypeListOfSale",
   customerList_url:host+"api/CustomerWX/GetCustomerListByType",
   //订单相关
   saveApply_url:host+"api/ApplyWX/SaveApply",
}
module.exports=config;