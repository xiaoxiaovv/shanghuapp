import fly from '../common/flyioRequest'
import URL from '../common/flyioRequest'
import qs from 'qs'

import { getDeviceId } from '../common/appcommon'

const base114 = "http://192.168.1.114:80";	//单次请求基底
const base140 = "http://192.168.1.140:80";	//单次请求基底
const base198 = "http://192.168.1.198:80";	//单次请求基底
const base150 = "http://192.168.1.150:80";	//单次请求基底

// export const baseURL = "https://test.pay.lingyundata.com"
// export const baseURL = "http://192.168.1.198"
// export const baseURL = "http://192.168.1.150:80"
// export const baseURL = "http://www.yunqufu.com"
export const baseURL = URL.config.baseURL;
/* 
 * 查询使用get ， 修改使用post
 * 端口走10002，通过网关监测
 */

/*注册*/
export function register(phone){
	return fly.request( {
		baseURL:URL.config.registerURL,
		url : '/add', 
		method: 'get',
		params: {
			phone,
			channel:'zhangGui'
		}
	})
}
/* 登录 */
export function login (mobile, password) {
	// let deviceId = getDeviceId()
	return fly.request( 'api/supervision/api/login', {
		mobile,
		password,
		
	},{
		method: 'post',
	})
	/* return fly.request({
		url : 'api/supervision/api/login', 
		method: 'post',
		data:{
			mobile,
			password
		}
	}) */
}
/* 根据用户名查询手机号码 */
export function getPhoneFindByUsername (username ) {
	return fly.request({
		url : '/merchant/admin/app/phone_find_by_username', 
		method: 'get',
		params: {
			username
		}
	})
}
/* 发送手机验证码 */
export function sendSms ( phone) {
	return fly.request( '/merchant/admin/app/send_sms', qs.stringify({
		phone,
	}),{
		method: 'post',
	})
}
/* 校验手机验证码 */
export function verifyCode ( phone, code) {
	return fly.request( '/merchant/admin/app/verify_code', qs.stringify({
		phone,
		code,
	}),{
		method: 'post',
	})
}
/* 重置密码 */
//参数：只需要username和password
export function resetStaffPassword( username, password) {
	return fly.request( '/merchant/admin/app/reset_new_pwd', qs.stringify({
		username,
		password,
	}),{
		method: 'post',
	})
}
/* 修改密码 */
//参数：旧密码和新密码
export function changePassword( password, newPassword) { 
	return fly.request( '/merchant/management/app/edit_password', qs.stringify({
		password,
		newPassword,
	}),{
		method: 'post',
	})
}
/* 查询账户信息 */
export function getAccountInfo ( ) {
	return fly.request({
		url : '/merchant/management/app/account_info', 
		method: 'get',
		params: {
			
		}
	})
}

/* 付款码支付 */
export function scanPay (totalPrice, disCountPrice, authCode, storeId='', equipmentId) {
	// console.log("totalPrice="+totalPrice)
	// console.log('scanPay xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
	// let equipmentId = uni.getStorageSync('equipmentId') || ''
	return fly.request('/order/app/scan_pay', qs.stringify({
		totalPrice,
		disCountPrice,
		authCode,
		storeId,
		equipmentId
	}),{
		method: 'post',
	})
}
/* 轮询查询新订单 */
export function queryNewOrder ( storeId, beginTime) {
	return fly.request({
		url : '/order/order/training/rotation', 
		method: 'get',
		params: {
			storeId,
			beginTime
		}
	})
}

/* 退款 */
export function refund(orderNumber, refundPayPrice, password) {
	return fly.request( '/order/app/refund', qs.stringify({
		orderNumber,
		refundPayPrice,
		password,
	}),{
		method: 'post',
	})
}

/* 获取订单列表 */
export function getOrderList ( pageNumber, pageSize, start_payTime, end_payTime, payWay, status, storeId, orderNumber) {
	return fly.request({
		url : '/order/app/query_order', 
		method: 'get',
		params: {
			pageNumber,
			pageSize,
			start_payTime,
			end_payTime,
			payWay,
			status,
			storeId,
			orderNumber
		}
	})
}
/* 获取订单详情 */
export function getOrderDetails ( orderNumber) {
	return fly.request({
		url : '/order/app/order_detail', 
		method: 'get',
		params: {
			 orderNumber
		}
	})
}
/* 修改订单备注 */
export function editOrderRemarks(orderNumber, remarks) {
	return fly.request( '/order/app/edit_remarks', qs.stringify({
		orderNumber,
		remarks,
	}),{
		method: 'post',
	})
}

