<template>
	<view class="if-page">
		<view class="lf-nav-blank"></view>
		<view class="shop-module shop-module__1 box align-default">
			<view class="bar match-width align-center">
				<view class="label">总奖励金额</view>
				<view>
					<view>{{yenSymbol}} {{merchantTotal?merchantTotal.totalCommission.toFixed(2):'0.00'}}</view>
					<view class="cash-out-can">可提现：{{yenSymbol}} {{merchantTotal?merchantTotal.canCommission.toFixed(2):'0.00'}}</view>
				</view>
				<view class="cash-out" @click="goCashout">提现</view>
			</view>
			<!-- <view class="item-list match-left-space">
				<view class="match-width align-hor-bet">
					<view class="item align-default">
						<view>订单金额</view>
						<view class="price">
							{{'0.00'}}元
						</view>
					</view>
					<view class="item align-default">
						<view>订单笔数</view>
						<view class="price">
							{{'0'}}笔
						</view>
					</view>
					<view class="item align-default">
						<view>有效笔数</view>
						<view class="price">
							{{'0'}}笔
						</view>
					</view>
				</view>
				<view class="match-width align-hor-bet">
					
				</view>
			</view> -->
			<view class="match-width align-hor-bet">
				<view class="align-baseline" style="padding-left: 25upx;margin-top: 30upx;">
					<view class="title">时间范围</view>
					<view class="date" @click="onShowDatePicker">{{start_payTime?start_payTime:'开始时间'}}</view>
					<view class="date" @click="onShowDatePicker">{{end_payTime?end_payTime:'结束时间'}}</view>
				</view>
			</view>
		</view>
		
		<!-- 选项卡 插件 -->
		<view class="shop-module shop-module__2 box">
			<view class="shop-module-item" v-for="(item,i) in list" :key="i">
				<view class="shop-module-item-left">{{item.createTime.substring(0,10)}}</view>
				<view class="shop-module-item-right">
					<view class="shop-module-item-right-item">
						<text>订单笔数：</text>
						<text class="num-big-000">{{item.totalOrder}}</text>
						<text>笔</text>
					</view>
					<view class="shop-module-item-right-item">
						<text>有效笔数：</text>
						<text class="num-big-000">{{item.totalOrder - item.washSale}}</text>
						<text>笔</text>
					</view>
					<view class="shop-module-item-right-item">
						<text>奖励金：</text>
						<text class="num-big-000">{{item.commission.toFixed(2)}}</text>
						<text>元</text>
					</view>
				</view>
			</view>
			<view class="empty-box" v-if="list.length == 0">暂无数据~</view>
		</view>
		<view style="background-color: #fff;color: red;text-align: center;" v-if="list.length != 0">（此交易数据仅作为参考，最终结算以月协作费账单为准）</view>
		<mx-date-picker :show="showPicker" :type="'rangedate'" :value="showPickerdata" :show-tips="true" :begin-text="'开始'" :end-text="'结束'" :show-seconds="true" color="#4BA8FF" @confirm="onSelected" @cancel="onCanceled"/>
	</view>
</template>

