<template>
	<view class='container-box pt-30 align-default'>
		<view class='content-box'>
			<view class='item-box align-hor-bet'>
				<view>积分抵扣现金</view>
				<switch 
					:checked="isRadioEnable" 
					color="#4BA8FF"
					@change="onRadioChange"
				/>
			</view>
			<block v-if='isRadioEnable'>
				<view class='item-box align-hor-bet'>
					<view class='align-left'>
						<input
							type='digit'
							placeholder="0"
							placeholder-class="placeholder"
							v-model="integralRule.integralNum"
							@blur="onInputBlur('score', $event)"
							@confirm="onInputBlur('score', $event)"
						/>
						<view class='input'>
							（积分）
						</view>
					</view>
					<view>=</view>
					<view class='align-left'>
						<input
							type='digit'
							placeholder="0"
							placeholder-class="placeholder"
							v-model="integralRule.deduction"
							@blur="onInputBlur('money', $event)"
							@confirm="onInputBlur('money', $event)"
						/>
						<view class='input'>
							（元）
						</view>
					</view>
				</view>
				<view class='item-box align-hor-bet'>
					<view>最多可抵扣</view>
					<view class='align-left'>
						<input
							type='digit'
							placeholder="0"
							placeholder-class="placeholder"
							v-model="integralRule.deductionMax"
							@blur="onInputBlur('maxScore', $event)"
							@confirm="onInputBlur('maxScore', $event)"
						/>
						<view class='input'>
							（积分）
						</view>
					</view>
				</view>
			</block>
			<view class='item-box align-center active'>
				<view
					class='btn align-center'
					@click='onSave'>
					保存
				</view>
			</view>
		</view>
		
		<!-- 模态框 -->
		
		<neil-modal
			:show="modalShowMsg"
			title="提示"
			:auto-close="false"
			@close="closeModalMsg"
			@confirm="btnConfirmMsg">
			<view
				class='align-center'
				style="min-height: 90upx;padding: 32upx 30upx; font-size: 28upx; text-align: center; line-height: 1.6;">
				{{content}}
			</view>
		</neil-modal>
	</view>
</template>