/* 获取门店列表（有门店详细信息） */
//参数name：用于搜索
//参数status： 1-启用,2-注销
export function getStoreList ( pageNumber, pageSize, name='', status) {
	return fly.request({
		url : '/merchant/store/app/list', 
		method: 'get',
		params: {
			 pageNumber,
			 pageSize,
			 name,
			 status
		}
	})
}
/* 获取选择门店列表*/
//无额外参数
export function getSelectStoreList ( name) {
	return fly.request({
		url : '/merchant/store/app/find_by_merchant_id', 
		method: 'get',
		params: {
			 name
		}
	})
}
/* 查看门店详情 */
//门店id
export function getStoreDetails (id) {
	return fly.request({
		url : '/merchant/store/app/find_one', 
		method: 'get',
		params: {
			id
		}
	})
}
/* 新增门店 */
//name -门店名称, storeNo -门店编号, province -省, city -市, address -门店地址, 
//phone -门店电话, paymentDesciption -支付凭证描述, status -门店状态, photoId -logoId
//参数status：门店状态 1-启用 2-注销，必填
export function addStore( name, storeNo, province, city, address, phone, paymentDesciption, status, photoId) {
	return fly.request( '/merchant/store/app/save', qs.stringify({
		name,
		storeNo,
		province,
		city,
		address,
		phone,
		paymentDesciption,
		status,
		photoId
	}),{
		method: 'post',
	})
}
/* 修改门店 */
//name -门店名称, storeNo -门店编号, province -省, city -市, address -门店地址, 
//phone -门店电话, paymentDesciption -支付凭证描述, status -门店状态, photoId -图片Id, id -门店id
//参数status：门店状态 1-启用 2-注销，必填
export function changeStore( name, storeNo, province, city, address, phone, paymentDesciption, status, photoId, id) {
	return fly.request( '/merchant/store/app/update', qs.stringify({
		name,
		storeNo,
		province,
		city,
		address,
		phone,
		paymentDesciption,
		status,
		photoId,
		id
	}),{
		method: 'post',
	})
}

/* 获取员工列表（有门店详细信息） */
//参数userType：职位 2:店长,3:员工
//参数status： 状态 1启用,2注销
//参数name：搜索名字，可选
export function getStaffList ( pageNumber, pageSize, userType, status, storeId, name) {
	return fly.request({
		url : '/merchant/user/app/list', 
		method: 'get',
		params: {
			 pageNumber,
			 pageSize,
			 userType,
			 status,
			 storeId,
			 name
		}
	})
}
/* 新增员工 */
//username -用户名, password -密码, name -姓名, phone -电话,
//storeId -门店id, status -员工状态,userType -角色, photoId -头像id
//参数storeId：若是店长添加,不传
//参数status：员工状态 1:启用  2：禁用
//参数userType：角色 2:店长 3:店员
export function addStaff( username, password, name, phone, storeId, status, userType, photoId, sex) {
	return fly.request( '/merchant/user/app/save', qs.stringify({
		username,
		password,
		name,
		phone,
		storeId,
		status,
		userType,
		photoId,
		sex
	}),{
		method: 'post',
	})
}
/* 修改员工 */
//id -员工id, name -姓名, phone -电话, storeId -门店id, status -员工状态,userType -角色, photoId -头像id
//参数storeId：若是店长添加,不传
//参数status：员工状态 1:启用  2：禁用
//参数userType：角色 2:店长 3:店员
export function changeStaff( id, name, phone, storeId, status, userType, photoId) {
	return fly.request( '/merchant/user/app/update', qs.stringify({
		id,
		name,
		phone,
		storeId,
		status,
		userType,
		photoId
	}),{
		method: 'post',
	})
}
/* 查看员工详情 */
export function getStaffDetails ( id) {
	return fly.request({
		url : '/merchant/user/app/detail', 
		method: 'get',
		params: {
			id
		}
	})
}

