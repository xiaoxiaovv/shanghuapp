/**
 * 定时器
 * @param callback              回调函数
 * @param delay                 间隔时间
 * 
 * 先全局定义并实例化Interval类
 * 在需要的地方使用 对象.openInterval 的方式启动定时器
 * 在需要的地方使用 对象.closeInterval 的方式关闭定时器
 * 两次调用openInterval()，后者会覆盖前者
 */
export const Interval = (callback, delay = 1000) => {
  /**
   * 定时器label
   */
  let interval = null
  /**
   * 计数变量
   */
  let count = 0
  /**
   * 第一次开始
   */
  let startInterval = () => {
	  callback && callback(0)
  }
  /**
   * 开启定时器
   */
  let openInterval = ()  => {
    if (interval) {
      closeInterval()
    }
    interval = setInterval(() => {
      count++
      callback && callback(count)
    }, delay)
  }
  /**
   * 关闭定时器
   */
  let closeInterval = () => {
    if (interval !== null) {
      clearInterval(interval)
      interval = null
      count = 0
    }
  }
  return {
    openInterval,
    closeInterval,
	startInterval
  }
}

/**
 * 金额限制，没有效果
 */
export const getRealMoney = (val) => {
	if (val === '') {
		return null
	}
	if (val === '.') {
		return '0.'
	}
	if (/^0\d+$/.test(val)) {
		return val.slice(1)
	}
	if (val.split('.').length > 2) {
		return val.slice(0, -1)
	}
	if (/^\d+\.\d{3}$/.test(val)) {
		return val.slice(0, -1)
	}
	return val
}

/**
 * toast
 */
export const showToast = (title, duration = 2000, callback) => {
	uni.showToast({
		title,
		icon: 'none',
		duration
	})
	setTimeout(() => {
		callback && callback()
	}, duration)
}

/**
 * 模态框
 */
export const showModal = (content, title = '提示') => {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title,
			content,
			showCancel: true,
			success: (res) => {
				if (res.confirm) {
					resolve && resolve()
				} else if (res.cancel) {
					reject && reject()
				}
			}
		})
	})
}

/**
 * loading
 */
export const showLoading = (flag = true) => {
	let method = (flag ? 'show' : 'hide') + 'Loading'
	uni[method]()
}

/**
 * 获取当前时间
 */
export const getCurrentTime = () => {
	let date = new Date()
	let y = date.getFullYear()
	let MM = date.getMonth() + 1
	MM = MM < 10 ? ('0' + MM) : MM
	let d = date.getDate()
	d = d < 10 ? ('0' + d) : d
	let today =  y + '-' + MM + '-' + d
	return today
}

/**
 * 调试日志
 */
export const debug = (data, flag = true) => {
	// let tmp = `${getCurrentTime()} =>\n${JSON.stringify(data)}\n`
	// return new Promise((resolve, reject) => {
	// 	fs.appendFile('../debug.txt', tmp, 'utf8', (err) => {
	// 		if (err) {
	// 			console.log('debug日志写入失败')
	// 			reject && reject(err)
	// 		} else {
	// 			resolve && resolve()
	// 		}
	// 	})
	// })
	flag && console.log(JSON.stringify(data))
}

/*判断obj是否为一个整数*/
function isInteger(obj){
	return Math.floor(obj) === obj;
}

/**
* 将一个浮点数转换成整数，返回整数和倍数
* 如 3.14 》》314  倍数是100
*
*/
function toInteger(floatNum){
	var ret = {times:1,num:0};  

	//是整数
	if(isInteger(floatNum)){
		ret.num = floatNum;
		return ret; 
	}

	var strfi = floatNum + '';
	//查找小数点的下标
	var dotPos = strfi.indexOf('.');
	// console.log('dotPos===='+dotPos);
	//获取小数的位数
	var len = strfi.substr(dotPos+1).length;
	// console.log('len===='+len);
	//Math.pow(10,len)指定10的len次幂。
	var time = Math.pow(10,len);

	//将浮点数转化为整数
	var intNum = parseInt(floatNum*time + 0.5,10);
	// console.log('intNum===='+intNum);
	ret.times = time;
	ret.num = intNum;
	return ret;
}

/**
*进行运算
*三个参数分别是要运算的两个数和运算符
*/
function operation(a,b,op){
	var o1 = toInteger(a);
	var o2 = toInteger(b);
	var n1 = o1.num;
	var n2 = o2.num;
	var t1 = o1.times;
	var t2 = o2.times;
	var max = t1 > t2 ? t1 : t2;
	var result = null;
	switch(op){
		case 'add':
			if(t1 === t2){
				result = n1 + n2;
			}else if(t1 > t2){
				result = n1 + n2 * (t1/t2);
			}else{
				result = n1 * (t2/t1) + n2;
			}

			return result / max;
			break;
		case 'subtract':
			if(t1 === t2){
				result = n1  - n2;
			}else if(t1 > t2){
				result = n1 - n2 * (t1/t2);
			}else{
				result = n1 * (t2/t1) - n2;
			}

			return result / max;
			break;
		case 'multiply':
			result = (n1 * n2)/(t1 * t2);
			return result;
			break;
		case 'divide':
			result = (n1 / n2)/(t2 / t1);
			return result;
			break;
	}    
}

/**
 * 获取两个数值的差值
 * @param {Object} num1
 * @param {Object} num2
 */
export function getSubValue(num1, num2) {
	return operation(num1, num2, 'subtract')
} 