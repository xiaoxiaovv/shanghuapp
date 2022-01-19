<template>
	<view class="if-page">
		<view class="tips-boxs">保存到相册后使用微信进行扫描认证~</view>
		<view class="flex justify-center align-center" style="margin-top: 30px;">
			<view class="lf-code-box align-center">
				<text style="display: block;margin-right: 20rpx;"><text>通道认证：{{ewmobj.scanPayChannelName}}</text></text>
				<view 
					id="canvas"
					class="qrimg align-center">
					<canvas canvas-id="myCanvas" />
				</view>
			</view>
			<view class="btn-btn-boxs" style="margin-top: 30rpx;">
				<vma-button
					content="保存到相册"
					@onBtnClick="saveEwm(1)"
				/>
			</view>
		</view>
		<view class="flex justify-center align-center" style="margin-top: 30px;" v-if="ewmobj.scanPayChannelName !== ewmobj.webPayChannelName">
			<view class="lf-code-box align-center">
				<text style="display: block;margin-right: 20rpx;"><text>通道认证：{{ewmobj.webPayChannelName}}</text></text>
				<view 
					id="canvas"
					class="qrimg align-center">
					<canvas canvas-id="myCanvas2" />
				</view>
			</view>
			<view class="btn-btn-boxs" style="margin-top: 30rpx;">
				<vma-button
					content="保存到相册"
					@onBtnClick="saveEwm(2)"
				/>
			</view>
		</view>
	</view>
</template>

<script>
	import VmaButton from "@/components/vma-button/index.vue"
	import { getwxEwm } from '../../../../api/vueAPI.js'
	import Qrcode from '../../../../components/qrcode-master/js/qrcode/qrcode.js'
	export default {
		components: { VmaButton },
		data() {
			return {
				ewmobj: '',
				scanPayChannelUrl: '',
				webPayChannelUrl: '',
				qrcode: null,
			};
		},
		onReady() {
			
		},
		onLoad() {
			let systemInfo = uni.getSystemInfoSync()
			let { screenWidth } = systemInfo
			let size = screenWidth / 375 * 200
			// console.log('systemInfo', systemInfo)
			// 二维码插件
			this.qrcode = new Qrcode({
				'level': 'H',
				'size': size
			})
			this.getwxEwm()
		},
		onShow() {
			
		},
		methods:{
			getwxEwm() {
				let customerInfo = uni.getStorageSync('customerCount')
				let serviceId = customerInfo.serviceId
				const params = {
					merchantId: uni.getStorageSync('merchantId'),
					serviceId: serviceId
				}
				getwxEwm(params).then(res => {
					this.ewmobj = res.obj
					this.scanPayChannelUrl = res.obj.scanPayChannelUrl
					this.webPayChannelUrl = res.obj.webPayChannelUrl
					this.qrcode.draw('myCanvas', this.scanPayChannelUrl)
					this.qrcode.draw('myCanvas2', this.webPayChannelUrl)
				})
			},
			saveEwm (type) {
				const canvasId = type == 1 ? 'myCanvas' : 'myCanvas2'
				uni.canvasToTempFilePath({
				  fileType: 'jpg',
				  canvasId: canvasId,
				  success: function(res) {
				    // 在H5平台下，tempFilePath 为 base64
				    console.log(res.tempFilePath)
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function (res) {
							console.log(res);
							uni.showToast({
								icon: 'success',
								title: '保存到相册成功~'
							})
						}
					})
				  } 
				})
			}
		}
	}
</script>

<style lang="scss">
	.tips-boxs {
		text-align: center;
		padding: 20upx 0;
		color: #999999;
	}
	.btn-btn-boxs {
		display: inline-block;
		margin-left: 80rpx;
	}
	.vma-button.btn-box {
		padding: 8px;
		font-weight: normal;
		font-size: 14px;
	}
	.lf-code-box{
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
</style>