/* 编辑订单备注 */
export function editRemarks( orderNumber, remarks) {
	return fly.request( '/order/app/edit_remarks', qs.stringify({
		orderNumber,
		remarks
	}),{
		method: 'post',
	})
}

/* 门店图片上传 */
export function storeFilesUpload( files) {
	console.log("files==="+files)
	return fly.request( '/fms/upload/files_upload/file/store', qs.stringify({
		files
	}),{
		method: 'post',
	})
}
/* 用户图片上传 */
export function userFilesUpload( files) {
	return fly.request( '/fms/upload/files_upload/file/user', qs.stringify({
		files
	}),{
		method: 'post',
	})
}
/* 图片回显 */
export function getImgThumbnail ( photoId) {
	return fly.request({
		url : '/fms/upload/resource/thumbnail/'+ photoId, 
		method: 'get',
	})
}

/* 二维码管理部分 */
/* 简易员工列表（无参数） */
export function getstaffListSelectItem (storeId) {
	return fly.request({
		url : '/merchant/qrcode/app/user/select_item/find_by_user_id', 
		method: 'get',
		params: {
			storeId
		}
	})
}

/* 二维码列表 */
export function getQRcodeList (pageNumber, pageSize, storeId, status, userId, name) {
	return fly.request({
		url : '/merchant/qrcode/app/list', 
		method: 'get',
		params: {
			pageNumber,
			pageSize,
			storeId,
			status,
			userId,
			name
		}
	})
}

/* 添加二维码 */
export function addQRcode (name, storeId, userId, money, description, flag, blankQrCodeId) {
	return fly.request( '/merchant/qrcode/app/save', qs.stringify({
		name,
		storeId,
		userId,
		money,
		description,
		flag,
		blankQrCodeId
	}),{
		method: 'post',
	})
}

/* 修改二维码 */
export function changeQRcode (name, storeId, userId, money, description, id) {
	return fly.request( '/merchant/qrcode/app/update', qs.stringify({
		name,
		storeId,
		userId,
		money,
		description,
		id
	}),{
		method: 'post',
	})
}

/* 二维码详情 */
export function getQRcodeDetail (id) {
	return fly.request({
		url : '/merchant/qrcode/app/detail', 
		method: 'get',
		params: {
			id
		}
	})
}

/* 扫描空二维码 */
//作用：1.扫描的二维码未激活时，将其激活。2.扫描的二维码已激活时，跳转至二维码重定向的支付页面
//参数：扫描的二维码中的id
export function scanBlankQRcode (blankQrCodeId) {
	return fly.request({
		url : '/merchant/store/qrcode/scan_blank_qrcode', 
		method: 'get',
		params: {
			blankQrCodeId
		}
	})
}

/* 统计-首页 */
/* 查询统计页面基本数据 */
export function getStatistics (start_payTime, end_payTime, storeId, userId) {
	return fly.request({
		url : '/order/app/statistics', 
		method: 'get',
		params:{
			start_payTime,
			end_payTime,
			storeId,
			userId
		}
	})
}
/* 支付方式 *//* 饼图 */
export function getStatisticsWayPieChart (start_payTime, end_payTime, storeId) {
	return fly.request({
		url : '/order/app/way_pie_chart', 
		method: 'get',
		params:{
			start_payTime,
			end_payTime,
			storeId
		}
	})
}
/* 支付终端 *//* 饼图 */
export function getStatisticsClientPieChart (start_payTime, end_payTime, storeId) {
	return fly.request({
		url : '/order/app/client_pie_chart', 
		method: 'get',
		params:{
			start_payTime,
			end_payTime,
			storeId
		}
	})
}
/* 近5日订单金额趋势 *//* 折线图 */
export function getStatisticsFiveDayOrderMoneyTrend (start_payTime, end_payTime, storeId) {
	return fly.request({
		url : '/order/app/five_day_order_money_trend', 
		method: 'get',
		params:{
			start_payTime,
			end_payTime,
			storeId
		}
	})
}

