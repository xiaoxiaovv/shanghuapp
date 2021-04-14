<template>
	<view>
		
		<view class='content-box align-default'>
			
			<!-- 灰色 -->
			<view class='pt-20 match-width box grey-box'></view>
			
			<!-- 查询功能 -->
			<view class='match-width align-hor-bet plr-30 ptb-40 bg-white'>
				<view class='box align-ver-left'>
					<view class='time-box match-width align-left'>
						<view>开始时间</view>
						<view 
							class='select align-center box ml-20'
							@click="onShowDatePicker('start')">
							<block v-if='startTime'>
								<view>{{startTime}}</view>
							</block>
							<block v-else>
								<view class='dark'>选择日期</view>
							</block>
						</view>
					</view>
					<view class='time-box match-width align-left mt-40'>
						<view>结束时间</view>
						<view 
							class='select align-center box ml-20'
							@click="onShowDatePicker('end')">
							<block v-if="endTime">
								<view>{{endTime}}</view>
							</block>
							<block v-else>
								<view class='dark'>选择日期</view>
							</block>
						</view>
					</view>
				</view>
				<view 
					class='btn-box align-center'
					@click='onQuery'>
					查询
				</view>
			</view>
			
			<!-- 灰色 -->
			<view class='pt-20 match-width box grey-box'></view>
			
			<!-- 记录列表 -->
			<view class='record-box match-width plr-40 align-left ptb-30'>
				<view class='device-name'>
					设备号
				</view>
				<view class='employee-name'>
					操作员
				</view>
				<view class='exchange-time'>
					交接时间
				</view>
			</view>
			
		</view>
		
		<view class='padding-height'></view>
		
		<!-- 记录列表 -->
		<view class='match-width box'>
			<mescroll-uni
				:down="downOption" 
				@down="downCallback" 
				:up="upOption" 
				@up="upCallback" 
				@init="mescrollInit">
				<view 
					class='record-box match-width plr-40 align-left ptb-40'
					v-for='(item, index) in dataList'
					:key='index'
					@click='onJumpDetails(item)'>
					<view class='device-name ml-4'>
						{{item.equipmentId ? item.equipmentId : '- -'}}
					</view>
					<view class='employee-name'>
						{{item.userName ? item.userName : ''}}
					</view>
					<view class='exchange-time'>
						{{item.endWorkTime ? item.endWorkTime : ''}}
					</view>
				</view>
			</mescroll-uni>
		</view>
		
		<!-- 日期时间 -->
		<mx-date-picker 
			:show="showPicker" 
			:type="type" 
			:value="value" 
			:show-tips="true" 
			:show-seconds="true"
			 :format='format'
			 :color='color'
			@confirm="onSelected" 
			@cancel="onSelected" 
		/>
		
	</view>
</template>

