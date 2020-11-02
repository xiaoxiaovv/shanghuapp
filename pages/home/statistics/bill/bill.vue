<template>
	<view>
		<view class="lf-screen shadow">
			<view><text>时间</text><text class="icon-unfold"></text></view>
			<view class="lf-line1"></view>
			<view><text>状态</text><text class="icon-unfold"></text></view>
			<view class="lf-line2"></view>
			<view><text>方式</text><text class="icon-unfold"></text></view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-content relative margin-bottom">
			<view class="lf-content-box">
				<view class="lf-content-head">
					<text class="text-lg">订单金额</text>
					<text class="text-lg text-gery">0.00元</text>
				</view>
				<view class="lf-content-payMoney">
					<view>
						<text class="text-llg text-red">0.00</text>
						<text class="text-sm">顾客实付</text>
					</view>
					<view class="line"></view>
					<view>
						<text class="text-llg text-red">0.00</text>
						<text class="text-sm">优惠金额</text>
					</view>
				</view>
			</view>
			<view class="lf-content-card" v-for="(item, index) in transactionList">
				<view class="padding bg-white ">
					<view class="lf-progress-text">
						<text>{{item.type}}</text>
						<text>{{item.proportion}}%</text>
					</view>
					<view class="lf-progress-text margin-top-10">
						<text class="text-grey">{{item.transactionNumber}}笔</text>
						<text class="text-red">￥{{item.transactionMoney}}</text>
					</view>
					<view class="margin-top-10">
						<view class="flex">
							<view class="cu-progress round">
								<view class="bg-green" :style="[{ width:loading? item.proportion + '%':''}]"></view>
							</view>
							<!-- <text class="margin-left">80%</text> -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-list>
			<view class="flex justify-between align-center height-80 padding border-bottom-line">
				<text>订单总数</text>
				<text class="text-grey">0笔</text>
			</view>
			<view class="flex justify-between align-center height-80 padding border-bottom-line">
				<text>退款金额</text>
				<text class="text-grey">0.00元</text>
			</view>
			<view class="flex justify-between align-center height-80 padding">
				<text>退款笔数</text>
				<text class="text-grey">0笔</text>
			</view>
		</uni-list>
		<view class="lf-help" @click.stop="closeAllHelp">
			<view class="one" @click.stop="showAllHelp">
				<text class="text-lg text-red">统计帮助</text>
			</view>
			<view class="two" v-show="isShowAllHelp">
				<ul class="lf-help-ul">
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
				</ul>
				<view class="lf-mat"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { uniList, uniListItem } from '@dcloudio/uni-ui'
	export default {
		components: {uniList, uniListItem },
		data() {
			return {
				loading: false,
				// type: '',		//终端类型
				// proportion: '',		//比重 （数字）
				// transactionNumber: '',		//成交数
				// transactionMoney: '',		//成交金额
				transactionList: [
					{
						type: '收银台',
						proportion: '50',
						transactionNumber: '1',
						transactionMoney: '0.01',
					},
					{
						type: 'APP',
						proportion: '50',
						transactionNumber: '1',
						transactionMoney: '0.01',
					},
				],
				isShowAllHelp: false,
				
			}
		},
		onLoad() {
			let that = this;
			setTimeout(function() {
				that.loading = true
			}, 500)
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
		}
	}
</script>

<style>
	.relative{
		position: relative;
	}
	.text-llg{
		font-size: 60upx;
	}
	.margin-top-10{
		margin-top: 10upx;
	}
	.height-80{
		height: 80upx;
	}
	.border-bottom-line{
		border-bottom: 1upx solid #EEE;
	}
	.lf-screen{
		width: 750upx;
		height: 80upx;
		border: 1upx solid #F1F1F3;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: relative;
	}
	.lf-line1{
		width: 1upx;
		height: 40upx;
		background-color: #EBEEF5;
		position: absolute;
		top: calc(50% - 20upx);
		left: 33.3%;
	}
	.lf-line2{
		width: 1upx;
		height: 40upx;
		background-color: #EBEEF5;
		position: absolute;
		top: calc(50% - 20upx);
		left: 66.6%;
	}
	.lf-mat{
		height: 20upx;
		background-color: #F1F1F3;
	}
	.lf-content{
		width: 750upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	.lf-content-box{
		width: 720upx;
	}
	.lf-content-head{
		width: 100%;
		height: 80upx;
		padding-right: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1upx solid #EFEFEF;
	}
	.lf-content-payMoney{
		width: 100%;
		height: 200upx;
		padding-right: 30upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.lf-content-payMoney > view{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		line-height: 60upx;
	}
	.lf-content-payMoney .line{
		width: 1upx;
		height: 100upx;
		background-color: #EFEFEF;
		position: absolute;
		top: 120upx;
		left: 50%;
	}
	.lf-content-card{
		width: 100%;
		height: 160upx;
	}
	.lf-progress-text{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
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
</style>
