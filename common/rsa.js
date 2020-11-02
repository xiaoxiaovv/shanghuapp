import crypto from 'crypto'
import { Base64 } from 'js-base64'


// 将对象按ASCII顺序排序
function sortObjByKey (obj) {
  var keys = Object.keys(obj).sort();
  var newObj = {}
  for(var i = 0; i < keys.length; i++){
    var index = keys[i]
    newObj[index] = obj[index]
  }
  return newObj
}

// 拼接对象
function concatKeys (obj) {
	let str = ''
	for (let i in obj) {
		if (typeof obj[i] === 'object') {
			str += i + '=' + JSON.stringify(obj[i]) + '&'
		} else {
			str += i + '=' + obj[i] + '&'
		}
	}
	return str.slice(0, -1)
}

// 分散拼接字符串
function splitObjs (str) {
	let arr = str.split('&')
	let obj = {}
	for (let i of arr) {
		let tmp = i.split('=')
		console.log(tmp)
		if (tmp[1].indexOf('{') !== -1) {
			obj[tmp[0]] = JSON.parse(tmp[1])
		} else {
			obj[tmp[0]] = tmp[1]
		}
	}
	return obj
}

// RSA加密
function encryptRSA (plainText, priKey) {
	return crypto.privateEncrypt(priKey, plainText)
}

// RSA解密
function decryptRSA (cipherText, pubKey) {
	return crypto.publicDecrypt(pubKey, cipherText)
}

// BASE64加密
function encryptBase64 (data) {
	return Base64.encode(data)
}

// BASE64解密
function decryptBase64 (data) {
	return Base64.decode(data)
}

// Sign加密
function encryptSign (obj, priKey) {
	return encryptBase64(encryptRSA(concatKeys(sortObjByKey(obj)), priKey))
}

// Sign Base64加密
function decryptSign (data, pubKey) {
	return splitObjs(decryptRSA(decryptBase64(data), pubKey))
}

export {
	encryptSign,
	decryptSign
}