/* 会员部分 */
/* 获取会员列表 */
//参数phoneOrNum：电话号码或会员号
export function getMemberList (phoneOrNum, pageNum, pageSize) {
	return fly.request({
		url : '/member/member/app/find_member_list', 
		method: 'get',
		params:{
			phoneOrNum,
			pageNum,
			pageSize,
		}
	})
}
/* 会员详情 */
export function getMemberDetail (id ) {
	return fly.request({
		url : '/member/member/app/member_detail', 
		method: 'get',
		params:{
			id
		}
	})
}
/* 会员手机验证码 */
export function getMemberPhoneCode (phone ) {
	return fly.request({
		url : '/member/admin/phone_verification_code', 
		method: 'get',
		params:{
			phone
		}
	})
}
/* 会员注册 */
// export function addMember (phone, nickname, birthday, sex, code) {
export function addMember (phone, nickname, birthday, sex) {
	return fly.request( '/member/admin/register', qs.stringify({
		phone,
		nickname,
		birthday,
		sex
	}),{
		method: 'post',
	})
}
/* 会员修改 */
export function changeMember (id, nickname, birthday, head) {
	return fly.request( '/member/member/update', qs.stringify({
		id,
		nickname,
		birthday,
		head,
	}),{
		method: 'post',
	})
}
/* 获取商户储值规则 */
//只需要token
export function getStoreMerchantId () {
	return fly.request({
		url : '/member/store_rule/app/find_by_merchant_id', 
		method: 'get',
		params: {
			
		}
	})
}
/* 会员储值 */
//参数：memberId：会员id、storeRuleId：储值规则id、authCode：付款码
export function storeMoney (memberId, storeRuleId, authCode, money, merchantId, storeId) {
	// return fly.request( '/member/store/app/store_money', qs.stringify({
	// 	memberId,
	// 	storeRuleId,
	// 	authCode,
	// }),{
	// 	method: 'post',
	// })
	return fly.request( '/member/pay/applet/store_money_member', qs.stringify({
		memberId,
		storeRuleId,
		authCode,
		money,
		totalPrice: money,
		merchantId,
		storeId,
		rechargeFlag: 2,
		disCountPrice: 0,
		payWay: 2
	}),{
		method: 'get',
	})
}
/* 会员优惠券列表 */
export function getCouponList (pageNumber, pageSize, memberId, status=1) {
	return fly.request({
		url : '/member/person_coupon/app/find_person_coupon', 
		method: 'get',
		params: {
			pageNumber,
			pageSize,
			memberId,
			status,
		}
	})
}
/* 会员积分明细列表 */
export function getIntegralList (pageNumber, pageSize, start_tradeTime, end_tradeTime, storeId, infoType, memberNum) {
	return fly.request({
		url : 'member/credits_info/app/find_list', 
		method: 'get',
		params: {
			pageNumber,
			pageSize,
			start_tradeTime,
			end_tradeTime,
			storeId,
			infoType,
			memberNum
		}
	})
}
/* 会员积分详情 */
export function getIntegralDetail (id) {
	return fly.request({
		url : 'member/credits_info/app/find_detail', 
		method: 'get',
		params: {
			id
		}
	})
}
/* 会员积分商城 */
/* 积分商城商品列表（含查找） */
export function getGoodsList (status, productName, pageNumber, pageSize) {
	return fly.request({
		url : '/member/credits_product/app/list_re', 
		method: 'get',
		params: {
			status,
			productName,
			pageNumber,
			pageSize,
		}
	})
}
/* 商品详细 */
export function getGoodsDetail (id) {
	return fly.request({
		url : '/member/credits_product/app/search', 
		method: 'get',
		params: {
			id,
		}
	})
}
/* 兑换商品 */
export function exchangeGoods (operator, phone, productId, memberId, app, storeid) {
	return fly.request( '/member/exchange_product/app/exchange', qs.stringify({
		operator,
		phone,
		productId,
		memberId,
		app,
		storeid
	}),{
		method: 'post',
	})
}
/* 扫码核销卡券 */
export function checkCoupon (code) {
	return fly.request( '/member/person_coupon/check_code', qs.stringify({
		code
	}),{
		method: 'post',
	})
}
/* 扫码核销商品 */
export function checkStatusGoods (code) {
	return fly.request( '/member/exchange_product/app/check_status', qs.stringify({
		code
	}),{
		method: 'post',
	})
}
/* 会员手机查找会员 */
export function findMember (phone) {
	return fly.request({
		url : '/member/member/app/find_member_by_phone', 
		method: 'get',
		params: {
			phone,
		}
	})
}

