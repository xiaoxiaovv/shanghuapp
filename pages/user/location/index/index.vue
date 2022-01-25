<template>
	<view>
		<web-view :src='url + "/#/location?merId=" + merId'></web-view>
	</view>
</template>

<script>
	import URL from '../../../../common/flyioRequest.js'
	export default {				
		data() {
			return {
				merId: uni.getStorageSync('merchantId'),
				url: URL.config.baseURL
			}
		},
		onLoad() {
			
		},
		onShow() {
			
		},
		methods: {
			
		}
	}

</script>

<style lang='scss'>
.lf-change-btn{
	width: 750upx;
	height: 120upx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 100upx;
}
.lf-change-btn .btn{
	width: 690upx;
	height: 80upx;
	border-radius: 40upx;
	color: #FFF;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #4BA8FF;
}
.lo-box{
	padding: 60upx 40upx;
	font-size: 30upx;
}
</style>