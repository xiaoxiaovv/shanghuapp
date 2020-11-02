import { Base64 } from 'js-base64'

function getAppMetaData(key) {	
	try {
		return plus.bridge.execSync('AppCommon', "getAppMetaData", [key])
	} catch(e) {
		// nothing to do
	}
}

function getDomain() {
	return getAppMetaData('APP_DOMAIN')
}

function getFirID() {
	return getAppMetaData('FIR_ID')
}

function getFirToken() {
	return getAppMetaData('FIR_API_TOKEN')
}

function getVersion() {
	return getAppMetaData('VER')
}

function getPackageName(packageName) {
	return packageName || 'com.vma.test'
}

function jump2Dkm(key, serviceProviderId, shopAccount, token, userType, storeId) {
	try {
		return plus.bridge.execSync('AppCommon', "jump2Dkm", [key, serviceProviderId, shopAccount, token, userType, storeId])
	} catch(e) {
		// nothing to do
	}
}

function jump2DkmMain(serviceProviderId, shopAccount, token, userType, storeId) {
	return jump2Dkm('Main', serviceProviderId, shopAccount, token, userType, storeId)
}

function jump2DkmShopManager(serviceProviderId, shopAccount, token, userType, storeId) {
	return jump2Dkm('ShopManager', serviceProviderId, shopAccount, token, userType, storeId)
}

function getFuiouInfo(key) {
	try {
		return plus.bridge.execSync('AppCommon', "getFuiouInfo", [key])
	} catch(e) {
		// nothing to do
	}
}

function getFuiouPackage() {
	return getFuiouInfo('Package')
}

function getFuiouActivity() {
	return getFuiouInfo('Activity')
}

function getFuiouVersion() {
	return getFuiouInfo('Version')
}

// TODO，对应后台接口版本，当前策略先写死
function getRealVersion() {
	let txt = 'MERCHANTAPP' + '-' + '5.2.6'
	return Base64.encode(txt)
}

/**
 * 获取设备唯一标识
 */
function getDeviceId() {
	try {
		let arr = plus.device.uuid || ''
		if (arr) {
			arr = arr.split(',')
			arr = arr[0]
		}
		// let arr = 'QCF420191026196289'
		return arr
	} catch(e) {
		// nothing to do
	}
}

export {
	getAppMetaData,
	getDomain,
	getPackageName,
	getFirID,
	getFirToken,
	getVersion,
	jump2DkmMain,
	jump2DkmShopManager,
	getFuiouPackage,
	getFuiouActivity,
	getFuiouVersion,
	getRealVersion,
	getDeviceId
}