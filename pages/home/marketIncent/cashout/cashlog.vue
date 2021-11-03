<template>
	<view class="if-page">
		<view class="shop-module shop-module__2 box">
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
			<view class="empty-box" v-if="list.length == 0">暂无数据~</view>
		</view>
	</view>
</template>

<script>
	import { cashOutlog } from '../../../../api/vueAPI.js'
	export default {
		components: {  },
		data() {
			return {
				list: []
			};
		},
		
		onReady() {
			
		},
		onLoad() {
			this.cashOutlog()
		},
		onShow() {
			
		},
		methods:{
			cashOutlog () {
				const params = {
					merchantId: uni.getStorageSync('merchantId'),
					pageNumber: 1,
					pageSize: 10,
					pageSort: '',
					pageOrder: ''
				}
				cashOutlog(params).then(res => {
					if (res.code === 200) {
						this.list = res.obj.content
					}
				})
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
