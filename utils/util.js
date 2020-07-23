//年月日 时分秒
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//年月日
const formatDate = date =>{
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-') 
}

//年月日
const formatDateAdd = (date,addMonth=0, addDay=0 )=>{
  var year = date.getFullYear()
  var month =0
  if( addMonth>0){
    var monthTotal = parseInt(date.getMonth() + 1+ addMonth);
    if(monthTotal%12!=0){
      year += parseInt(monthTotal/12);
      month =  parseInt(monthTotal%12)
    }
    else{
      month=monthTotal
    }
  }
  else{
    var monthTotal = parseInt(date.getMonth() + 1+ addMonth);
    if(monthTotal<0){
      if(monthTotal%12!=0){
        year += parseInt(monthTotal/12);
        month =date.getMonth() + 1+ parseInt(monthTotal%12)
      }
    }else{
      month=monthTotal
    }
  }
  const day = date.getDate()+ addDay
  return [year, month, day].map(formatNumber).join('-') 
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate:formatDate,
  formatDateAdd:formatDateAdd,
}
