<template>
	<view>
		<view class="lf-head-box flex flex-direction justify-center align-center" style="background-image: url('../../../static/tabBar/bg_mine.png')">
			<view class="lf-pic-head">
				<image class="imgs" src="../../../static/tabBar/icon_me.png"></image>
			</view>
			<text class="ly-font-size-28 ly-font-weight-500 text-white mt-20">{{name}}</text>
			<text class="ly-font-size-36 ly-font-weight-bold text-white">{{merchantName}}</text>
			<image class="lf-btn-message" src="../../../static/tabBar/icon_the_bell.png" @click="jumpMessageCenter"/>
		</view>
		<view 
			class="cu-form-group cu-form-group-sec bg-white box plr-40" 
			v-for="(menu,key) in menuList" 
			:key="key" 
			@click="menuJump(key,menu.url)">
			<view class="title">
				<!-- <view class="prod height"></view> -->
				<image class="left meat" :src="menu.image"></image>
				<text class="meat">{{menu.name}}</text>
			</view>
			<view>
				<!-- <view class="prod height"></view> -->
				<text class="text-grey meat ly-font-color-6" :class="menu.remarks=='支付宝签约'?'ly-font-color-main':''">{{menu.remarks}}</text>
				<image class="right meat" src="../../../static/tabBar/icon_the_arrow.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { getAccountInfo} from '../../../api/vueAPI.js'
	import { jump2DkmShopManager } from '../../../common/appcommon.js'
	
	export default {
		data() {
			return {
				menuList: {
					'set':{
						image: '../../../static/tabBar/icon_setting_bg.png',
						name: '设置',
						remarks: '',
						url: '/pages/user/set/index/index'
					},
					'mendMerchant':{
						image: '../../../static/tabBar/icon_pay_sign.png',
						name: '完善/修改商户信息',
						remarks: '',
						url: '/pages/user/mendMerchant/mendMerchant'
					},
					'enterChannel':{
						image: '../../../static/tabBar/icon_ticket.png',
						name: '进件',
						remarks: '',
						url: '/pages/user/enterChannel/enterChannel'
					},
					'selectCard':{
						image: '../../../static/tabBar/icon_card.png',
						name: '卡管理',
						remarks: '',
						url: '/pages/home/quickPay/selectCard'
					},
					'cashOut':{
						image: '../../../static/tabBar/icon_money.png',
						name: '钱包',
						remarks: '',
						url: '/pages/user/cashOut/cashOut'
					},
					'about':{
						image: '../../../static/tabBar/icon_about.png',
						name: '关于',
						remarks: '',
						url: '/pages/user/about/index/index'
					},
				},
				merchantName: '',
				name: '',
				bindedEquipment: '',
			};
		},
		watch: {
			menuList:{
				handler(newValue, oldValue) {
					
				},
				deep:true
			}
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
			this.name = this.userInfo.realName
			/* getAccountInfo().then(res => {
				// console.log(res);
				this.merchantName = res.obj.merchantName
				this.name = res.obj.name
			}).catch(err => {
				console.log(err)
			})
			let bluetoothOnLine = uni.getStorageSync('bindedEquipment')
			if(bluetoothOnLine){
				// console.log("改变打印机名字")
				this.menuList.printer.remarks = bluetoothOnLine.localName;
			} */
		},
		methods:{
			webViewMessage(e){
				console.log(e.detail.data.msg);
				if(e.detail.data.msg === close){
					let currentWebview = this.$mp.page.$getAppWebview()
					currentWebview.children()[0].close()
				}				
			},
			/* 跳转消息中心 */
			jumpMessageCenter() {
				uni.showToast({
					title:"敬请期待",
					icon:"none"
				})
				return
				// console.log("跳转消息中心页面")
				/* 保留页面栈进行跳转 */
				uni.navigateTo({
					url: '/pages/user/messageCenter/index/index'
				})
			},
			/* 菜单跳转 */
			menuJump(key,url) {
				if(key === 'mendMerchant'){
					// console.log('0000000')
					/* let wv = plus.webview.create( 'http://test.fx.mamipay.com/h5/#/clientEdit', 'mendMerchant', {
						top:'26px',
						height:'92%',
					}) */
					// let currentWebview = this.$mp.page.$getAppWebview()
					// currentWebview.append(wv);
					// console.log('22222222222',Json.stringify(currentWebview.children()[0]))
					// currentWebview.children()[0].message = this.webViewMessage 
					
					
					// console.log('1111111')
				}
				
				if(key === 'AlipaySigningPage'){
					uni.showToast({
						title:"敬请期待",
						icon:"none"
					})
					return
				}
				// TODO
				// key === 'ticketSet' || 
				// key === 'vipSet'
				// if(key === 'vipSet'){
				// 	uni.showToast({
				// 		title:"敬请期待",
				// 		icon:"none"
				// 	})
				// 	return
				// }
				// 客流统计
				if (key === 'customerCount') {
					// let systemInfo = uni.getSystemInfoSync()
					// let { platform } = systemInfo
					// if (!platform || platform === 'ios') {
					// 	uni.showToast({
					// 		title:"敬请期待",
					// 		icon:"none"
					// 	})
					// 	return
					// }
					let customerInfo = uni.getStorageSync('customerCount')
					let { serviceId, servicePhone, token } = customerInfo
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
					if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
						storeId = nowStoreDetail.storeId
					}
					let userType = uni.getStorageSync('userType') || ''
					serviceId && servicePhone && token && jump2DkmShopManager(serviceId, servicePhone, token, userType, storeId)
					return
				}
				// console.log("跳转地址："+url);
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style>
	body{
		background-color: #F8F9FD;
	}
	.text-llg{
		font-size: 46upx;
	}
	.cu-form-group-sec{
		height: 109upx;
	}
	.cu-form-group .title {
		min-width: 120upx;
	}
	.cu-form-group .left{
		width: 36upx;
		height: 36upx;
		margin-right: 20upx;
	}
	.cu-form-group .right{
		width: 11upx;
		height: 20upx;
		margin-left: 30upx;
	}
	.cu-form-group .height{
		height: 40upx;
	}
	.cu-form-group text{
		font-size: 32upx;
	}
	.lf-head-box{
		width: 750upx;
		height: 400upx;
		background-color: #007AFF;
		background-repeat: no-repeat;
		background-size: cover;
		position: relative;
	}
	.lf-pic-head{
		position: relative;
		width: 160upx;
		height: 160upx;
		border-radius: 50%;
	}
	.lf-pic-head:before{
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.2);
	}
	.lf-pic-head .imgs {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 150upx;
		height: 150upx;
		background-color: #fff;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		overflow: hidden;
	}
	.lf-head-box text{
		margin-top: 10upx;
	}
	.lf-btn-message{
		width: 32upx;
		height: 40upx;
		position: absolute;
		top: 70upx;
		right: 30upx;
	}
	.text-white {
		color: #FFF;
	}
	.bg-white {
		background-color: #FFF;
		box-sizing: border-box;
		padding: 0 30upx;
	}
</style>