/* 会员分析部分 */
/* 会员分析 */
export function getMemberAnalyseConsumeActivityLevel (startTime, endTime) {
	return fly.request({
		url : '/member/member/app/member_analyse_consume_activity_level', 
		method: 'get',
		params:{
			startTime,
			endTime,
		}
	})
}
/* 新增会员数量和会员总量 */
export function getMemberAnalyseCard (startTime, endTime) {
	return fly.request({
		url : '/member/member/app/member_analyse_card', 
		method: 'get',
		params:{
			startTime,
			endTime,
		}
	})
}
/* 新增会员数量和会员总量 *//* 按时间 */
export function getMemberAnalyseChartByTime (startTime, endTime) {
	return fly.request({
		url : '/member/member/app/member_analyse_chart_by_time', 
		method: 'get',
		params:{
			startTime,
			endTime,
		}
	})
}
/* 新增会员数量和会员总量 *//* 按渠道 */
export function getMemberAnalyseChartByChannel (startTime, endTime) {
	return fly.request({
		url : '/member/member/app/member_analyse_chart_by_channel', 
		method: 'get',
		params:{
			startTime,
			endTime,
		}
	})
}
/* 新增会员数量和会员总量 *//* 按性别 */
export function getMemberAnalyseChartBySex (startTime, endTime) {
	return fly.request({
		url : '/member/member/app/member_analyse_chart_by_sex', 
		method: 'get',
		params:{
			startTime,
			endTime,
		}
	})
}
/* 会员消费记录列表-总 */
//参数：startTime和endTime必须存在
export function getMemberRecord (pageNumber, pageSize, storeId, payStatus, payWay, startTime, endTime, orderNumber) {
	return fly.request({
		url : '/member/store_record/app/consume/all/list', 
		method: 'get',
		params:{
			pageNumber,
			pageSize,
			storeId,
			payStatus,
			payWay,
			startTime,
			endTime,
			orderNumber
		}
	})
}
/* 会员消费记录列表-单会员(储值记录) */
//参数：startTime和endTime必须存在
export function getMemberRecordOne (pageNumber, pageSize, payWay, startTime, endTime, memberId) {
	return fly.request({
		url : '/member/store_record/app/consume/customer/list', 
		method: 'get',
		params:{
			pageNumber,
			pageSize,
			payWay,
			startTime,
			endTime,
			memberId
		}
	})
}
/* 会员消费记录详情 */
export function getRecordDetail (id) {
	return fly.request({
		url : '/member/store_record/app/consume/detail', 
		method: 'get',
		params:{
			id
		}
	})
}


/**
 * 获取app广告
 * @param {Object} merchantId			商户id
 * @param {Object} fromRange			1平台所有商户 2一级代理所有商户 3二级代理所有商户 4指定商户 5指定城市 6客户小程序 7客户付完款页面 8启动页 9会员支付页 10支付成功页
 */
export function getAdvertises (merchantId, fromRange = 1) {
	return fly.get('/advertise/advertise/view', qs.stringify({
		merchantId,
		fromRange
	}))
}

/**
 * 查看app广告
 * @param {Object} merchantId			商户id
 * @param {Object} advertiseId			广告id
 * @param {Object} fromRange			1平台所有商户 2一级代理所有商户 3二级代理所有商户 4指定商户 5指定城市 6客户小程序 7客户付完款页面 8启动页 9会员支付页 10支付成功页
 */
export function clickAdvertise (advertiseId, merchantId, fromRange = 1) {
	return fly.get('/advertise/advertise/click', qs.stringify({
		merchantId,
		advertiseId,
		fromRange
	}))
}

/**
 * 查看广告 app
 * @param {Object} advertiseId
 * @param {Object} fromRange
 */
export function adClick(advertiseId, fromRange) {
	return fly.get('/advertise/advertise/click', qs.stringify({
		advertiseId,
		fromRange
	}))
}