<script>
	import MescrollUni from "mescroll-uni/mescroll-uni.vue"
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue"
	import { queryRecord } from '../../../../api/vueAPI.js'

	export default {	
		components: {
			MescrollUni,
			MxDatePicker
		},
					
		data() {
			return {
				selectType: '',
				startTime: '',
				endTime: '',
				searchLock: false,
				// 列表数据
				dataList: [],
				// 下拉刷新的常用配置
				downOption: { 
					// use: true, // 是否启用下拉刷新; 默认true
					// auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				},
				// 上拉加载的常用配置
				upOption: {
					// use: true, // 是否启用上拉加载; 默认true
					// auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					// page: {
					// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					// 	size: 10 // 每页数据的数量,默认10
					// },
					// noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无交接记录',
						icon: "../../../../static/order/no-data.png", //图标,默认null,支持网络图
					}
				},
				showPicker: false,
				type: 'datetime',
				value: '',
				color: '#4BA8FF',
				format: 'yyyy-mm-dd hh:ii:ss',
				mescroll: null
			}
		},
		
		onLoad() {
			this.getCurrentTime()
		},
		
		onShow() {
			
		},
		
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			this.mescroll && this.mescroll.onPageScroll(e)
		},
		
		methods: {
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调, 有三种处理方式: */
			downCallback(mescroll){
				mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			upCallback(mescroll) {
				// console.log('mescroll', mescroll)
				// 此时mescroll会携带page的参数:
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				if (!this.startTime || !this.endTime) {
					mescroll.endErr()
					return
				}
				this.showLoading(true)
				queryRecord(this.startTime, this.endTime, pageNum, pageSize).then(res => {
					this.showLoading(false)
					// console.log(res)
					if (res.code === 200 && res.obj && res.obj.content) {
						// 接口返回的当前页数据列表 (数组)
						let curPageData = res.obj.content
						// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
						let totalPage = res.obj.totalPages
						//设置列表数据
						if(mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
						this.dataList = this.dataList.concat(curPageData); //追加新数据
						// 成功隐藏下拉加载状态
						// //方法一(推荐): 后台接口有返回列表的总页数 totalPage
						mescroll.endByPage(curPageData.length, totalPage); 
					}
				}).catch(err => {
					this.showLoading(false)
					mescroll.endErr()
				})
			},
			// 显示时间
			onShowDatePicker(type) {
				this.showPicker = true
				this.selectType = type
				if (type === 'start') {
					this.value = this.startTime || ''
				} else if (type === 'end') {
					this.value = this.endTime || ''
				}
			},
			// 日期选择
			onSelected(e) {
				this.showPicker = false
				if (e) {
					if (this.selectType === 'start') {
						if (this.endTime === '') {
							this.startTime = e.value
						} else {
							let tmpValue = e.value
							let startTime = this.getTimestamp(tmpValue)
							let tmpEndTime = this.endTime
							let endTime = this.getTimestamp(tmpEndTime)
							if (startTime < endTime) {
								this.startTime = tmpValue
							} else {
								this.showToast('开始时间不能晚于结束时间')
							}
						}
					} else if (this.selectType === 'end') {
						if (this.satrtTime === '') {
							this.endTime = e.value
						} else {
							let tmpValue = e.value
							let tmpStartTime = this.startTime
							let startTime = this.getTimestamp(tmpStartTime)
							let endTime = this.getTimestamp(tmpValue)
							if (startTime < endTime) {
								this.endTime = tmpValue
							} else {
								this.showToast('结束时间不能早于开始时间')
							}
						}
					}
				}
			},
			// 时间比较
			getTimestamp (stringDate) {
				if (stringDate) {
					// 部分真机只支持使用yyyy/mm/dd hh:mm:ss的格式
					let tmpStringDate = stringDate.replace(/\-/g, '/')
					let date = new Date(tmpStringDate)
					let time = date.getTime()
					return time
				}
				return 0
			},
			// 提示
			showToast(title) {
				title && uni.showToast({
					title,
					icon: 'none'
				})
			},
			// 查询
			onQuery () {
				if (this.searchLock) {
					// this.showToast('请不要重复点击')
					return
				}
				this.searchLock = true
				setTimeout(() => {
					this.searchLock = false
				}, 1000)
				let startTime = this.startTime
				let endTime = this.endTime
				if (!startTime) {
					this.showToast('请选择开始时间')
				} else if (!endTime) {
					this.showToast('请选择结束时间')
				} else {
					this.mescroll.resetUpScroll()
					setTimeout(() => {
						this.mescroll.scrollTo(0)
					}, 200)
				}
			},
			// 获取当前时间
			getCurrentTime() {
				let date = new Date()
				let yyyymmdd = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
				this.startTime = yyyymmdd + ' 00:00:00'
				this.endTime = yyyymmdd + ' 23:59:59'
			},
			// 显隐loading
			showLoading(flag) {
				let methodName = (flag ? 'show' : 'hide') + 'Loading'
				uni[methodName]()
			},
			// 跳转详情
			onJumpDetails(item) {
				uni.setStorageSync('classExchangeDetail', item)
				uni.navigateTo({
					url: '/packageA/pages/user/classReplace/details/index'
				})
				
			}
		}
	}

</script>

<style lang='scss'>

	uni-page-body {
		width: 100%;
		height: 100%;
	}
	
	.container-box {
		width: 100%;
		height: 100%;
		background-color: #F8F9FD;
		position: relative;
		box-sizing: border-box;
		top: 0;	
		left: 0;
		right: 0;
	}
	
	.padding-height {
		width: 100%;
		height: 420upx;
		position: relative;
		box-sizing: border-box;
	}
	
	.content-box {
		width: 100%;
		box-sizing: border-box;
		flex: 1;
		background-color: #FFF;
		position: fixed;
		z-index: 10;
		
		.item-box {
			width: 100%;
			height: 120upx;
			color: #333;
			font-size: 32upx;
			font-weight: 500;
			box-sizing: border-box;
			border-bottom: 1upx solid #F0F0F0;
			padding: 0 40upx;
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
		
		.time-box {
			font-size: 30upx;
			color: #333;
			font-weight:500;
			
			.select {
				width: 300upx;
				height: 70upx;
				border-radius: 45upx;
				background-color: #F1F8FF;
				font-size: 26upx;
				
				.dark {
					color: #999999;
				}
				
				&:active {
					opacity: 0.8;
				}
			}
		}
		
		.grey-box {
			background-color: #F8F9FD;
		}
	}
	
	.record-box {
		box-sizing: border-box;
		color: #666;
		font-size: 26upx;
		font-weight: bold;
		border-bottom: 1upx solid #EEEEEE;
		
		.device-name {
			width: 200upx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			box-sizing: border-box;
			padding: 0 20upx 0 0;
		}
		
		.employee-name {
			width: 160upx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			box-sizing: border-box;
			padding: 0 20upx 0 0;
		}
		
		.exchange-time {
			width: 300upx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			box-sizing: border-box;
			padding: 0 20upx 0 0;
		}
	}

</style>