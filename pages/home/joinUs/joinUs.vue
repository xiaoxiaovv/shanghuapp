<template>
	<view class="border-top-line">
		<view class="lf-list">
			<view>
				<text class="ly-font-color-9">一星代理</text>
				<view class='btn-box align-center'>
					申请
					</view>
				</view>
			</view>
			<view class="lf-help mt-50" @click.stop="closeAllHelp">
					<view class="one" @click.stop="showAllHelp">
						<text class="text-lg text-red">申请说明</text>
					</view>
					<view class="two" v-show="isShowAllHelp">
						<rich-text :nodes="explainRitchText">
							
						</rich-text>
						<!-- <ul class="lf-help-ul">
							<li>
								<view>订单金额：</view>
								<view class="text">所有收款成功过的订单数，包含支付成功、已退款和部分退款状态的订单金额总和</view>
							</li>
							<li>
								<view>订单总数：</view>
								<view class="text">所有收款成功过的订单数，包含支付成功、已退款和部分退款状态的订单总数</view>
							</li>
							<li>
								<view>退款金额：</view>
								<view class="text">特定时间内已退款和部分退款订单金额总和</view>
							</li>
							<li>
								订单金额=优惠金额+顾客实付
							</li>
							<li>
								优惠金额=商户优惠+微信优惠/支付宝优惠
							</li>
						</ul> -->
						<view class="lf-mat"></view>
					</view>
				</view>
			
		</view>
	
</template>

<script>
	import {} from '../../../api/vueAPI.js'
	import fly from '../../../common/flyioRequest.js'
	
	
	
	export default {
		
		data() {
			return {
				isShowAllHelp: false,
				explainRitchText:''
			};
		},
		onLoad() {
			
		},
	    onReady() {
			
			// this.showAnalysis();
	    },
		onShow(){
			
		},
		methods: {
			showAllHelp() {
				if(this.isShowAllHelp){
					this.closeAllHelp()
					return
				}
				this.isShowAllHelp = true
			},
			closeAllHelp() {
				if(this.isShowAllHelp){
					this.isShowAllHelp = false
				}
			}
		},
	}
</script>

<style>
	.border-top-line{
		border-top: 1upx solid #f1f1f3;
	}
	.lf-list > view{
		width: 750upx;
		height: 98upx;
		padding: 0 29upx;
		font-size: 32upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FFF;
		border-bottom: 1upx solid #F1F1F3;
		font-weight: 500;
	}
	.btn-box {
		width: 110upx;
		height: 62upx;
		border-radius: 10upx;
		background-color: #4BA8FF;
		box-sizing: border-box;
		font-size: 26upx;
		font-weight: 500;
		color: #FFF;
		
		&:active {
			opacity: 0.8;
		}
	}
	.lf-help{
		width: 750upx;
		background-color: #F1F1F3;
		
	}
	.lf-help .one{
		height: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-help .two li{
		margin-top: 20upx;
	}
	.lf-help .two li > view{
		display: inline-block;
		vertical-align: top;
	}
	.lf-help-ul .text{
		width: 470upx;
	}
	.lf-mat{
		height: 20upx;
		background-color: #F1F1F3;
	}
</style>
