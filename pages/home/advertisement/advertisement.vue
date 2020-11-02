<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	
export default {
	data() {
		return {
			url:'',
			id:'',
		}
	},
	onLoad(options) {
		// console.log(options)
		if (options && options.url) {
			this.url = options.url
		}
	},
	methods: {
		
	}
}
</script>

<style>

</style>