/**
 * 蛙跳
 * @param {Object} url				 重定向地址
 */
export function frogJump(url) {
	return fly.get(url)
}

/* 随行付支付 */
export function webPay(userId, merchantId, storeId, totalPrice, payWay, payChannel, serviceId, bankCardId) {
	// payChannel, serviceId, bankCardId  手机pos用的字段，其他业务可不加
	return fly.request({
		url : '/order/app/web_pay', 
		method: 'POST',
		params: {
			userId,
			merchantId,
			storeId,
			totalPrice ,
			payWay,
			payChannel, 
			serviceId, 
			bankId:bankCardId
		}
	})
}

/* 下单确认 */
export function transactionSure(chSerialNo, checkCode, serviceId, chMerCode, orderCode) {
	// chSerialNo第三方下单返回的交易流水号
	// checkCode短信验证码
	// serviceId服务商id
	// chMerCode通道商户编号
	return fly.request({
		url : '/order/app/quickPayConfirmApi', 
		method: 'POST',
		params: {
			chSerialNo,
			checkCode,
			serviceId, 
			chMerCode,
			orderCode
		}
	})
}

/* 获取域名 */
export function getDomain() {
	return fly.request({
		url: '/auth/admin/app/user/domain', 
		method: 'GET'
	})
}


// 电子发票接口集

/**
 * 电子发票启用或关闭
 * @param {Object} enable			启用或关闭
 */
export function switchTicketState(enable) {
	return fly.put('/billing/backend/enable', qs.stringify({
		enable
	}))
}

/**
 * 查询开票设置启用状态
 */
export function getSwitchState() {
	return fly.get('/billing/backend/billing_enable_status')
}

/**
 * 获取开票设置
 */
export function getTicketSetting() {
	return fly.get('/billing/backend/')
}

/**
 * 查询开票类目
 */
export function getClassifyData(likeName, name, parentCode, level) {
	return fly.get('/billing/backend/goods_codes', qs.stringify({
		likeName, name, parentCode, level
	}))
}

/**
 * 更新开票设置
 * @param {Object} id
 * @param {Object} name
 * @param {Object} vatRate
 * @param {Object} lowerLimit
 * @param {Object} upperLimit
 * @param {Object} issuer
 */
export function updateTicketSetting(id, name, vatRate, lowerLimit, upperLimit, issuer) {
	return fly.put('/billing/backend/update', qs.stringify({
		name,
		vatRate,
		id,
		upperLimit,
		lowerLimit,
		issuer
	}))
}

/**
 * 创建开票设置
 */
export function createTicketSetting(taxpayerIdentificationNum, lowerLimit, upperLimit, name, goodsCode, vatRate, issuer, defaultSetting = true) {
	return fly.post('/billing/backend/create', qs.stringify({
		defaultSetting,
		goodsCode,
		name,
		vatRate,
		issuer,
		upperLimit,
		lowerLimit,
		taxpayerIdentificationNum
	}))
}


// 会员支付设置

/**
 * 获取支付设置
 */
export function getVipSetting() {
	return fly.get('/merchant/member/payrule')
}

/**
 * 支付设置
 * @param {Object} vipInfo
 */
export function setVipSetting(vipInfo) {
	return fly.post('/merchant/member/payrule', {
		...vipInfo
	})
}

// pos机

/**
 * 创建订单
 */
export function createOrder(merchantId, storeId, totalPrice) {
	let equipmentId = uni.getStorageSync('equipmentId') || ''
	return fly.post('/order/app/create_order', qs.stringify({
		merchantId,
		storeId,
		totalPrice,
		disCountPrice: 0,
		payWay: 3,
		payClient: 3,
		rechargeFlag: 1,
		orderType: 0,
		payClient: 4,
		equipmentId
	}))
}

/**
 * 更新订单
 */
export function updateOrder(order) {
	return fly.post('/order/app/pos_update_order', order)
} 

/**
 * pos机退款校验
 * @param {Object} orderNumber
 * @param {Object} refundPayPrice
 * @param {Object} password
 */
export function posRefundValid(orderNumber, refundPayPrice, password) {
	return fly.post('/order/app/pos_refund_valid', {
		orderNumber,
		refundPayPrice,
		password
	})
}


