<template>
	<view class="padding">
		<view class="flex justify-between align-center lf-img-size">
			<view class="flex flex-direction align-center">
				<image class="md img-margin-bottom" src="../../../static/login/icon_one.png"></image>
				<text class="text-grey">账号验证</text>
			</view>
			<view :class="isWhatDotTwo" class="xxs"></view>
			<view :class="isWhatDotTwo" class="xs"></view>
			<view :class="isWhatDotTwo" class="sm"></view>
			<view class="flex flex-direction align-center">
				<image class="md img-margin-bottom" v-if="showYelloTwo" src="../../../static/login/icon_two.png"></image>
				<image class="md img-margin-bottom" v-else src="../../../static/login/icon_pay_sign_two_grey.png"></image>
				<text class="text-grey">短信验证</text>
			</view>
			<view :class="isWhatDotThree" class="xxs"></view>
			<view :class="isWhatDotThree" class="xs"></view>
			<view :class="isWhatDotThree" class="sm"></view>
			<view class="flex flex-direction align-center">
				<image class="md img-margin-bottom" v-if="showYelloThree" src="../../../static/login/icon_three.png"></image>
				<image class="md img-margin-bottom" v-else src="../../../static/login/icon_gray_three.png"></image>
				<text class="text-grey">重置密码</text>
			</view>
		</view>
		<view class="lf-mat"></view>
		<!-- 1.账号验证 -->
		<view v-if="!showYelloTwo && !showYelloThree">
			<view class="lf-from-content">
				<view class="lf-border-bottom-line">
					<image src="/static/login/icon_account_black.png"></image>
					<input type="text" placeholder="请输入账号" v-model="username"/>
				</view>
			</view>
			<view class="lf-btn-next" @click="nextTwo">
				<text>下一步</text>
			</view>
		</view>
		<!-- 2.短信验证 -->
		<view v-if="showYelloTwo && !showYelloThree">
			<view class="lf-from-content">
				<view class="relative">
					<view class="lf-btn-cover"></view>
					<image src="/static/login/icon_phone_grey.png"></image>
					<input type="text" class="lf-no-input text-lg" placeholder="请输入绑定手机号" disabled v-model="phoneFilters"/>
				</view>
				<view class="lf-border-bottom-line">
					<image src="/static/login/icon_verification_code.png"></image>
					<input type="number" placeholder="验证码" v-model="code" maxlength="6"/>
					<text class="shadow text-sm text-right lf-btn-code" v-if="isCode" @click="getCode">获取验证码</text>
					<text class="shadow text-sm text-right lf-btn-code" v-else>{{codeTime}}s后可获取</text>
				</view>
			</view>
			<view class="lf-btn-next" v-if="code" @click="nextThree">
				<text>下一步</text>
			</view>
			<view class="lf-btn-next lf-btn-next-no" v-else>
				<text>下一步</text>
			</view>
		</view>
		<!-- 3.重置密码 -->
		<view v-if="showYelloTwo && showYelloThree">
			<view class="lf-from-content">
				<view class="lf-border-bottom-line">
					<image src="/static/login/icon_xiugaimima.png"></image>
					<input type="text" placeholder="请输入新密码" v-model="newPassword"/>
				</view>
				<view class="lf-border-bottom-line">
					<image src="/static/login/icon_xiugaimima.png"></image>
					<input type="text" placeholder="请再次输入新密码" v-model="newPasswordAgain"/>
				</view>
			</view>
			<view class="lf-btn-next" @click="resetStaffPassword">
				<text>重置密码</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { getPhoneFindByUsername, sendSms, verifyCode, resetStaffPassword} from '../../../api/vueAPI.js'
	export default {
		data() {
			return {
				// showYellowDotTwo: false,	//是否显示为黄色点 流程点2
				showYelloTwo: false,		//是否显示黄色流程2
				isWhatDotTwo: {
					'dot-up-move': true,
					'lf-no-dot': true, 
					'lf-yellow-dot': false
				},
				// showYellowDotThree: false,	//是否显示为黄色点 流程点3
				showYelloThree: false,	//是否显示黄色流程3
				isWhatDotThree: {
					'dot-up-move': true,
					'lf-no-dot': true, 
					'lf-yellow-dot': false
				},
				isCode: true,	//是否可以进行获取验证码
				codeTime: 0,
				username: '',	//账号
				phone:'',	//手机号
				phoneFilters: '',	//展示用手机号
				code:'',	//手机验证码
				newPassword: '',	//新密码
				newPasswordAgain: '',	//确认密码
			};
		},
		watch: {
			showYelloTwo(newValue, oldValue) {
				if(newValue === true){
					this.isWhatDotTwo['lf-no-dot'] = false;
					this.isWhatDotTwo['lf-yellow-dot'] = true;
				}
			},
			showYelloThree(newValue, oldValue) {
				if(newValue === true){
					this.isWhatDotThree['lf-no-dot'] = false;
					this.isWhatDotThree['lf-yellow-dot'] = true;
				}
			},
			phone(newValue, oldValue) {
				let stars = '****'
				this.phoneFilters = this.phone.replace( this.phone.slice(3,8), stars);
			},
		},
		onLoad(option) {
			console.log(option.username)
			this.username = option.username;
		},
		methods: {
			nextTwo() {
				console.log("跳2")
				uni.showLoading()
				getPhoneFindByUsername(this.username).then(res => {
					console.log(res)
					uni.hideLoading()
					if(!res.obj){
						uni.showModal({
							content:"您没有绑定手机号",
							showCancel: false,
							success(obj) {
								uni.reLaunch({
									url:"/pages/login/index/index"
								})
							}
						})
					}
					this.phone = res.obj;
					this.showYelloTwo = true;
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
				})
			},
			getCode() {
				console.log("得码")
				uni.showLoading()
				sendSms(this.phone).then(res => {
					console.log(res)
					/* 发送成功，进入60秒计时才可重新发送 */
					this.codeTime = 60;
					this.isCode = false;
					let clock = setInterval(() => {
						this.codeTime--;
						if(this.codeTime < 0){
							clearInterval(clock)
							this.isCode = true;
						}
					},1000)
					uni.hideLoading()
					uni.showModal({
						content:res.msg,
						showCancel: false
					})
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
				})
			},
			nextThree() {
				console.log("跳3")
				uni.showLoading()
				verifyCode(this.phone, this.code).then(res => {
					console.log(res)
					uni.hideLoading()
					this.showYelloThree = true;
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
				})
			},
			resetStaffPassword() {
				console.log("重置")
				if(this.newPassword.trim() === '' || this.newPasswordAgain.trim() === '' || this.newPassword.trim() !== this.newPasswordAgain.trim()){
					uni.showToast({
						title:"密码输入有误",
						icon:"none"
					})
					return
				}
				uni.showLoading()
				resetStaffPassword(this.username, this.newPassword).then(res => {
					console.log(res)
					uni.hideLoading()
					uni.showModal({
						content:res.msg,
						icon:"success",
						complete() {
							uni.navigateBack()
						}
					})
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
				})
			},
		},
	}
