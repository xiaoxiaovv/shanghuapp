<template>
	<view 
		v-if="isCoverShow"
		class="vma-action-sheet action-sheet-box"
		@touchmove.stop.prevent="()=>{}">
		
		<view
			class="vma-action-sheet action-sheet-box__cover"
			@click="onCoverBoxClick('close')">
		</view>
		
		<view class="vma-action-sheet action-sheet-box__inner">
			<view class="menu-box plr-40 align-hor-bet">
				<view 
					class="menu-box__btn"
					@click="onCoverBoxClick('cancel')">
					取消
				</view>
				<view 
					class="menu-box__btn active"
					@click="onCoverBoxClick('confirm')">
					确定
				</view>
			</view>
			<view class="match-width">
				<slot></slot>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		name: 'vma-action-sheet',
		
		props: {
			isAllowCoverClickHide: {
				type: Boolean,
				default: true
			},
		},
		
		data() {
			return {
				isCoverShow: false
			}
		},
		
		methods: {
			// 遮罩点击
			onCoverBoxClick(action) {
				this.isCoverShow = false
				if (action === 'confirm') {
					this.$emit('onModalConfirm')
				} else if (action === 'cancel') {
					// this.onModalCancel()
					this.$emit('onModalCancel')
				} else if (action === 'close') {
					if (this.isAllowCoverClickHide) {	
						// this.onModalClose()
						this.$emit('onModalClose')
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
	
	.vma-action-sheet {
		
		&.action-sheet-box {
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
			}
			
			&__inner {
				width: 100%;
				position: absolute;
				left:0;
				bottom: 0;
				right: 0;
				z-index: 1100;
				
				.menu-box {
					width: 100%;
					height: 90upx;
					box-sizing: border-box;
					background-color: #FAFAFA;
					font-size: 32upx;
					color: #AAAAAA;
					font-weight: 500;
					
					&__btn {
						
						&.active {
							color: #4BA8FF;
						}
						
						&:active {
							opacity: 0.8;
						}
					}
				}
			}
		}
	}
</style>