<script>
	import { getVipSetting, setVipSetting } from '../../../../../api/vueAPI.js'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	
	export default {
		components: {neilModal},
		
		data() {
			return {
				isRadioEnable: false,
				vipInfo: {},
				integralRule: {},
				isChange: false,
				modalShowMsg: false,
				content: '',
				returnType: '',
				isFirst: false
			}
		},
		methods: {
			// 单选按钮切换
			onRadioChange(e) {
				let value = e.detail.value
				this.isRadioEnable = value
				this.vipInfo.integralUse = this.isRadioEnable ? 1 : 0
				 // 支付设置
				// this.setVipSetting()
				this.isChange = true
			},
			// 获取会员支付设置
			getVipSetting() {
				getVipSetting().then(res => {
					// console.log('getVipSetting', res)
					
					// res.obj = null
					
					if (res && res.obj) {
						this.vipInfo = res.obj
						this.isRadioEnable = this.vipInfo.integralUse === 1
						if (this.vipInfo.integralRule) {
							this.integralRule = JSON.parse(this.vipInfo.integralRule)
						}
						this.isFirst = false
					} else {
						// this.vipInfo = {}
						this.isRadioEnable = false
						this.isFirst = true
						this.vipInfo = uni.getStorageSync('prevVipSetting') || {}
						// console.log('this.vipInfo', this.vipInfo)
						this.isRadioEnable = this.vipInfo.integralUse === 1
						if (this.vipInfo.integralRule) {
							this.integralRule = JSON.parse(this.vipInfo.integralRule)
						}
					}
				}).catch(err => {
					// this.isRadioEnable = false
					// this.isFirst = true
					// this.vipInfo = uni.getStorageSync('prevVipSetting') || {}
					// console.log('this.vipInfo', this.vipInfo)
					// this.isRadioEnable = this.vipInfo.integralUse === 1
					// if (this.vipInfo.integralRule) {
					// 	this.integralRule = JSON.parse(this.vipInfo.integralRule)
					// }
				})
			},
			// 支付设置
			setVipSetting() {
				let { id, integralRule, integralUse, rechargeUse, simultaneouslyUse } = this.vipInfo
				if (id) {
					uni.showLoading()
					setVipSetting(this.vipInfo).then(res => {
						// this.getVipSetting()
						uni.hideLoading()
						setTimeout(() => {
							this.showToast('设置成功')
						}, 200)
					}).catch(err => {
						uni.hideLoading()
					})
				}
			},
			// 输入框失焦
			onInputBlur(type, e) {
				let value = +e.detail.value
				if (type === 'money') {
					if (/^\d+\.\d{2}\d+$/.test(value)) {
						value = value.toFixed(2)
						value = Number(value)
					}
					if (value <= 0) {
						value = 0.01
					} else if (value > 999999) {
						value = 999999
						this.showToast('金额上限值为999999')
					}
				} else {
					value = Math.floor(value)
					if (value <= 0) {
						value = 1
					} else if (value > 99999999) {
						value = 99999999
						this.showToast('积分上限值为99999999')
					} else if (value === 0) {
						// if (type === 'score') {
						// 	this.integralRule.deduction = value
						// }
					} else if (/^\d+\.$/.test(value + '')) {
						// value = Number(value)
					}
				}
				if (type === 'score') {
					// this.integralRule.integralNum = value
					this.integralRule.integralNum = value
				} else if (type === 'money') {
					// console.log('value', value)
					this.integralRule.deduction = value
				} else if (type === 'maxScore') {
					this.integralRule.deductionMax = value
				}
				this.vipInfo.integralRule = JSON.stringify(this.integralRule)
				this.isChange = true
			},
			// 提示
			showToast(title) {
				title && uni.showToast({
					title,
					icon: 'none'
				})
			},
			// 保存
			onSave() {
				if (!this.integralRule.integralNum || !this.integralRule.deduction || !this.integralRule.deductionMax) {
					uni.showToast({
						title: '有内容未填完',
						icon: 'none'
					})
					return
				}
				this.returnType = 'button'
				this.onBack()
			},
			// 返回
			onBack() {
				this.modalShowMsg = true
				this.content = '是否保存？'
				// uni.showModal({
				// 	title: '提示',
				// 	content: '是否保存？',
				// 	showCancel: true,
				// 	success: (res) => {
				// 		if (res.confirm) {
				// 			this.setVipSetting()
				// 			let pages = getCurrentPages()
				// 			let curPage = pages[pages.length - 1]
				// 			let prevPage = pages[pages.length - 2]
				// 			if (curPage && prevPage) {
				// 				prevPage.isOnShow = true
				// 				prevPage.$vm.isOnShow = true
				// 			}
				// 			uni.navigateBack({
				// 				delta: 1
				// 			})
				// 		} else {
				// 			uni.navigateBack({
				// 				delta: 1
				// 			})
				// 		}
				// 	}
				// })
			},
			// 关闭对话框
			closeModalMsg() {
				this.modalShowMsg = false
				// this.returnType = ''
				// console.log(this.returnType)
				if (this.returnType === 'back') {
					// nothing to do
				} else if (this.returnType === 'button') {
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 200)
				}
			},
			// 确定
			btnConfirmMsg() {
				if (this.returnType === 'back') {
					uni.navigateBack({
						delta: 1
					})
				} else if (this.returnType === 'button') {
					let pages = getCurrentPages()
					let curPage = pages[pages.length - 1]
					let prevPage = pages[pages.length - 2]
					if (!this.isFirst) {
						this.setVipSetting()
						if (curPage && prevPage) {
							prevPage.isOnShow = true
							prevPage.$vm.isOnShow = true
						}
					} else {
						if (curPage && prevPage) {
							prevPage.vipInfo = {
								...this.vipInfo
							}
							prevPage.$vm.vipInfo = {
								...this.vipInfo
							}
						}
					}
				}
			},
			// toast
			showToast(title) {
				uni.showToast({
					title,
					icon: 'none'
				})
			}
		},
		onLoad() {
			// 获取vip设置
			this.getVipSetting()
		},
		onBackPress(e) {
			// if (this.isFirst) {
				if ((e.from === 'backButton' || e.from === 'backbutton') && this.isChange) {
					this.returnType = 'back'
					// this.onBack()
					// return true
					this.modalShowMsg = true
					this.content = '是否放弃设置？'
					return true
				}
			// }
		}
	}
</script>

<style lang="scss">
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
		
		.content-box {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			flex: 1;
			background-color: #FFF;
			position: relative;
			
			.item-box {
				width: 100%;
				height: 150upx;
				box-sizing: border-box;
				padding: 0 40upx;
				color: #333333;
				font-size: 32upx;
				font-weight: 500;
				border-bottom: 1upx solid #F0F0F0;
				
				&.active {
					border-bottom: 1upx solid transparent;
				}
				
				input {
					width: 150upx;
					text-align: center;
					color: #333;
				}
				
				.input {
					color: #CCCCCC;
				}
				
				.btn {
					width: 100%;
					height: 100upx;
					border-radius: 12upx;
					background-color: #4BA8FF;
					box-sizing: border-box;
					font-size: 36upx;
					font-weight: 500;
					color: #FFF;
					margin-top: 150upx;
					
					&:active {
						opacity: 0.8;
					}
				}
				
				.placeholder {
					color: #CCCCCC !important;
				}
			}
		}
	}
</style>
