<template>
	<view>
		<!-- <view class="lf-warning" v-if="isShowWarning">
			<text class="text-sm">支付机构未通知支付结果，请下拉页面，刷新同步更新状态</text>
		</view> -->
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view>
				<text class="text-grey">卡号</text>
				<text>{{integralDetails.memberNum? integralDetails.memberNum:''}}</text>
			</view>
			<view>
				<text class="text-grey">手机号</text>
				<text>{{integralDetails.phone? integralDetails.phone:''}}</text>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view> 
				<text class="text-grey">交易类型</text>
				<text>{{integralDetails.transactionType? integralDetails.transactionType:''}}</text>
			</view>
			<view>
				<text class="text-grey">交易积分</text>
				<text>{{integralDetails.tradeScores? integralDetails.tradeScores:''}}</text>
			</view>
			<view>
				<text class="text-grey">交易后积分</text>
				<text>{{integralDetails.avaCredits? integralDetails.avaCredits:''}}</text>
			</view>
			<view>
				<text class="text-grey">交易时间</text>
				<text>{{integralDetails.tradeTime? integralDetails.tradeTime:''}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { getIntegralDetail} from '../../../../../../api/vueAPI.js'
	export default {
		data() {
			return {
				yenSymbol: '\u00A5',	//金钱符号
				orderNumber: '',
				integralDetails: '',		//储值详情
				isShowWarning: false,	//警告
				id:'',
			}
		},
		onLoad(obj) {
			this.id= obj.id;
			// console.log(this.id)
			this.getIntegralDetail();
		},
		filters:{
			infoTypeFilters(val) {
				switch(parseInt(val)){
					case 1:		
						return '积分商品兑换';
						break;
					case 2:		
						return '充值赠送积分';
						break;
					case 3:		
						return '消费';
						break;
					case 4:		
						return '退款';
						break;
					case 6:		
						return '开卡赠送';
						break;
					default:
						console.log("异常支付码："+val)
				}
			},
		},
		methods: {
			/* 积分详情 */
			getIntegralDetail(){
				getIntegralDetail( this.id).then(res => {
					// console.log(res)
					this.integralDetails = res.obj
				}).catch(err => {
					console.log(err)
				})
			},
		}
	}
</script>

<style>
	body{
		background-color: #F1F1F3;
	}
	.text-llg{
		font-size: 38upx;
	}
	.margin-right-20{
		margin-right: 20upx;
	}
	.prod-height{
		height: 36upx;
	}
	.lf-warning{
		width: 750upx;
		height: 60upx;
		padding-left: 30upx;
		/* font-size: 12upx; */
		color: #ffa500;
		background-color: #ffe372;
		display: flex;
		align-items: center;
	}
	.lf-list > view{
		width: 750upx;
		height: 90upx;
		padding: 0 40upx;
		font-size: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FFF;
		border-bottom: 1upx solid #F1F1F3;
	}
	.lf-list image{
		width: 36upx;
		height: 36upx;
	}
	.lf-mat{
		width: 750upx;
		height: 40upx;
	}
	.lf-btn{
		width: 750upx;
		height: 160upx;
		padding: 0 40upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-btn > view{
		width: 320upx;
		height: 80upx;
		border-radius: 50upx;
		border: 1upx solid #ff8800;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-btn .bg-ff8800{
		background-color: #ff8800;
	}
	.lf-btn .bg-ffcb90{
		background-color: #ffcb90;
	}
	.lf-refund-modal > view{
		height: 60upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-refund-modal input{
		border-bottom: 1upx solid #E5E5E5;
	}
	.lf-btn-allRefund{
		padding: 5upx 8upx;
		background-color: #32C6E9;
		color: #FFF;
		border-radius: 5upx;
	}
	.lf-remarks-input{
		border: 1upx solid #EFEFEF;
		padding: 0 5upx;
		border-radius: 10upx;
	}
</style>
