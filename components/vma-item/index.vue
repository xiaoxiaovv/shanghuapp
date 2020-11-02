<template>
	<view
		v-if="isShow"	
		class="match-width box plr-30 bg-white">
		<view
			:class="['vma-item item-box align-hor-bet', showBorderBottom ? '' : 'active']"
			@click="onItemClick">
			<view>
				{{title}}
			</view>
			<view class="arrow align-left">
				<slot></slot>
				<view 
					v-if="isArrowShow"
					class="icon iconfont icon-arrow-sl ml-10">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'vma-item',
		
		props: {
			title: {
				type: String,
				default: ''
			},
			index: {
				type: Number,
				default: -1
			},
			showBorderBottom: {
				type: Boolean,
				default: true
			},
			isShow: {
				type: Boolean,
				default: true
			},
			isArrowShow: {
				type: Boolean,
				default: true
			}
		},
		
		data() {
			return {}
		},
		
		methods: {
			onItemClick() {
				this.$emit('onItemClick', this.index)
			}
		}
	}
</script>

<style lang="scss">
	.vma-item {
		
		&.item-box {
			width: 100%;
			height: 120upx;
			background-color: #FFF;
			color: #333333;
			font-size: 30upx;
			font-weight: 500;
			box-sizing: border-box;
			border-bottom: 1upx solid #F0F0F0;
			
			.arrow {
				height: 100%;
				font-size: 28upx !important;
				color: #999999;
				
				.icon {
					font-size: 28upx !important;
					color: #999999;
				}
			}
			
			&.active {
				border-bottom: 1upx solid transparent;
			}
		}
	}
</style>
