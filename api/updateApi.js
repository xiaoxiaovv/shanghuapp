import Fly from 'flyio/dist/npm/wx'
import qs from 'qs'
import { getFirToken, getFirID, getVersion } from '../common/appcommon.js'

const fly = new Fly()

fly.config.timeout = 10000

// TODO

const VERSION = getVersion() || '1.0.0'

const API_TOKEN = getFirToken() || 'bf6322d6ccc3a74c123c1b61c31dc96e'

const ID = getFirID() || '5d35ac7ef945481a89aefaf5'

const bundle_id = ''

// 使用bundle_id 请求必填
const type = ''

// 检查更新
function checkUpdate(id, bundleId, apiToken, type) {
	// console.log('检查更新', id, bundleId, apiToken, type)
	return fly.get(`http://api.fir.im/apps/latest/${id}`, qs.stringify({
		bundle_id: bundleId,
		api_token: apiToken,
		type: type
	}))
}

// android检查更新
function checkApp() {
	return checkUpdate(ID, '', API_TOKEN, '')
}

// 比较版本号
function compareVersion(v1, v2) {
	v1 = v1.split('.')
	v2 = v2.split('.')
	var len = Math.max(v1.length, v2.length)
		 
	while (v1.length < len) {
	  v1.push('0')
	}
	while (v2.length < len) {
	  v2.push('0')
	}
		 
	for (var i = 0; i < len; i++) {
	  var num1 = parseInt(v1[i])
	  var num2 = parseInt(v2[i])
		 
	  if (num1 > num2) {
	    return 1
	  } else if (num1 < num2) {
	    return -1
	  }
	}
	return 0
}

// 升级检测
function compareAppVersion(newVersion) {
	return (compareVersion(VERSION, newVersion) < 0)
}

export {
	VERSION,
	checkApp,
	compareVersion,
	compareAppVersion
}