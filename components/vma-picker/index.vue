<template>
	<view
		class='popup-view'
		v-if='isPickerShow'>
		<view 
			class='match-left-space'
			@click="onConfirm('close')">
			<!-- 遮罩关闭 -->
		</view>
		<view class='picker-view'>
			<view class='match-width box align-hor-bet plr-40'>
				<view 
					class='btn'
					@click="onConfirm('cancel')">
					取消
				</view>
				<view 
					class='btn active'
					@click="onConfirm('confirm')">
					确定
				</view>
			</view>
			<picker-view
				mode='selector'
				:value="pickerValue"
				@change='onPickerChangeInner'>
				<picker-view-column>
					<view
						class='match-width align-center'
						v-for='(item, index) in dataList'
						:key="index">
						{{item}}
					</view>
				</picker-view-column>
			</picker-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'vma-picker',
		
		props: {
			isPickerShow: {
				type: Boolean,
				default: false,
				required: true
			},
			dataList: {
				type: Array,
				required: true
			},
			pickerValue: {
				type: Array,
				required: true
			},
			onPickerClick: {
				type: Function,
				default: () => {},
				required: true
			},
			onPickerChange: {
				type: Function,
				default: () => {},
				required: true
			}
		},
		
		methods: {
			// picker confirm
			onConfirm(type) {
				let value = null
				if (type === 'confirm') {
					value = this.dataList[this.pickerValue[0]]
				}
				this.onPickerClick(false, value)
			},
			// picker change
			onPickerChangeInner(e) {
				let value = e.detail.value
				this.onPickerChange(value)
			}
		}
	}
</script>

<style lang='scss'>
	.popup-view {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 999;
		
		.picker-view {
			width: 100%;
			// height: 40upx;
			font-size: 32upx;
			color: #333;
			font-weight: 500;
			background-color: #FFF;
			box-sizing: border-box;
			padding: 24upx 0;
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			border-bottom: 1upx solid #F0F0F0;
			z-index: 1000;
			
			.btn {
				color: #999;
				height: 100%;
				
				&.active {
					color: #4BA8FF;
				}
				
				&:active {
					opacity: 0.8;
				}
			}
			
			picker-view {
				width: 100%;
				height: 500upx;
			}
		}
	}
</style>
