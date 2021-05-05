<template>
	<view class="group-share">
		<view class="align-center border-top-line">
			<image class="" src="../../static/group/share_title.png"></image> 
		</view>
		<view class="align-center  fs-38 color-999">
			<text>扫码刷卡任你选</text>
			<text class="ml-30">随时随地可收款</text>
		</view>
		<view class="lf-code-box align-center mt-50">
			<view 
				class="qrimg align-center"
				@click="onChangeScanCode">
				<canvas canvas-id="myCanvas" />
			</view>
		</view>
	</view>
</template>

<script>
	import {} from '../../api/vueAPI.js'
	import fly from '../../common/flyioRequest.js'
	import tkiQrcode from "tki-qrcode"
	import Qrcode from '../../components/qrcode-master/js/qrcode/qrcode.js'
	
	export default {
		components: {tkiQrcode},
		data() {
			return {
				
			};
		},
		onLoad() {
			let systemInfo = uni.getSystemInfoSync()
			let { screenWidth } = systemInfo
			let size = screenWidth / 375 * 200
			console.log('systemInfo,s================', systemInfo)
			// 二维码插件
			this.qrcode = new Qrcode({
				'level': 'L',
				'size': size
			})
			this.screenHeight = systemInfo['screenHeight'] - 100
			setTimeout(()=>{
				this.createBarCode()
			},100)
		/* 	let date = new Date();
			let y = date.getFullYear();
			let MM = date.getMonth() + 1;
			MM = MM < 10 ? ('0' + MM) : MM;
			let d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			let today =  y + '-' + MM + '-' + d;
			this.startTime = today;
			this.endTime = today;
			this.date = today.replace(/-/g,'/')
			this.cacheToday = today;
			
			_self = this;
			this.cWidth=uni.upx2px(680);
			this.cHeight=uni.upx2px(300);
			this.cWidthB=uni.upx2px(680);
			this.cHeightB=uni.upx2px(500);
			// this.getServerData();
			this.showAnalysis(); */
		},
        onReady() {
			
			// this.showAnalysis();
        },
		onShow(){
			
		},
		methods: {
			// 生成二维码
			createBarCode() {
				let userInfo = uni.getStorageSync('userInfo')
				// let val = `${fly.config.baseURL}/h5/register?inviteCode=${userInfo.inviteCode}&serviceId=${userInfo.serviceId}&inviterId =${userInfo.id }`
				let userInfoJsonStr = encodeURI(JSON.stringify(userInfo));
				// let val = `http://test.fx.mamipay.com/h5/#/register?userInfoJsonStr=${userInfoJsonStr}`
				let val = `http://192.168.0.102:8088/#/register?userInfoJsonStr=${userInfoJsonStr}`	
				// console.log(val)
				this.qrcode.draw('myCanvas', val)
			},
			
          
		},
	}
</script>

<style lang="scss">
	.group-share{
		.title-img-box{
			width: 100%;
	}
	.border-top-line{
		border-top: 1upx solid #f1f1f3;
	}
	.lf-code-box{
		// width: 670upx;
		// height: 580upx;
		// background-image: url('../../../static/home/code_bg.png');
		background-repeat: no-repeat;
		// background-size: 670upx 580upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-code-box > view{
		width: 400upx;
		height: 400upx;
		background-color: #FFF;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		
		canvas, .canvas {
			width: 100%;
			height: 100%;
		}
	}
		
	}
</style>