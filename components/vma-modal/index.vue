<template>
	<view
		class="vma-modal-style cover-box align-default"
		v-if="isCoverShow"
		@touchmove.stop.prevent="()=>{}">
		
		<!-- <view class="match-width bg-white" style="height: 90upx;"></view> -->
		
		<view class="match-left-space">
			<view
				class="vma-modal-style cover-box__cover"
				@click="onCoverBoxClick('close')">
			</view>
			
			<view :class="['modal-box', isTopJustify ? 'top-35' : '']">
				<view class="modal-box__title">
					{{title}}
				</view>
				<view class="modal-box__content match-width align-center box pb-30">
					<slot></slot>
				</view>
				<view :class="['modal-box__btn', isShowCancel ? 'align-left' : 'align-center']">
					<view
						v-if="isShowCancel"
						class="modal-box__btn__inner align-center"
						@click="onCoverBoxClick('cancel')">
						{{cancelText}}
					</view>
					<view 
						:class="['modal-box__btn__inner align-center active', isShowCancel ? 'bl' : 'mh']"
						@click="onCoverBoxClick('confirm')">
						{{confirmText}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'vma-modal',
		
		props: {
			title: {
				type: String,
				default: '提示'
			},
			isAllowCoverClickHide: {
				type: Boolean,
				default: true
			},
			isTopJustify: {
				type: Boolean,
				default: false
			},
			isShowCancel: {
				type: Boolean,
				default: true
			},
			confirmText: {
				type: String,
				default: '确定'
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			index: {
				type: Number,
				default: -1
			}
		},
		
		data() {
			return {
				isCoverShow: false
			}
		},
		
		methods: {
			// 遮罩层关闭
			onCoverBoxClick(action) {
				this.isCoverShow = false
				if (action === 'confirm') {
					this.$emit('onModalConfirm', this.index)
				} else if (action === 'cancel') {
					// this.onModalCancel()
					this.$emit('onModalCancel', this.index)
				} else if (action === 'close') {
					if (this.isAllowCoverClickHide) {	
						// this.onModalClose()
						this.$emit('onModalClose', this.index)
					} else {
						this.isCoverShow = true
					}
				}
			},
			// 打开模态框，供外部使用
			onModalOpen(flag = true) {
				this.isCoverShow = flag
			},
			// 获取模态框的状态
			getModalStatus() {
				return this.isCoverShow
			}
		}
	}
</script>

<style lang="scss">
	
	.vma-modal-style {
		
		&.cover-box {
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			z-index: 1000;
			background-color: rgba(0, 0, 0, 0.5);
			
			&__cover {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				flex: 1;
			}
			
			.modal-box {
				width: 560upx;
				background-color: #FFF;
				border-radius: 10upx;
				font-size: 32upx;
				font-weight: 500;
				color: #666;
				position: absolute;
				left: 50%;
				top: 20%;
				margin-left: -280upx;
				z-index: 1100;
				
				&__title {
					width: 100%;
					font-weight: bold;
					font-size: 36upx;
					color: #333;
					box-sizing: border-box;
					padding: 30upx 0;
					text-align: center;
				}
				
				&__btn {
					width: 100%;
					height: 100upx;
					font-size: 34upx;
					border-top: 1upx solid #F0F0F0;
					box-sizing: border-box;
					
					&__inner {
						width: 50%;
						height: 100%;
						box-sizing: border-box;
						
						&.active {
							color: #4BA8FF;
						}
						
						&:active {
							background-color: #F0F0F0;
							opacity: 0.8;
						}
						
						&.bl {
							border-left: 1upx solid #F0F0F0;
						}
						
						&.mh {
							width: 100%;
						}
					}
				}
				
				&__content {
					
					&__textarea {
						width: 500upx;
						height: 200upx;
						border: 1upx solid #F0F0F0;
						border-radius: 10upx;
						overflow: hidden;
						font-size: 32upx;
						font-weight: 500;
						
						textarea {
							width: 100%;
							height: 120upx;
							color: #666666;
						}
						
						.textarea {
							width: 100%;
							height: 120upx;
							color: #999999;
						}
						
						.tips {
							width: 100%;
							text-align: right;
							color: #999999;
							font-size: 26upx;
							font-weight: 500;
						}
					}
				}
			}
		}
	}
	
	.top-35 {
		top: 30% !important;
	}
</style>
