export const textToast = (text) => {
	uni.showToast({
		title: text,
		duration: 1000,
		icon: 'none'
	});
}

export const loading = () => {
	uni.showLoading({
		title: '加载中',
		mask: true
	});
}
// 银行卡号用*代替
export const cardFilter = (num) => {
	if (num) {
		return '****  ****  ****  ' + num.substring(num.length - 4);
	}
}

// 手机号用*代替
export const phoneFilter = (phone) => {
	if (num) {
		return phone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
	}
}


// 手机号用*代替
export const payWayFilters = (val) => {
				switch(parseInt(val)){
					case 1:		//微信支付
						return '微信';
						break;
					case 2:		//支付宝支付
						return '支付宝';
						break;
					case 3:		//银行卡支付
						return '银行卡';
						break;
					case 4:		//会员卡支付
						return '会员卡';
						break;
					case 5:		//现金支付
						return '现金';
						break;
					case 6:		//现金支付
						return '会员+微信';
						break;
					case 7:		//现金支付
						return '会员+支付宝';
						break;
					case 8:		//现金支付
						return '手机pos';
						break;	
					case 9:		//现金支付
						return '云闪付';
						break;		
					case 10:		//刷脸付 畅捷
						return '刷脸付';
						break;	
					case 99:	//未知支付
						return '未知支付';
						break;
					default:
						console.log("异常支付码："+val)
				}
			}