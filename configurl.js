// var host="http://39.106.112.135:9000/";
var host="http://localhost:62115/";
var config={
   host,
   //登入
   loginAuto_url:host+"api/WXLogin/WXAutoLogin",
   login_url:host+"api/WXLogin/WXLogin",
   loginVerify_url:host+"api/WXLogin/WXAVerifyLogin",
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
   getApplyInfo_url:host+"api/ApplyWX/GetApplyInfo",
   getApplyList_url:host+"api/ApplyWX/GetApplyListByPage",
   deleteApply_url:host+"api/ApplyWX/DeleteApply",
   //对账单
   getAccountNotCheckPurchase_url:host+"api/ApplyWX/GetApplyOfPurchaseAccountCheck",
   saveAccountCheck_url:host+"api/AccountCheckWX/SaveAccountCheck",
   getAccountCheckList_url:host+"api/AccountCheckWX/GetAccountCheckListByPage",
   getAccountCheckForEdit_url:host+"api/AccountCheckWX/GetAccountCheckForEdit",
   deleteAccountCheck_url:host+"api/AccountCheckWX/DeleteAccountCheck",
   //应收付款单
   getAccountCanPaymentList_url:host+"api/AccountCanPaymentWX/GetAccountCanPaymentListByPage",
   getAccountCanPaymentAddInfo_url:host+"api/AccountCheckWX/GetAccountCanPaymentAddInfoByCheckId",
   saveAccountCanPayment_url:host+"api/AccountCanPaymentWX/SaveAccountCanPayment",
   deleteAccountCanPaymentg_url:host+"api/AccountCanPaymentWX/DeleteAccountCanPayment",
   getPaymentDays_url:host+"api/CustomerWX/GetPaymentDays",
   getAccountCanPaymentForEdit_url:host+"api/AccountCanPaymentWX/GetAccountCanPaymentForEdit",
}
module.exports=config;