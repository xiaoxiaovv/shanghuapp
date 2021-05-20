<template>
	<view>
		<!-- <web-view ref="webview"  src='http://192.168.0.102:8088/#/client_info_record' ></web-view> -->
			<!-- <web-view ref="webview"  src='http://test.fx.mamipay.com/h5/#/client_info_record' ></web-view> -->
	</view>
</template>

<script>
	import {
		regeditAndIncomeStatus
	} from '../../../api/vueAPI.js'
	export default {
		data() {
			return {}
		},
		watch: {
			
		},
		onLoad() {
			regeditAndIncomeStatus().then(res=>{
				
					this.userInfo = uni.getStorageSync('userInfo');
					console.log('this.userInfo==============',this.userInfo)
					let url = 'http://192.168.0.102:8088';
					// let url = 'http://test.fx.mamipay.com/h5/'
					let wv = plus.webview.create( `${url}/#/client_info_record`,'enterChannel', {
						top:'66px',
						// height:'92%',
					},{data:this.userInfo})
					let currentWebview = this.$mp.page.$getAppWebview()
					currentWebview.append(wv);
				
			})
			
		},
		onShow() {
		},
		methods:{
			
		}
	}
</script>

<style lang="scss">
	uni-page-body {
		width: 100%;
		height: 100%;
	}
</style>
