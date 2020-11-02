<template>
	<view>
		<view class="lf-mat ly-bg-color-main"></view>
		<!-- <uni-list>
			<uni-list-item title="接收消息推送" show-switch="true" show-arrow="false" :switch-checked="isPush" @switchChange="setPush"></uni-list-item>
		</uni-list> -->
		<!-- <view class="lf-mat ly-bg-color-main"></view> -->
		<uni-list>
			<uni-list-item title="收款到账语音播报" show-switch="true" show-arrow="false" :switch-checked="isVoice" @switchChange="setVoice"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import { uniList, uniListItem } from '@dcloudio/uni-ui'
	export default {
		components: {uniList, uniListItem },
		data() {
			return {
				isPush: false,
				isVoice: false,
			};
		},
		onShow(){
			this.isPush = uni.getStorageSync("setPush") || false
			this.isVoice = uni.getStorageSync("setVoice") || false
			// console.log('isVoice', this.isVoice)
		},
		methods: {
			/* 设置更改-接收消息推送 */
			setPush(e) {
				uni.setStorageSync("setPush", e.value)
			},
			/* 设置更改-收款到账语音播报 */
			setVoice(e) {
				uni.setStorageSync("setVoice", e.value)
			},
		},
	}
</script>

<style>
	body{
		background-color: #F1F1F3;
	}
	.lf-mat{
		width: 750upx;
		height: 40upx;
	}
</style>