<script>
	import { merchantDayList, getMerchantTotal } from '../../../../api/vueAPI.js'
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	export default {
		components: { MxDatePicker },
		data() {
			return {
				showPicker: false,
				yenSymbol: '\u00A5',	//金钱符号
				showPickerdata: '',
				start_payTime: '',
				end_payTime: '',
				list: [],
				merchantTotal: '',
			};
		},
		onReady() {
			
		},
		onLoad() {
			//获取当前日期
			let myDate = new Date();
			let nowY = myDate.getFullYear();
			let nowM = myDate.getMonth()+1;
			let nowD = myDate.getDate();
			this.end_payTime = nowY+"-"+(nowM<10 ? "0" + nowM : nowM)+"-"+(nowD<10 ? "0"+ nowD : nowD);//当前日期
	
			//获取31天前日期
			let lw = new Date(myDate - 1000 * 60 * 60 * 24 * 31);//最后一个数字31可改，31天的意思
			let lastY = lw.getFullYear();
			let lastM = lw.getMonth()+1;
			let lastD = lw.getDate();
			this.start_payTime = lastY+"-"+(lastM<10 ? "0" + lastM : lastM)+"-"+(lastD<10 ? "0"+ lastD : lastD);//三十天之前日期
			this.getMerchantTotal()
			this.merchantDayList()
		},
		onShow() {
			
		},
		methods:{
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
			merchantDayList() {
				const params = {
					pageNumber: 1,
					pageSize: 100,
					pageSort: '',
					pageOrder: '',
					paltform: '',
					merchantId: uni.getStorageSync('merchantId'),
					starttime: this.start_payTime,
					endtime: this.end_payTime
				}
				merchantDayList(params).then(res => {
					if (res.code === 200) {
						this.list = res.obj.content
					}
				})
			},
			onShowDatePicker() {
				this.showPicker = true
			},
			onCanceled() {
				this.showPicker = false;
			},
			onSelected(e) {//选择
			    if(e) {
			        //选择的值
			        console.log( e.value);
					const days = this.getDaysBetween(e.value[0],e.value[1])
					if(days>31){
						uni.showToast({
							title:"请选择小于31天的范围",
							icon: 'error'
						})
						return
					} else {
						this.showPicker = false;
						let start_payTime = e.value[0].replace(/\//g,'-');
						let end_payTime = e.value[1].replace(/\//g,'-');
						this.start_payTime = start_payTime
						this.end_payTime = end_payTime
						this.merchantDayList()
					}
			    }
			},
			goCashout () {
				uni.navigateTo({
					url: '/pagesA/home/marketIncent/cashout/index'
				})
			},
			getDaysBetween(dateString1,dateString2){
			    var  startDate = Date.parse(dateString1);
			    var  endDate = Date.parse(dateString2);
			    if (startDate > endDate){
			        return 0;
			    }
			    if (startDate == endDate){
			        return 1;
			    }
			    var days = (endDate - startDate)/(1*24*60*60*1000) + 1;
			    return days;
			}
		}
	}
</script>

<style lang="scss">
	.if-page {
		width: 100%;
		background-color: #F8F9FD;
	}
	.empty-box {
		font-size: 12px;
		color: #999999;
		text-align: center;
		margin-top: 130upx;
	}
	.icon-unfold {
		font-size: 28upx;
	}
	.relative{
		position: relative;
	}
	.margin-left-right-20{
		margin: 0 20upx;
	}
	.text-lg {
		font-size: 36rpx;
	}
	.text-llg{
		font-size: 36upx;
	}
	.text-lllg{
		font-size: 80upx;
	}
	.text-weight{
		font-weight: bold;
	}
	.margin-left-10{
		margin-left: 10upx;
	}
	.lf-date{
		width: 750upx;
		height: 100upx;
		padding: 0 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-date image{
		width: 50upx;
		height: 50upx;
	}
	.num-big-000 {
		color: #000;
		font-weight: bold;
		font-size: 28upx;
		margin-right: 8upx;
	}
	.lf-date-line{
		width: 1upx;
		height: 40upx;
		margin: 0 30upx;
		background-color: #EEEEEE;
	}
	.lf-money-statistics-box{
		width: 750upx;
		height: 480upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-money-statistics{
		width: 710upx;
		height: 430upx;
		border-radius: 40upx;
	}
	.lf-money-statistics .up{
		height: 160upx;
		margin: 20upx 0;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}
	.lf-money-statistics .down{
		height: 220upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-money-statistics .down .block{
		width: 240upx;
		height: 210upx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}
	.lf-money-statistics .down .block > view{
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 40upx;
	}
	.lf-money-statistics .down .line1{
		width: 1upx;
		height: 180upx;
		background-color: #F1F1F3;
		position: absolute;
		left: 33.3%;
	}
	.lf-money-statistics .down .line2{
		width: 1upx;
		height: 180upx;
		background-color: #F1F1F3;
		position: absolute;
		right: 33.3%;
	}
	.tab-height{
		height: 500upx;
	}
	.lf-order-trend{
		width: 750upx;
		height: 300upx;
	}
	.lf-active-cover {
		width: 100%;
		height: 500upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lf-active-cover .imageOne{
		width: 400upx;
		height: 400upx;
	}
	
	.lf-nav-blank {
		height: 5upx;
	}

	.shop-module {
		background-color: #FFF;
		font-size: 28upx;
		color: #999999;
		font-weight: 500;
		box-sizing: border-box;
		padding: 30upx;
		padding-top: 0;
		&__1 {
			width: 100%;
			.title {
				color: #333333;
				font-size: 32upx;
				font-weight: bold;
			}
			
			.date {
				color: #999999;
				font-size: 30upx;
				text-align: center;
				margin-left: 20upx;
				padding: 10upx 20upx;
				min-width: 230upx;
				background-color: #F8F9FD;
			}
			
			.icon {
				color: #666666;
				font-size: 32upx !important;
			}
			
			.bar {
				width: 680upx;
				height: 250upx;
				background: linear-gradient(31deg, rgba(26,161,255,1), rgba(110,216,255,1));
				border-radius: 12upx;
				font-size: 60upx;
				color: #FFF;
				font-weight: bold;
				position: relative;
				margin: 30upx 0 30upx 0;
				
				.label {
					font-size: 28upx;
					font-weight: 500;
					position: absolute;
					top: 20upx;
					left: 30upx;
				}
			}
			
			.item-list {
				box-sizing: border-box;
				padding: 0 20upx;
				
				.item {
					width: 150upx;
					
					.price {
						font-size: 32upx;
						font-weight: bold;
						color: #333333;
						padding: 14upx 0;
						box-sizing: border-box;
					}
				}
			}
		}
		
		&__2 {
			margin-top: 20upx;
			font-size: 32upx;
			color: #666666;
			font-weight: 500;
			
		}
		.shop-module-item {
			padding: 20upx;
			margin-bottom: 6upx;
			display: flex;
			align-items: center;
			justify-content: start;
			border-radius: 10upx;
			box-shadow: 2upx 2upx 10upx 0 rgba(0.5, 0.5, 0.5, 0.1);
			.shop-module-item-left {
				font-size: 32upx;
				font-weight: bold;
				height: 100%;
				width: 230upx;
			}
			.shop-module-item-right {
				border-left: 1px solid #999999;
				font-size: 26upx;
				height: 90upx;
				padding-left: 20upx;
				display: flex;
				flex-wrap: wrap;
				.shop-module-item-right-item{
					width: 50%;
				}
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
.cash-out {
	position: absolute;
	right: 66upx;
	font-size: 26upx;
	font-weight: normal;
}	
.cash-out-can {
	font-size: 24upx;
	font-weight: normal;
}
page{background:#FFF;width: 750upx;overflow-x: hidden;}
.qiun-padding{padding:2%; width:96%;}
.qiun-wrap{display:flex; flex-wrap:wrap;}
.qiun-rows{display:flex; flex-direction:row !important;}
.qiun-columns{display:flex; flex-direction:column !important;}
.qiun-common-mt{margin-top:10upx;}
.qiun-bg-white{background:#FFFFFF;}
.qiun-title-bar{width:96%; padding:10upx 2%; flex-wrap:nowrap;}
.qiun-title-dot-light{border-left: 10upx solid #0ea391; padding-left: 10upx; font-size: 32upx;color: #000000}
.qiun-charts{width: 100%; height:500upx; box-sizing: border-box; background: #FFFFFF;}
.charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
</style>