/**
 * pos机退款
 * @param {Object} orderNumber
 * @param {Object} refundPayPrice
 */
export function posRefund(orderNumber, refundPayPrice, password) {
	return fly.post('/order/app/pos_refund', {
		orderNumber,
		refundPayPrice, 
		password
	})
}

/**
 * 删除pos机生成的无效订单
 * @param {Object} orderNum
 */
export function invalidOrderDel(orderNum) {
	return fly.get('/order/app/invalid_order_del', {
		orderNum
	})
}

// 交接班

/**
 * 交接班记录查询
 */
export function queryRecord(workTime, endWorkTime, pageNumber = 1, pageSize = 10) {
	return fly.get('/merchant/shift/work/record', qs.stringify({
		workTime,
		endWorkTime,
		pageNumber,
		pageSize
	}))
}

/**
 * 获取交接班信息
 */
export function getWorkInfo() {
	let equipmentId = uni.getStorageSync('equipmentId') || ''
	// console.log('equipmentId', equipmentId)
	return fly.get('/merchant/shift/work/info', qs.stringify({
		equipmentId
	}))
}

/**
 * 交接班
 * @param {Object} workInfo
 */
export function exchangeClass(workInfo) {
	let equipmentId = uni.getStorageSync('equipmentId')
	workInfo['equipmentId'] = equipmentId || ''
	return fly.post('/merchant/shift/work', workInfo)
}

// 押金管理

/**
 * 押金列表
 * @param {Object} beginTime
 * @param {Object} endTime
 * @param {Object} status
 * @param {Object} id
 * @param {Object} pageNumber
 * @param {Object} pageSize
 */
export function getDepositList(beginTime, endTime, status, id, pageNumber, pageSize) {
	return fly.get('/merchant/deposit/list', qs.stringify({
		beginTime,
		endTime,
		status,
		id,
		pageNumber,
		pageSize
	}))
}

/**
 * 退押金
 * @param {Object} depositId
 * @param {Object} usedFee
 */
export function refundDeposit(depositId, usedFee) {
	return fly.post('/merchant/deposit/refund', {
		depositId,
		usedFee: usedFee * 100
	})
}

/**
 * 修改押金备注
 * @param {Object} id
 * @param {Object} remark
 */
export function updateDeposit(id, remark) {
	return fly.put('/merchant/deposit', {
		id,
		remark
	})
}

// 云打印

/**
 * 获取某一个拥有者的某一项的云设备列表
 * @param {Object} equipmentOwner
 */
export function getPrinterList(equipmentOwner) {
	return fly.get('/auth/yun_equipment/get_equipment_list', {
		equipmentOwner,
		type: 1
	})
}

/**
 * 添加云打印机
 * @param {Object} equipmentName
 * @param {Object} equipmentProvider
 * @param {Object} equipmentOwner
 * @param {Object} equipmentConfig
 * @param {Object} equipmentRemark
 */
export function addPrinter(equipmentName, equipmentProvider, equipmentOwner, equipmentConfig, equipmentRemark, id = '') {
	// console.log('奶茶', equipmentName, equipmentProvider, equipmentOwner, equipmentConfig, equipmentRemark, id)
	// equipmentConfig = `{key:${equipmentConfig['key']},sn:${equipmentConfig['sn']}}`
	equipmentConfig = `${equipmentConfig['key']}:${equipmentConfig['sn']}`
	return fly.post('/auth/yun_equipment/add_or_edit_yunequipment', {
		equipmentConfig,
		equipmentName,
		equipmentOwner,
		equipmentRemark,
		equipmentType: 1,
		equipmentProvider,
		equipmentVersion: '',
		id
	})
}

/**
 * 连接云打印机
 * @param {Object} key
 * @param {Object} sn
 * @param {Object} storeId
 */
export function useCloudSound(key, sn, storeId, printName) {
	return fly.post('/merchant/printer', {
		key,
		sn,
		storeId,
		printName
	})
}

/**
 * 对一个云设备进行解除
 * @param {Object} yunEquipmentId
 */
export function unbindPrinter(yunEquipmentId) {
	return fly.get('/auth/yun_equipment/relieve_yunEquipment', {
		yunEquipmentId
	})
}

