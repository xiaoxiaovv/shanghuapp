<template>
	<view class="page-coupon-cancel box align-default">
		
		<view class="page-coupon-cancel__nav box align-hor-bet pl-30 pr-40">
			<view class="icon iconfont icon-Back" @click="returnBack"></view>
			<view class="title">核销记录</view>
			<view @click="scanCode">核销</view>
		</view>
		
		<view 
			class="page-coupon-cancel__select box align-center bg-warn"
			@click="jumpStoreSelect">
			<view>{{storeName ? storeName : '全部门店'}}</view>
			<text class="icon-unfold ml-10"></text>
		</view>
		
		<view class="page-coupon-cancel__content match-left-space box bg-warn">
			<view class="time box plr-40 align-left">
				<picker
					mode="date"
					fields="month"
					:value="value"
					:end="today"
					@change="onPickerChange"
					@cancel="onPickerCancel">
					<view class="align-baseline">
						<view>{{today | todayFilter}}</view>
						<text class="icon-unfold ml-10"></text>
					</view>
				</picker>
			</view>
			<view class="match-left-space">		
				<!-- <mescroll-uni 
					@down="downCallback" 
					:up="mescrollUp" 
					@up="upCallback" 
					@init="mescrollInit"> -->
					<view 
						class="item box plr-40 pt-32 pb-32"
						v-for="(timeList, index) in couponList" :key="index">
						<view class="title match-width align-hor-bet">
							<view>8833065623266</view>
							<view>端午活动1</view>
						</view>
						<view class="align-left mt-10">
							2018-04-03 11:00:00
						</view>
					</view>
				<!-- </mescroll-uni> -->
			</view>
		</view>
		
	</view>
</template>

<script>
import MescrollUni from "mescroll-uni/mescroll-uni.vue"
	
export default {
	data() {
		return {
			couponList: [],
			value: '',
			mescroll: null,
			mescrollUp: {
				empty: {
					icon: "../../static/order/no-data.png", //图标,默认null,支持网络图
					tip: "暂无相关数据~" //提示
				}
			},
			isMescroll: false,	//onShow刷新指示
			yenSymbol: '\u00A5',	//金钱符号
			storeId: '',
			storeName: '',
			today: ''
		}
	},
	
	components: {
		MescrollUni
	},
	
	methods: {
		/* 返回 */
		returnBack() {
			uni.navigateBack({})
		},
		
		/* 跳转选择门店页面 */
		jumpStoreSelect() {
			uni.navigateTo({
				url: '/packageA/pages/home/storeSelect/index/index'
			})
		},
		
		/* 核销 */
		scanCode() {
			uni.scanCode({
				success(res) {
					this.codeResult = res.result
					// console.log("扫码内容：" + res.result)
					// console.log("扫码类型：" + res.scanType)
					// console.log('扫码成功，进行h核销。。。');
					// TODO
					
				}
			})
		},
		
		/* mescroll组件初始化的回调,可获取到mescroll对象 */
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		
		/*下拉刷新的回调*/
		downCallback(mescroll){
			mescroll.resetUpScroll() // 重置列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
		},
		
		/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
		upCallback(mescroll) {
			// TODO
			
		},
		
		/* 选择时间 */
		selectTime() {
			
		},
		
		/* picker change */
		onPickerChange(e) {
			this.value = e.detail.value
			this.today = this.value 
		},
		
		/* picker cancel */
		onPickerCancel() {
			// console.log(this.value)
		}
	},
	
	filters: {
		todayFilter(time) {
			let tmp = time.split('-')
			if (/^0[1-9]$/.test(tmp[1])) {
				tmp[1] = tmp[1].slice(1)
			}
			return (tmp[0] + '年' + tmp[1] + '月')
		}
	},
	
	onShow() {
		/* 刷新 */
		if(this.isMescroll){
			// this.closeCover()
			// this.start_payTime = '';
			// this.end_payTime = '';
			// this.status = '';
			// this.payWay = '';
			// if(this.showPicker === true){
			// 	this.showPicker = false;
			// }
			// this.orderList = []// 在这里手动置空列表,可显示加载中的请求进度
			// this.mescroll.resetUpScroll()// 刷新列表数据
		}else{
			this.isMescroll = true
		}
		
		/* 门店选择 */
		let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
		if(nowStoreDetail.status) {
			nowStoreDetail.status = false
			uni.setStorageSync('nowStoreDetail', nowStoreDetail)
		} else {
			this.storeId = nowStoreDetail.storeId
			this.storeName = nowStoreDetail.storeName
		}
		
		// 截止时间
		this.date = new Date()
		this.today = (this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate())
	},
	
	//注册滚动到底部的事件,用于上拉加载
	onReachBottom() {
		this.mescroll && this.mescroll.onReachBottom()
	},
	
	//注册列表滚动事件,用于下拉刷新
	onPageScroll(e) {
		this.mescroll && this.mescroll.onPageScroll(e)
	},
}
</script>

<style lang="scss">
	
	.page-coupon-cancel {
		width: 100%;
		height: 100%;
		background-color: #FFF;
		font-weight: 500;
		font-size: 24upx;
		color: #999999;
		
		&__nav {
			width: 100%;
			height: 88upx;
			background-color: #FFF;
			font-size: 28upx;
			margin-top: 40upx;
			
			.title {
				color: #333333;
				font-size: 32upx;
				// font-weight: bold;
			}
			
			.icon {
				font-size: 44upx !important;
			}
		}
		
		&__select {
			width: 100%;
			height: 88upx;
			color: #666666;
			font-size: 28upx;
			background-color: #FFF;
		}
		
		&__content {
			background-color: #F8F9FD;
			
			.time {
				width: 100%;
				height: 88upx;
				color: #666666;
				font-size: 30upx;
				
				text {
					font-size: 24upx;
				}
			}
			
			.item {
				background-color: #FFF;
				border-bottom: 1upx solid #F0F0F0;
				
				.title {
					color: #333333;
					font-size: 28upx;
				}
			}
		}
	}
	
</style>
