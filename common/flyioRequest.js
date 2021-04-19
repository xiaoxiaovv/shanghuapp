import { textToast } from './utils.js'
import Fly from 'flyio/dist/npm/wx';

import { getDomain, getRealVersion } from './appcommon'
import { debug } from './wxapi'

const fly = new Fly;
// const URL = "http://192.168.1.150:80"	//全局总URL
// const URL = getDomain() || "http://pay-adm.vmajy.com"	//全局总URL
 // const URL = getDomain() || "http://pay.ydcyd.cn"	//全局总URL
 // const URL = getDomain() || "http://pay-adm.h5h5h5.cn"	//全局总URL
 // const URL = getDomain() || "https://pay.oem.51hbpay.com"	//全局总URL
 // const URL = getDomain() || "http://pay.oem.test.mamipay.com:41000"	//全局总URL
 // const URL = getDomain() || "https://yt.hbpay.vip"	//全局总URL
 // const URL = getDomain() || "http://mamipay.com:41000"	//全局总URL
 // const URL = getDomain() || "https://mamipay.com"	//全局总URL
 const URL = getDomain() || "http://152.136.224.153:10003"	//全局总URL
 
 
 // const URL = getDomain() || "http://192.168.0.13"	//全局总URL
 // const URL = getDomain() || "https://yt.hbpay.vip"	//全局总URL
 // const URL = getDomain() || "http://yt.hbpay.vip:41000"	//全局总URL
 // const URL = getDomain() || "https://lsy.skmpos.com"	//乐收银
 // const URL = getDomain() || "https://www.zhizpay.com"	//赵建华
 // const URL = getDomain() || "http://pay.glaimb.com"	//全局总URL
 // const URL = getDomain() || "http://pay.yyvvv.net"	//全局总URL
 // const URL = getDomain() || "http://pay.shempay.com"	//全局总URL
 // const URL = getDomain() || "http://pay.oem.wexiaocheng.com"	//全局总URL
 // const URL = getDomain() || "http://pay-test.vmajy.com"	//全局总URL
 // const URL = getDomain() || "http://pay.jiangshenkeji.com"	//全局总URL
 // const URL = getDomain() || "http://pay.sanyizf.com"	//全局总URL
 // const URL = "http://pay-adm.vmajy.com"	//全局总URL
// const URL = "https://pay.itdui.cn"	//全局总URL
//设置超时
fly.config.timeout = 10000;
//设置请求基地址
// fly.config.baseURL = "http://192.168.1.198";baseURL
// fly.config.baseURL = "http://192.168.1.150:80";
// fly.config.baseURL = "http://192.168.1.114:80";
// fly.config.baseURL = "http://192.168.1.140:80";
// fly.config.baseURL = "https://test.pay.lingyundata.com";
// fly.config.baseURL = "http://www.yunqufu.com";
fly.config.baseURL = URL;
fly.config.registerURL = 'https://hbpay.vip'
//添加请求拦截器
fly.interceptors.request.use((request)=>{
    //给所有请求添加自定义header
	const token = uni.getStorageSync('token')
    if (token) {
       request.headers['token'] = token;
    }
	let { url } = request
	if ('/merchant/admin/app/login' !== url) {
		request.headers['version'] = getRealVersion()
	}
	// 调试专用
	debug(request, false)
    return request
});
//添加响应拦截器
fly.interceptors.response.use(
    (response) => {
		// console.log(66, response, response['request']['url'], response['status'])
		if (response['request']['url'] === '/pay/pay/face/polling/order' && response['data']['code'] === 500) {
			console.log('okokokko')
			return
		}
		// 根据后台的需求自定义
		let token = response.headers['accesstoken']
		if (token) {
			uni.setStorageSync('token', token);
		}
        //只将请求结果的data字段返回
		// console.log('ccccccccccccccccccccccccccccccccc========',response)
		let data = response.data
		
		if (data.code === 0) {
			// console.log('1111111111111',data.code)
			 return data
		} else {
			// console.log('2222222222222222',data.code)
			if (data.code === 401 || data.code === 422) {	/* 未登录/token错误失效 */
				uni.removeStorageSync('token');
				uni.removeStorageSync('userId');
				uni.removeStorageSync('userType');
				uni.reLaunch({
					url:'/pages/login/index/index'
				})
			} else {
				data.msg && textToast(data.msg)
			}
			return Promise.reject(data)
		}
    },
    (err) => {
        //发生网络错误后会走到这里
		// console.log(666, err, err.message)
		textToast(err.message);
        return Promise.reject(new Error('error'))
    }
);
export default fly;