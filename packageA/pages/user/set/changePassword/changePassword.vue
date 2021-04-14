<template>
	<view>
		<view class="lf-mat"></view>
		<uni-list>
			<view class="lf-from-block text-lg lf-bottom-line">
				<text>原始密码</text>
				<input type="password" placeholder="请输入原始密码" v-model="oldPassword">
			</view>
			<view class="lf-from-block text-lg lf-bottom-line">
				<text>新密码</text>
				<input type="password" placeholder="请输入新密码" v-model="newPassword">
			</view>
			<view class="lf-from-block text-lg">
				<text>确认密码</text>
				<input type="password" placeholder="请再次输入确认" v-model="newAgainPassword">
			</view>
		</uni-list>
		<view class="lf-mat"></view>
		<view class="lf-mat"></view>
		<view class="lf-mat"></view>
		<view class="lf-change-btn">
			<view class="btn" @click="changePassword">
				<text class="text-lg">修改</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { uniList, uniListItem } from '@dcloudio/uni-ui'
	import { changePassword } from '../../../../../api/vueAPI.js'
	export default {
		components: {uniList, uniListItem },
		data() {
			return {
				oldPassword: '',
				newPassword: '',
				newAgainPassword: '',
				
			};
		},
		methods:{
			/* 修改密码 */
			changePassword() {
				if( this.oldPassword.trim() === '' || this.newPassword.trim() === '' || this.newAgainPassword.trim() === ''){
					// console.log("有空")
					// uni.showModal({
					// 	content: '不能有空',
					// 	showCancel: false
					// });
					uni.showToast({
						title: '不能有空',
						icon: 'none'
					})
					// uni.hideLoading();
					return
				}
				if(this.newPassword.trim() === this.newAgainPassword.trim() ){
					if( this.oldPassword.trim() === this.newPassword.trim() ){
						// console.log('密码没有变化，请重新输入')
						uni.showToast({
							title: '密码没有变化，请重新输入',
							icon: 'none',
						})
						return
					}
					changePassword(this.oldPassword.trim(), this.newPassword.trim() ).then(res => {
						// console.log('密码修改成功，请重新登录')
						// uni.removeStorageSync('token');
						uni.showToast({
							title: '修改成功',
							icon: 'none',
							duration: 1000,
							success: (res) => {
								
							}
						})
						setTimeout(() => {
							uni.removeStorageSync('onStoreId');
							uni.reLaunch({
							    url: '../../../login/index/index'
							})
							uni.setStorageSync('password', '')
							uni.setStorageSync('remember', false)
						}, 1001)
					}).catch(err => {
						// console.log("error!!")
						console.log(err)
					})
				}else{
					// uni.showModal({
					// 	content: '两次密码输入不同',
					// 	showCancel: false
					// });
					uni.showToast({
						title: '两次密码输入不同',
						icon: 'none',
					})
					// uni.hideLoading();
				}
			}
		}
	}
</script>

<style>
	body{
		background-color: #F1F1F3;
	}
	.lf-bottom-line{
		border-bottom: 1upx solid #F1F1F3;
	}
	.lf-mat{
		width: 750upx;
		height: 40upx;
	}
	.lf-from-block{
		width: 750upx;
		height: 100upx;
		padding: 0 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-from-block input{
		width: 70%;
	}
	.lf-change-btn{
		width: 750upx;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
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
</style>
