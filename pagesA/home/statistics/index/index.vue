<template>
	<view class="if-page">
		
		<view class="lf-nav">
			<view class="lf-nav-order">
				<view class="lf-nav-mat"></view>
				<!-- 导航栏-正常 -->
				<view class="lf-nav-content padding">
					<image class="img1" src="../../../../static/home/the_arrow_icon_black1.png" @click="navBack"></image>
					<view>
						<text v-if="isMerchant" class="text-weight" @click="jumpStoreSelect">
							<text class="text-lg">{{storeName? storeName:'全部门店'}}</text>
							<text class="icon-unfold margin-left-10"></text>
						</text>
						<text v-else class="text-weight">
							<text class="text-lg">{{storeName? storeName:''}}</text>
							<text class=" margin-left-10"></text>
						</text>
					</view>
					<!-- <image class="img2" src="../../../../static/home/icon_switch.png" @click="navToBill"></image> -->
					<text class="img2"></text>
				</view>
			</view>
		</view>
		<view class="lf-nav-blank"></view>
		<!-- <view class="lf-mat"></view> -->
		
		<view class="shop-module shop-module__1 box align-default">
			<view class="match-width align-hor-bet">
				<view class="align-baseline">
					<view class="title">日统计</view>
					<view class="date">{{date? date:''}}</view>
				</view>
				<view 
					class="icon iconfont icon-rili"
					@click="onShowDatePicker('date')">
				</view>
			</view>
			<view class="bar match-width align-center">
				<view class="label">实收金额</view>
				<view>{{yenSymbol}} {{statisticsDate.actualRevenue? statisticsDate.actualRevenue:'0.00'}}</view>
			</view>
			<view class="item-list match-left-space">
				<view class="match-width align-hor-bet">
					<view class="item align-default">
						<view>订单金额</view>
						<view class="price">
							{{statisticsDate.orderAmount? statisticsDate.orderAmount:'0.00'}}元
						</view>
					</view>
					<view class="item align-default">
						<view>商户优惠</view>
						<view class="price">
							{{statisticsDate.merchantDiscount? statisticsDate.merchantDiscount:'0.00'}}元
						</view>
					</view>
					<view class="item align-default">
						<view>退款金额</view>
						<view class="price">
							{{statisticsDate.refundAmount? statisticsDate.refundAmount:'0.00'}}元
						</view>
					</view>
				</view>
				<view class="match-width align-hor-bet">
					<view class="item align-default">
						<view>订单数</view>
						<view class="price">
							{{statisticsDate.orderTotal? statisticsDate.orderTotal:'0'}}笔
						</view>
					</view>
					<view class="item align-default">
						<view>其他优惠</view>
						<view class="price">
							{{statisticsDate.otherDiscount? statisticsDate.otherDiscount:'0.00'}}元
						</view>
					</view>
					<view class="item align-default">
						<view>退款数</view>
						<view class="price">
							{{statisticsDate.refundCount? statisticsDate.refundCount:'0'}}笔
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 选项卡 插件 -->
		<view class="shop-module shop-module__2 box">
			<!-- tabs -->
			<view class="tabs match-width align-hor-bet">
				<view 
					:class="[TabCur == 0 ? 'active' : '', 'align-default']"
					@tap="swiperChange(0)">
					<view>支付方式统计</view>
					<view class="line"></view>
				</view>
				<view 
					:class="[TabCur == 1 ? 'active' : '', 'align-default']"
					@tap="swiperChange(1)">
					<view>支付终端统计</view>
					<view class="line"></view>
				</view>
			</view>
			<!-- tabs content -->
			<swiper
				:current="TabCur"
				class="swiper row tab-height"
				duration="300"
				:circular="true"
				indicator-color="rgba(255,255,255,0)"
				indicator-active-color="rgba(255,255,255,0)"
				@change="swiperChange(-1, $event)">
			
				<swiper-item
					class="align-center"
					v-for="(item,index) in tabList" 
					:key="index">
					<!-- Echarts 插件 -->
					<!-- 环形图1 -->
					<view 
						class="lf-echarts match-parent align-center" 
						v-if="index === 0">
						<view 
							class="no-data align-center"
							v-if="isPayWay">
							<image
								class="match-parent"
								mode="scaleToFill"
								src="../../../../static/home/notData.png"/>
						</view>
						<!-- Echarts-环形图 -->
						<view 
							class="qiun-charts align-center" 
							v-else>
							<canvas canvas-id="canvasRingA" id="canvasRingA" class="charts" @touchstart="touchRingA"></canvas>
						</view>
					</view>
					<!-- 环形图2 -->
					<view
						class="lf-echarts match-parent align-center" 
						v-if="index === 1">
						<view 
							class="no-data align-center"
							v-if="isClientPieChart">
							<image
								class="match-parent"
								mode="scaleToFill"
								src="../../../../static/home/notData.png"/>
						</view>
						<!-- Echarts-环形图 -->
						<view 
							class="qiun-charts align-center"
							v-else>
							<canvas canvas-id="canvasRingB" id="canvasRingB" class="charts" @touchstart="touchRingB"></canvas>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="shop-module shop-module__3 box">
			<view class="title">
				近5日订单金额趋势
			</view>	
			<view class="charts">
				<!-- Echarts-折线图 -->
				<view 
					class="qiun-charts" style="height: 200upx;">
					<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" style="height: 250upx;" @touchstart="touchLineA"></canvas>
				</view>
			</view>
		</view>	
		
		<mx-date-picker 
			:show="showPicker" 
			:type="type" 
			:value="value" 
			:show-tips="true" 
			:begin-text="'入住'" 
			:end-text="'离店'" 
			 color="#4BA8FF"
			:show-seconds="true" 
			@confirm="onSelected" 
			@cancel="onSelected" />
		
	</view>
