<template>
	<view>
		<view class='container-box'>
			
			<!-- 灰色 -->
			<view class='pt-20 match-width box grey-box'></view>
			
			<!-- 收银员 -->
			<view class='head-box match-width box plr-40 ptb-50'>
				<view class='head-box__inner match-width align-hor-bet plr-30'>
					<view class='align-left'>
						<image
							class='icon'
							mode='scaleToFill'
							src='../../../../static/home/mine.png'
						/>
						<view class='name ml-30'>收银员</view>
					</view>
					<view class='align-left'>
						<view>{{workInfo['userName'] || ''}}</view>
						<view class='dark'>（职位：{{workInfo['userType'] | userTypeFilter}}）</view>
					</view>
				</view>
			</view>
			
			<!-- 收银信息 -->
			<view class='detail-box match-width box plr-50 pt-10'>
				<view class='detail-box__inner'>
					<image
						class='bg'
						mode='scaleToFill'
						src='../../../../static/home/mine_bg.png'
					/>
					<view class='detail-box__inner__cover align-center plr-30 box'>
						<view class='items match-width align-hor-bet box ptb-30'>
							<view class='item align-ver-left'>
								<view>设备号</view>
								<view class='big mt-20'>{{workInfo['equipmentId'] || '--'}}</view>
							</view>
						</view>
						<view class='items match-width align-hor-bet box ptb-30'>
							<view class='item align-ver-left'>
								<view>实际营收</view>
								<view class='big mt-20'>¥ {{workInfo['actualMoney'] || '0.00'}}</view>
							</view>
						</view>
						<view class='items match-width align-hor-bet box ptb-30'>
							<view class='item align-ver-left'>
								<view>交易金额</view>
								<view class='big mt-20'>¥ {{workInfo['amountMoney'] || '0.00'}}</view>
							</view>
							<view class='item align-ver-left'>
								<view>交易笔数</view>
								<view class='big mt-20 ml-4'> {{workInfo['amountCount'] || 0}}</view>
							</view>
						</view>
						<view class='items match-width align-hor-bet box ptb-30'>
							<view class='item align-ver-left'>
								<view>退款金额</view>
								<view class='big mt-20'>¥ {{workInfo['refundMoney'] || '0.00'}}</view>
							</view>
							<view class='item align-ver-left'>
								<view>退款笔数</view>
								<view class='big mt-20 ml-4'>{{workInfo['refundCount'] || 0}}</view>
							</view>
						</view>
						<view class='items active match-width align-hor-bet box ptb-30'>
							<view class='match-width align-ver-left'>
								<view>交接时间</view>
								<view class='big match-width mt-20'>
									{{workInfo['workTime'] || ''}} ~ {{workInfo['endWorkTime'] || ''}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 底部按钮 -->
			<!-- <view class='bottom-box plr-40 pb-50'>
				<view class='match-width align-center'>
					工作时间：
				</view>
				<view class='match-width align-center mt-14'>
					{{workInfo['workTime'] || ''}} ~ {{workInfo['endWorkTime'] || ''}}
				</view>
				<view 
					class='bottom-box__btn align-center mt-30'
					@click="onClassExchange">
					交接班
				</view>
			</view> -->
			
		</view>
		
		
		<!-- 切换门店 -->
		<vma-modal
			ref="switchDialog"
			:index="1"
			:isTopJustify="true"
			@onModalConfirm="onModalConfirm"
			@onModalCancel="onModalCancel">
			<view class="text-center box match-width plr-50" style="font-size: 32upx;">
				当前系统选择的门店和交接班详情上的门店不匹配，无法打印，是否切换门店？
			</view>
		</vma-modal>
		
		<!-- 添加打印机 -->
		<vma-modal
			ref="switchDialogPrinter"
			:index="3"
			:isTopJustify="true"
			@onModalConfirm="onModalConfirm"
			@onModalCancel="onModalCancel">
			<view class="text-center box match-width plr-50" style="font-size: 32upx;">
				没有检测到打印机，是否前往打印机设置添加打印机？
			</view>
		</vma-modal>
		
	</view>
</template>

<script>
	import { getWorkInfo, exchangeClass } from '../../../../api/vueAPI.js'
	// wxapi
	import { Interval, showToast } from '../../../../common/wxapi.js'
	import { getPrintClassDetailAndPrint } from '../../../../api/classExchangeApi.js'
	import VmaModal from '@/components/vma-modal/index.vue'
	import { isPrinterExist } from '../../../../api/printApi.js'
	
	export default {
		components: {
			"vma-modal": VmaModal
		},
		
		data() {
			return {
				workInfo: {},
				exchangeLock: false,
				isShow: false,
				isLock: false
			}
		},
		
		onLoad() {
			// this.getWorkInfo()
			this.workInfo = uni.getStorageSync('classExchangeDetail') || {}
		},
		
		// 自动获取交接班信息
		onShow() {
			// this.getWorkInfo()
			// this.isShow = true
			// this.interval.startInterval()
			// this.interval.openInterval()
		},
		
		onHide() {
			// this.isShow = false
		},
		// 返回
		onBackPress(e) {
			if (e.from === 'backbutton' || e.from === 'backButton') {
				// nothing to do
			}
			// this.isShow = false
		},
		// 打印
		onNavigationBarButtonTap() {
			if (this.isLock) {
				return
			}
			this.isLock = true
			setTimeout(() => {
				this.isLock = false
			}, 2000)
			let storeId = ''
			let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
			if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
				storeId = nowStoreDetail.storeId
			}
			// console.log(this.workInfo['storeId'], storeId)
			if (this.workInfo['storeId'] === storeId) {
				if (!isPrinterExist()) {
					this.$refs['switchDialogPrinter'].onModalOpen()
					return
				}
				// 打印
				getPrintClassDetailAndPrint(this.workInfo)
			} else {
				this.$refs['switchDialog'].onModalOpen()
			}
		},
		
		methods: {
			// 获取交接班信息
			getWorkInfo(flag) {
				// 获取交接班信息
				this.interval = Interval((count) => {
					if(!uni.getStorageSync('token')) {
						this.interval.closeInterval()
						return
					}
					if (!this.isShow) {
						this.interval.closeInterval()
						return
					}
					// console.log('交接班~onShow')
					// this.showLoading(true)
					getWorkInfo().then(res => {
						// this.showLoading(false)
						// console.log('交接班', res)
						if (res.code === 200 && res.obj) {
							this.workInfo = res.obj
						}
					}).catch(err => {
						// this.showLoading(false)
						this.showToast('获取交接班信息失败，请检查网络')
					})
				}, 1000)
			},
			// 交接
			onClassExchange() {
				// 防止用户连续点击
				if (this.exchangeLock) {
					return
				}
				this.exchangeLock = true
				setTimeout(() => {
					this.exchangeLock = false
				}, 1000)
				this.showModal('是否确定要交接班？', (data) => {
					getWorkInfo().then(res => {
						if (res && res.code === 200 && res.obj) {
							this.workInfo = res.obj
							let workInfo = res.obj
							if (data.confirm) {
								// console.log('交接完成')
								this.exchangeClass(workInfo)
							} else {
								this.showToast('交接取消')
							}
						}
					}).catch((err) => {
						this.showToast('交接失败，请检查网络')
					})
				})
			},
			// 交接班
			exchangeClass(workInfo) {
				let userId = uni.getStorageSync('userId') || ''
				workInfo[userId] = userId
				exchangeClass(workInfo).then(res => {
					if (res && res.code === 200 && res.obj) {
						this.showToast('交接班成功')	
						setTimeout(() => {
							this.doLoginOut()
						}, 600)
					}
				}).catch(err => {
					this.showToast('交接班失败，请检查网络')
				})
			},
			// 登出
			doLoginOut () {
				uni.reLaunch({
					url: '/pages/login/index/index',
					success() {
						uni.removeStorageSync('token')
						uni.removeStorageSync('userId')
						uni.removeStorageSync('userType')
						uni.removeStorageSync('beginTime')
						uni.setStorageSync('remember', true)
						uni.setStorageSync('isLogin', true)
					}
				})
			},
			// 显示弹框
			showModal(content, callback) {
				if (content) {
					uni.showModal({
						title: '提示',
						content,
						showCancel: true,
						success: (res) => {
							callback && callback(res)
						}
					})
				}
			},
			// 显示消息
			showToast(title) {
				if (title) {
					uni.showToast({
						title,
						icon: 'none'
					})
				}
			},
			// 显隐loading
			showLoading(flag) {
				let methodName = (flag ? 'show' : 'hide') + 'Loading'
				uni[methodName]()
			},
			// 模态框确定
			onModalConfirm(type) {
				if (type === 1) {
					// 切换门店模态框
					// console.log('confirm')
					uni.navigateTo({
						url: '/pagesA/home/storeSelect/index/index'
					})
				} else if (type === 3) {
					// 添加打印机
					uni.navigateTo({
						url: '/pages/user/newPrinter/index/index'
					})
				}
			},
			// 模态框取消
			onModalCancel(type) {
				// nothing to do
			}
		},
		
		filters: {
			// 用户类型过滤
			userTypeFilter(userType) {
				if (userType == 1) {
					return '商户'
				} else if (userType == 2) {
					return '店长'
				} else if (userType == 3) {
					return '员工'
				} 
				return '无'
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
		background-color: #FFF;
		position: relative;
		box-sizing: border-box;
		top: 0;	
		left: 0;
		right: 0;
		
		.grey-box {
			background-color: #F8F9FD;
		}
		
		.head-box {
			
			&__inner {
				width: 100%;
				height: 120upx;
				border-radius: 60upx;
				/* opacity: 0.08; */
				background-color: #F1F8FF;
				font-size: 32upx;
				font-weight: 500;
				color: #333333;
				
				.icon {
					width: 60upx;
					height: 60upx;
				}
				
				.name {
					color: #4BA8FF;
				}
				
				.dark {
					color: #999;
				}
			}
		}
		
		.detail-box {
			width: 100%;
			height: 900upx;
			
			&__inner {
				width: 100%;
				height: 100%;
				position: relative;
				color: #FFF;
				font-size: 24upx;
				font-weight: 500;
				
				.bg {
					width: 100%;
					height: 100%;
				}
				
				&__cover {
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					z-index: 10;
					font-size: 28upx;
					
					.items {
						width: 100%;
						height: 160upx;
						/* padding: 0 30upx; */
						border-bottom: 1upx solid #FFF;
						
						&.active {
							border-bottom: 1upx solid transparent;
						}
					}
					
					.item {
						width: 200upx;
						
						.biger {
							/* font-size: 36upx; */
						}
						
						.big {
							/* font-size: 30upx; */
						}
					}
				}
			}
		}
		
		.bottom-box {
			width: 100%;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			z-index: 20;
			color: #999;
			font-size: 24upx;
			font-weight: 500;
			
			&__btn {
				width: 100%;
				height: 98upx;
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
	}
	
</style>