</script>

<style>
	.relative{
		position: relative;
	}
	.img-margin-bottom{
		margin-bottom: 20upx;
	}
	.dot-up-move{
		margin-top: -50upx;
	}
	.lf-mat{
		width: 750upx;
		height: 150upx;
	}
	.lf-img-size .xxs {
		width: 10upx;
		height: 10upx;
	}
	.lf-img-size .xs {
		width: 15upx;
		height: 15upx;
	}
	.lf-img-size .sm {
		width: 25upx;
		height: 25upx;
	}
	.lf-img-size .md {
		width: 80upx;
		height: 80upx;
	}
	.lf-no-dot{
		background-image: url(../../../static/login/no_dot.png);
		background-repeat: no-repeat;
		background-size: cover;
	}
	.lf-yellow-dot{
		background-image: url('../../../static/login/icon_yellow_dots.png');
		background-repeat: no-repeat;
		background-size: cover;
	}
	.lf-from-content{
		width: 100%;
	}
	.lf-from-content > view{
		width: 100%;
		height: 100upx;
		display: flex;
		align-items: center;
		margin-bottom: 40upx;
	}
	.lf-from-content > view > image{
		width: 45upx;
		height: 60upx;
		margin-right: 20upx;
	}
	.lf-from-content input{
		width: 400upx;
	}
	.lf-border-bottom-line{
		border-bottom: 1upx solid #FF9A2F;
	}
	.lf-btn-next{
		width: 100%;
		height: 90upx;
		border-radius: 100upx;
		background-image: url('../../../static/login/ok_btn_bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100upx; 
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFF;
		font-size: 38upx;
	}
	.lf-btn-next-no{
		background-image: url('../../../static/login/ok_btn_bg_press.png');
		background-repeat: no-repeat;
		background-size: 100% 100upx; 
	}
	.lf-btn-cover{
		width: 750upx;
		height: 100%;
		position: absolute;
		top: 0;
		left: -30upx;
		background-color: #D9D9D9;
	}
	.lf-no-input{
		color: #8F8F94;
	}
	.lf-btn-code{
		width: 150upx;
		background-color: #FF4500;
		padding: 15upx 30upx;
		color: #FFF;
		border-radius: 10upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	/* .lf-btn-login:hover{
		background-image: url('../../../static/login/ok_btn_bg_press.png');
	} */
</style>
