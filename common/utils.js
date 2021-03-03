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