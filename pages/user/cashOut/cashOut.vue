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
					this.userInfo = uni.getStorageSync('userInfo');
					console.log('this.userInfo==============',this.userInfo)
					let url = 'http://192.168.0.102:8088';
					// let url = 'http://test.fx.mamipay.com/h5/'
					console.log('cashout=================', `${url}/#/commission`)
					let wv = plus.webview.create( `${url}/#/commission`,'cashOut', {
						top:'66px',
						// height:'92%',
					},{data:this.userInfo})
					let currentWebview = this.$mp.page.$getAppWebview()
					currentWebview.append(wv);
				
			
			
			// this.handlePostMessage("消息");  
		},
		onShow() {
		
		/* setTimeout(function(){
			console.log('2233==============================')
			currentWebview.evalJS(`window.handleMessage({data:${this.userInfo}})`)
		},1000) */
		// console.log('22222222222',Json.stringify(currentWebview.children()[0]))
		// currentWebview.children()[0].message = this.webViewMessage 
		/* var webviewId = "__uniapp__service_browser";  
		var style = {}  
		
		var params = {  
		    preload:{  
		        data:"jalon8888",  
		        timestamp: new Date().getTime(),  
		    }  
		}  
		var url = "http://test.fx.mamipay.com/h5/#/clientEdit"  
		plus.webview.create(url,webviewID,style,params) */
		},
		methods:{
			 handlePostMessage(res) {  
			                // this.$refs.webview.evalJs(`handleMessage(${res})`);  
			            }  
			/* webViewMessage(e){
				console.log('postmessage=============',e.detail.data.msg);
				if(e.detail.data.msg === 'close'){
					let currentWebview = this.$mp.page.$getAppWebview()
					currentWebview.children()[0].close()
				}				
			}, */
			
		}
	}
</script>

<style lang="scss">
	uni-page-body {
		width: 100%;
		height: 100%;
	}
</style>
