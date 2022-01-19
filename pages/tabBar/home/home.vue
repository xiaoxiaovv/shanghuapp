<template>
	<view class='macth-wdith'>

		<view class='page-home-x'>

			<view class='page-home-x__banner box align-default'>
				<image class='match-parent' src="../../../static/homev2/bg.png" mode="scaleToFill" />
				<view class="cover box align-default plr-40" :style="[paddingTop ? paddingTop : '']">
					<view class="title match-width align-center">
						<view v-if="userType === 1" @click="storeSelect">
							<text>{{storeName? storeName : '全部门店'}}</text>
							<image class="ml-20" src="../../../static/tabBar/icon_black_arrow.png" />
						</view>
						<view v-else>
							<text>{{storeName? storeName : '全部门店'}}</text>
						</view>
					</view>
					<view class='content box align-ver-center mtb-30'>
						<view class='match-width align-center'>
							今日实收金额（元）
						</view>
						<view class='match-width align-center larger box pt-14 pb-14'>
							{{realOrder ? realOrder.actualRevenue : '0.00'}}
							<!-- {{(realOrder && realOrder.actualRevenue ? realOrder.actualRevenue : 0) | dealWithMoneyFilter}} -->
						</view>
						<view class='mark match-width align-center'>
							<view class='match-left-space align-right'>
								收款共<view class='mlr-10 darker'>{{realOrder && realOrder.orderTotal ? realOrder.orderTotal : 0}}</view>笔
							</view>
							<view class='match-left-space align-left ml-50'>
								新增会员<view class='mlr-10 darker'>{{realOrder && realOrder.memberTotalToday? realOrder.memberTotalToday : 0}}</view>人
							</view>
							<!-- <view class="" @click="shuaLian">刷脸</view> -->
							<!-- <view class="" @click="shuaLian">异步回调</view> -->
							<!-- <view @click="posTest">手机pos下单；</view> -->
							<!-- <view @click="orderSure">网联下单确认；</view>													 -->
							<!-- <view @click="gotoNativePage">跳到原生1；</view> -->
							<!-- <view @click="addOrEditBankCark">加卡；</view> -->
							<!-- <view @click="bankCarkList">卡表；</view> -->
							<!-- <view @click="bankCardInfo">查卡；</view> -->
							<!-- <view @click="delBankCard">删卡；</view> -->
						</view>
					</view>
					<!-- 收银栏 -->
					<view class='keyboard-box match-width box plr-30 align-hor-bet'>
						<view>收银金额</view>
						<text v-if="isNumberKeyboard" @click.stop="">{{paymentMoney}}<text class="fade-cursor-icon">|</text></text>
						<view v-else class='keyboard-box__inner align-right' @click.stop="showNumberKeyboard">
							<text>{{paymentText}}</text>
						</view>
					</view>
					<!-- 青蛙app入口 -->
					<view class="icon-frog iconfont icon-richscan_icon" @click="frogJump"></view>
				</view>

				<!-- <view 
					class="lf-cash-register padding-sm shadow align-center box" 
					v-show="isShowCashRegister && !isRich">
					<image 
						class=''
						src="../../../static/home/btn_shoukuanma_click.png" 
						@click="jumpPaymentCode"/>
					<image 
						class="ml-50"
						src="../../../static/home/btn_shouyin_click.png" 
						@click="cashierScan"/>
					<image
						class='ml-50'
						src="../../../static/home/btn_quickPay_click.png" 
						@click="quickPayJump"/>	
				</view>
				<view
					class="lf-cash-register lf-cash-register-bottom padding-sm shadow align-center box" 
					v-show="isShowCashRegister && !isRich">
					<image
						class=''
						src="../../../static/home/btn_quickPay_click.png" 
						@click="shuaLian"/>
		
					
					<image
							class="ml-50"
							src="../../../static/home/btn_shoujipos_click.png" 
							@click="shouJiPosPay"/>
				</view> -->


				<view class="lf-cash-register padding shadow align-center box" style='padding-left: 0; padding-right: 0;' v-show="isShowCashRegister && isRich">
					<swiper class='match-width' style='height: 140upx;' @change='onSwiperChange'>
						<swiper-item class='align-hor-bet box plr-40'>
							<image class="image" style='margin-top: 0' src="../../../static/home/btn_bank_click.png" mode='scaleToFill'
							 @click="bankAppJump" />
							<image class='' src="../../../static/home/btn_shoukuanma_click.png" @click="jumpPaymentCode" />
						</swiper-item>
						<swiper-item class='align-hor-bet box plr-40'>
							<image class="ml-30" src="../../../static/home/btn_shouyin_click.png" @click="cashierScan" />
						</swiper-item>
					</swiper>
				</view>

			</view>

			<view class='bar'></view>

			<view v-if="lastOrder && lastOrder.actPayPrice != 0" class='page-home-x__message box plr-50 align-left' @click="jumpOrderDetails(lastOrder.orderNumber)">
				<view class='icon'>
					<image class='match-parent' src='../../../static/homev2/tongzhi.png' mode='scaleToFill' />
				</view>
				<view class='circle align-ver-bet box pl-24'>
					<view></view>
					<view></view>
					<view></view>
				</view>
				<view class='match-left-space align-ver-left ml-30'>
					<view>{{lastOrder.createTime}}</view>
					<view class='darker mt-10'>{{lastOrder.payWay | payWayFilter}}收款{{lastOrder.actPayPrice | dealWithMoneyFilter}}元</view>
				</view>
				<view class="arrow">
					<image class='match-parent' src='../../../static/homev2/right.png' mode='scaleToFill' />
				</view>
			</view>

			<view v-if="lastOrder && lastOrder.actPayPrice != 0" class='bar'></view>
			<!-- 两行两个 -->
			<view class="lf-cash-register padding-sm shadow align-center box">
				<image class='' src="../../../static/home/btn_shoukuanma_click.png" @click="jumpPaymentCode" />
				<image class="lf-cash-register__ml-90" src="../../../static/home/btn_shouyin_click.png" @click="cashierScan" />

			</view>
			<view class="lf-cash-register lf-cash-register-bottom padding-sm shadow align-center box">
				<!-- <image
						class=''
						src="../../../static/home/btn_quickPay_click.png" 
						@click="shuaLian"/> -->
				<image class='' src="../../../static/home/btn_quickPay_click.png" @click="quickPayJump" />

				<image class="lf-cash-register__ml-90" src="../../../static/home/btn_shoujipos_click.png" @click="shouJiPosPay" />
			</view>
			<!-- 两行三个 -->
			<!-- <view class="lf-cash-register padding-lg shadow  box">
				<image class='' src="../../../static/home/btn_shoukuanma_click.png" @click="jumpPaymentCode" />
				<image class="ml-50" src="../../../static/home/btn_shouyin_click.png" @click="cashierScan" />
				<image class='ml-50' src="../../../static/home/btn_quickPay_click.png" @click="quickPayJump" />
				<image class='margin-top-sm' src="../../../static/home/btn_shualian_click.png" @click="shuaLian" />

				<image class="margin-top-sm" src="../../../static/home/btn_shoujipos_click.png" @click="shouJiPosPay" />
			</view> -->

			<!-- 菜单 -->
			<!-- <view :class="['page-home-x__menu align-left box plr-30', isSmall ? 'pt-30' : 'pt-50']">
				<view
					:class="['item align-default box',  isSmall ? 'mb-34' : 'mb-54']" 
					v-for="menu in menuList"  
					v-if="menu.isShow === 1" 
					@click="menuJump(menu.url, menu.status)">
					<image
						:class="[('img_3')]"
						mode='scaleToFill'
						:src="menu.src" >
					</image>
					<text class='mt-20'>{{menu.name}}</text>
				</view>
			</view> -->

			<!-- 轮播菜单 -->
			<!-- <swiper
				class='match-width mt-20'
				style='height: 320upx;'
				indicator-dots='true'
				indicator-color='#F0F0F0'
				indicator-active-color='#999'>
				<swiper-item> -->
			<view class='bar'></view>
			<view :class="['page-home-x__menu align-left box plr-10 margin-top-lg', isSmall ? '': 'mt-20']">
				<view :class="['item align-ver-bet box']" v-for="(menu, index) in menuList" v-if="menu.isShow === 1" :key='index'
				 @click="menuJump(menu.url, menu.status)">
					<image :class="[('img_3')]" mode='scaleToFill' :src="menu.src">
					</image>
					<text>{{menu.name}}</text>
				</view>
				<!-- <web-view class="item align-ver-bet box" src="https://alitong.vip/ydh5/index.html?i=1#/yidu_tc/pages/tabbar/index">
							<image
								class="img_3"
								mode='scaleToFill'
								src="static/homev2/shop.png" >
							</image>
						</web-view> -->
			</view>
			<!-- </swiper-item>
				<swiper-item> -->
			<!-- <view :class="['page-home-x__menu align-left box plr-10']">
						<view
							:class="['item align-default box']" 
							v-for="(menu, index) in menuListTwo"  
							v-if="menu.isShow === 1" 
							:key='index'
							@click="menuJump(menu.url, menu.status)">
							<image
								:class="[('img_3')]"
								mode='scaleToFill'
								:src="menu.src" >
							</image>
							<text class='mt-20'>{{menu.name}}</text>
						</view>
					</view> -->
			<!-- </swiper-item>
			</swiper>
			 -->

			<!-- <view :class="['page-home-x__menu align-left box plr-30']">
				<view
					:class="['item align-default pt-50']" 
					v-for="menu in menuList"  
					v-if="menu.isShow === 1" 
					@click="menuJump(menu.url, menu.status)">
					<image
						:class="[('img_3')]"
						mode='scaleToFill'
						:src="menu.src" >
					</image>
					<text class='mt-20'>{{menu.name}}</text>
				</view>
			</view> -->

			<!-- 补白 -->
			<!-- <view class='match-left-space bg-white align-default'></view> -->
		</view>

		<!-- 广告 -->
		<view :class="['page-home-x__banner_x align-center', isSmall ? 'active' : '']" v-if="bannerData && bannerData.length">
			<swiper class="match-parent" indicator-dots="true" autoplay="true" interval="3000" duration="500" indicator-color="#DDD"
			 indicator-active-color="#FFF" :current="current" @change="onBannerChange">
				<swiper-item v-for="(item, index) in bannerData" v-if="index < showNum" :key="index">
					<view class="match-parent" @click="onBannerClick(item.id)">
						<image class="match-parent" :src="item.imageUrl" mode="scaleToFill" />
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 手写签名 -->
		<!-- <signature></signature> -->
		<!-- 键盘-组件 -->
		<tki-float-keyboard ref="keyb" :mode="keyMode" :type="keyType" :title="keyTitle" @del="keyDel" @val="keyVal" @show="keyShow"
		 @hide="keyHide">
		</tki-float-keyboard>

	</view>

	</view>
