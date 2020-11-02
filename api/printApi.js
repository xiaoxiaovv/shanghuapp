import { printX } from './vueAPI.js'
import { showToast, showLoading, showModal } from '../common/wxapi.js'

/**
 * 云打印
 * 
 * @param(*) yunEquipmentId			打印机的ID
 * @param(*) bottomContent			打印的内容
 * @param(*) title					打印的标题
 */
export const printY = (yunEquipmentId, bottomContent, title) => {
	return new Promise((resolve, reject) => {
		// uni.showLoading({
		// 	title: '打印中'
		// })
		printX(yunEquipmentId, bottomContent, title).then(res => {
			showLoading(false)
			if (res) {
				showToast('打印请求已发送')
				resolve && resolve()
			}
		}).catch(err => {
			showLoading(false)
			showToast('打印失败')
			reject && reject()
		})
	})
}

/**
 * 是否有后台打印机
 */
export const hasPrefixPrinters = () => {
	let storeId = ''
	let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
	if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
		storeId = nowStoreDetail.storeId
	}
	let userId = uni.getStorageSync('userId') || ''
	let key = 'key_' + storeId + '_' + userId
	
	let prefixPrinterArr = uni.getStorageSync('prefixPrinter')
	let prefixObj = null
	if (prefixPrinterArr && prefixPrinterArr.length) {
		prefixPrinterArr = prefixPrinterArr.filter((item, index) => {
			return item[key] !== undefined
		})
		if (prefixPrinterArr.length && prefixPrinterArr[0][key]) {
			prefixObj = prefixPrinterArr[0][key]
		}
	}
	return prefixObj
}

/**
 * 是否有前台打印机
 */
export const hasPostfixPrinters = () => {
	let storeId = ''
	let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
	if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
		storeId = nowStoreDetail.storeId
	}
	let userId = uni.getStorageSync('userId') || ''
	let key = 'key_' + storeId + '_' + userId
	
	let postfixPrinterArr = uni.getStorageSync('postfixPrinter')
	let postfixObj = null
	if (postfixPrinterArr && postfixPrinterArr.length) {
		postfixPrinterArr = postfixPrinterArr.filter((item, index) => {
			return item[key] !== undefined
		})
		if (postfixPrinterArr.length && postfixPrinterArr[0][key]) {
			postfixObj = postfixPrinterArr[0][key]
		}
	}
	return postfixObj
}

/**
 * 判断打印机是否存在
 */
export const isPrinterExist = () => {
	return (!!hasPrefixPrinters() || !!hasPostfixPrinters()) 
}

/**
 * 获取打印对象的Promise
 */
export const getPrintPromise = (type, yunEquipmentId, title, data) => {
	return () => {
		printY(yunEquipmentId, data, title)
	}
}

/**
 * 云打印
 * @param(*) data		打印的数据，对象
 * @param(*) title		打印的标题		
 */
export const print = (data, title) => {
	let prefixObj = hasPrefixPrinters()
	let postfixObj = hasPostfixPrinters()
	let tmpArr = []
	if (prefixObj) {
		tmpArr = [
			getPrintPromise('background', prefixObj['id'], title, data)
		]
	}
	if (postfixObj) {
		tmpArr = [
			...tmpArr,
			getPrintPromise('foreground', postfixObj['id'], title, data)
		]
	}
	let delay = 5000
	let tmpDeday = 0
	if (tmpArr.length >= 2) {
		for (let i = 0; i < tmpArr.length; i++) {
			tmpDeday = delay * i
			setTimeout(() => {
				tmpArr[i]()
			}, tmpDeday)
		}
		tmpDeday += 2000
	} else if (tmpArr.length === 1) {
		tmpArr[0]()
		tmpDeday = 2000
	} else {
		tmpDeday = 2000
	}
	return tmpDeday
}
