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
					'printer':{
						image: '../../../static/tabBar/icon_print_bg.png',
						name: '打印机',
						remarks: '',
						url: '/pages/user/newPrinter/index/index'
					},
					// 'AlipaySigningPage':{
					// 	image: '../../../static/tabBar/icon_pay_sign.png',
					//  	name: '支付签约',
					//  	remarks: '支付宝签约',
					//  	url: '/pages/user/AlipaySigningPage/index/index'
					// },
					'vipSet':{
						image: '../../../static/tabBar/icon_vip.png',
						name: '会员支付设置',
						remarks: '',
						url: '/pages/user/vipSet/index/index'
					},
					'ticketSet':{
						image: '../../../static/tabBar/icon_ticket.png',
						name: '电子发票设置',
						remarks: '',
						url: '/pages/user/ticketSet/index/index'
					},
					// 'customerCount':{
					// 	image: '../../../static/tabBar/icon_customer.png',
					// 	name: '客流统计设置',
					// 	remarks: '',
					// 	url: ''
					// },
					'classReplace':{
						image: '../../../static/tabBar/workinfo.png',
						name: '交接班记录',
						remarks: '',
						url: '/pages/user/classReplace/index/index'
					},
					'location':{
						image: '../../../static//tabBar/location.png',
						name: '定位',
						remarks: '',
						url: '/pages/user/location/index/index'
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
			getAccountInfo().then(res => {
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
			}
		},
		methods:{
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
