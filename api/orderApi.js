import { getOrderDetails } from './vueAPI.js'
import { print, isPrinterExist } from './printApi'
import { showToast, showLoading, showModal } from '../common/wxapi.js'

// 小票标题
// export const TITLE = '订单小票'
export const TITLE = uni.getStorageSync('merchantName') || ''
// 退款标题
// export const TITLE_REFUND = '订单退款'
export const TITLE_REFUND = uni.getStorageSync('merchantName') || ''

/**
 * 订单状态过滤
 */
export const orderStatusFilters = (val) => {
	switch(parseInt(val)){
		case 1:
			return '未支付';
			break;
		case 2:
			return '支付成功';
			break;
		case 3:
			return '支付失败（已关闭）';
			break;
		case 4:
			return '已撤销';
			break;
		case 5:
			return '全额退款成功';
			break;
		case 6:
			return '部分退款成功';
			break;
		case 7:
			return '退款失败';
			break;
		case 8:
			return '退款中';
			break;
		case 9:
			return '撤销失败';
			break;
		default:
			console.log("异常状态值："+val);
	}
}

/**
 * 订单支付方式过滤
 */
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
		case 99:	//未知支付
			return '未知支付';
			break;
		default:
			console.log("异常支付码："+val)
	}
}

/**
 * 订单支付方式图标过滤
 */
export const payWayImgFilters = (val) => {
	switch(parseInt(val)){
		case 1:		//微信支付
			return '/static/order/icon_wechat_list.png';
			break;
		case 2:		//支付宝支付
			return '/static/order/icon_zhifubao_list.png';
			break;
		case 3:		//银行卡支付
			return '/static/order/icon_unionpay_list.png';
			break;
		case 4:		//会员卡支付
			return '/static/home/icon_king.png';
			break;
		case 5:		//现金
			return '/static/home/icon_king.png';
			break;
		case 6:		//会员+微信
			return '/static/home/icon_king.png';
			break;
		case 7:		//会员+支付宝
			return '/static/home/icon_king.png';
			break;
		case 99:	//未知支付
			return '/static/order/icon_receive_money.png';
			break;
		default:
			console.log("异常支付码："+val)
	}
}

/**
 * 订单备注过滤
 */
export const remarksFilters = (val) => {
	if(val === null){
		return ''
	}
	return val
}

/**
 * 订单支付终端过滤
 */
export const payClientFilters = (val) => {
	switch(parseInt(val)){
		case 1:
			return 'PC端'
		case 2:
			return 'App端'
		case 3:
			return '其它'
		case 4:
			return 'POS机'
	}
}

/**
 * 订单金币处理
 */
export const dealWithMoney = (money) => {
	if (/^[0-9]+\.[0-9]$/.test(money)) {
		money = money + '0'
	} else if (/^[0-9]+$/.test(money)) {
		money = money + '.00'
	} else if (!money) {
		money = '0.00'
	}
	return money
}

/**
 * 订单支付渠道过滤
 */
export const payChannelFilters = (channel) => {
	if (channel === 1) {
		channel = '官方'
	} else if (channel === 2) {
		channel = '会员宝'
	} else if (channel === 3) {
		channel = '易融码'
	} else if (channel === 4) {
		channel = '统统收'
	} else if (channel === 5) {
		channel = '慧闪付'
	} else if (channel === 6) {
		channel = '富友'
	} else if (channel === 7) {
		channel = '随行付'
	} else if (channel === 8) {
		channel = '拉卡拉'
	} else if (channel === 9) {
		channel = '威富通'
	} else if (channel === 10) {
		channel = '乐刷'
	} else if (channel === 11) {
		channel = '传化'
	} else if (channel === 12) {
		channel = '天阙随行付'
	} else if (channel === 13) {
		channel = '易生'
	} else if (channel === 14) {
		channel = '新大陆'
	} 
	return channel
}

/**
 * 获取打印的订单详情
 */
