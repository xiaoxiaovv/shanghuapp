export const VERSION = '1.0.0'

/**
 * 比较版本号
 */
export const compareVersion = (v1, v2) => {
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

/**
 * 升级检测
 */
export const compareAppVersion = (newVersion) => {
	return (compareVersion(VERSION, newVersion) < 0)
}