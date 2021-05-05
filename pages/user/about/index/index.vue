<template>
	<view>
		<view class="lf-logo">
			<view>
				<image src="../../../../static/logo/android/72_72.png"></image>
				<text class="text-blue uni-text-md">版本号：{{edition}}</text>
			</view>
		</view>
		<view class="lf-list">
			<view @click="">
				<text class="uni-text-md">检测更新</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="margin-right-10 meat uni-text-md">{{edition}}</text>
					<image class="meat" src="../../../../static/home/icon_go_arrow.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {uniList } from '@dcloudio/uni-ui'
	import { checkApp, VERSION, compareAppVersion } from '../../../../api/updateApi.js'
	import { getPackageName } from '../../../../common/appcommon.js'
	export default {
		components: { uniList  },
		data() {
			return {
				edition: VERSION
			}
		},
		onLoad(obj){
			if(obj.from&&obj.from==='webView'){
				uni.switchTab({
					url: '/pages/tabBar/user/user'
				})
			}
		},
		methods: {
			checkUpdate() {
				// console.log('检查更新') 
				uni.showLoading()
				let platform = uni.getSystemInfoSync().platform
				let type = platform === 'android' ? 'android' : (platform === 'ios' ? 'ios' : '')
				if (type === 'android' || type === 'ios') {
					checkApp().then(res => {
						// console.log('测试', res)
						if (res.status === 200) {
							let newVersion = res.data.versionShort
							let updateUrl = res.data.update_url
							let changelog = (!!res.data.changelog) ? res.data.changelog : '有新版本可用'
							// console.log(77777, res.data.update_url)
							// console.log(8888, plus.runtime)
							
							if (compareAppVersion(newVersion)) {
								uni.showModal({
									title: '更新提示',
									content: changelog,
									showCancel: true,
									confirmText: '更新',
									success: (res) => {
										if (res.confirm) {
											plus.runtime.openURL(updateUrl, () => {
												uni.showToast({
													title: '获取新版本失败',
													icon: 'none',
													duration: 3000
												})
											})
										}
									}
								})
							} else {
								uni.showToast({
									title: '当前已是最新版本',
									icon: 'none',
									duration: 3000
								})
							}
							uni.hideLoading()
						} else {
							uni.showToast({
								title: res.statusText,
								icon: 'none',
								duration: 3000,
								success: () => {
									uni.hideLoading()
								}
							})
						}
					}).catch(err => {
						console.log(err)
						uni.showToast({
							title: '更新失败',
							icon: 'none',
							duration: 3000,
							success: () => {
								uni.hideLoading()
							}
						})
					})
				} else {
					uni.showToast({
						title: '非android/ios平台，暂不支持更新',
						icon: 'none',
						duration: 3000,
						success: () => {
							uni.hideLoading()
						}
					})
				}
			}
		}
	}
</script>

<style>
	.margin-right-10{
		margin-right: 10upx;
	}
	.lf-logo{
		width: 750upx;
		height: 350upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-logo > view{
		height: 230upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}
	.lf-logo image{
		width: 160upx;
		height: 160upx;
	}
	.prod-height{
		height: 30upx;
	}
	.lf-list{
		width: 720upx;
		padding-left: 30upx;
		background-color: #FFF;
		border-top: 1upx solid #F1F1F3;
		border-bottom: 1upx solid #F1F1F3;
	}
	.lf-list > view{
		width: 690upx;
		height: 100upx;
		padding-right: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-list > view image{
		width: 20upx;
		height: 30upx;
	}
</style>