</template>

<script>
	import { getStatistics, getStatisticsWayPieChart, getStatisticsClientPieChart, getStatisticsFiveDayOrderMoneyTrend, getStoreDetails} from '../../../../api/vueAPI.js'
	import WucTab from "../../../components/wuc-tab/wuc-tab.vue";
	import uCharts from '@/components/u-charts/u-charts.js';
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	let _self;
	let canvaLineA=null;
	let canvaRingA=null;
	let canvaRingB=null;
	export default {
		components: { WucTab, MxDatePicker },
		data() {
			return {
				tabList: [
					{ name: "支付方式统计", index: 0 }, 
					{ name: "支付终端统计", index: 1 },
				],
				TabCur: 0,
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				storeId:'',
				storeName:'',
				start_payTime: '',
				end_payTime: '',
				cacheToday: '',
				statisticsDate: '',
				isPayWay: false,
				isClientPieChart: false,
				/* 日期选择器~ */
				showPicker: false,
                date: '',
                type: 'date',
                value: '',
				/* ~日期选择器 */
				yenSymbol: '\u00A5',	//金钱符号
				isMerchant:true
			};
		},
		onReady() {
			
		},
		onLoad() {
			let date = new Date();
			let y = date.getFullYear();
			let MM = date.getMonth() + 1;
			MM = MM < 10 ? ('0' + MM) : MM;
			let d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			let today =  y + '-' + MM + '-' + d;
			this.start_payTime = today;
			this.end_payTime = today;
			this.date = today.replace(/-/g,'/')
			this.cacheToday = today;
			
			_self = this;
			this.cWidth=uni.upx2px(680);
			this.cHeight=uni.upx2px(500);
			this.cWidthB=uni.upx2px(680);
			this.cHeightB=uni.upx2px(200);
			
		},
		onShow() {
			/* 获取统计数据 */
			this.getStatisticsDate()
			
			// 获取商店名称
			if(uni.getStorageSync('userType') == 1){
				this.isMerchant = true
			}else{
				this.isMerchant = false
			}
			let storeDetail = uni.getStorageSync("nowStoreDetail")
			if(storeDetail != '' && storeDetail != null && storeDetail != undefined && storeDetail){
				this.storeName = storeDetail.storeName
			}
		},
		methods:{
			/* 返回上一页 */
			navBack() {
				uni.navigateBack()
			},
			/* 选择门店 */
			jumpStoreSelect() {
				uni.navigateTo({
					url:'/pagesA/home/storeSelect/index/index'
				})
			},
			/* 前往对账页 */
			navToBill() {
				uni.navigateTo({
					url: '../bill/bill'
				})
			},
			/* 选项卡 */
			swiperChange(index, e) {
				if (+index !== -1) {
					this.TabCur = +index;
				} else {
					let { current } = e.target;
					this.TabCur = current
				}
			},
			/* 获取统计数据 */
			getStatisticsDate() {
				let storeId = '';
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				let userId = uni.getStorageSync('userId') || ''
				/* 统计数据 */
				getStatistics(this.start_payTime, this.end_payTime, storeId, userId).then(res => {
					// console.log("getStatistics",res);
					this.statisticsDate = res.obj
				}).catch(err => {
					console.log("getStatistics",err)
				})
				this.getServerData();
			},
			/* uCharts */
			//获取信息
			getServerData() {
				let storeId = '';
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				/* 支付方式 */
				getStatisticsWayPieChart(this.start_payTime, this.end_payTime, storeId).then(res => {
					// console.log("getStatisticsWayPieChart",res);
					if(res.obj === null){
						// console.log("进来了")
						this.isPayWay = true;
						return
					}else{
						this.isPayWay = false;
					}
					let RingA={series:[]};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					RingA.series=res.obj;
					/* 暂无数据监测 */
					let notData = 0;
					for (let item of RingA.series) {
						if(item.value != 0){
							notData = 1
						}
					}
					if(notData === 0){
						this.isPayWay = true;
					}else{
						this.isPayWay = false;
					}
					_self.showRingA("canvasRingA",RingA);
				}).catch(err => {
					console.log("getStatisticsWayPieChart",err)
					_self.tips="网络错误";
				})
				/* 支付终端 */
				getStatisticsClientPieChart(this.start_payTime, this.end_payTime, storeId).then(res => {
					// console.log("777",res);
					if(res.obj === null){
						this.isClientPieChart = true;
						return
					}else{
						this.isClientPieChart = false;
					}
					let RingB={series:[]};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					RingB.series=res.obj;
					/* 暂无数据监测 */
					let notData = 0;
					for (let item of RingB.series) {
						if(item.value != 0){
							notData = 1
						}
					}
					if(notData === 0){
						this.isClientPieChart = true;
					}else{
						this.isClientPieChart = false;
					}
					_self.showRingB("canvasRingB",RingB);
				}).catch(err => {
					console.log("getStatisticsClientPieChart",err)
					_self.tips="网络错误";
				})
				/* 近5日订单金额趋势 */
				getStatisticsFiveDayOrderMoneyTrend(this.start_payTime, this.end_payTime, storeId).then(res => {
					// console.log("getStatisticsFiveDayOrderMoneyTrend",res);
					let LineA={categories:[],series:[{}]};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					LineA.categories = res.obj.xdata;
					LineA.series[0]['value'] = res.obj.ydata;
					_self.showLineA("canvasLineA",LineA);
				}).catch(err => {
					console.log("getStatisticsFiveDayOrderMoneyTrend",err)
				})
			},
			showLineA(canvasId,chartData){
				canvaLineA=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'line',
					fontSize:11,
					legend:false,
					dataLabel:true,
					dataPointShape:true,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type:'grid',
						gridColor:'#CCCCCC',
						gridType:'dash',
						dashLength:0,
						disableGrid:true,
					},
					yAxis: {
						gridType:'dash',
						gridColor:'#CCCCCC',
						dashLength:5,
						splitNumber:0,
						format:(val)=>{return ''},
						disableGrid: true,
					},
					width: _self.cWidthB*_self.pixelRatio,
					height: _self.cHeightB*_self.pixelRatio,
					extra: {
						line:{
							type: 'straight'
						}
					},
				});
			},
			touchLineA(e) {
				
			},
			showRingA(canvasId,chartData){
				canvaRingA=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'ring',
					fontSize:11,
					legend:true,
					extra: {
						pie: {
						  offsetAngle: -45,
						  ringWidth: 25*_self.pixelRatio,
						  lableWidth:15
						}
					},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					disablePieStroke: true,
					dataLabel: true
				});
			},
			showRingB(canvasId,chartData){
				canvaRingB=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'ring',
					fontSize:11,
					legend:true,
					extra: {
						pie: {
						  offsetAngle: -45,
						  ringWidth: 25*_self.pixelRatio,
						  lableWidth:15
						}
					},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData.series,
					animation: false,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					disablePieStroke: true,
					dataLabel: true,
				});
			},
			touchRingA(e){
				canvaRingA.showToolTip(e, {
					format: function (item) {
						return item.name + ':' + item.value 
					}
				});
			},
			touchRingB(e){
				canvaRingB.showToolTip(e, {
					format: function (item) {
						return item.name + ':' + item.value 
					}
				});
			},
			/* 日期选择器 */
			onShowDatePicker(type){//显示
                this.type = type;
                this.showPicker = true;
                this.value = this[type];
            },
            onSelected(e) {//选择
                this.showPicker = false;
                if(e) {
                    this[this.type] = e.value; 
                    //选择的值
                    // console.log('value => '+ e.value);
                    //原始的Date对象
                    // console.log('date => ' + e.date);
					this.date = e.value;
					this.start_payTime = e.value.replace(/\//g,'-');
					this.end_payTime = e.value.replace(/\//g,'-');
					/* 数据再获取 */
					this.getStatisticsDate();
                }
            },
		}
	}
