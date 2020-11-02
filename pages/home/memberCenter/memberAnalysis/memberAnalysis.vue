<template>
	<view>
		<!-- 上半-会员量 -->
		<view class="lf-member-number padding margin-bottom ly-font-color-main">
			<view class="first">
				<view class="one flex justify-between align-center">
					<view class="flex align-center ly-bg-color-blur-main ly-date-eles" @click="onShowDatePicker('date', 'yyyy.MM.dd')">
						<image class="date" src="../../../../static/home/icon_calendar2.png"></image>
						<text>{{date? date:'2019.04.25'}}</text>
					</view>
					<!-- <image class="line line-margin-white" src="../../../../static/home/icon_line.png"></image>  -->
					<view class="dateLabel text-sm">
						<view @click="clickDate(date.index)" v-for="date in dateList" :class="{isClickHighLight: date.isClickHighLight}">{{date.name}}</view>
					</view>
				</view>
				<view class="two flex justify-around align-center memeber-bg-colors">
					<view class="flex flex-direction align-center">
						<text class="text-white text-lg">新增会员量</text>
						<text class="text-white ly-font-size-36 ly-margin-top-32">{{newMember? newMember:'0'}}</text>
					</view>
					<image class="line" src="../../../../static/home/icon_a_vertical_bar.png"></image>
					<view class="flex flex-direction align-center">
						<text class="text-white text-lg">会员总量</text>
						<text class="text-white ly-font-size-36 ly-margin-top-32">{{allMember? allMember:'0'}}</text>
					</view>
				</view>
			</view>
			<view>
				<!-- 选项卡 插件 -->
				<view class="vma-tab-style align-default">
					<wuc-tab
						class="match-width"
						:tab-list="tabList"
						textFlex
						:tabCur.sync="TabCur"
						tab-class="text-center text-black bg-white  ly-cum-wuctab"
						select-class="text-orange ly-select-wuctab">
					</wuc-tab>
					<swiper
						:current="TabCur"
						class="swiper row match-parent"
						duration="300"
						circular="false"
						indicator-color="rgba(255,255,255,0)"
						indicator-active-color="rgba(255,255,255,0)"
						@change="swiperChange"
					>
						<swiper-item 
							class="align-center"
							v-for="(item,index) in tabList" 
							:key="index">
							<!-- Echarts 插件 -->
							<!-- 按时间 -->
							<view 
								class="lf-echarts match-parent align-center" 
								v-if="item.index === index && item.index === 0">
								<!-- Echarts-折线图 -->
								<view class="charts-small">
									<canvas 
										canvas-id="canvasLineA" 
										id="canvasLineA" 
										class="charts-small"
										@touchstart="touchLineA">
									</canvas>
								</view>
							</view>
							<!-- 按性别 -->
							<view 
								class="lf-echarts match-parent" 
								v-if="item.index === index && item.index === 1">
								<!-- 性别占比  -->
								<view class="img-gender">
									<view class="match-width align-hor-bet box plr-50">
										<image class="img-boy" src="../../../../static/home/sex_boy.png"></image>
										<image class="img-girl" src="../../../../static/home/sex_girl.png"></image>
									</view>
									<view class="flex justify-between">
										<view class="flex flex-direction align-center">
											<view>
												<text class="margin">男</text>
												<text class="text-32C6E9">{{ (boyNumber+girlNumber) === 0? '0':parseInt(((boyNumber/(boyNumber+girlNumber))*100).toFixed(0))}}%</text>
											</view>
										</view>
										<view class="flex flex-direction align-center">
											<view>
												<text class="margin">女</text> 
												<text class="text-FA3A88">{{ (boyNumber+girlNumber) === 0? '0':parseInt(((girlNumber/(boyNumber+girlNumber))*100).toFixed(0))}}%</text>
											</view>
										</view>
									</view>
								</view>
								<view class="lf-gender">
									<view class="lf-gender-bar">
										<view class="lf-gender-boy" :style="{width : boyNumber/(boyNumber+girlNumber)*100 + '%'}"></view>
										<view class="lf-gender-girl" :style="{width : girlNumber/(boyNumber+girlNumber)*100 + '%'}"></view>
									</view>
								</view>
							</view>
							<!-- 按渠道 -->
							<view 
								class="lf-echarts lf-channel match-parent align-center" 
								v-if="item.index === index && item.index === 2">
								<view class="lf-active-cover alin-center" v-if="isChannel">
									<image class="imageTwo" src="../../../../static/home/notData.png"/>
								</view>
								<!-- Echarts-环形图 -->
								<view class="charts-small" v-else>
									<canvas 
										canvas-id="canvasRingA" 
										id="canvasRingA" 
										class="charts-small" 
										@touchstart="touchRingA">
									</canvas>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		
		<!-- 下半-活跃分析 -->
		<view class="lf-active-analysis margin-bottom">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
				<view class="qiun-title-dot-light">会员活跃分析</view>
			</view>
			<view class="lf-level relative">
				<view class="lf-active-cover" v-if="isLevel"><image class="imageOne" src="../../../../static/home/notData.png"></image></view>
				<!-- Echarts-环形图 -->
				<view class="qiun-charts align-center">
					<canvas canvas-id="canvasRingB" id="canvasRingB" class="charts" @touchstart="touchRingB"></canvas>
				</view>
			</view>
		</view>
		<view class="lf-active-percentage">
			<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
				<view class="qiun-title-dot-light">会员活跃占比</view>
			</view>
			<view class="lf-percentage" v-if="!isLevel">
				<view v-for="(item,key) in levelList">
					<view>
						<view class="backgroundImg" :style="{'background-color': item.color}"></view>
					</view>
					<text class="text-grey one">{{item.name}}</text>
					<text class="text-grey two">{{item.value}}</text>
					<text class="text-grey three">{{parseInt(item._proportion_ * 100)}}%</text>
				</view>
			</view>
			<view class="lf-percentage-none flex justify-center align-center" v-if="isLevel">
				<!-- <text class="text-grey">暂无数据</text> -->
				<view class="meme-no-data"><image class="imageOne" src="../../../../static/home/notData.png"></image></view>
			</view>
		</view>
		<mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'入住'" :end-text="'离店'" :show-seconds="true" color="#4BA8FF" @confirm="onSelected" @cancel="onSelected" />
	</view>