/**
 * 打印
 * @param {Object} yunEquipmentId
 */
export function printX(yunEquipmentId, bottomContent, title) {
	return fly.post('/auth/yun_equipment/yunequipment_print_data', {
		yunEquipmentId,
		dto: {
			bottomContent,
			title
		}
	})
}

/**
 * 保存配置
 * @param {Object} ownerId							门店ID
 * @param {Object} payEquipmentSn					设备SN
 * @param {Object} yunEquipmentId					云打印机SN
 * @param {Object} scene							场景值，0 前台，1 后厨
 */
export function savePrintSettings(ownerId, payEquipmentSn, yunEquipmentId, scene) {
	return fly.post('/auth/yun_equipment/add_or_edit_yunequipment_binding', {
		ownerId,
		payEquipmentSn,
		yunEquipmentId,
		scene
	})
}

// 付款码轮询

/**
 * 获取uuid
 */
export function getUUID() {
	return fly.post('/pay/pay/face/uuid')
}

/**
 * h5支付后轮询订单状态
 */
export function getCallOrder(uuid) {
	return fly.post('/pay/pay/face/polling/order', qs.stringify({
		uuid
	}))
}


// 隐私政策

/**
 * getSiteInfo
 */
export function getSiteInfo() {
	return fly.get('/merchant/admin/app/get_info')
}


// 订单优化

/**
 * queryOrderSummary
 * @param {Object} createTime
 * @param {Object} storeId
 */
export function queryOrderSummary(createTime, storeId, status, payWay, endCreateTime = '') {
	let data = {
		createTime,
		storeId,
		status,
		payWay
	}
	if (endCreateTime) {
		data['endCreateTime'] = endCreateTime
	}
	return fly.get('/order/app/query_order/summary', qs.stringify(data))
}
// 获取商户的进件信息
/**
 * @param {Object} id   商户id
 */
export function getUserInfo(id) {
	let data = {
		id
	}
	return fly.get('/merchant/mch_info/feedDetail', qs.stringify(data))
}
// 手机pos-网联卡管理

/**
 * addOrEditBankCark  添加和编辑银行卡
 * @param {Object} merchantId 商户ID
 * @param {Object} realName 开户人名称
 * @param {Object} idCard  身份证号
 * @param {Object} accNo  支付卡号
 * @param {Object} mobile  手机号
 * @param {Object} cvv2 银行卡背面 后三位
 * @param {Object} validity 有效期 格式： MMYY
 * @param {Object} id bankid  银行卡id
 */
export function addOrEditBankCard(merchantId, realName, accNo, mobile, cvv2, validity, bankName, idCard, id) {
	let data = {
		merchantId,
		realName,
		accNo,
		mobile,
		cvv2,
		validity,
		bankName,
		idCard,
		id
	}
	return fly.post('/order/bank/saveAndFlush', qs.stringify(data))
}
/**
 * bankCarkList  查询商户的银行卡列表
 * @param {Object} merchantId 商户ID
 */
export function bankCarkList(merchantId) {
	let data = {
		merchantId
	}
	return fly.post('/order/bank/getBankList', qs.stringify(data))
}
/**
 * bankCarkList  查询银行卡信息
 * @param {Object} id 银行卡id
 */
export function bankCardInfo(id) {
	let data = {
		id
	}
	return fly.post('/order/bank/getOne', qs.stringify(data))
}		
/**
 * bankCarkList  删除银行卡
 * @param {Object} id 银行卡id
 */
export function delBankCard(id) {
	let data = {
		id
	}
	return fly.post('/order/bank/delete', qs.stringify(data))
}					
/**
 * chanpayPreSign  畅捷预授权
 * @param {Object} id 银行卡号
 */
export function chanpayPreSign(accNo) {
	let data = {
		accNo
	}
	return fly.post('/order/bank/chanpayPreSign', qs.stringify(data))
}
/**
 * chanpayPreSign  畅捷预授权确认
 * @param {Object} accNo 银行卡号
 */
export function chanpayPreSignSure(accNo, captcha) {
	let data = {
		accNo,
		captcha
	}
	return fly.post('/order/bank/chanpaySureSign', qs.stringify(data))
}

