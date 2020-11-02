import { getFuiouPackage, getFuiouActivity, getFuiouVersion } from '../common/appcommon'

// 应用包名
let FUIOU_PACKAGE_NAME = getFuiouPackage() || 'com.centerm.epos.fuiou'
// 应用Activity名
let FUIOU_ACTIVITY_NAME = getFuiouActivity() || 'com.centerm.component.pay.PayEntryActivity'
// 应用版本号
let FUIOU_VERSION = getFuiouVersion() || '1.1.6'


/*************** 业务码 **************/

// 银行卡付款
let REQUEST_CODE_BANK_PAY = 10001
// 银行卡退款
let REQUEST_CODE_BANK_REFUND = 10002

/**
 * 判断第三方程序(如微信) 是否安装
 * @param {Object} packageName					应用包名
 */
const checkApp = (pname) => {
	try {
		if (pname) {
			return plus.runtime.isApplicationExist({
				pname
			})
		}
		return false
	} catch(e) {
		// nothing to do
	}
}

/**
 * 判断是否富友平台
 */
const isFuiouPlatform = () => {
	return checkApp(FUIOU_PACKAGE_NAME)
}

/**
 * 金币转化
 * @param money
 */
const translate = (money) => {
	if (money > 99999999.99) {
		money = 99999999.99
	} else if (money < 0.01) {
		money = 0.01
	}
	if (/^[0-9]+\.[0-9]{2}$/.test(money)) {
		money = money + ''
		money = money.replace('.', '')
	} else if (/^[0-9]+\.[0-9]$/.test(money)) {
		money = money + '0'
		money = money.replace('.', '')
	} else {
		money = money + '00'
	}
	let tmp = money
	for (let i = money.length; i < 12; i++) {
		tmp = '0' + tmp
	}
	return tmp
}

/**
 * 金币反转
 * @param amount
 */
const reverseTranslate = (amount) => {
	let first = amount.slice(0, 10)
	let second = amount.slice(10)
	let tmpFirst = first
	let tmpSecond = second
	for (let i = 0; i < 9; i++) {
		if (first[i] === 0) {
			tmpFirst = tmpFirst.slice(1)
		} else {
			break
		}
	}
	for (let i = 0; i < 1; i++) {
		if (second[i] === 0) {
			tmpSecond = tmpSecond.slice(1)
		} else {
			break
		}
	}
	return (+tmpFirst + (+tmpSecond / 100))
}

/**
 * 启动富掌柜
 * @param callback			通用回调
 * @param REQUEST_CODE		请求码
 * @param resolve 			成功回调
 * @param reject			失败回调
 */
const startFuiou = (callback, REQUEST_CODE, resolve, reject) => {
	try {
		let Intent = plus.android.importClass("android.content.Intent")
		let intent = new Intent(Intent.ACTION_VIEW)
		let ComponentName = plus.android.importClass("android.content.ComponentName")
		let packageName = FUIOU_PACKAGE_NAME
		let activityName = FUIOU_ACTIVITY_NAME
		let version = FUIOU_VERSION
		let comp = new ComponentName(packageName, activityName)
		intent.setComponent(comp)
		intent.setAction("android.intent.action.MAIN")
		callback && callback(intent)
		var main = plus.android.runtimeMainActivity()
		main.onActivityResult = (requestCode, resultCode, intent) => {
			if (requestCode === REQUEST_CODE) {
				if(resultCode === -1) {
					let referenceNo = intent.getStringExtra('referenceNo')
					let date = intent.getStringExtra('date')
					resolve && resolve(referenceNo, date)
				} else if (resultCode === 0) {
					reject && reject()
				}
			}
		}
		main.startActivityForResult(intent, REQUEST_CODE)
	} catch(e) {
		// nothing to do
	}
}

/**
 * 银行卡支付
 * @param orderNumber
 * @param amount
 * @param resolve			
 * @param reject
 */
const onFuiouBankPay = (orderNumber, amount, resolve, reject) => {
	startFuiou((intent) => {
		intent.putExtra("transName", "消费")
		intent.putExtra("orderNumber", orderNumber)
		let tmpMoney = translate(amount)
		intent.putExtra("amount", tmpMoney)
		let version = FUIOU_VERSION
		intent.putExtra("version", version)
	}, REQUEST_CODE_BANK_PAY, resolve, reject)
}

/**
 * 银行卡退款
 * @param orderNumber
 * @param amount
 * 
 * @param resolve			
 * @param reject
 */
const onFuiouBankRefund = (orderNumber, amount, resolve, reject) => {
	startFuiou((intent) => {
		intent.putExtra("transName", "退货")
		intent.putExtra("orderNumber", orderNumber)
		// console.log('onFuiouBankRefund', amount)
		let tmpMoney = translate(amount)
		intent.putExtra("amount", tmpMoney)
		let version = FUIOU_VERSION
		intent.putExtra("version", version)
	}, REQUEST_CODE_BANK_REFUND, resolve, reject)
}

export {
	isFuiouPlatform,
	onFuiouBankPay,
	onFuiouBankRefund
}