export const getPrintOrderDetail = (orderDetails) => {
	return new Promise((resolve, reject) => {
		if (orderDetails) {
			if (Object.keys(orderDetails).length) {
				let userName = uni.getStorageSync('namename') || ''
				let data = {}
				if (orderDetails['payWay'] == 4) {
					// 会员卡
					data = {
						"订单金额": dealWithMoney(orderDetails['totalPrice']) + '元',
						"订单状态": orderStatusFilters(orderDetails['status']),
						"门店": orderDetails['storeName'] || '',
						"收银员": userName,
						"支付方式": payWayFilters(orderDetails['payWay']),
						"支付时间": orderDetails['payTime'] || '',
						"创建时间": orderDetails['createTime'] || '',
						"退款金额": dealWithMoney(orderDetails['refundPayPrice']) + '元'
					}
					if (orderDetails['refundTime']) {
						data['退款时间'] = orderDetails['refundTime'] || ''
						data['操作员'] = orderDetails['refundUsername'] || ''
					}
					data = {
						...data,
						"订单备注": remarksFilters(orderDetails['remarks']),
						"参考号": orderDetails.payClient == 4 ? (orderDetails['transactionId'] || '') : '',
						"订单编号": orderDetails['orderNumber'] || '',
						"QR| ": ''
					}
				} else {
					data = {
						"订单金额": dealWithMoney(orderDetails['totalPrice']) + '元',
						"订单状态": orderStatusFilters(orderDetails['status']),
						"门店": orderDetails['storeName'] || '',
						"收银员": orderDetails['username'] || orderDetails['userName'] || '',
						"支付方式": payWayFilters(orderDetails['payWay']),
						"支付终端": payClientFilters(orderDetails['payClient']),
						"支付渠道": payChannelFilters(orderDetails['payChannel']),
						"支付时间": orderDetails['payTime'] || '',
						"创建时间": orderDetails['createTime'] || '',
						"退款金额": dealWithMoney(orderDetails['refundPayPrice']) + '元'
					}
					if (orderDetails['refundTime']) {
						data['退款时间'] = orderDetails['refundTime'] || ''
						data['操作员'] = orderDetails['refundUsername'] || ''
					}
					data = {
						...data,
						"订单备注": remarksFilters(orderDetails['remarks']),
						"参考号": orderDetails.payClient == 4 ? (orderDetails['transactionId'] || '') : '',
						"订单编号": orderDetails['orderNumber'] || '',
						"QR| ": orderDetails['orderNumber'] || ''
					}
				}
				resolve && resolve(data)
			} else {
				showToast('打印失败，订单信息无效')
				reject && reject()
			}
		} else {
			showToast('打印失败，没有订单信息')
			reject && reject()
		}
	})
}

/**
 * 获取打印的订单详情并打印
 */
export const getPrintOrderDetailAndPrint = (orderDetails, isToastShow = true, isRefund = false) => {
	return new Promise((resolve, reject) => {
		let delay = 5000
		if (!isPrinterExist()) {
			isToastShow && showToast('请先添加打印机')
			resolve && resolve(delay)
			return
		}
		// let title = isRefund ? TITLE_REFUND :TITLE,
		let title = uni.getStorageSync('merchantName') || ''
		getPrintOrderDetail(orderDetails).then((data) => {
			delay = print(data, title)
			resolve && resolve(delay)
		}).catch(err => {
			resolve && resolve(delay)
		})
	})
}

/**
 * 获取订单详情并打印
 * 
 * @param {Object} orderNumber 		订单号
 */
export const getOrderDetailsAndPrint = (orderNumber, isToastShow = true, isRefund = false) => {
	showLoading(true)
	getOrderDetails(orderNumber).then(res => {
		showLoading(false)
		if (res && res.obj) {
			let orderDetails = res.obj
			getPrintOrderDetailAndPrint(orderDetails, isToastShow, isRefund)
		}
	}).catch(err => {
		showLoading(false)
		isPrinterExist() && showToast('打印失败，无法获取订单信息，请检查网络')
	})
}
