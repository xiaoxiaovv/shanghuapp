<template>
	<view>
		<view class="lf-mat"></view>
		<view class="lf-head">
			<view>
				<!-- <image src="../../../static/home/icon_chenggong.png"></image> -->
				<view class="icon iconfont icon-success"></view>
				<text class="text-llg">收款成功</text>
			</view>
		</view>
		<view class="lf-content">
			<view>
				<text class="text-grey text-lg">消费金额</text>
				<text>{{orderDetails.totalPrice}}</text>
			</view>
			<view>
				<text class="text-grey text-lg">支付方式</text>
				<view>
					<view class="prod prod-height"></view>
					<!-- <image src="../../../static/home/icon_wechat.png"></image> -->
					<image class="meat" :src=" orderDetails.payWay | payWayImgFilters"></image>
					<text class="meat">{{orderDetails.payWay | payWayFilters}}</text>
				</view>
			</view>
			<view>
				<text class="text-grey text-lg">订单编号</text>
				<text>{{orderDetails.orderNumber}}</text>
			</view>
			<view>
				<text class="text-grey text-lg">支付状态</text>
				<text>{{orderDetails.status | statusFilters}}</text>
			</view>
			<view>
				<text class="text-grey text-lg">支付时间</text>
				<text>{{orderDetails.payTime}}</text>
			</view>
		</view>
		<view class="lf-btn">
			<view @click="jumpBack">
				<text>确定</text>
			</view>
		</view>
		
		<!-- 广告 -->
		<view 
			class="banner align-center" 
			v-if="bannerData && bannerData.length">
			<swiper 
				class="match-parent" 
				indicator-dots="true" 
				autoplay="true" 
				interval="3000" 
				duration="500"
				indicator-color="#DDD"
				indicator-active-color="#FFF"
				:current="current"
				@change="onBannerChange">
				<swiper-item 
					v-for="(item, index) in bannerData" 
					v-if="index < showNum"
					:key="index">
					<view 
						class="match-parent"
						@click="onBannerClick(item.id)">
						<image
							class="match-parent"
							:src="item.imageUrl"
							mode="scaleToFill"/>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
	</view>
</template>

<script>
	import { getOrderDetails, getAdvertises, clickAdvertise, adClick } from '../../../api/vueAPI.js'
	import { getPrintOrderDetailAndPrint } from '../../../api/orderApi.js'
	import { payWayFilters } from '../../../common/utils.js'
	
	export default {
		data() {
			return {
				orderDetails: '',
				bannerData: [],
				showNum: 4,							// 要展示的广告数量
				fromRange: 11,
				current: 0
			}
		},
		onLoad(obj) {
			getOrderDetails(obj.orderNumber).then(res => {
				// console.log(888, res)
				this.orderDetails = res.obj
				// 打印小票，有打印机则打印
				getPrintOrderDetailAndPrint(this.orderDetails, false)
			}).catch(err => {
				console.log(err)
			})
			
			// 获取广告数据
			this.getBannerList()
		},
		filters:{
			statusFilters(val) {
				switch(parseInt(val)){
					case 1:
						return '未支付';
						break;
					case 2:
						return '支付成功';
						break;
					case 3:
						return '支付失败（已关闭）';
						break;
					case 4:
						return '已撤销';
						break;
					case 5:
						return '全额退款成功';
						break;
					case 6:
						return '部分退款成功';
						break;
					case 7:
						return '退款失败';
						break;
					default:
						console.log("异常状态值："+val);
				}
			},
			payWayFilters,
			/* payWayFilters(val) {
				switch(parseInt(val)){
					case 1:		//微信支付
						return '微信';
						break;
					case 2:		//支付宝支付
						return '支付宝';
						break;
					case 3:		//银行卡支付
						return '银行卡';
						break;
					case 3:		//会员卡支付
						return '会员卡';
						break;
					case 99:	//未知支付
						return '未知支付';
						break;
					default:
						console.log("异常支付码："+val)
				}
			}, */
			payWayImgFilters(val) {
				switch(parseInt(val)){
					case 1:		//微信支付
						return '/static/order/icon_wechat_list.png';
						break;
					case 2:		//支付宝支付
						return '/static/order/icon_zhifubao_list.png';
						break;
					case 3:		//银行卡支付
						return '/static/order/icon_unionpay_list.png';
						break;
					case 4:		//会员卡支付
						return '/static/home/icon_king.png';
						break;
					case 99:	//未知支付
						return '/static/order/icon_receive_money.png';
						break;
					default:
						console.log("异常支付码："+val)
				}
			}
		},
		methods: {
			/* 确定返回 */
			jumpBack() {
				uni.navigateBack({
					delta:1
				})
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
							// uni.showToast({
							// 	title: err.msg,
							// 	icon: 'none'
							// })
							this.bannerData = []
						}
					}, (err) => {
						// uni.showToast({
						// 	title: err.msg,
						// 	icon: 'none'
						// })
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
				adClick(id, this.fromRange)
				// 广告跳转
				if (obj[0].isJump === 0) {
					// 内部打开
					uni.navigateTo({
						url: ('/pages/home/advertisement/advertisement?url=' + obj[0].imageLink)
					})
				} else {
					// 外部打开
					plus.runtime.openURL(obj[0].imageLink)
				}
			}
		},
		// 打印
		onNavigationBarButtonTap() {
			// TODO
			uni.showToast({
				title: '未接入打印设备',
				icon: 'none'
			})
		},
		// 广告滑动
		onBannerChange(e) {
			this.current = e.detail.current
		}
	}
</script>

<style>
	.text-llg{
		font-size: 48upx;
	}
	.lf-mat{
		height: 80upx;
	}
	.lf-head{
		width: 750upx;
		height: 230upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-head > view{
		width: 300upx;
		height: 230upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
	.lf-head image{
		width: 130upx;
		height: 130upx;
	}
	.lf-content{
		width: 750upx;
		height: 400upx;
		padding: 0 20upx;
	}
	.lf-content > view{
		width: 710upx;
		height: 70upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
	.lf-content image{
		width: 30upx;
		height: 30upx;
		margin-right: 10upx;
	}
	.prod-height{
		height: 30upx;
	}
	.lf-btn{
		width: 750upx;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-btn > view{
		width: 710upx;
		height: 100upx;
		background-color: #4BA8FF;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFF;
		font-size: 36upx;
		border-radius: 50upx;
	}
	.banner {
		width: 100%;
		height: 600upx;
		position: absolute;
		/* bottom: 80upx; */
	}
	.icon {
		color: #4BA8FF;
		font-size: 120upx !important;
	}
</style>
