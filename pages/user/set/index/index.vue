<template>
	<view>
		<view class="lf-mat"></view>
		<view class="lf-personal bg-white" @click="jumpUserDetails">
			<view>
				<image 
					class="margin-right-20" 
					src="../../../../static/tabBar/icon_me.png"/>
				<view class="lf-personal-text">
					<text class="text-lg">{{merchantName}}</text>
					<text class="text-sm text-grey">{{name}}</text>
				</view>
			</view>
			<text class="icon-right text-grey icon-lg fs-40"></text>
		</view>
		<view class="lf-mat ly-bg-color-main"></view>
		<uni-list>
			<view class="lf-list">
				<view
					class='match-width'
					@click="jumpMessageNotification">
					<view>
						<view class="prod prod-height"></view>
						<image class="meat" src="/static/user/icon_message_bg.png"></image>
						<text class="text-lg">消息通知</text>
					</view>
					<image class="meat" src="../../../../static/home/icon_go_arrow.png"></image>
				</view>
			</view>
			<uni-list-item 
				class='lf-list-x'
				title="键盘音效" 
				thumb="/static/user/icon_yinxiao.png" 
				show-switch="true" 
				show-arrow="false" 
				:switch-checked="iskeyboardVoice" 
				@switchChange="keyboardVoice">
			</uni-list-item>
			<view class="lf-list">
				<view
					class='match-width'
					@click="jumpChangePassword">
					<view>
						<view class="prod prod-height"></view>
						<image class="meat" src="/static/user/icon_xiugaimima.png"></image>
						<text class="text-lg">修改密码</text>
					</view>
					<image class="meat" src="../../../../static/home/icon_go_arrow.png"></image>
				</view>
			</view>
		</uni-list>
		<view class="lf-mat"></view>
		<view class="lf-logout">
			<view @click="doLogout">
				<text class="text-lg text-white">退出登录</text>
			</view>
		</view>
		
		<!-- 弹框 -->
		<uni-popup ref="popup" type="center" :show="isPopupShow">
			<view class="dialog align-ver-bet">
				<view class="title match-width box align-center">提示</view>
				<view class="box align-center">是否退出登录？</view>
				<view class="match-width align-hor-bet box plr-10">
					<view class="btn align-center" @click="closePopup">取消</view>
					<view class="btn align-center active" @click="onConfirm">确定</view>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import { uniList, uniListItem } from '@dcloudio/uni-ui'
	import { getAccountInfo} from '../../../../api/vueAPI.js'
	import neilModal from '@/components/neil-modal/neil-modal.vue'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {uniList, uniListItem, neilModal, uniPopup },
		data() {
			return {
				merchantName: '',
				name: '',
				iskeyboardVoice: false,
				show: false,
				isPopupShow: false
			};
		},
		onShow() {
			getAccountInfo().then(res => {
				// console.log(res);
				this.merchantName = res.obj.merchantName
				this.name = res.obj.name
			}).catch(err => {
				console.log(err)
			})
			let iskeyboardVoice = uni.getStorageSync("setKeyboardVoice")
			if(iskeyboardVoice === 1){
				this.iskeyboardVoice = true;
			}else{
				this.iskeyboardVoice = false;
			}
		},
		methods:{
			/* 跳转消息推送页面 */
			jumpMessageNotification() {
				// uni.showToast({
				// 	title:"敬请期待",
				// 	icon:"none"
				// })
				// return
				uni.navigateTo({
					url: '/pages/user/set/messageNotification/messageNotification'
				})
			},
			/* 键盘音效 */
			keyboardVoice(check){
				if(check.value === true){
					uni.setStorageSync("setKeyboardVoice",1)
				}else{
					uni.setStorageSync("setKeyboardVoice",2)
				}
			},
			/* 跳转修改密码页面 */
			jumpChangePassword() {
				uni.navigateTo({
					url: '/pages/user/set/changePassword/changePassword'
				})
			},
			/* 退出登录 */
			doLogout() {
				this.openPopup()
				// uni.showModal({
				// 	title: '提示',
				// 	content: '是否确认退出？',
				// 	success: function (res) {
				// 		if (res.confirm) {
				// 			uni.reLaunch({
				// 				url: '/pages/login/index/index',
				// 				success() {
				// 					uni.removeStorageSync('token');
				// 					uni.removeStorageSync('userId');
				// 					uni.removeStorageSync('userType');
				// 					uni.removeStorageSync('beginTime');
				// 					uni.setStorageSync('remember', true)
				// 					uni.setStorageSync('isLogin', true)
				// 				}
				// 			})
				// 		} else if (res.cancel) {
				// 			// console.log('用户点击取消')
				// 		}
				// 	}
				// })
			},
			// 跳转用户详情
			jumpUserDetails() {
				// uni.navigateTo({
				// 	url: '/pages/user/userDetail/userDetail'
				// })
				uni.showToast({
					title: '敬请期待',
					icon: 'none'
				})
			},
			closeModal() {
				this.show = false
			},
			openModal() {
				this.show = true
			},
			openPopup(){
				// console.log('测试', this, this.$refs, this.$refs.po)
				this.isPopupShow = true
			},
			closePopup(){
				this.isPopupShow = false
			},
			onConfirm () {
				uni.reLaunch({
					url: '/pages/login/index/index',
					success() {
						uni.removeStorageSync('token')
						uni.removeStorageSync('userId')
						uni.removeStorageSync('userType')
						uni.removeStorageSync('beginTime')
						uni.setStorageSync('remember', true)
						uni.setStorageSync('isLogin', true)
						// uni.setStorageSync('setVoice', uni.getStorageSync('setVoice'))
						// uni.setStorageSync('setKeyboardVoice', uni.getStorageSync('setKeyboardVoice'))
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	
	body{
		background-color: #F8F9FD;
	}
	.bg-white{
		background-color: #FFF;
	}
	.icon-lg{
		font-size: 48upx;
	}
	.margin-right-20{
		margin-right: 20upx;
	}
	.lf-mat{
		width: 750upx;
		height: 40upx;
	}
	.lf-personal{
		width: 750upx;
		height: 220upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30upx;
		background: linear-gradient(-50deg,rgba(50,101,255,1) 0%,rgba(69,178,255,1) 100%);
		color: #FFF;
	}
	.lf-personal > view{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.lf-personal image{
		width: 130upx;
		height: 130upx;
		border-radius: 50%;
	}
	.lf-personal-text{
		height: 100upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
	}
	.lf-logout{
		width: 750upx;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-logout > view{
		width: 650upx;
		height: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #4BA8FF;
		border-radius: 50upx;
	}
	.lf-list{
		// width: 720upx;
		width: 100%;
		// padding-left: 40upx;
		background-color: #FFF;
		border-bottom: 1upx solid #F0F0F0;
		color: #666666;
		font-size: 32upx;
		font-weight: 500;
		box-sizing: border-box;
	}
	.lf-list-x {
		width: 100%;
		height: 120upx;
		box-sizing: border-box;
		border-bottom: 1upx solid transparent;
	}
	.lf-list > view{
		width: 100%;
		height: 120upx;
		padding: 0 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
	}
	.lf-list > view > image{
		width: 20upx;
		height: 30upx;
	}
	.lf-list > view > view > image{
		width: 50upx;
		height: 50upx;
		margin-right: 20upx;
	}
	.prod-height{
		height: 100upx;
	}
	.text-white {
		color: #FFF;
	}
	.text-grey {
		color: #FFF;
	}
	.dialog {
		width: 500upx;
		height: 380upx;
		background-color: #fff;
		box-sizing: border-box;
		border-radius: 20upx;
		padding: 40upx;
		font-family: 400;
		font-size: 32upx;
		color: #666;
		
		.title {
			font-size: 32upx;
			font-family: bold;
			// border-bottom: 1upx solid #F0F0F0;
		}
		
		.btn {
			width: 140upx;
			height: 80upx;
			background-color: #fff;
			border: 1upx solid #4BA8FF;
			color: #4BA8FF;
			border-radius: 10upx;
			font-size: 28upx;
			
			&.active {
				background-color: #4BA8FF;
				border: 1upx solid #4BA8FF;
				color: #fff;
			}
			
			&:active {
				opacity: 0.8;
			}
		}
	}
</style>
