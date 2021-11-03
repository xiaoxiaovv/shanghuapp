<template>
	<view class="if-page">
		<view class="bank-card" @click="goBank()">
			<view>到账银行卡</view>
			<view style="font-weight: bold;margin-left: -15px;" v-if="bankInfo">{{bankInfo.bankName}}({{bankInfo?bankInfo.cardNo.substring(bankInfo.cardNo.length - 4):''}})</view>
			<view style="font-weight: bold;margin-left: -15px;" v-if="!bankInfo">请先添加银行卡</view>
			<text class="text-llg icon-right text-white"></text>
		</view>
		<view class="cash-card">
			<view class="cash-card-1">提现金额</view>
			<view class="cash-card-2"><text>¥</text><input class="lf-modal-input" type="number" v-model="cashNumber" maxlength="15"></view>
			<view class="line"></view>
			<view class="cash-card-3">
				<view>可提现金额：<text style="color: #F43F3B;font-weight: bold;">{{merchantTotal?merchantTotal.canCommission.toFixed(2):'0.00'}}</text>元</view>
				<view style="color: #6D6D72;" @click="goLog">提现记录</view>
			</view>
			<view class="tip-box">
				<view>温馨提示：</view>
				<view class="tip-item">
					<view>分润税点</view>
					<view>{{configInfo.rateCash}}%</view>
				</view>
				<view class="tip-item">
					<view>到账时间</view>
					<view>T+1</view>
				</view>
				<view class="tip-item">
					<view>提现金额不得低于</view>
					<view>{{configInfo.minCashAmount}}(元)</view>
				</view>
				<view class="tip-item">
					<view>提现时间</view>
					<view>{{configInfo.cashOutStartTime}} - {{configInfo.cashOutEndTime}}</view>
				</view>
			</view>
		</view>
		<view class='bottom-box plr-40 pb-50'>
			<view 
				class='bottom-box__btn align-center mt-30'
				@click="cashOut">
				提交申请
			</view>
		</view>
	</view>
</template>

<script>
	import { getMarketCard, getMerchantTotal, cashOut, getMarketConfig } from '../../../../api/vueAPI.js'
	export default {
		components: {  },
		data() {
			return {
				reFresh: "",
				cashNumber: 0,
				bankInfo: '',
				merchantTotal: '',
				configInfo: {},
			};
		},
		watch:{
		    //监听reFresh,如果有修改就执行监听器
		    reFresh:function(){
		      // 调初始化页面的接口
		        this.getMarketCard()
		    }
		},
		onReady() {
			
		},
		onLoad() {
			this.getMarketConfig()
			this.getMerchantTotal()
			this.getMarketCard()
		},
		onShow() {
			
		},
		methods:{
			getMarketConfig() {
				getMarketConfig().then(res => {
					this.configInfo = res.obj
					this.configInfo.cashOutStartTime = this.configInfo.cashOutStartTime.substring(0,5)
					this.configInfo.cashOutEndTime = this.configInfo.cashOutEndTime.substring(0,5)
					this.configInfo.rateCash = this.configInfo.rateCash*100
				})
			},
			getMerchantTotal() {
				const params = {
					merchantId: uni.getStorageSync('merchantId')
				}
				getMerchantTotal(params).then(res => {
					if (res.code === 200) {
						this.merchantTotal = res.obj
					}
				})
			},
			goBank() {
				uni.navigateTo({
					url: '/pages/home/marketIncent/bank/index'
				})
			},
			goLog() {
				uni.navigateTo({
					url: '/pages/home/marketIncent/cashout/cashlog'
				})
			},
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
			cashOut () {
				const params = {
					accountNum: this.bankInfo.cardNo,
					accountType: 3,
					applyAmount: this.cashNumber,
					merchantId: uni.getStorageSync('merchantId')
				}
				cashOut(params).then(res => {
					if (res.code === 200) {
						this.getMerchantTotal()
						uni.showToast({
							title: res.msg,
							icon: 'success'
						})
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/home/marketIncent/cashout/cashlog'
							})
						},1000)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
.bank-card {
	padding: 20upx 20upx 20upx 40upx;
	height: 200upx;
	font-size: 33upx;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 10upx;
	box-shadow: 7upx 7upx 10upx 0 rgba(0.7, 0.7, 0.7, 0.1);
	margin: 20upx 40upx;
	margin-top: 0;
	background-image: url(../../../../static/home/bg.png);
}
.cash-card {
	font-size: 33upx;
	padding:20upx 40upx;
	.cash-card-1 {
		padding: 20upx 40upx;
	}
	.cash-card-2 {
		padding: 20upx 40upx;
		font-size: 90upx;
		display: flex;
		align-items: center;
		.lf-modal-input {
			font-size: 90upx;
		}
	}
	.cash-card-3 {
		display: flex;
		justify-content: space-between;
	}
}
.bottom-box {
	width: 100%;
	box-sizing: border-box;;
	&__btn {
		width: 70%;
		height: 98upx;
		margin: 0 auto;
		border-radius: 20upx;
		background-color: #4BA8FF;
		color: #FFF;
		font-size: 36upx;
		font-weight: bold;
		letter-spacing: 4upx;
		&:active {
			opacity: 0.8;
		}
	}
}
.tip-box {
	width: 90%;
	margin: 30upx auto;
	border: 1px solid #bdbdbd;
	color: #bdbdbd;
	border-radius: 8upx;
	font-size: 26upx;
	text-align: left;
	padding: 24upx;
	.tip-item {
		padding-left: 30upx;
		margin: 14upx 0;
		display: flex;
		justify-content: space-between;
	}
}
</style>