</template>

<script>
	import {getMemberAnalyseConsumeActivityLevel, getMemberAnalyseCard, getMemberAnalyseChartByTime, getMemberAnalyseChartByChannel, getMemberAnalyseChartBySex} from '../../../../api/vueAPI.js'
	import WucTab from "@/components/wuc-tab/wuc-tab.vue";
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
					{ name: "按时间", index: 0 }, 
					{ name: "按性别", index: 1 },
					{ name: "按渠道", index: 2 },
				],
				dateList: [
					{ name: "今日", index: 0, isClickHighLight: false},
					{ name: "昨日", index: 1, isClickHighLight: false},
					{ name: "近7日", index: 2, isClickHighLight: false},
					{ name: "近30日", index: 3, isClickHighLight: false},
				],
				TabCur: 0,
				newMember: '',	//新增会员
				allMember: '',	//会员总量
                cWidth:'',
				cHeight:'',
				cWidthB: '',
				cHeightB: '',
				pixelRatio:1,
				serverData:'',
				boyNumber: 0,		//按性别 男的人数
				girlNumber: 0,		//按性别 女的人数
				startTime:'2019-04-05',
				endTime:'2019-06-05',
				cacheToday: '',
				isChannel: false,		//按渠道无数据显示
				isLevel: false, 	//会员活跃分析无数据显示
				isPercentage: false,	//会员活跃占比无数据显示
				levelList: [],	//会员活跃数据
				startDate: 0,
				/* 日期选择器~ */
				showPicker: false,
                date: '',
                type: 'date',
                value: ''
				/* ~日期选择器 */
			};
		},
		onLoad() {
			let date = new Date();
			let y = date.getFullYear();
			let MM = date.getMonth() + 1;
			MM = MM < 10 ? ('0' + MM) : MM;
			let d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			let today =  y + '-' + MM + '-' + d;
			this.startTime = today;
			this.endTime = today;
			this.date = today.replace(/-/g,'/')
			this.cacheToday = today;
			
			_self = this;
			this.cWidth=uni.upx2px(680);
			this.cHeight=uni.upx2px(300);
			this.cWidthB=uni.upx2px(680);
			this.cHeightB=uni.upx2px(500);
			// this.getServerData();
			this.showAnalysis();
		},
        onReady() {
			// this.showAnalysis();
        },
		methods: {
			/* 日期快捷点击按钮 */
			clickDate(index) {
				/* 时间处理 */
				switch(index){
					case 0:
						this.startDate = 0;
						break;
					case 1:
						this.startDate = 1;
						break;
					case 2:
						this.startDate = 6;
						break;
					case 3:
						this.startDate = 29;
						break;
				}
				let date = new Date(new Date().getTime() - this.startDate*1000*60*60*24);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				let time =  y + '-' + MM + '-' + d;
				this.startTime = time;
				if(index === 1){
					this.endTime = time;
				}else{
					this.endTime = this.cacheToday;
				}
				/* 样式处理 */
				for (let date of this.dateList) {
					date.isClickHighLight = false
				}
				this.dateList[index].isClickHighLight = true;
				/* 数据再获取 */
				this.showAnalysis();
			},
			/* 刷新页面（再次获取数据） */
			showAnalysis() {
				/* 会员分析-会员量 */
				getMemberAnalyseCard(this.startTime, this.endTime).then(res => {
					// console.log("getMemberAnalyseCard",res)
					this.newMember = res.obj.newMember;
					this.allMember = res.obj.allMember;
				}).catch(err => {
					console.log("getMemberAnalyseCard",err)
				})
				/* 会员分析-按性别 */
				getMemberAnalyseChartBySex(this.startTime, this.endTime).then(res => {
					// console.log("getMemberAnalyseChartBySex",res)
					// 数据调整
					res.obj = res.obj.newMemberCount
					if (res.obj && res.obj.length) {
						this.boyNumber = (res.obj.filter((item) => {
							return item.name === '男'
						}))
						if (this.boyNumber.length) {
							this.boyNumber = this.boyNumber[0].value
						} else {
							this.boyNumber = 0
						}
						this.girlNumber =(res.obj.filter((item) => {
							return item.name === '女'
						}))
						if (this.girlNumber.length) {
							this.girlNumber = this.girlNumber[0].value
						} else {
							this.girlNumber = 0
						}
					} else {
						this.boyNumber = 0
						this.girlNumber = 0
					}
				}).catch(err => {
					console.log("getMemberAnalyseChartBySex",err)
				})
				/* 获取uni-charts数据 */
				this.getServerData();
			},
			/* 选项卡切换 */
			swiperChange(e) {
				let { current } = e.target;
				this.TabCur = current;
			},
			/* uni-charts-环形图 */
			/* 获取数据 */
			getServerData(){
				/* 按时间 */
				getMemberAnalyseChartByTime(this.startTime, this.endTime).then(res => {
					// console.log("getMemberAnalyseChartByTime",res)
					let LineA={categories:[],series:[{}]};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					LineA.categories = res.obj.xdata;
					LineA.series[0]['value'] = res.obj.ydata;
					// LineA.series[0]['value'] = res.obj.num;
					// console.log(LineA)
					/* 数据处理 */
					switch(this.startDate){
						case 0:
						case 1:
							// LineA.categories.push('0')
							// console.log("进1")
							for (let key in LineA.categories) {
								if((parseInt(LineA.categories[key].split(':')[0]))%4 === 0 || key === 0){
									LineA.categories[key] = LineA.categories[key].replace(':00','h')
								}else{
									LineA.categories[key] = '';
								}
							}
							break;
						case 6:
							// console.log("进2")
							for (let key in LineA.categories) {
								LineA.categories[key] = LineA.categories[key].split('-')[2] + '日'
							}
							break;
						case 29:
							// console.log("进3")
							// LineA.categories.push('0')
							for (let key in LineA.categories) {
								if((parseInt(LineA.categories[key].split('-')[2]))%3 === 0 || key === 0){
									// console.log(key)
									LineA.categories[key] = LineA.categories[key].split('-')[2] + '日'
								}else{
									LineA.categories[key] = '';
								}
							}
							break;
					}
					// console.log(LineA)
					LineA.series[0]['color'] = "#FFAF2C"
					_self.showLineA("canvasLineA",LineA);
				}).catch(err => {
					console.log("getMemberAnalyseChartByTime",err)
				})
				/* 按渠道 */
				getMemberAnalyseChartByChannel(this.startTime, this.endTime).then(res => {
					// console.log("getMemberAnalyseChartByChannel 777777",res)
					let RingA={series:[]};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					// RingA.series=res.obj;
					RingA.series=res.obj.totalMemberCount;
					// console.log('RingA.series', res.obj.totalMemberCount)
					/* 暂无数据监测 */
					let notData = 0;
					for (let item of RingA.series) {
						if(item.value !== 0){
							notData = 1
						}
					}
					if(notData === 0){
						this.isChannel = true;
					}else{
						this.isChannel = false;
					}
					_self.showRingA("canvasRingA",RingA);
				}).catch(err => {
					console.log("getMemberAnalyseChartByChannel",err)
					_self.tips="网络错误";
				})
				/* 会员活跃分析 */
				getMemberAnalyseConsumeActivityLevel(this.startTime, this.endTime).then(res => {
					// console.log("getMemberAnalyseConsumeActivityLevel666",res)
					let RingB={series:[]};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					RingB.series=res.obj;
					this.levelList = res.obj

					/* 暂无数据监测 */
					let notData = 0;
					for (let item of RingB.series) {
						if(item.value !== 0){
							notData = 1
						}
					}
					if(notData === 0){
						this.isLevel = true;
						// this.isPercentage = true;
					}else{
						this.isLevel = false;
					}
					_self.showRingB("canvasRingB",RingB);
				}).catch(err => {
					console.log("getMemberAnalyseConsumeActivityLevel",err)
					_self.tips="网络错误";
				})
			},
			showLineA(canvasId,chartData){
				canvaLineA=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'line',
					fontSize:7,
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
						min:0,
						max:10,
						format:(val)=>{return ''},
						disableGrid: true,
					},
					width: (_self.cWidth)*(_self.pixelRatio),
					height: (_self.cHeight)*_self.pixelRatio,
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
					fontSize:8,
					legend:true,
					extra: {
						pie: {
						  offsetAngle: -45,
						  ringWidth: 8*_self.pixelRatio,
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
					legend:false,
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
					width: _self.cWidthB*_self.pixelRatio,
					height: _self.cHeightB*_self.pixelRatio,
					disablePieStroke: true,
					dataLabel: true
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
					this.startDate = 0;
					this.startTime = e.value.replace(/\//g,'-');
					this.endTime = e.value.replace(/\//g,'-');
					/* 数据再获取 */
					this.showAnalysis();
					/* 去除右边快捷按钮样式 */
					for (let date of this.dateList) {
						date.isClickHighLight = false
					}
                }
            },
		},
	}
</script>

<style lang="scss">
	body{
		background-color: #f1f1f3;
	}
	.relative{
		position: relative;
	}
	.text-lllg{
		font-size: 64upx;
		font-weight: 900;
	}
	.ly-date-eles{
		width: 244upx;
		height: 52upx;
		padding: 12upx 6upx;
		color: #fff;
		border-radius: 6upx;
	}
	.lf-member-number{
		width: 750upx;
		height: 800upx;
		border: 1upx solid #f1f1f3;
		background-color: #FFF;
	}
	.lf-member-number .first .one{
		width: 100%;
		height: 100upx;
	}
	.lf-member-number .first .one .date{
		width: 30upx;
		height: 30upx;
		margin-right: 10upx;
	}
	.lf-member-number .first .one .line{
		width: 1upx;
		height: 30upx;
	}
	.lf-member-number .first .one .dateLabel{
		width: 416upx;
		height: 52upx;
		margin-left: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1upx solid #4BA8FF;
		border-radius: 6upx;
		overflow: hidden;
	}
	.lf-member-number .first .one .dateLabel > view{
		width: 120upx;
		height: 52upx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-right: 1upx solid #4BA8FF;
	}
	.lf-member-number .first .one .dateLabel > view:last-child{
		border-right: 0;
	}
	.isClickHighLight{
		background-color: #4BA8FF;
		color: #FFF;
	}
	.lf-member-number .first .two{
		width: 100%;
		height: 250upx;
	}
	.lf-member-number .first .two .line{
		width: 1upx;
		height: 60upx;
	}
	.lf-member-number .first .two > view{
		width: 280upx;
	}
	.memeber-bg-colors{
		width:680upx;
		height:160upx;
		background:linear-gradient(149deg,rgba(26,161,255,1),rgba(110,216,255,1));
		border-radius:10upx;
	}
	.text-32C6E9{
		color: #32C6E9;
	}
	.text-FA3A88{
		color: #FA3A88;
	}
	.img-gender{
		height: 250upx;
		padding: 50upx;
	}
	.img-boy{
		width: 70upx;
		height: 120upx;
		margin-bottom: 20upx;
	}
	.img-girl{
		width: 70upx;
		height: 120upx;
		margin-bottom: 20upx;
	}
	.lf-gender{
		display: flex;
		justify-content: center;
	}
	.lf-gender-bar{
		width: 90%;
		height: 25upx;
		border-radius: 25upx;
		background-color: #EFEFEF;
		display: flex;
		justify-content: flex-start;
		overflow: hidden;
	}
	.lf-gender-boy{
		background-color: #32C6E9;
		height: 100%;
		transition: width 1s;
	}
	.lf-gender-girl{
		background-color: #FA3A88;
		height: 100%;
		transition: width 1s;
	}
	.lf-active-analysis{
		width: 750upx;
		height: 550upx;
		background-color: #FFF;
	}
	.lf-active-percentage{
		width: 750upx;
		background-color: #FFF;
	}
	.lf-percentage-none {
		width: 750upx;
		height: 500upx;
	}
	.lf-percentage-none .imageOne {
		width: 320upx;
		height: 320upx;
	}
	.lf-percentage{
		width: 750upx;
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap;
	}
	.lf-percentage > view{
		width: 700upx;
		border-bottom: 1upx solid #F1F1F3;
		height: 80upx;
		display: flex;
		align-items: center;
	}
	.lf-percentage .backgroundImg{
		width: 40upx;
		height: 40upx;
		margin-right: 30upx;
	}
	.lf-percentage .one{
		width: 330upx;
	}
	.lf-percentage .two{
		width: 150upx;
	}
	.lf-channel{
		// position: relative;
	}
	.lf-level{
		width: 750upx;
		height: 500upx;
	}
	.lf-active-cover{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #FFF;
		z-index: 100;
		display: flex;
		justify-content: center;
		align-items: center;
		
		image {
			width: 100upx;
			height: 100upx;
		}
	}
	.lf-active-cover .imageOne{
		width: 320upx;
		height: 320upx;
	}
	.lf-active-cover .imageTwo{
		width: 250upx;
		height: 250upx;
		// margin-top: -200upx;
	}
	
	.text-white {
		color: #FFF;
	}
	
	.swiper {
		width: 100%;
		height: 300upx;
	}
	
page{background:#F2F2F2;width: 750upx;overflow-x: hidden;}
.qiun-padding{padding:2%; width:96%;}
.qiun-wrap{display:flex; flex-wrap:wrap;}
.qiun-rows{display:flex; flex-direction:row !important;}
.qiun-columns{display:flex; flex-direction:column !important;}
.qiun-common-mt{margin-top:10upx;}
.qiun-bg-white{background:#FFFFFF;}
.qiun-title-bar{width:96%; padding:10upx 2%; flex-wrap:nowrap;}
.qiun-title-dot-light{border-left: 10upx solid #4BA8FF; padding-left: 19upx; font-size: 32upx;color: #333; font-weight: bold;}
.qiun-charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
.charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
.charts-small{width: 680upx; height: 300upx;background-color: #FFF}

.ly-cum-wuctab {
	color: #666;
	font-size: 32upx;
	font-weight: 500;
}

.text-orange {
	color: #4BA8FF;
	border-bottom: 1upx solid #4BA8FF;
}
</style>