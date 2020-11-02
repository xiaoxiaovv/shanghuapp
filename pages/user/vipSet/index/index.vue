<template>
	<view class='container-box pt-30 align-default'>
		<view class='content-box'>
			<view class='item-box align-hor-bet'>
				<view class="align-ver-left">
					<view>
						充值赠送金额
					</view>
					<view class='subtitle'>
						{{this.vipInfo.rechargeUse | rechargeUseFilter}}
					</view>
				</view>
				<switch 
					:checked="isRadioEnable" 
					color="#4BA8FF"
					@change="onRadioChange"
				/>
			</view>
			<view 
				class='item-box align-hor-bet'
				@click="jumpIntoPaySetting">
				<view class="align-ver-left">
					<view>
						积分抵扣现金
					</view>
					<view
						class='subtitle'
						v-if="integralRule && integralUse">
						{{integralRule.integralNum}}积分={{integralRule.deduction}}元, 上限{{integralRule.deductionMax}}积分
					</view>
				</view>
				<image
					src='../../../../static/tabBar/icon_the_arrow.png'
				/>
			</view>
			<view
				class='item-box align-hor-bet'
				@click="onOrderAccountChange(true, 'open')">
				<view class="align-ver-left">
					<view>
						优惠组合
					</view>
					<view class='subtitle'>
						{{this.vipInfo.simultaneouslyUse | simultaneouslyUseFilter}}
					</view>
				</view>
				<image
					src='../../../../static/tabBar/icon_the_arrow.png'
				/>
			</view>
			<view 
				class='btn-box align-center'
				v-if="isFirst">
				<view 
					class='create-btn box align-center mr-30'
					@click="onBtnClick('confirm')">
					设置
				</view>
				<view 
					class='create-btn box align-center active'
					@click="onBtnClick('cancel')">
					取消
				</view>
			</view>
		</view>
		<view 
			class='container-box__cover box align-default'
			v-if="isPickerShow">
			<view 
				class='match-left-space'
				@click='onCoverClose'>
			</view>
			<view 
				class='picker-box align-default'
				v-if="isPickerShow">
				<view class='menu align-hor-bet plr-40 box'>
					<view 
						@click="onOrderAccountChange(false, 'cancel')">
						取消
					</view>
					<view 
						class='active'
						@click="onOrderAccountChange(false, 'confirm')">
						确定
					</view>
				</view>
				<view class='panel'>
					<view
						class='panel__item align-hor-bet'
						@click="onChangeCheckBox('discount')">
						<view :class="[isDiscountShow ? 'light' : '']">
							展示满减
						</view>
						<image
							v-if='isDiscountShow'
							src='../../../../static/homev2/good.png'
						/>
					</view>
					<view 
						class='panel__item align-hor-bet'
						@click="onChangeCheckBox('coupon')">
						<view :class="[isCouponShow ? 'light' : '']">
							展示优惠券
						</view>
						<image
							v-if='isCouponShow'
							src='../../../../static/homev2/good.png'
						/>
					</view>
					<view class='match-width align-top box plr-40 pt-50'>
						<view>
							提示：
						</view>
						<view class='match-left-space align-ver-left'>
							<view>
								1.单独选择满减/优惠券时，设备上仅展示满减或优惠券信息；
							</view>
							<view>
								2.满减和优惠券都选择时，设备上展示两样优惠信息，但是用户只能选择一个优惠；
							</view>
							<view>
								3.满减和优惠券都不选择时，有优惠信息也不展示
							</view>
						</view>
					</view>
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
	import { getVipSetting, setVipSetting } from '../../../../api/vueAPI.js'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	
	export default {
		components: {neilModal},
		
		data() {
			return {
				isRadioEnable: false,
				vipInfo: {},
				isPickerShow: false,
				isCouponShow: false,
				isDiscountShow: false,
				integralRule: '',
				isOnShow: false,
				integralUse: true,
				isFirst: false,
				content: '',
				modalShowMsg: false,
				returnType: ''
			}
		},
		methods: {
			// switch切换
			onRadioChange(e) {
				let value = e.detail.value
				this.isRadioEnable = value
				this.vipInfo.rechargeUse = this.isRadioEnable ? 1 : 2
				 // 支付设置
				!this.isFirst && this.setVipSetting()
			},
			// 获取会员支付设置
			getVipSetting() {
				// uni.showLoading()
				getVipSetting().then(res => {
					// console.log('getVipSetting', res)
					
					// res.obj = null
					
					if (res && res.obj) {
						this.vipInfo = res.obj
						this.isRadioEnable = this.vipInfo.rechargeUse === 1
						if (this.vipInfo.integralRule) {
							this.integralRule = JSON.parse(this.vipInfo.integralRule)
						} else {
							this.vipInfo.integralRule = ''
						}
						this.integralUse = this.vipInfo.integralUse === 1
						this.isFirst = false
					} else {
						this.vipInfo = {
							integralRule: JSON.stringify({integralNum: 1,deduction: 0.01,deductionMax: 1}),
							integralUse: 0,
							rechargeUse: 2,
							simultaneouslyUse: 0
						}
						this.isRadioEnable = false
						this.integralRule = ''
						this.integralUse = false
						this.isFirst = true
					}
					// uni.hideLoading()
				}).catch(err => {
					// this.vipInfo = {
					// 	integralRule: JSON.stringify({integralNum: 0,deduction: 0,deductionMax: 0}),
					// 	integralUse: 0,
					// 	rechargeUse: 2,
					// 	simultaneouslyUse: 0
					// }
					// this.isRadioEnable = false
					// this.integralRule = ''
					// this.integralUse = false
					// this.isFirst = true
					// uni.hideLoading()
				})
			},
			// 支付设置
			setVipSetting() {
				let { id, integralRule, integralUse, rechargeUse, simultaneouslyUse } = this.vipInfo
				uni.showLoading()
				return setVipSetting(this.vipInfo).then(res => {
					// this.getVipSetting()
					uni.hideLoading()
					this.showToast('设置成功')
				}).catch(err => {
					uni.hideLoading()
				})
			},
			// 跳往积分设置
			jumpIntoPaySetting() {
				uni.setStorageSync('prevVipSetting', this.vipInfo)
				uni.navigateTo({
					url: '../pay/index'
				})
			},
			// 遮罩层关闭
			onCoverClose() {
				this.onOrderAccountChange(false)
			},
			// 优惠组合控制开关
			onOrderAccountChange(isShow, type) {
				this.isPickerShow = isShow
				if (type === 'confirm') {
					this.vipInfo.simultaneouslyUse = 0
					if (this.isDiscountShow && this.isCouponShow) {
						this.vipInfo.simultaneouslyUse = 3
					} else if(this.isDiscountShow) {
						this.vipInfo.simultaneouslyUse = 1
					} else if(this.isCouponShow) {
						this.vipInfo.simultaneouslyUse = 2
					}
					!this.isFirst && this.setVipSetting()
				} else if (type === 'open') {
					this.isDiscountShow = false
					this.isCouponShow = false
					if (this.vipInfo.simultaneouslyUse === 1) {
						this.isDiscountShow = true
					} else if (this.vipInfo.simultaneouslyUse === 2) {
						this.isCouponShow = true
					} else if (this.vipInfo.simultaneouslyUse === 3) {
						this.isDiscountShow = true
						this.isCouponShow = true
					}
				}
			},
			// 复选框切换
			onChangeCheckBox(type) {
				if (type === 'discount') {
					this.isDiscountShow = !this.isDiscountShow
				} else if (type === 'coupon') {
					this.isCouponShow = !this.isCouponShow
				}
			},
			// 按钮点击
			onBtnClick(type) {
				if (type === 'confirm') {
					// console.log('this.vipInfo', this.vipInfo)
					this.content = '是否设置？'
					this.modalShowMsg = true
					this.returnType = 'set'
				} else if (type === 'cancel') {
					this.returnType = 'back'
					this.modalShowMsg = true
					this.content = '是否放弃设置？'
				}
			},
			// 模态框关闭
			closeModalMsg() {
				this.modalShowMsg = false
			},
			// 模态框确定
			btnConfirmMsg() {
				if (this.returnType === 'set') {
					this.setVipSetting().then(res => {
						this.getVipSetting()
					})
				} else if (this.returnType === 'back') {
					this.returnType = ''
					uni.navigateBack({
						delta: 1
					})
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
		filters: {
			// 充值赠送的金额规则过滤
			rechargeUseFilter(rechargeUse) {
				if (rechargeUse === 1) {
					return '可立即使用'
				} else if (rechargeUse === 2) {
					return '下次消费可使用'
				}
				return ''
			},
			// 优惠组合规则过滤
			simultaneouslyUseFilter(simultaneouslyUse) {
				if (simultaneouslyUse === 1) {
					return '仅展示满减'
				} else if (simultaneouslyUse === 2) {
					return '仅展示优惠券'
				} else if (simultaneouslyUse === 3) {
					return '展示满减和优惠券'
				}
				return ''
			}
		},
		onLoad() {
			this.getVipSetting()
		},
		onShow() {
			if (!this.isFirst) {
				setTimeout(() => {
					this.getVipSetting()
				}, 100)
			} else {
				this.isRadioEnable = this.vipInfo.rechargeUse === 1
				if (this.vipInfo.integralRule) {
					this.integralRule = JSON.parse(this.vipInfo.integralRule)
				} else {
					this.vipInfo.integralRule = ''
				}
				this.integralUse = this.vipInfo.integralUse === 1
			}
		},
		onBackPress(e) {
			if (this.isFirst) {
				if (e.from === 'backButton' || e.from === 'backbutton') {
					this.returnType = 'back'
					this.modalShowMsg = true
					this.content = '是否放弃设置？'
				}
				if (this.returnType === 'set' || this.returnType === 'back') {
					return true
				}
			}
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
				padding: 0 40upx;
				border-bottom: 1upx solid #F0F0F0;
				box-sizing: border-box;
				color: #333333;
				font-size: 32upx;
				font-weight: 500;
				line-height: 1.6;
				
				.subtitle {
					color: #999999;
					font-size: 28upx;
				}
				
				image {
					width: 11upx;
					height: 20upx;
				}
			}
			
			.btn-box  {
				width: 100%;
				padding-top: 100upx;
				
				.create-btn {
					width: 320upx;
					height: 80upx;
					box-sizing: border-box;
					background-color: #4BA8FF;
					border-radius: 50upx;
					border: 1upx solid #4BA8FF;
					color: #FFF;
					font-size: 32upx;
					font-weight: 500;
					
					&.active {
						background-color: #FFF;
						color: #4BA8FF;
					}
					
					&:active {
						opacity: 0.8;
					}
				}
			}
		}
		
		&__cover {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 10000;
			
			.light {
				color: #007AFF;
			}
			
			.picker-box {
				width: 100%;
				height: 800upx;
				position: relative;
				left: 0;
				right: 0;
				bottom: 0;
				
				.menu {
					width: 100%;
					height: 99upx;
					background-color: #F6F6F6;
					color: #999999;
					font-size: 36upx;
					font-weight: 500;
					
					.active {
						color: #007AFF;
					}
				}
				
				.panel {
					width: 100%;
					height: 100%;
					flex: 1;
					background-color: #FFF;
					color: #999999;
					font-size: 24upx;
					line-height: 1.8;
					font-weight: 500;
					text-align: left;
					
					&__item {
						width: 100%;
						height: 150upx;
						box-sizing: border-box;
						padding: 0 40upx;
						color: #333;
						font-size: 28upx;
						font-weight: 500;
						border-bottom: 1upx solid #F0F0F0;
						
						&.active {
							border-bottom: 1upx solid transparent;
						}
						
						image {
							width: 40upx;
							height: 32upx;
						}
					}
				}
			}
		}
	}
</style>