</template>

<script>
	import fly from '@/common/flyioRequest'
	// import signature from '@/components/signature/signature.vue'
	import tkiFloatKeyboard from '@/components/tki-float-keyboard/tki-float-keyboard.vue'
	// 后台接口
	import {
		scanPay,
		refund,
		queryNewOrder,
		baseURL,
		getStoreDetails,
		getAdvertises,
		clickAdvertise,
		getAccountInfo,
		checkCoupon,
		frogJump,
		webPay,
		getStatistics,
		getOrderList,
		getOrderDetails,
		createOrder,
		updateOrder,
		invalidOrderDel,
		adClick,
		addOrEditBankCark,
		bankCarkList,
		bankCardInfo,
		delBankCard,
		orderSure,
		isMarket,
		audioCast
	} from '../../../api/vueAPI.js'
	// 检查更新
	import {
		checkApp,
		getToken,
		ID,
		VERSION,
		compareAppVersion
	} from '../../../api/updateApi.js'
	// 客流统计
	import {
		jump2DkmMain
	} from '../../../common/appcommon.js'
	// pos接口
	import {
		isFuiouPlatform,
		onFuiouBankPay
	} from '../../../api/fuiouApi.js'
	// wxapi
	import {
		Interval,
		showModal
	} from '../../../common/wxapi.js'
	import {
		getOrderDetailsAndPrint
	} from '../../../api/orderApi.js'

	// utils
	import {
		setInterval,
		setTimeout
	} from '../../../utils/adapter/index.js'
	import {
		LoginCache
	} from '../../../utils/cache/index.js'
	import Voice from '@/js_sdk/QuShe-baiduYY/QS-baiduyy/QS-baiduyy.js'
	// import mqtt from "mqtt"
	var mqtt = require('mqtt/dist/mqtt.js')
	// #ifdef APP-PLUS
	var posModule = uni.requireNativePlugin('DCloud-PosMoudle')
	// var shuaLianModule = uni.requireNativePlugin('DCloud-ShuaLianMoudle')
	// #endif
	export default {
		components: {
			tkiFloatKeyboard
		},
		data() {
			return {
				client: null,
				topocSrcArr: [],
				topocSrc: null,
				/* msg: {
					header: {
						connection: keep - alive
						content - length: 0
						content - type: application / oct - stream
						date: Fri,
						12 Mar 2021 07
						keep - alive: timeout = 25
						server: Kaede / 3.5 .3 .523(zb001t4h6)
						x - ca - error - code: B403MQ
						x - ca - error - message: Api Market Subscription quota exhausted
						x - ca - request - id: A77CDCA5 - CC79 - 46E2 - 863 A - 7 B2871B7F520
					},
					body: {
						"error_code": 0,
						"reason": "成功",
						"result": {
							"IdCardNo": "6101*********",
							// 用户传入的参数脱敏原封返回
							"Name": "李*",
							// 用户传入的参数脱敏原封返回
							"Validate_Result": 1,
							"Similarity": 92
						}
					}
				} */
				paymentText: '请输入金额',
				paymentMoney: '0',
				isNumberKeyboard: false, //是否打开键盘
				isShowCashRegister: false, //是否显示收银
				menuList: { //菜单
					"memberCenter": {
						src: '../../../static/homev2/hy.png',
						name: '会员中心',
						url: '/pagesA/home/memberCenter/index/index',
						status: 1,
						isShow: 1,
						iconWidth: 44,
						iconHeight: 38
					},
					"refund": {
						src: '../../../static/homev2/sm.png',
						name: '扫码退款',
						url: 'refund',
						status: 1,
						isShow: 1,
						iconWidth: 43,
						iconHeight: 44
					},
					"statistics": {
						src: '../../../static/homev2/tj.png',
						name: '统计',
						url: '/pagesA/home/statistics/index/index',
						status: 1,
						isShow: 1,
						iconWidth: 40,
						iconHeight: 36
					},
					"QRcodeAdministration": {
						src: '../../../static/homev2/ewm.png',
						name: '二维码管理',
						url: '/pagesA/home/2DcodeAdministration/index/index',
						status: 1,
						isShow: 1,
						iconWidth: 38,
						iconHeight: 38
					},
					"storeAdministration": {
						src: '../../../static/homev2/md.png',
						name: '门店管理',
						url: '/pagesA/home/storeAdministration/index/index',
						status: 1,
						isShow: 1,
						iconWidth: 42,
						iconHeight: 40
					},
					"staffManagement": {
						src: '../../../static/homev2/yg.png',
						name: '员工管理',
						url: '/pagesA/home/staffManagement/index/index',
						status: 1,
						isShow: 1,
						iconWidth: 43,
						iconHeight: 42
					},
					"couponCancel": {
						src: '../../../static/homev2/kq.png',
						name: '卡券核销',
						url: 'couponCancel',
						// url: '/pagesA/home/couponCancel/couponCancel',
						status: 1,
						isShow: 1,
						iconWidth: 47,
						iconHeight: 43
					},
					"consumerAnalysis": {
						src: '../../../static/homev2/xfz.png',
						name: '客流统计',
						// url: '/pagesA/home/consumerAnalysis/index/index',
						url: 'consumerAnalysis',
						status: 1,
						isShow: 0,
						iconWidth: 42,
						iconHeight: 40
					},
					"classExchange": {
						src: '../../../static/homev2/workinfo.png',
						name: '交接班',
						url: '/pagesA/home/classExchange/index/index',
						status: 1,
						isShow: 1,
						iconWidth: 44,
						iconHeight: 38
					},
					"depositManage": {
						src: '../../../static/homev2/dm.png',
						name: '押金管理',
						url: '/pagesA/home/depositManage/index/index',
						status: 1,
						isShow: 1,
						iconWidth: 44,
						iconHeight: 38
					},
					"ruyi": {
						src: '../../../static/homev2/zfb.png',
						name: '如意设备',
						url: '/pagesA/home/ruyi/ruyi',
						status: 1,
						isShow: 1,
						iconWidth: 44,
						iconHeight: 38
					},
					"marketIncent": {
						src: '../../../static/homev2/jili.png',
						name: '营销激励',
						url: '/pagesA/home/marketIncent/index/index',
						status: 1,
						isShow: 1,
						iconWidth: 44,
						iconHeight: 38
					},
					"wxEwm": {
						src: '../../../static/homev2/wxsign.png',
						name: '微信认证',
						url: '/pagesA/home/wxEwm/index/index',
						status: 1,
						isShow: 1,
						iconWidth: 44,
						iconHeight: 38
					},
					
					/* ,
										"depositManage":{
											src: '../../../static/homev2/quickPay.png',
											name: '快捷支付',
											url: 'quickPayJump',
											status: 1,
											isShow: 1,
											iconWidth: 44,
											iconHeight: 38
										} */
					"depositManage":{
						src: '../../../static/homev2/shop.png',
						name: '商城',
						url: '/pagesA/home/shop/shop',
						status: 1,
						isShow: 1,
						iconWidth: 200,
						iconHeight: 200
					},
					/* ,
										"depositManage":{
											src: '../../../static/homev2/dm.png',
											name: '手机pos',
											url: 'sjPosJump',
											status: 1,
											isShow: 1,
											iconWidth: 44,
											iconHeight: 38
										} */
				},
				menuListTwo: { //菜单 2
				},
				keyMode: 'number', //键盘组件-类型	keyboard-普通键盘 car-汽车键盘 number-数字键盘
				keyType: 0, //键盘组件-使用状态  0-全部可用||number类型时 1-全部禁用
				keyTitle: '', //键盘组件-
				codeResult: '', //扫码信息
				scanPayMoney: '0',
				storeId: '',
				storeName: '',
				userType: '',
				webviewStyle: {
					progress: {
						color: '#000',
					},
				},
				isKeyboardVoice: false, //键盘按键音效
				isVoice: '',
				isPush: '',
				beginTime: '',
				bannerData: [],
				showNum: 4, // 要展示的广告数量
				current: 0,
				polling: 1, //报错后轮询指示位
				fromRange: 5, // 广告相关
				isFrogAuthorized: false,
				payWay: 1, // 支付方式
				payWayShow: true, // 控制显隐
				lastOrder: null, // 最新订单
				realOrder: null, // 实收情况
				start_payTime: '',
				end_payTime: '',
				paddingTop: null,
				innerAudioContextKeyboard: null,
				isSmall: false,
				isRich: false,
				swiperCurrent: 0,
				requestCount: 0,
				bankLock: false,
				keyboardLock: false,
				maxPaymentMoney: 100000000,
				isShow: false,
				isHomeSelf: true,
				pausePoll: false,
				notFirstInit: false
			};
		},

		onLoad() {
			// 调整样式
			let systemInfo = uni.getSystemInfoSync()
			// console.log('systemInfo', systemInfo)
			let {
				windowHeight,
				windowWidth
			} = systemInfo
			// if (375 / windowWidth * windowHeight < 667) {
			// 	this.isSmall = true
			// }
			if (systemInfo && systemInfo['pixelRatio'] && systemInfo['statusBarHeight']) {
				this.paddingTop = systemInfo['pixelRatio'] * systemInfo['statusBarHeight'] + 'px'
			}
			// 版本更新检测
			//#ifdef APP-PLUS
			this.checkUpdate()
			//#endif
			// 获取当前时间
			// this.getCurrentTime()
			// 登录者身份验证
			this.roleValid()
			// 获取广告数据
			this.getBannerList()
			// 清空本应用推送信息
			// try {
			// 	plus.push.clear()
			// } catch (e) {
			// 	// nothing to do
			// }			
			// 富有平台判断
			this.isRich = isFuiouPlatform()
			// console.log('this.isRich============',this.isRich)
			this.isShow = true


			// 轮询最新一笔订单
			// this.getLastOrder()
			// #ifdef APP-PLUS
			let uuid = plus.device.uuid
			console.log('uuid', uuid)
			// #endif
			// showModal('uuid:'+ uuid)
			// 重置开始时间
			uni.setStorageSync("beginTime", '')
		},

		onReady() {
			// console.log('我来到火星的世界x1', LoginCache)
			// 存储登录页的状态
			LoginCache.state = false
			// console.log('我来到火星的世界x2', LoginCache)
			// 轮询查询新订单
			//this.queryNewOrder()
			this.isMarket()
		},

		onShow() {
			if (this.client) {
				//this.client.unsubscribe(this.topocSrcArr)
				this.client.end(true)
			}
			this.isHomeSelf = true
			// 实时收入金额
			this.getStatistics()
			//this.getStatisticsDate()
			// 获取门店名称
			let storeDetail = uni.getStorageSync("nowStoreDetail")
			if (storeDetail != '' && storeDetail != null && storeDetail != undefined && storeDetail) {
				this.storeName = storeDetail.storeName
			}
			if (this.notFirstInit) {
				this.concactWebSocket()
			}
			this.notFirstInit = true
			/////
			// 检查音效设置
			let isKeyboardVoice = parseInt(uni.getStorageSync("setKeyboardVoice"))
			if (isKeyboardVoice === 1) {
				this.isKeyboardVoice = true 
			} else {
				this.isKeyboardVoice = false
			}
		},

		onHide() {
			this.isHomeSelf = false
			// 失焦关闭键盘
			// this.$refs.keyb._keyHide()
			// this.isShow = false

			// this.getRealInterval.pauseInterval()
			// this.interval.pauseInterval()
		},

		watch: {
			paymentMoney(newValue, oldValue) {
				// if(!newValue.match(/^[0-9]+([.]{1}[0-9]{1,2})?$/)){
				// 	/* 隐藏收银栏 */
				// 	this.isShowCashRegister = false;
				// }
			},
			storeId(val, oldVal) {
				/* 广告 */
				// this.getAppAdvertisement();
			}
		},
		methods: {
			concactWebSocket() {
				let option = {
					  "port": 15675,
					  "path": '/ws',
				      "clean": true, // Can also be false
					  "username": `app`,
					  "password": `123456`,
					  "clientId": new Date().getTime(),
					  "keepalive": 1,
					  "SSL": false,
				}
				let WebSocketUrl = fly.config.baseURL.replace('https://', '')
				// #ifdef H5
				var client = mqtt.connect('ws://' + WebSocketUrl, option)
				// #endif
				// #ifdef MP-WEIXIN||APP-PLUS
				var client = mqtt.connect('wx://' + WebSocketUrl, option)
				// #endif
				this.client = client
				client.on('error', function(e) {
					console.log('on error')
				}).on('end', function(e) {
					console.log('on end')
				})
				client.on('connect', () => {
					console.log("连接成功！")
					const params = {
						id: uni.getStorageSync('userType') == 1?uni.getStorageSync('merchantId'):uni.getStorageSync('nowStoreDetail').storeId,
						type: uni.getStorageSync('userType') == 1 ? 1 : 2,
					}
					audioCast(params).then(resp => {
						let topocSrcArr = resp.obj.split(',')
						this.topocSrcArr = topocSrcArr
						client.subscribe(topocSrcArr[0], function(err) {
							console.log('订阅'+topocSrcArr[0]+'成功!')
						})
						client.subscribe(topocSrcArr[1], function(err) {
							console.log('订阅'+topocSrcArr[1]+'成功!')
						})
					})
				});
				client.on('message',(topic, message) => {
					let _this = this
					const resObj = JSON.parse(JSON.parse(message.toString()))
					console.log('收到消息：',resObj)
					if (resObj.type == 'voiceMsg') {
						if (uni.getStorageSync('userType') == 1) {
							if (resObj.storeId == uni.getStorageSync('nowStoreDetail').storeId) {
								//播报
								console.log('我会播报：',resObj.msg)
								let voiceText = resObj.msg							
								Voice({
									voiceSet: {
										tex: voiceText,
										vol: 15,
										per: 0
									  }
								})
								// 页面喇叭站位
								_this.lastOrder = resObj
							}
						} else if (uni.getStorageSync('userType') == 2){
							if (resObj.userType == 2 && resObj.storeId == uni.getStorageSync('nowStoreDetail').storeId) {
								//播报
								console.log('我会播报：',resObj.msg)
								let voiceText = resObj.msg
								Voice({
									voiceSet: {
										tex: voiceText,
										vol: 15,
										per: 0
									  }
								})
								// 页面喇叭站位
								_this.lastOrder = resObj
							}
						} else {
							if (resObj.userType == 3 && resObj.username == uni.getStorageSync('username') && resObj.storeId == uni.getStorageSync('nowStoreDetail').storeId) {
								//播报
								console.log('我会播报：',resObj.msg)
								let voiceText = resObj.msg
								Voice({
									voiceSet: {
										tex: voiceText,
										vol: 15,
										per: 0
									  }
								})
								// 页面喇叭站位
								_this.lastOrder = resObj
							}
						}
					}
					if (resObj.type == 'payInfo') {
						if (uni.getStorageSync('userType') == 1) {
							if (resObj.storeId == uni.getStorageSync('nowStoreDetail').storeId) {
								console.log('我会更新数据：',resObj)
								_this.realOrder = resObj
							}
						} else if (uni.getStorageSync('userType') == 2){
							if (resObj.userType == 2 && resObj.storeId == uni.getStorageSync('nowStoreDetail').storeId) {
								console.log('我会更新数据：',resObj)
								_this.realOrder = resObj
							}
						} else {
							if (resObj.userType == 3 && resObj.username == uni.getStorageSync('username') && resObj.storeId == uni.getStorageSync('nowStoreDetail').storeId) {
								console.log('我会更新数据：',resObj)
								_this.realOrder = resObj
							}
						}
					}
				})
			},
			isMarket() {
				const params = {
				  merchantId: uni.getStorageSync('merchantId'),
				}
				 isMarket(params).then(res => {
					 // if(res.code === 200 && res.msg === 'true'){
						//  this.menuList.marketIncent.isShow = 1
					 // } else {
						//  this.menuList.marketIncent.isShow = 2
					 // }
				 })
			},
			/**
			 * addOrEditBankCark  添加和编辑银行卡
			 * @param {Object} merchantId 商户ID
			 * @param {Object} realName 开户人名称
			 * @param {Object} idCard  身份证号
			 * @param {Object} accNo  支付卡号
			 * @param {Object} mobile  手机号
			 * @param {Object} cvv2 银行卡背面 后三位
			 * @param {Object} validity 有效期 格式： MMYY
			 */
			addOrEditBankCark() {
				let merchantId = uni.getStorageSync('merchantId')
				let realName = '张国军'
				let idCard = '130533198309185913'
				let accNo = '6226880385610282'
				let mobile = '15803196620'
				let cvv2 = '947'
				let validity = '0523'
				addOrEditBankCark(merchantId, realName, idCard, accNo, mobile, cvv2, validity)
			},
			bankCarkList() {
				let merchantId = uni.getStorageSync('merchantId')
				bankCarkList(merchantId)
			},
			bankCardInfo(bankCardId) {
				bankCardInfo('1345981813639208960')
			},
			delBankCard(bankCardId) {
				delBankCard('1345981813639208960')
			},
			shuaLian() {
				uni.showToast({
					title: '已开始调取',
					icon: 'none'

				})
				// 调用异步方法
				// #ifdef APP-PLUS
				posModule.postest({
						'name': 'unimp',
						'age': 1
					},
					(ret) => {
						uni.showToast({
							title: ret,
							icon: 'none'

						})
					})
				// #endif
			},
			posTest() {
				// 下单
				let userId = uni.getStorageSync('userId') || ''
				let merchantId = uni.getStorageSync('merchantId') || ''
				// let merchantId = '123213123213'
				let storeId = uni.getStorageSync('storeId') || ''
				let customerInfo = uni.getStorageSync('customerCount')
				let serviceId = customerInfo.serviceId
				// console.log('customerInfo==============',customerInfo)
				let totalPrice = '1' //this.paymentMoney || '0.01'
				let payWay = 8
				let payChannel = 17 //17 pos  18 网联
				let bankCardId = '1345981813639208960'
				webPay(userId, merchantId, storeId, totalPrice, payWay, payChannel, serviceId, bankCardId).then(function(data) {
					console.log('sucess==========', JSON.stringify(data))
				}, function(data) {
					console.log('fail==========', JSON.stringify(data))
				})
			},
			orderSure(bankCardId) {
				let customerInfo = uni.getStorageSync('customerCount')
				let serviceId = customerInfo.serviceId
				orderSure('20210104143544242783', '332633', serviceId, 'C070820113023698', '202101041435446833')
			},
			// 获取当前时间
			getCurrentTime() {
				let date = new Date()
				let y = date.getFullYear()
				let MM = date.getMonth() + 1
				MM = MM < 10 ? ('0' + MM) : MM
				let d = date.getDate()
				d = d < 10 ? ('0' + d) : d
				let today = y + '-' + MM + '-' + d
				this.start_payTime = today
				this.end_payTime = today
			},
			// 登录者身份验证 
			roleValid() {
				// 获取用户类型
				this.userType = parseInt(uni.getStorageSync('userType'))
				// console.log(this.userType)
				switch (parseInt(this.userType)) {
					case 1:
						uni.setStorageSync('nowStoreDetail', {
							storeId: '',
							storeName: '',
							status: false
						})
						this.storeName = ''
						this.storeNameGet()
						break
						/* 登录者-店长 */
					case 2:
						this.menuList.storeAdministration.isShow = 0;
						this.storeNameGet()
						break;
						/* 登录者-店员 */
					case 3:
						this.menuList.storeAdministration.isShow = 0;
						this.menuList.staffManagement.isShow = 0;
						this.menuList.QRcodeAdministration.isShow = 0;
						// this.menuList.statistics.isShow = 0;
						// this.menuList.consumerAnalysis.isShow = 0;
						// this.menuList.couponCancel.isShow = 0;
						this.menuList.refund.isShow = 0;
						this.storeNameGet()
						break;
				}
			},
			// 滑动组件change事件
			onSwiperChange(e) {
				this.swiperCurrent = e.detail.current
			},
			// 金币保留两位小数
			dealWithMoney(money) {
				// console.log('过滤前', money)
				if (/^[0-9]+\.[0-9]$/.test(money)) {
					money = money + '0'
				} else if (/^[0-9]+$/.test(money)) {
					money = money + '.00'
				}
				// console.log('过滤后', money)
				return money + ''
			},
			// 判断支付方式
			onPayWayChange(e) {
				// console.log('支付方式', e.detail.value)
				this.payWay = e.detail.value
			},
			// 控制支付方式显隐
			onPayWayShow(status) {
				if (+status === 1) {
					this.payWayShow = true
					this.payWay = 1
				} else {
					this.payWayShow = false
				}
			},
			/* 广告轮播图 */
			change(e) {
				this.current = e.detail.current
			},
			/* 广告跳转 */
			srcJump(url, id) {
				if (url) {
					// console.log("广告跳转啦~",url)
					uni.navigateTo({
						url: '/pagesA/home/advertisement/advertisement?id=' + id + '&url=' + url
					})
				} else {
					console.log("没有url")
				}
			},
			/* 登陆者为店长/店员，获取门店名称  新增：如果登录这为商户本人，并且只有一个商铺，加上全部门店项，共两个，则该商户为默认选择商铺，如果有多个商铺，付款时需要手动选择 */
			storeNameGet() {
				getAccountInfo().then(res => {
					// console.log("信息");
					// console.log(res);
					this.userType = parseInt(uni.getStorageSync('userType'))
					// 商户登录
					if (this.userType === 1) {
						let storeSelectItemArr = res.obj.storeSelectItem
						// 只有一个门店的时候设置为默认门店（加上全部门店项，共两个）
						if (storeSelectItemArr.length === 2) {
							this.storeId = storeSelectItemArr[1].storeId;
							this.storeName = storeSelectItemArr[1].storeName;
							// uni.setStorageSync('storeId', this.storeId)				
							uni.setStorageSync('nowStoreDetail', {
								storeId: this.storeId,
								storeName: this.storeName,
								// todo status卡券核销记录页面用到了，不太清楚区别，商户手动选择是true，店长店员登录自动获取的是false
								status: true
							})
						}
					} else {
						if (!res.obj.storeId) {
							this.storeName = res.obj.merchantName
							this.storeId = ''
							return
						}
						this.storeName = res.obj.storeName
						this.storeId = res.obj.storeId
						uni.setStorageSync('nowStoreDetail', {
							storeId: this.storeId,
							storeName: this.storeName,
							status: false
						})
					}
					this.concactWebSocket()
				}).catch(err => {
					// console.log(err)
				})
			},
			/* 打开数字键盘 */
			showNumberKeyboard() {
				// console.log('启动')
				// 显示键盘 + 设置键盘启动状态
				this.isNumberKeyboard = true
				this.$refs.keyb._keyShow()
				// 检查音效设置
				let isKeyboardVoice = parseInt(uni.getStorageSync("setKeyboardVoice"))
				if (isKeyboardVoice === 1) {
					this.isKeyboardVoice = true
				} else {
					this.isKeyboardVoice = false
				}
				// 创建键盘音效音频实例
				if (!this.innerAudioContextKeyboard) {
					this.innerAudioContextKeyboard = uni.createInnerAudioContext()
					this.innerAudioContextKeyboard.autoplay = false
					this.innerAudioContextKeyboard.src = encodeURI('../../../static/music/keyboard_voice.mp3')
					// this.innerAudioContextKeyboard.src = "https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3"
					this.innerAudioContextKeyboard.onPlay(() => {
						// console.log('开始播放')
					});
					this.innerAudioContextKeyboard.onError((res) => {
						console.log(res.errMsg)
						console.log(res.errCode)
						uni.showToast({
							title: res.errMsg,
							icon: 'none'

						})
					})
					// console.log('开始音频')
				}
			},
			/* 关闭数字键盘 */
			closeNumbeKeyboard() {
				// console.log('关闭')
				/* 键盘信息初始化 */
				this.paymentMoney = '0'
				/* 隐藏收银栏 */
				this.isShowCashRegister = false
				// 销毁实例
				if (this.innerAudioContextKeyboard) {
					this.innerAudioContextKeyboard.stop()
					this.innerAudioContextKeyboard.destroy()
					this.innerAudioContextKeyboard = null
					// console.log('销毁音频')
				}
			},
			/* 选择门店 */
			storeSelect() {
				// console.log("选择门店")
				uni.navigateTo({
					url: '/pagesA/home/storeSelect/index/index?ishome=1'
				})
			},
			/* 菜单功能跳转 */
			menuJump(url, status) {
				// console.log('点击', url, status)
				if (status === 0) {
					uni.showToast({
						title: "敬请期待",
						icon: "none"
					})
					// console.log('更新留余区域')
					return
				}
				// 客流统计
				if (url === 'consumerAnalysis') {
					this.customerCount()
					return
				}
				/* 扫码退款 */
				if (url === 'refund') {
					this.showRefund();
					return
				}
				/* 扫码核销卡券 */
				if (url === 'couponCancel') {
					this.checkCoupon();
					return
				}
				// 网联，快捷支付
				if (url === 'quickPayJump') {
					this.quickPayJump();
					return
				}
				/* // 手机pos调取原生页面
				if(url === 'sjPosJump'){
					this.sjPosJump();
					return
				} */
				// console.log('跳转页面：'+url)
				/* 保留页面栈进行跳转 */
				uni.navigateTo({
					url: url
				})
			},
			/* 键盘组件回调函数~ */
			// 返回键盘输入内容 
			keyVal(val) {
				// console.log(777, val)
				// 防止用户超快速点击
				if (this.keyboardLock) {
					return
				}
				this.keyboardLock = true
				setTimeout(() => {
					this.keyboardLock = false
				}, 100)
				// 获取输入值
				this.keyboardInput(val)
				// 验证输入值
				let flag = this.validKeyboardInput()
				this.isShowCashRegister = flag
				/* 键盘音效 */
				if (this.isKeyboardVoice === true) {
					// 键盘播报
					this.startKeyboardAudio()
				}
			},
			// 键盘输入
			keyboardInput(val) {
				// POS机最大限制输入金额为1亿元
				if (this.paymentMoney >= this.maxPaymentMoney) {
					this.showToast('最大金额不能超过1亿元')
					let tmpData = this.paymentMoney
					this.isShowCashRegister = false
					return
				}
				let tmpPaymentMoney = this.paymentMoney
				if (tmpPaymentMoney.length === 1) {
					if (val === '.') {
						this.paymentMoney = tmpPaymentMoney + '.'
					} else {
						if (tmpPaymentMoney === '0') {
							if (val === '0') {
								this.paymentMoney = tmpPaymentMoney + '.'
							} else {
								this.paymentMoney = val
							}
						} else {
							this.paymentMoney = tmpPaymentMoney + val
						}
					}
				} else if (tmpPaymentMoney.length === 2) {
					if (/^\d\.$/.test(tmpPaymentMoney)) {
						if (val !== '.') {
							this.paymentMoney = tmpPaymentMoney + val
						} else if (/^\d\d$/.test(tmpPaymentMoney)) {
							this.paymentMoney = tmpPaymentMoney + val
						}
					} else {
						this.paymentMoney = tmpPaymentMoney + val
					}
				} else if (tmpPaymentMoney.length === 3) {
					if (/^\d\.\d$/.test(tmpPaymentMoney)) {
						if (val !== '.') {
							if (tmpPaymentMoney === '0.0') {
								if (val !== '0') {
									this.paymentMoney = tmpPaymentMoney + val
								}
							} else {
								this.paymentMoney = tmpPaymentMoney + val
							}
						}
					} else if (/^\d\d\.$/.test(tmpPaymentMoney)) {
						if (val !== '.') {
							this.paymentMoney = tmpPaymentMoney + val
						}
					} else {
						this.paymentMoney = tmpPaymentMoney + val
					}
				} else if (tmpPaymentMoney.length >= 4) {
					let firstRegExp = ""
					let secondRegExp = ""
					for (let i = 0; i < tmpPaymentMoney.length - 2; i++) {
						firstRegExp += "\\d"
					}
					firstRegExp = "^" + firstRegExp + "\\.\\d$"
					for (let i = 0; i < tmpPaymentMoney.length - 1; i++) {
						secondRegExp += "\\d"
					}
					secondRegExp = "^" + secondRegExp + "\\.$"
					firstRegExp = new RegExp(firstRegExp)
					secondRegExp = new RegExp(secondRegExp)
					if (firstRegExp.test(tmpPaymentMoney)) {
						if (val !== '.') {
							this.paymentMoney = tmpPaymentMoney + val
						}
					} else if (secondRegExp.test(tmpPaymentMoney)) {

						if (val !== '.') {
							this.paymentMoney = tmpPaymentMoney + val
						}
					} else {
						if (tmpPaymentMoney.indexOf('.') !== (tmpPaymentMoney.length - 3)) {
							this.paymentMoney = tmpPaymentMoney + val
						}
					}
				}
			},
			// 验证键盘输入
			validKeyboardInput() {
				let tmpPaymentMoney = this.paymentMoney
				if (tmpPaymentMoney >= this.maxPaymentMoney) {
					this.showToast('最大金额不能超过1亿元')
				}
				return !(/\d\.$/.test(tmpPaymentMoney) || ('0' === tmpPaymentMoney) || ('0.0' === tmpPaymentMoney) || ('0.00' ===
					tmpPaymentMoney) || (+tmpPaymentMoney < 0.01) || (+tmpPaymentMoney >= this.maxPaymentMoney))
			},
			// 键盘退格时回调 
			keyDel() {
				/* 当仅剩一位数时退格判断 */
				if (this.paymentMoney.length === 1) {
					/* 金额初始化 */
					this.paymentMoney = '0'
					/* 隐藏收银栏 */
					// this.isShowCashRegister = false;
				} else {
					if (this.paymentMoney === '0.0') {
						this.paymentMoney = '0'
					} else {
						let tmpPaymentMoney = this.paymentMoney
						this.paymentMoney = tmpPaymentMoney.slice(0, -1)
					}
				}
				// 验证输入值
				let flag = this.validKeyboardInput()
				this.isShowCashRegister = flag
				/* 键盘音效 */
				if (this.isKeyboardVoice === true) {
					// 键盘播报
					this.startKeyboardAudio()
				}
			},
			// 启动键盘音效
			startKeyboardAudio() {
				// console.log('todo')
				let innerAudioContextKeyboard = this.innerAudioContextKeyboard
				if (innerAudioContextKeyboard) {
					innerAudioContextKeyboard.play()
				}
			},
			// 调用函数式启动键盘音效
			startKeyboardAudio2() {
				const innerAudioContextKeyboard = uni.createInnerAudioContext()
				innerAudioContextKeyboard.autoplay = true
				innerAudioContextKeyboard.src = encodeURI('../../../static/music/keyboard_voice.mp3')
				innerAudioContextKeyboard.onPlay(() => {
					// console.log('开始播放')
				});
				innerAudioContextKeyboard.onError((res) => {
					// console.log(res.errMsg)
					// console.log(res.errCode)
					uni.showToast({
						title: res.errMsg,
						icon: 'none'

					})
				})
				setTimeout(() => {
					innerAudioContextKeyboard.stop()
					innerAudioContextKeyboard.destroy()
					innerAudioContextKeyboard = null
				}, 100)
			},
			// 键盘显示的回调，返回键盘节点信息
			keyShow(h) {
				// console.log(h)
			},
			// 隐藏键盘时触发
			keyHide() {
				/* 关闭键盘 */
				this.isNumberKeyboard = false
				this.closeNumbeKeyboard()
			},
			/* ~键盘组件回调函数 */
			/* 收款码跳转 */
			jumpPaymentCode() {
				if (parseFloat(this.paymentMoney) === 0) {
					uni.showToast({
						title: '请输入正确金额',
						icon: 'none'
					})
					return
				}
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
				if (!nowStoreDetail.storeId) {
					/* uni.showToast({
						title: '请选择门店',
						icon: 'none'
					}) */
					uni.showModal({
						title: '提示',
						content: '请选择门店',
						showCancel: true,
						// confirmText: '请选择门店',
						success: (res) => {
							// console.log('确定', res.confirm)
							if (res.confirm) {
								this.storeSelect()

							}
						}
					})
					return
				}
				let storeId = nowStoreDetail.storeId || '';
				// this.onPayWayShow(1)
				let that = this
				uni.navigateTo({
					url: '/pagesA/home/cashRegisterCode/cashRegisterCode?paymentMoney=' + that.paymentMoney + '&payWay=' + that.payWay +
						'&storeId=' + storeId,
					complete() {
						/* 金额初始化 */
						that.paymentMoney = '0'
						that.isShowCashRegister = false
						console.log('隐藏键盘')
						// 隐藏键盘
						that.$refs.keyb._keyHide()
						that.isNumberKeyboard = false
						that.closeNumbeKeyboard()
					}
				})
			},
			/* 客流统计 */
			customerCount() {
				// console.log('客流统计'
				let customerInfo = uni.getStorageSync('customerCount')
				let {
					serviceId,
					servicePhone,
					token
				} = customerInfo
				// console.log('customerInfo', customerInfo)
				if (!serviceId) {
					uni.showToast({
						title: '服务商id不存在',
						icon: 'none'
					})
					return
				}
				if (!servicePhone) {
					uni.showToast({
						title: '商户帐号不存在',
						icon: 'none'
					})
					return
				}
				if (!token) {
					uni.showToast({
						title: 'token不存在',
						icon: 'none'
					})
					return
				}
				let storeId = '';
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
				if (nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail) {
					storeId = nowStoreDetail.storeId
				}
				// console.log('storeId', storeId)
				let userType = uni.getStorageSync('userType') || ''
				serviceId && servicePhone && token && jump2DkmMain(serviceId, servicePhone, token, userType, storeId)
			},
			/* 扫码退款 */
			showRefund() {
				uni.scanCode({
					onlyFromCamera: true,
					success: (res) => {
						this.codeResult = res.result
						// console.log("扫码内容："+res.result)
						// console.log("扫码类型："+res.scanType)
						// console.log('扫码成功，进行退款。。。');
						if ('CODE_128' === res.scanType || 'QR_CODE' === res.scanType) {
							getOrderDetails(res.result).then(res => {
								// console.log('uuuuuuuuuu', res)
								uni.navigateTo({
									url: '/pages/order/orderDetails/orderDetails?orderNumber=' + res.obj.orderNumber
								})
							}).catch(err => {
								console.log('yyyyyyyyyyyyyyy', err)
							})
						}
					},
					fail: (res) => {
						console.log(err)
					}
				});
			},
			// 手机pos付款

			shouJiPosPay() {
				// #ifdef APP-PLUS
				/* uni.showModal({
							content: `人脸验证失败（代码：）。`,
							showCancel: false
						}) */
				// console.log('ssssssssssssssssssssssssssssssssss')
				if (parseFloat(this.paymentMoney) < 10) {
					uni.showToast({
						title: '手机POS交易金额不能小于10元',
						icon: 'none'
					})
					return
				}
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
				if (!nowStoreDetail.storeId) {
					uni.showModal({
						title: '提示',
						content: '请选择门店',
						showCancel: true,
						// confirmText: '请选择门店',
						success: (res) => {
							// console.log('确定', res.confirm)
							if (res.confirm) {
								this.storeSelect()

							}
						}
					})

					/* uni.showToast({
						title: '请选择门店',
						icon: 'none'
					}) */
					return
				}

				let userId = uni.getStorageSync('userId') || ''
				let merchantId = uni.getStorageSync('merchantId') || ''
				// let merchantId = '123213123213'
				let customerInfo = uni.getStorageSync('customerCount')
				let serviceId = customerInfo.serviceId
				// console.log('customerInfo==============',customerInfo)
				let totalPrice = this.paymentMoney //this.paymentMoney || '0.01'
				/* let payWay = 8
				let payChannel = 17
				let bankCardId = '1342280548032446464' */



				let storeId = '';

				let equipmentId = uni.getStorageSync('equipmentId') || ''
				let token = uni.getStorageSync('token');
				// console.log('token===============',token)
				if (nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail) {
					storeId = nowStoreDetail.storeId
				}
				let posDataObj = {
					userId,
					merchantId,
					storeId,
					serviceId,
					totalPrice
				}
				let posDataObjStr = JSON.stringify(posDataObj);
				// console.log('posDataObjStr=========================',posDataObjStr)
				posModule.pos(posDataObjStr)
				// #endif
				// #ifndef APP-PLUS
				uni.showToast({
					title: '正在开发中，敬请期待~',
					icon: 'none'
				})
				// #endif
			},
			shopJump() {
				location.href = 'https://alitong.vip/ydh5/index.html?i=1#/yidu_tc/pages/tabbar/index'
			},
			quickPayJump() {
				if (parseFloat(this.paymentMoney) === 0) {
					uni.showToast({
						title: '请输入正确金额',
						icon: 'none'
					})
					return
				}
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
				if (!nowStoreDetail.storeId) {
					uni.showModal({
						title: '提示',
						content: '请选择门店',
						showCancel: true,
						// confirmText: '请选择门店',
						success: (res) => {
							// console.log('确定', res.confirm)
							if (res.confirm) {
								this.storeSelect()

							}
						}
					})
					// this.storeSelect()
					/* uni.showToast({
						title: '请选择门店',
						icon: 'none'
					}) */
					return
				}
				uni.navigateTo({
					url: '/pagesA/home/quickPay/index?paymentMoney=' + this.paymentMoney + '&fromPayChannel=18'
				})
				/* let storeId = nowStoreDetail.storeId
				let userId = uni.getStorageSync('userId') || ''
				let merchantId = uni.getStorageSync('merchantId') || ''
				// let merchantId = '123213123213'
				let customerInfo = uni.getStorageSync('customerCount')
				let serviceId = customerInfo.serviceId
				// console.log('customerInfo==============',customerInfo)
				let totalPrice = this.paymentMoney //this.paymentMoney || '0.01'
				let token = uni.getStorageSync('token');
				var obj = {merchantId,storeId,serviceId,userId,token}
				var objStr = JSON.stringify(obj)
				// console.log(objStr)
				posModule.quickPay(objStr);
				// posModule.gotoNativePage(); */
			},
			/* shuaLianCallback(ret){
				uni.showToast({
					title: ret,
					icon: 'none'
				})
				uni.navigateTo({
					url: '/pagesA/home/quickPay/index?paymentMoney='+this.paymentMoney+'&fromPayChannel=20'
				})
			},
			shuaLianAsyncFunc() {
				uni.showToast({
					title: 'shuaLianModule7777777777777777777'+shuaLianModule,
					icon: 'none'
				})
				let obj = {
						Name: '韩治涛',
						Number: '130582198612181613',
						Count:4
					};
					let objStr = JSON.stringify(obj)
				shuaLianModule.shuaLianAuth(objStr,
					(ret) => {
						this.shuaLianCallback(ret)
					})
				
			}, */
			/* shuaLianSimple(){
				if(parseFloat(this.paymentMoney) === 0){
					uni.showToast({
						title: '请输入正确金额',
						icon: 'none'
					})
					return
				}
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
				if (!nowStoreDetail.storeId) {
					uni.showModal({
						title: '提示',
						content: '请选择门店',
						showCancel: true,
						// confirmText: '请选择门店',
						success: (res) => {
							// console.log('确定', res.confirm)
							if (res.confirm) {
								this.storeSelect()
								
							}
						}
					})
					return
				}
				uni.navigateTo({
					url: '/pagesA/home/quickPay/index?paymentMoney='+this.paymentMoney+'&fromPayChannel=20'
				})
			}, */
			shuaLian() {
				if (parseFloat(this.paymentMoney) === 0) {
					uni.showToast({
						title: '请输入正确金额',
						icon: 'none'
					})
					return
				}
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
				if (!nowStoreDetail.storeId) {
					uni.showModal({
						title: '提示',
						content: '请选择门店',
						showCancel: true,
						// confirmText: '请选择门店',
						success: (res) => {
							// console.log('确定', res.confirm)
							if (res.confirm) {
								this.storeSelect()

							}
						}
					})
					return
				}
				uni.navigateTo({
					url: '/pagesA/home/quickPay/index?paymentMoney=' + this.paymentMoney + '&fromPayChannel=20'
				})
				this.shuaLianAsyncFunc()


			},
			/* sjPosJump() {
				
				// 调取摄像头传给sdk的,暂时没用
				// var obj = {
				// 	"memberCode": "C070820120351304",
				// 	"tranAmount": "1100",
				// 	"txnDate": "20201231",
				// 	"txnTime": "104857",
				// 	"systrace": "023920",
				// 	"orderCode": "202012151348574454",
				// 	"netCode": "9",
				// 	"manufacturer": "小米",
				// 	"deviceType": "MI 9",
				// 	"serialNum": "52882189691967929917",
				// 	"location": "116.455746,39.954022",
				// 	"ip": "125.33.28.50",										
				// 	"additionalInfo": "TUK9z3tXUT5A176QygmTPR5intwPMmHrYh2nl9z/8xRja2t17+zeWlJde2HMQuqvp1NGUJ8HVxI="					
				// }
				if(parseFloat(this.paymentMoney) < 10){
					uni.showToast({
						title: '手机POS交易金额不能小于10元',
						icon: 'none'
					})
					return
				}
				var obj = {userName:'15803196620',password:'123456',merchantId:'111'}
				var objStr = JSON.stringify(obj)
				// posModule.gotoNativePage()
				// posModule.toast()
				// console.log('posModule=========',posModule)
				// console.log('posModulePay=========',posModule.pay)
				posModule.pay(objStr);
				// posModule.gotoNativePage();
			}, */

			/* 扫码收款 */
			cashierScan() {
				if (parseFloat(this.paymentMoney) === 0) {
					uni.showToast({
						title: '请输入正确金额',
						icon: 'none'
					})
					return
				}

				// console.log(nowStoreDetail.storeId)
				let that = this
				// console.log('哈哈哈哈', that.scanPayMoney, that.paymentMoney)
				that.scanPayMoney = that.paymentMoney
				// 聚合通道
				/*if(android != null){
					let storeId = '';
					let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
					let equipmentId = uni.getStorageSync('equipmentId') || ''
					let token = uni.getStorageSync('token');
					// console.log('token===============',token)
					if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
						storeId = nowStoreDetail.storeId
					}
					android.saoMaShouKuan(that.scanPayMoney, 0,storeId, equipmentId, token)
					// 金额初始化
					that.paymentMoney = '0'
					that.scanPayMoney = '0'
					// 关闭键盘
					that.$refs.keyb._keyHide()
					that.isNumberKeyboard = false
					that.closeNumbeKeyboard()
				}else{
					console.log('没有扫码设备')
				} */

				uni.scanCode({
					onlyFromCamera: true,
					success: (res) => {
						this.codeResult = res.result
						// console.log("扫码内容："+res.result)
						// console.log("扫码类型："+res.scanType)
						// console.log('扫码成功，进行收款。。。'+that.scanPayMoney)
						// 临时注释
						let storeId = '';
						let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
						console.log('nowStoreDetail', nowStoreDetail)
						if (nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail) {
							storeId = nowStoreDetail.storeId
						}
						let equipmentId = uni.getStorageSync('equipmentId') || ''
						// console.log('that.scanPayMoney',that.scanPayMoney)
						// console.log(55555555555555,that.scanPayMoney, 0, res.result, storeId, equipmentId)
						scanPay(that.scanPayMoney, 0, res.result, storeId, equipmentId).then(res => {
							// console.log(6666666666666666666666666666, res)
							uni.navigateTo({
								url: '../../home/paySuccess/paySuccess?orderNumber=' + res.obj.orderNumber
							})
							金额初始化
							that.paymentMoney = '0'
							that.scanPayMoney = '0'
							// 关闭键盘
							that.$refs.keyb._keyHide()
							that.isNumberKeyboard = false
							that.closeNumbeKeyboard()
						}).catch(err => {
							// console.log(777777777777777777777777, err)
							console.log(err)
						})
					}
				})
			},
			/* 轮询查询新订单 */
			queryNewOrder() {
				// 轮询订单
				setTimeout((count) => {

					if (LoginCache.state || this.pausePoll) {
						// this.interval.pauseInterval()
						return
					}

					// console.log('语音播放', count)

					let beginTime = uni.getStorageSync("beginTime") || ''
					let storeId = '';
					let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
					if (nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail) {
						storeId = nowStoreDetail.storeId
					}
					// console.log('beginTime', beginTime)
					queryNewOrder(this.storeId, beginTime).then(res => {
						// console.log('查询订单', res, res.obj.speechMsgVos)
						if (res && res.obj) {
							let beginTime = res.obj.beginTime
							uni.setStorageSync("beginTime", beginTime)
							if (res.obj.speechMsgVos.length > 0) {
								// Push本地推送
								// let isPush = uni.getStorageSync("setPush")
								// if(isPush){
								// 	console.log('推送去哪了')
								// 	//发送本地推送信息
								// 	let options = {
								// 		cover: false
								// 	}
								// 	try {
								// 		for (let msg of musicList) {
								// 			plus.push.createMessage('xxxx', "LocalMSG", options)
								// 		}
								// 	} catch(e) {
								// 		// nothing to do
								// 	}
								// }
								// 语音播报
								let musicList = res.obj.speechMsgVos
								let num = musicList.length
								let i = 0
								let isVoice = uni.getStorageSync("setVoice")
								if (isVoice) {
									// this.interval.pauseInterval()
									this.pausePoll = true
									this.musicPlay(i, num, musicList)
								}
							}
						}
					}).catch(err => {
						// nothing to do
					})
					this.queryNewOrder()
				}, 5000)
			},
			/* 语音队列播放 */
			musicPlay(i, num, musicList) {
				//播放完毕
				if (i >= num) {
					this.pausePoll = false
					// this.interval.restartInterval()
					this.queryNewOrder()
					return
				}
				let innerAudioContext = uni.createInnerAudioContext()
				innerAudioContext.autoplay = true
				innerAudioContext.src = baseURL + '/music/' + musicList[i].speechVoice
				innerAudioContext.onPlay(() => {
					let nowMusicTime = innerAudioContext.duration
					i++
					setTimeout(() => {
						this.musicPlay(i, num, musicList)
					}, nowMusicTime * 1000)
				})
				innerAudioContext.onError((res) => {
					uni.showToast({
						title: res.errMsg,
						icon: 'none'
					})
				})
			},
			/* 扫码核销卡券 */
			checkCoupon() {
				// uni.showToast({
				// 	title: "敬请期待",
				// 	icon: "none"
				// })
				// return
				uni.scanCode({
					onlyFromCamera: true,
					success: (res) => {
						this.codeResult = res.result
						// console.log("扫码内容："+res.result)
						// console.log("扫码类型："+res.scanType)
						// console.log('扫码成功，进行商品核销。。。');
						checkCoupon(res.result).then(res => {
							// console.log(res)
							uni.showToast({
								title: res.msg,
								icon: "success"
							})
						}).catch(err => {
							console.log(err)
						})
					}
				});
			},
			// 银行跳转
			bankAppJump() {
				if (this.bankLock) {
					return
				}
				this.bankLock = true
				setTimeout(() => {
					this.bankLock = false
				}, 3000)
				let newOrder = uni.getStorageSync('newOrder')
				if (newOrder) {
					this.requestCount = 0
					uni.showToast({
						title: '上一笔订单有未完成业务正在处理中，请稍后重试',
						icon: 'none'
					})
					setTimeout(() => {
						let {
							tag,
							orderNumber,
							order
						} = newOrder
						if (tag === 'update') {
							this.updateOrder(order, orderNumber)
						} else if (tag === 'delete') {
							this.invalidOrderDel(orderNumber)
						}
					}, 500)
					// TODO
					return
				}
				this.createOrder()
			},
			// 创建订单
			createOrder() {
				uni.hideLoading()
				if (this.requestCount > 4) {
					this.requestCount = 0
					uni.showToast({
						title: '创建订单失败',
						icon: 'none'
					})
					return
				}
				if (parseFloat(this.paymentMoney) === 0) {
					uni.showToast({
						title: '请输入正确金额',
						icon: 'none'
					})
					return
				}
				if (parseFloat(this.paymentMoney) >= 100000000) {
					uni.showToast({
						title: '银行卡收银的最大收银金额不能超过1亿元',
						icon: 'none'
					})
					return
				}
				let tmp = this.dealWithMoney(this.paymentMoney)
				let merchantId = uni.getStorageSync('merchantId')
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
				let storeId = null
				createOrder(merchantId, storeId, tmp).then(res => {
					this.requestCount = 0
					uni.setStorageSync('newOrder', '')
					if (res && res.obj) {
						let order = res.obj
						let {
							orderNumber
						} = order
						onFuiouBankPay(orderNumber, tmp, (referenceNo, date) => {
							// console.log('onFuiouBankPay success')
							if (date) {
								order['transactionId'] = referenceNo
								order['payTime'] = date
								let dateObj = new Date()
								let timeObj = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate() + ' ' +
									dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds()
								order['payTime'] = timeObj
								// console.log('order', order)
								uni.setStorageSync('newOrder', {
									order,
									orderNumber,
									tag: 'update'
								})
								this.updateOrder(order, orderNumber)
							} else {
								// 删除由于签到造成的第一次的无效订单
								uni.setStorageSync('newOrder', {
									orderNumber,
									tag: 'delete'
								})
								this.invalidOrderDel(orderNumber)
							}
						}, () => {
							// console.log('onFuiouBankPay cancel')
							uni.setStorageSync('newOrder', {
								orderNumber,
								tag: 'delete'
							})
							// 支付失败
							this.invalidOrderDel(orderNumber)
						})
					}
				}).catch(err => {
					// uni.showLoading({
					// 	title: '创建订单失败，尝试重新创建（第' + (this.requestCount + 1) + '次）',
					// 	mask: true
					// })
					uni.showToast({
						title: '创建订单失败，尝试重新创建（第' + (this.requestCount + 1) + '次）',
						icon: 'none'
					})
					this.requestCount += 1
					setTimeout(() => {
						this.createOrder()
					}, 3000)
				})
			},
			// 更新订单
			updateOrder(order, orderNumber) {
				// 支付成功
				uni.hideLoading()
				if (this.requestCount > 4) {
					this.requestCount = 0
					uni.showToast({
						title: '更新订单失败',
						icon: 'none'
					})
					return
				}
				updateOrder(order).then(() => {
					this.requestCount = 0
					uni.setStorageSync('newOrder', '')
					// pos机消费之后需要打印
					getOrderDetailsAndPrint(orderNumber, false)
					setTimeout(() => {
						this.jumpOrderDetails(orderNumber)
					}, 200)
				}).catch(err => {
					// uni.showLoading({
					// 	title: '更新订单失败，尝试重新更新（第' + (this.requestCount + 1) + '次）',
					// 	mask: true
					// })
					uni.showToast({
						title: '更新订单失败，尝试重新更新（第' + (this.requestCount + 1) + '次）',
						icon: 'none'
					})
					this.requestCount += 1
					setTimeout(() => {
						this.updateOrder(order, orderNumber)
					}, 3000)
				})
			},
			// 删除订单
			invalidOrderDel(orderNumber) {
				uni.hideLoading()
				if (this.requestCount > 4) {
					this.requestCount = 0
					uni.showToast({
						title: '删除订单失败',
						icon: 'none'
					})
					return
				}
				invalidOrderDel(orderNumber).then(res => {
					// nothing to do
					this.requestCount = 0
					uni.setStorageSync('newOrder', '')
				}).catch(err => {
					// uni.showLoading({
					// 	title: '删除订单失败，尝试重新删除（第' + (this.requestCount + 1) + '次）',
					// 	mask: true
					// })
					uni.showToast({
						title: '删除订单失败，尝试重新删除（第' + (this.requestCount + 1) + '次）',
						icon: 'none'
					})
					this.requestCount += 1
					setTimeout(() => {
						this.invalidOrderDel(orderNumber)
					}, 3000)
				})
			},
			/* 跳转订单详情（附订单号） */
			jumpOrderDetails(orderNumber) {
				uni.navigateTo({
					url: '/pages/order/orderDetails/orderDetails?orderNumber=' + orderNumber
				})
				// 关闭键盘
				that.$refs.keyb._keyHide()
				that.isNumberKeyboard = false
				that.closeNumbeKeyboard()
			},
			// 获取广告信息
			getBannerList() {
				this.merchantId = uni.getStorageSync('merchantId')
				if (this.merchantId) {
					getAdvertises(this.merchantId, this.fromRange).then((res) => {
						// console.log('广告数据', res)
						if (res.code === 200) {
							let tmp = res.obj
							// 过滤图片url为空的数据
							tmp = tmp.filter((item) => {
								return !!item.imageUrl
							})
							this.bannerData = tmp
						} else {
							this.bannerData = []
						}
					}, (err) => {
						this.bannerData = []
					})
				} else {
					this.bannerData = []
				}
			},
			// 广告点击
			onBannerClick(id) {
				if (!this.bannerData || !this.bannerData.length) {
					return
				}
				if (!id || !this.merchantId) {
					return
				}
				let obj = this.bannerData.filter((item) => {
					return item.id === id
				})
				if (!obj[0].imageLink) {
					return
				}
				// 点击广告
				// clickAdvertise(id, this.merchantId, this.fromRange).then((res) => {
				// 	// nothing to do
				// }, (err) => {
				// 	// nothing to do 
				// })
				this.adClick(id)
				// 广告跳转
				if (obj[0].isJump === 0) {
					// 内部打开
					uni.navigateTo({
						url: ('../../home/advertisement/advertisement?url=' + obj[0].imageLink)
					})
				} else {
					// 外部打开
					try {
						plus.runtime.openURL(obj[0].imageLink)
					} catch (e) {
						// nothing to do
					}
				}
			},
			/* 图片回显 */
			getPic(val) {
				var url = baseURL + '/fms/upload/resource/' + val
				// console.log(url)
				return url
			},
			// 广告滑动
			onBannerChange(e) {
				this.current = e.detail.current
			},
			// 青蛙APP
			frogJump() {
				uni.scanCode({
					onlyFromCamera: true,
					success: (res) => {
						let codeResult = res.result
						// console.log("扫码内容：" + res.result)
						// console.log("扫码类型：" + res.scanType)
						// console.log('扫码成功，青蛙app跳转。。。')

						uni.showModal({
							content: '是否登录？',
							showCancel: true,
							success: (res) => {
								// console.log(res)
								if (res.confirm) {
									frogJump(codeResult).then((res) => {
										// console.log('青蛙', res)
										if (res.code === 200) {
											uni.showToast({
												title: '登录成功',
												icon: 'none'
											})
										} else {
											uni.showToast({
												title: res.msg,
												icon: 'none'
											})
										}
									}).catch(err => {
										uni.showToast({
											title: '无效码！',
											icon: 'none'
										})
									})
								} else {
									uni.showToast({
										title: '取消授权',
										icon: 'none'
									})
								}
							}
						})
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			// 检查更新
			checkUpdate() {
				// console.log('检查更新') 
				uni.showLoading()
				let platform = uni.getSystemInfoSync().platform
				let type = platform === 'android' ? 'android' : (platform === 'ios' ? 'ios' : '')
				if (type === 'android' || type === 'ios') {
					checkApp().then(res => {
						// console.log('测试', res)
						if (res.status === 200) {
							let newVersion = res.data.versionShort
							let updateUrl = res.data.update_url
							let changelog = (!!res.data.changelog) ? res.data.changelog : '有新版本可用'
							if (compareAppVersion(newVersion)) {

								uni.showModal({
									title: '更新提示',
									content: changelog,
									showCancel: true,
									confirmText: '更新',
									success: (res) => {
										// console.log('确定', res.confirm)
										if (res.confirm) {
											try {
												getToken().then(resp => {
													plus.runtime.openURL('https://download.bq04.com/apps/'+ ID+'/install?download_token='+ resp.data.download_token, () => {
														console.log('获取新版本失败')
													})
												})
												
											} catch (e) {
												// nothing to do
											}
										}
									}
								})
							} else {
								console.log('最新版本')
							}
							uni.hideLoading()
						} else {
							console.log(err)
							uni.hideLoading()
						}
					}).catch(err => {
						console.log(err)
						uni.hideLoading()
					})
				} else {
					// console.log('非ios、android，不支持更新')
					uni.hideLoading()
				}
			},
			// 获取统计数据
			getStatisticsDate() {
				// 获取实时收入

				setTimeout((count) => {

					if (LoginCache.state || !this.isHomeSelf) {
						// this.getRealInterval.pauseInterval()
						return
					}

					// console.log('实时收入', count)

					this.getStatistics()
					this.getStatisticsDate()
				}, 5000)
			},
			/**
			 * 获取实时收入
			 */
			getStatistics() {
				let userId = uni.getStorageSync('userId') || ''
				let storeId = null
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
				if (nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail) {
					storeId = nowStoreDetail.storeId
				}
				if (!this.start_payTime || !this.end_payTime) {
					this.getCurrentTime()
				}

				getStatistics(this.start_payTime, this.end_payTime, storeId, userId).then(res => {
					// console.log('实时刷新', res, storeId)
					if (res && res.obj) {
						this.realOrder = res.obj
						this.realOrder.actualRevenue = this.dealWithMoney(this.realOrder.actualRevenue)
						this.lastOrder = res.obj.order
					}
				}).catch(err => {
					// nothing to do
				})
			},
			// 获取最新数据
			getLastOrder() {
				// 获取最后一笔订单
				this.getLastOrderInterval = Interval((count) => {
					// 退出登录时跳过后面代码
					if (!uni.getStorageSync('token')) {
						this.getLastOrderInterval.closeInterval()
						return
					}
					// if (!this.isShow) {
					// 	return
					// }
					if (!uni.getStorageSync('isAppShow')) {
						this.getLastOrderInterval.closeInterval()
						return
					}
					let storeId = null
					let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
					if (nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail) {
						storeId = nowStoreDetail.storeId
					}
					getOrderList(1, 1, '', '', '', 2, storeId, '').then((res) => {
						// console.log('最新订单', res)
						if (res && res.obj && res.obj.content) {
							let obj = Object.values(res.obj.content)[0].orders[0]
							this.lastOrder = obj
						}
					}).catch(err => {
						// nothing to do
					})
				}, 5000)
			},
			// 消息提示
			showToast(title) {
				if (title) {
					uni.showToast({
						title,
						icon: 'none'
					})
				}
			},
			// 广告次数曝光
			adClick(advertiseId) {
				adClick(advertiseId, this.fromRange)
			},
		},
		filters: {
			// 金币保留两位小数
			dealWithMoneyFilter(money) {
				// console.log('过滤前', money)
				money = +money
				if (/^[0-9]+\.[0-9]$/.test(money)) {
					money = money + '0'
				} else if (/^[0-9]+$/.test(money)) {
					money = money + '.00'
				}
				// console.log('过滤后', money)
				return money + ''
			},
			/**
			 * 支付方式
			 * @param {Object} val
			 */
			payWayFilter(val) {
				// console.log('xxxxxxxx', val)
				switch (+val) {
					case 1: //微信支付
						return '微信'
						break
					case 2: //支付宝支付
						return '支付宝'
						break
					case 3: //银行卡支付
						return '银行卡'
						break
					case 4: //会员卡支付
						return '会员卡'
						break
					case 5: //现金支付
						return '现金';
						break;
					case 6: //现金支付
						return '会员+微信';
						break;
					case 7: //现金支付
						return '会员+支付宝';
						break;
					case 8: //现金支付
						return '手机pos';
						break;
					case 9: //现金支付
						return '云闪付';
						break;
					case 10: //刷脸付 畅捷
						return '刷脸付';
						break;
					case 99: //未知支付
						return '未知方式'
						break
					default:
						console.log("异常支付码：" + val)
				}
			},
			/**
			 * 创建时间过滤
			 */
			creatTimeFilter(time) {
				return time.slice(5, 10)
			}
		}
	}
</script>

<style lang="scss">
	uni-page-body {
		width: 100%;
		height: 100%;
	}

	// uni-page-wrapper {
	// 	width: 100%;
	// 	height: 100%;
	// }
	// 
	// uni-page-body {
	// 	width: 100%;
	// 	height: 100%;
	// 	background-color: #ff9e00;
	// }

	.lf-cash-register {
		// position: absolute;
		bottom: 50upx;
		width: 750upx;
		// width: 100%;
		// background-color: #F1F2F3;
		z-index: 100;
		// margin-bottom: -194upx;

		image {
			// 两个的尺寸
			width: 240upx;
			height: 100upx;
			// 三个的尺寸
			/* width: 190upx;
			height: 80upx; */
		}

		.image {
			width: 320upx;
			height: 130upx;
			background-color: #DDD;
			border: 2upx solid #FFF;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 20upx;
			font-size: 37upx;
			font-weight: 400;
			color: #FFF;
			margin-top: 20upx;

			&:active {
				opacity: 0.8;
			}
		}
		&__ml-90{
			margin-left: 90upx;
		}
		
	}

	///*浮动收款样式开始 ***************** */
	// .lf-cash-register {
	// 	position: absolute;
	// 	bottom: 50upx;
	// 	width: 750upx;
	// 	// width: 100%;
	// 	background-color: #F1F2F3;
	// 	z-index: 100;
	// 	margin-bottom: -194upx;

	// 	image {
	// 		// 两个的尺寸
	// 		/* width: 240upx;
	// 		height: 100upx; */
	// 		// 三个的尺寸
	// 		width: 190upx;
	// 		height: 80upx;
	// 	}

	// 	.image {
	// 		width: 320upx;
	// 		height: 130upx;
	// 		background-color: #DDD;
	// 		border: 2upx solid #FFF;
	// 		display: flex;
	// 		align-items: center;
	// 		justify-content: center;
	// 		border-radius: 20upx;
	// 		font-size: 37upx;
	// 		font-weight: 400;
	// 		color: #FFF;
	// 		margin-top: 20upx;

	// 		&:active {
	// 			opacity: 0.8;
	// 		}
	// 	}
	// }
	///*浮动收款样式结束 ***************** */
	.lf-cash-register-bottom {
		bottom: -70upx
	}

	.page-home-x {
		width: 100%;
		// height: 100%;
		background-color: #FFF;
		// position: fixed;
		// left: 0;
		// right: 0;
		// top: 0;
		padding-bottom: 350upx;

		&__banner {
			width: 100%;
			height: 554upx;
			position: relative;
			box-sizing: border-box;

			.cover {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				color: #FFF;
				padding-top: 80upx;

				.title {
					width: 100%;
					font-size: 36upx;
					font-weight: bold;

					image {
						width: 26upx;
						height: 26upx;
					}
				}

				.content {
					// width: 650upx;
					width: 100%;
					height: 246upx;
					border-radius: 20upx;
					opacity: 0.9;
					background-color: #FFF;
					font-size: 25upx;
					font-weight: 500;
					color: #666;

					.larger {
						font-size: 67upx;
					}

					.darker {
						color: #333;
					}

					.mark {
						font-size: 29upx;
					}
				}

				.keyboard-box {
					width: 100%;
					height: 100upx;
					border-radius: 10upx;
					border: 2upx solid #FFF;

					text {
						color: #FFF;
						opacity: 0.5;
					}

					&__inner {
						width: 200upx;
						height: 100%;
					}
				}
			}
		}

		&__message {
			width: 100%;
			height: 120upx;
			font-size: 28upx;
			font-weight: 500;
			color: #666;
			background-color: #FFF;

			.icon {
				width: 43upx;
				height: 36upx;
			}

			.arrow {
				width: 14upx;
				height: 25upx;
			}

			.darker {
				color: #333;
			}

			.circle {

				view {
					width: 6upx;
					height: 6upx;
					background-color: #CCC;
					border-radius: 50%;
					margin: 6upx 0;
				}
			}
		}

		&__menu {
			width: 100%;
			font-size: 24upx;
			color: #333;
			font-weight: 500;
			background-color: #FFF;

			.item {
				width: 25%;
				height: 90upx;
				margin: 20upx 0;

				image {
					width: 44upx;
					height: 38upx;
				}

				.img_0 {
					width: 44upx;
					height: 38upx;
				}

				.img_1 {
					width: 43upx;
					height: 44upx;
				}

				.img_2 {
					width: 40upx;
					height: 36upx;
				}

				.img_3 {
					width: 38upx;
					height: 38upx;
				}

				.img_4 {
					width: 42upx;
					height: 40upx;
				}

				.img_5 {
					width: 43upx;
					height: 42upx;
				}

				.img_6 {
					width: 47upx;
					height: 43upx;
				}

				.img_7 {
					width: 42upx;
					height: 40upx;
				}
			}
		}

		&__banner_x {
			width: 750upx;
			height: 220upx;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			margin-bottom: var(--window-bottom);

			&.active {
				position: relative;
			}
		}
	}

	.icon-frog {
		color: #FFF;
		font-size: 40upx !important;
		position: absolute;
		top: 80upx;
		right: 40upx;
	}

	.bar {
		width: 100%;
		height: 20upx;
		background-color: #F8F9FD;
	}
</style>
