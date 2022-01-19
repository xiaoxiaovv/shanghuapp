<template>
	<view class="lf-payment" :style="{height: screenHeight + 'px'} ">
		<view></view>
		<view></view>
		<text class="text-llg">需支付</text>	
		<text class="text-llg text-weight">{{yenSymbol}} {{paymentMoney}}</text>
		<view class="lf-code-box align-center">
			<view 
				class="qrimg align-center"
				@click="onChangeScanCode">
				<canvas canvas-id="myCanvas" />
			</view>
		</view>
		<text class="text-grey">
			<text class="text-llg icon-loading2"></text>
			<text class="text-lg">5分钟自动更新，限当面使用</text>
		</text>
		<view></view>
		<view></view>
	</view>
</template>

<script>
	import tkiQrcode from "../../components/tki-qrcode/tki-qrcode.vue"
	import {baseURL, getDomain, getUUID, getAppid, getCallOrder} from "../../../api/vueAPI.js"
	import Qrcode from '../../../components/qrcode-master/js/qrcode/qrcode.js'
	// wxapi
	import { Interval, showToast } from '../../../common/wxapi.js'
	import { getPrintOrderDetailAndPrint } from '../../../api/orderApi.js'
	
	export default {
		components: {tkiQrcode},
		data() {
			return {
				yenSymbol: '¥',		//金钱符号
				paymentMoney: '0',		//支付金额
				screenHeight: '',	//屏幕高度
				val: '', // 要生成的二维码值
				size: 360, // 二维码大小
				unit: 'upx', // 单位
				background: '#FFF', // 背景色
				foreground: '#000', // 前景色
				pdground: '#000', // 角标色
				icon: '', // 二维码图标
				iconsize: 40, // 二维码图标大小
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '' ,// 二维码生成后的图片地址或base64
				interfere: '',	//二维码干扰项（暂时更换二维码显示用）
				code:null,	//关闭刷新定时器用
				isShow: false
			};
		},

		onLoad(obj) {
			let systemInfo = uni.getSystemInfoSync()
			let { screenWidth } = systemInfo
			let size = screenWidth / 375 * 200
			// console.log('systemInfo', systemInfo)
			// 二维码插件
			this.qrcode = new Qrcode({
				'level': 'L',
				'size': size
			})
			this.screenHeight = systemInfo['screenHeight'] - 100

			this.paymentMoney = obj.paymentMoney
			this.payWay = obj.payWay
			
			// 
			this.getUUID().then(uuid => {
				console.log('qqqqqqqqqqqqq', uuid)
				this.uuid = uuid
				this.getDomain().then(domain => {
					this.domain = domain
					this.createBarCode().then(() => {
						this.getTimer((count) => {
							console.log('计时器', count)
							this.checkOrderStatus().then(order => {
								console.log('order', order)
								if (order) {
									this.interval.closeInterval()
									showToast('支付成功')
									getPrintOrderDetailAndPrint(order, false).then(delay => {
										setTimeout(() => {
											this.navigateBack()
										}, delay)
									})
								}
							})
						})
					})
				})
			})
		}, 
		
		onShow() {
			// if (this.interval) {
			// 	this.interval.openInterval()
			// 	this.interval.startInterval()
			// } 
		},
		
		onHide() {
			// if (this.interval) {
			// 	this.interval.closeInterval()
			// }
		},
		
		onBackPress() {
			if (this.interval) {
				this.interval.closeInterval()
			}
		},
		
		methods: {
			qrR(res) {
				// console.log("返回链接", res)
				// console.log(res)
				this.src = res
			},
			// 生成二维码
			createBarCode() {
				let userId = uni.getStorageSync('userId')
				let storeId = ''
				let isOpen = -1
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
					isOpen = nowStoreDetail.isOpen
				}
				let customerInfo = uni.getStorageSync('customerCount')
				let serviceId = customerInfo.serviceId
				let merchantId = uni.getStorageSync('merchantId')
				let equipmentId = uni.getStorageSync('equipmentId') || ''
				let aliAppId = ''
				getAppid({serviceId}).then(res => {
					if (res.code === 200) {
						aliAppId = res.obj
						let val = this.domain + '/web/pay/index.html#/?totalPrice='+ this.paymentMoney +'&userId='+userId + '&storeId=' + storeId + '&equipmentId=' + equipmentId + '&uuid=' + this.uuid + '&fence=' + isOpen + '&serviceId=' + serviceId + '&merchantId=' + merchantId + '&aliAppId=' + aliAppId
						this.qrcode.draw('myCanvas', val)
					}
				})
				return Promise.resolve()
			},
			// 获取uuid
			getUUID() {
				return new Promise((resolve, reject) => {
					getUUID().then(res => {
						if (res && res.code === 200) {
							resolve && resolve(res.obj)
						}
					}).catch(err => {
						console.log(err)
						reject && reject()
					})
				})
			},
			// 获取域名
			getDomain() {
				return new Promise((resolve, reject) => {
					getDomain().then(res => {
						// console.log('付款码', res)
						if (res && res.code === 200) {
							// TODO 临时注释
							resolve && resolve(res.obj)
						}
					}).catch(err => {
						// nothing to do
						console.log(err)
					})
				})
			},
			// 检查订单支付状态
			checkOrderStatus() {
				return new Promise((resolve, reject) => {
					if (this.uuid) {
						getCallOrder(this.uuid).then(res => {
							if (res && res.code === 200) {
								resolve && resolve(res.obj)
							}
						}).catch(err => {
							console.log(err)
							reject && reject()
						})
					} else {
						console.log('uuid is null')
						reject && reject('uuid is null')
					}
				})
			},
			// 改变二维码
			onChangeScanCode() {
				// nothing to do
				// this.createBarCode().then(() => {})
			},
			// 获取定时器
			getTimer(callback) {
				this.interval = Interval((count) => {
					// console.log(count)
					console.log('付款码', undefined)
					callback && callback(count)
				}, 3000)
				this.interval.openInterval()
				this.interval.startInterval()
			},
			// 返回
			navigateBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
	.text-llg{
		font-size: 36upx;
	}
	.text-weight{
		font-weight: 800;
	}
	.lf-payment{
		width: 750upx;
		border-top: 1upx solid #F1F1F3;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}
	.lf-code-box{
		width: 670upx;
		height: 580upx;
		background-image: url('../../../static/home/code_bg.png');
		background-repeat: no-repeat;
		background-size: 670upx 580upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-code-box > view{
		width: 400upx;
		height: 400upx;
		background-color: #FFF;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		
		canvas, .canvas {
			width: 100%;
			height: 100%;
		}
	}
</style>