</script>

<style lang="scss">
	.if-page {
		width: 100%;
		background-color: #F8F9FD;
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
	// .lf-mat{
	// 	height: 20upx;
	// 	background-color: #F1F1F3;
	// }
	.lf-nav{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		background-color: #FFF;
		font-size: 36upx;
		color: #333;
	}
	
	.lf-nav-order{
		width: 750upx;
		height: 120upx;
		background-color: #FFF;
	}
	.lf-nav-mat{
		width: 750upx;
		height: 40upx;
	}
	.lf-nav-content{
		width: 750upx;
		height: 80upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-nav-content .img1{
		width: 60upx;
		height: 60upx;
	}
	.lf-nav-content .img2{
		width: 40upx;
		height: 40upx;
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
		height: 120upx;
	}

	.shop-module {
		background-color: #FFF;
		font-size: 28upx;
		color: #999999;
		font-weight: 500;
		box-sizing: border-box;
		padding: 30upx;
		
		&__1 {
			width: 100%;
			// height: 578upx;
			margin-top: 20upx;
			
			.title {
				color: #333333;
				font-size: 32upx;
				font-weight: bold;
			}
			
			.date {
				color: #666666;
				font-size: 32upx;
				margin-left: 40upx;
			}
			
			.icon {
				color: #666666;
				font-size: 32upx !important;
			}
			
			.bar {
				width: 680upx;
				height: 200upx;
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
			
			.tabs {
				box-sizing: border-box;
				padding: 0 80upx;
					
				.active {
					color: #4BA8FF;
					// font-weight: bold;
					
					.line {
						background: #4BA8FF;
					}
				}
				
				.line {
					width: 66upx;
					height: 6upx;
					background: transparent;
					border-radius: 3upx;
					margin-top: 12upx;
				}
			}
		}
		
		&__3 {
			margin-top: 20upx;
			
			.title {
				font-size: 32upx;
				color: #333333;
				font-weight: bold;
				
				&:before {
					content: '';
					width: 6upx;
					height: 24upx;
					background-color: rgb(75, 168, 255);
					margin-right: 10upx;
					display: inline-flex;
				}
			}
			
			.charts {
				width: 100%;
				height: auto;
				padding: 100upx 0 0 0;
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
	
	.swiper {
		width: 100%;
		height: 500upx;
		// background-color: #FF9e00;
	}
	
	.lf-echarts {
		// background-color: white;
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
