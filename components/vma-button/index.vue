<template>
	<view 
		class="vma-button btn-box align-center"
		@click="onBtnClick">
		{{content}}
	</view>
</template>

<script>
	export default {
		name: 'vma-button',
		
		props: {
			content: {
				type: String,
				default: ''
			}
		},
		
		methods: {
			onBtnClick() {
				this.$emit('onBtnClick')
			}
		}
	}
</script>

<style lang="scss">
	.vma-button {
			
		&.btn-box {
			width: 100%;
			height: 100%;
			background-color: #4BA8FF;
			color: #FFF;
			font-size: 36upx;
			font-weight: bold;
			letter-spacing: 10upx;
			border-radius: 10upx;
			
			&:active {
				opacity: 0.8;
			}
		}
	}
</style>
