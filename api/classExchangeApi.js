import { print, isPrinterExist } from './printApi'
import { showToast, showLoading, showModal } from '../common/wxapi.js'

// 打印的标题
// export const TITLE = '交接班小票'
export const TITLE = uni.getStorageSync('merchantName') || ''

/**
 * 用户类型过滤
 * @param(*)							用户类型
 */
export const userTypeFilter = (userType) => {
	if (userType == 1) {
		return '商户'
	} else if (userType == 2) {
		return '店长'
	} else if (userType == 3) {
		return '员工'
	} 
	return ''
}

/**
 * 获取打印的交接班详情
 * 
 * @param(*) classDetails				交接班详情
 */
export const getPrintClassDetail = (classDetails) => {
	return new Promise((resolve, reject) => {
		if (classDetails) {
			if (Object.keys(classDetails).length) {
				let data = {
					"收银员": classDetails['userName'] || '',
					"职位": userTypeFilter(classDetails['userType']),
					"实际营收": (classDetails['actualMoney'] || '0.00') + '元',
					"交易金额": (classDetails['amountMoney'] || '0.00') + '元',
					"交易笔数": (classDetails['amountCount'] || 0) + '笔',
					"退款金额": (classDetails['refundMoney'] || '0.00') + '元',
					"退款笔数": (classDetails['refundCount'] || 0) + '笔',
					"开始时间": classDetails['workTime'] || '',
					"结束时间": classDetails['endWorkTime'] || ''
				}
				resolve && resolve(data)
			} else {
				showToast('打印失败，交接班信息无效')
				reject && reject()
			}
		} else {
			showToast('打印失败，没有交接班信息')
			reject && reject()
		}
	})
}

/**
 * 交接并打印
 * 
 * @param(*) classDetails				交接班详情
 * @param(*) isToastShow				是否显示Toast
 */
export const getPrintClassDetailAndPrint = (classDetails, isToastShow = true, isExchange = false) => {
	if (!isPrinterExist()) {
		isToastShow && showToast('请先添加打印机')
		if (!isExchange) {
			return
		}
	}
	// let title = TITLE
	let title = uni.getStorageSync('merchantName') || ''
	getPrintClassDetail(classDetails).then((data) => {
		if (!isExchange) {
			print(data, title)
		} else {
			let delay = print(data, title)
			setTimeout(() => {
				doLoginOut()
			}, delay)
		}
	})
}

/**
 * 登出
 */
export function doLoginOut () {
	uni.reLaunch({
		url: '/pages/login/index/index',
		success() {
			uni.removeStorageSync('token')
			uni.removeStorageSync('userId')
			uni.removeStorageSync('userType')
			uni.removeStorageSync('beginTime')
			uni.setStorageSync('remember', true)
			uni.setStorageSync('isLogin', true)
		}
	})
}