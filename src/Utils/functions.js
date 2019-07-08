let currentDate = new Date()
let day = ("0" + (currentDate.getMonth())).slice(-2);
var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
let year = currentDate.getFullYear()
export const today =   (year+'-'+month+'-'+day)