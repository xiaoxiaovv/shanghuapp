<template>
	<view class="if-page">
		<view class="shop-module shop-module__2 box">
			<mescroll-uni @down="downCallback" @up="upCallback" :up="mescrollUp" @init="mescrollInit">
				<view class="shop-module-item" v-for="(item,i) in list" :key="i">
					<view class="shop-module-item-row">
						<view style="color: #000;">申请提现</view>
						<view class="cash-price">+{{item.applyAmount.toFixed(2)}}</view>
					</view>
					<view class="shop-module-item-row color-9">
						<view>申请时间</view>
						<view>{{item.createTime}}</view>
					</view>
					<view class="shop-module-item-row color-9">
						<view>提现方式</view>
						<view>银行卡</view>
					</view>
					<view class="shop-module-item-button">
						<view class="button-load" v-if="item.status == -1">审核未通过</view>
						<view class="button-error" v-if="item.status == 1">待审核</view>
						<view class="button-success" v-if="item.status == 2">审核通过</view>
						<view class="button-success" v-if="item.status == 3">提现成功</view>
					</view>
				</view>
			</mescroll-uni>
			<view class="empty-box" v-if="list.length == 0">暂无数据~</view>
		</view>
	</view>
</template>

<script>
	import { cashOutlog } from '../../../../api/vueAPI.js'
	import MescrollUni from "mescroll-uni/mescroll-uni.vue";
	export default {
		components: { MescrollUni },
		data() {
			return {
				mescroll: null,
				mescrollUp: {
					empty: {
						icon: "../../../../../static/order/no-data.png", //图标,默认null,支持网络图
						tip: "暂无相关数据~" //提示
					}
				},
				isMescroll: false,	//onShow刷新指示
				list: []
			};
		},
		
		onReady() {
			
		},
		onLoad() {
			this.cashOutlog()
		},
		onShow() {
			/* 刷新 */
			if(this.isMescroll){
				this.list = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			}else{
				this.isMescroll = true
			}
		},
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			this.mescroll && this.mescroll.onPageScroll(e);
		},
		methods:{
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调*/
			downCallback(mescroll){
				mescroll.resetUpScroll() // 重置列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				const params = {
					merchantId: uni.getStorageSync('merchantId'),
					pageNumber: mescroll.num,
					pageSize: 10,
					pageSort: '',
					pageOrder: ''
				}
				cashOutlog(params).then(res => {
					if (res.code === 200) {
						mescroll.endBySize( res.obj.content.length, res.obj.totalElements)
						if(mescroll.num == 1) this.list = []
						this.list = this.list.concat(res.obj.content)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'error'
						})
					}
				})
			},
			cashOutlog () {
				
			},
		}
	}
</script>

<style lang="scss">
.shop-module {
		background-color: #FFF;
		font-size: 28upx;
		color: #999999;
		font-weight: 500;
		box-sizing: border-box;
		padding: 30upx;
		padding-top: 0;
		&__2 {
			font-size: 30upx;
			color: #666666;
			font-weight: 500;	
		}
		.shop-module-item {
			padding: 20upx;
			margin-bottom: 20upx;
			border-radius: 10upx;
			box-shadow: 2upx 2upx 10upx 0 rgba(0.5, 0.5, 0.5, 0.1);
			.shop-module-item-row {
				display: flex;
				justify-content: space-between;
				padding: 5upx 0;
			}
			.shop-module-item-button {
				display: flex;
				justify-content: flex-end;
				padding: 5upx 0;
				font-size: 28upx;
				.button-load {
					padding: 6upx 14upx;
					border-radius: 8upx;
					background-color: red;
					color: #fff;
				}
				.button-success {
					padding: 6upx 14upx;
					border-radius: 8upx;
					background-color: green;
					color: #fff;
				}
				.button-error {
					padding: 6upx 14upx;
					border-radius: 8upx;
					background-color: #999999;
					color: #fff;
				}
			}
			.color-9 {
				color: #929292;
			}
			.cash-price {
				color: #39b54a;
				font-size: 32upx;
				font-weight: bold;
			}
		}
		.no-data {
			width: 320upx;
			height: 320upx;
			box-sizing: border-box;
			font-size: 24upx;
			color: #999999;
		}
	}
</style>
