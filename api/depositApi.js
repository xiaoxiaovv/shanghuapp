import { getDepositList } from './vueAPI.js'
import { print, isPrinterExist } from './printApi'
import { showToast, showLoading, showModal, getSubValue } from '../common/wxapi.js'

// 打印的标题
// export const TITLE = '退押金小票'
export const TITLE = uni.getStorageSync('merchantName') || ''

/**
 * 金币处理
 */
export const dealWithMoney = (val) => {
	val += ''
	let arr = val.split('.')
	if (arr.length === 2) {
		if (arr[1].length === 1) {
			return val + '0'
		} else if (arr[1].length > 2) {
			return arr[0] + '.' + arr[1].slice(0, 2)
		}
		return val
	}
	return val + '.00'
}

/**
 * 押金状态过滤
 */
export const depositStatusFilter = (value) => {
	let val = ''
	if (value == 1) {
		val = '冻结中'
	} else if (value == 2) {
		val = '冻结成功'
	} else if (value == 3) {
		val = '解冻失败'
	} else if (value == 4) {
		val = '已解冻'
	}
	return val
}	

/**
 * 获取押金详情
 * 
 * @param(*) refundDetails				押金详情
 */
export const getPrintRefundDetail = (refundDetails) => {
	return new Promise((resolve, reject) => {
		if (refundDetails) {
			if (Object.keys(refundDetails).length) {
				// showModal('ok')
				let data = {
					"授权单号": (refundDetails['id'] || ''),
					"订单编号": (refundDetails['orderNumber'] || ''),
					"冻结金额": dealWithMoney(refundDetails['money']) + '元',
					"支付金额": dealWithMoney(getSubValue(refundDetails['money'], refundDetails['leftMoney'])) + '元',
					"退押金金额": dealWithMoney(refundDetails['leftMoney']) + '元',
					"冻结状态": depositStatusFilter(refundDetails['status']),
					"冻结时间": (refundDetails['updateTime'] || ''),
					"备注": (refundDetails['remark'] || '')
				}
				resolve && resolve(data)
			} else {
				showToast('打印失败，押金信息无效')
				reject && reject()
			}
		} else {
			showToast('打印失败，没有押金信息')
			reject && reject()
		}
	})
}

/**
 * 退押金并打印
 * 
 * @param(*) refundDetails				押金详情
 * @param(*) isToastShow				是否显示Toast
 */
export const getPrintRefundDetailAndPrint = (refundDetails, isToastShow = true) => {
	if (!isPrinterExist()) {
		isToastShow && showToast('请先添加打印机')
		return
	}
	// let title = TITLE
	let title = uni.getStorageSync('merchantName') || ''
	getPrintRefundDetail(refundDetails).then((data) => {
		print(data, title)
	})
}

/**
 * 退押金并打印
 * 
 * @param {Object} id 				   授权单号
 */
export const getRefundDetailAndPrint = (id, isToastShow = true) => {
	if (id) {
		// showLoading(true)
		getDepositList('', '', '', id, 1, 10).then(res => {
			// showLoading(false)
			if (res && res.obj && res.obj.content) {
				// showModal(JSON.stringify(res.obj.content[0]))
				let refundDetails = res.obj.content[0]
				getPrintRefundDetailAndPrint(refundDetails, isToastShow)
			}
		}).catch(err => {
			// showModal(err.msg)
			// showLoading(false)
			isPrinterExist() && showToast('打印失败，无法获取押金详情，请检查网络')
		})
	}
}