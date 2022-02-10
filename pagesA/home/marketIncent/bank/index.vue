<template>
	<view class="if-page">
		<view class="form-item">
			<view class="form-item-left"><text class="star">*</text><text>开户姓名</text></view>
			<view>
				<input class="lf-modal-input" type="text" placeholder="请输入开户名" v-model="bankInfo.bankAccount" maxlength="15"/>
			</view>
		</view>
		<view class="form-item">
			<view class="form-item-left"><text class="star">*</text><text>银行名称</text></view>
			<view>
				<input class="lf-modal-input" type="text" v-model="bankInfo.bankName" placeholder="请输入银行名称" maxlength="15"/>
			</view>
		</view>
		<view class="form-item">
			<view class="form-item-left"><text class="star">*</text><text>银行卡号</text></view>
			<view>
				<input class="lf-modal-input" type="number" v-model="bankInfo.cardNo" placeholder="请输入银行卡号" maxlength="30"/>
			</view>
		</view>
		<view class='bottom-box plr-40 pb-50'>
			<view 
				class='bottom-box__btn align-center mt-30'
				@click="bindMarketCard">
				提交
			</view>
		</view>
	</view>
</template>

<script>
	import { bindMarketCard, getMarketCard } from '../../../../api/vueAPI.js'
	export default {
		components: {  },
		data() {
			return {
				bankInfo: {
					bankAccount: '',
					bankName: '',
					cardNo: '',
					merchantId: uni.getStorageSync('merchantId')
				},
			};
		},
		onReady() {
			
		},
		onLoad() {
			this.getMarketCard()
		},
		onShow() {
			
		},
		methods:{
			getMarketCard () {
				const params = {
					merchantId: uni.getStorageSync('merchantId'),
				}
				getMarketCard(params).then(res => {
					if (res.code === 200 && res.obj) {
						this.bankInfo = res.obj
					}
				})
			},
			bindMarketCard() {
				const params = this.bankInfo
				bindMarketCard(params).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: res.msg,
							icon: 'success'
						})
						let pages = getCurrentPages()//页面栈
						let prePage = pages[pages.length - 2]//上一页
						prePage.$vm.reFresh = Math.random()//触发上一页监听器
						uni.navigateBack()//返回上一页
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
uni-page-body {
	height: 100%;
}
.if-page {
	background-color: #f0f0f0;
	height: 100%;
	padding-top: 6upx;
}
.form-item {
	background-color: #fff;
	display: flex;
	padding: 50upx 30upx;
	justify-content: space-between;
	font-size: 33upx;
	border-bottom: 1px solid #F0F0F0;
	.form-item-left {
		display: flex;
		.star {
			padding-top: 12upx;
			color: red;
		}
	}
	input {
		text-align: right;
	}
}
.bottom-box {
	width: 100%;
	box-sizing: border-box;
	margin-top: 100upx;
	&__btn {
		width: 70%;
		height: 70upx;
		margin: 0 auto;
		border-radius: 20upx;
		background-color: #4BA8FF;
		color: #FFF;
		font-size: 30upx;
		font-weight: bold;
		letter-spacing: 4upx;
		&:active {
			opacity: 0.8;
		}
	}
}
</style>
