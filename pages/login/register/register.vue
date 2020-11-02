<template>
	<view class="padding ">
			<view class="lf-from-content mt-20">
				<view class="relative">
					<view class="lf-btn-cover"></view>
					<image src="/static/login/icon_phone_grey.png"></image>
					<input type="text" class="lf-no-input text-lg" placeholder="请使用您的手机号注册"  v-model="phone"/>
				</view>
			</view>
			<view class="lf-btn-next"  @click="register">
				<text>确定</text>
			</view>
			<view class="lf-btn-next mt10"  @click="back">
				<text>返回</text>
			</view>
	</view>
</template>

<script>
	import { register} from '../../../api/vueAPI.js'
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
			/* phone(newValue, oldValue) {
				let stars = '****'
				this.phoneFilters = this.phone.replace( this.phone.slice(3,8), stars);
			}, */
		},
		onLoad(option) {
			
		},
		methods: {
			register(){
				uni.showLoading()
				register(this.phone).then(res => {
					console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
						// console.log(res)
						uni.hideLoading()
						console.log('modal')
						uni.showModal({
							content:"注册中……服务专员将会在24小时内联系您",
							icon:"success",
							complete() {
								uni.navigateBack()
							}
						})
						console.log('modal=================')
					}).catch(err => {
						console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
						uni.hideLoading()
						// console.log(err)
					})
			},
			back(){
				uni.navigateBack()
			
		}
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
	.mt-10{
		display: flex;
		margin-top: 10upx;
	}
	.mt-20{
		display: flex;
		margin-top: 20upx;
	}
	/* .lf-btn-login:hover{
		background-image: url('../../../static/login/ok_btn_bg_press.png');
	} */
</style>
