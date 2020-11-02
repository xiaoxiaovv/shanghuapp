<template>
	<view>
		<text class="">测试显示</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				codeResult: '',		//扫码信息
			};
		},
		created() {
			uni.scanCode({
				success: (res) => {
					this.codeResult = res.result
				}
			});
		},
	}
</script>

<style>

</style>
