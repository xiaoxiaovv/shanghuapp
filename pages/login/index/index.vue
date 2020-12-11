<template>
	<view class="lf-login-box pt-50" :style="{height: screenHeight + 'px'} ">
		<view class="lf-mat"></view>
		<!-- <view class="lf-logo">
			<image src="/static/icon_logo.png"></image>
		</view> -->
		<view class="yqf-logo">
			<image src="/static/logo/android/192_192.png"></image>
		</view>
		<view class="lf-from">
			<view class="lf-from-content">
				<view class="lf-border-bottom-line">
					<image src="/static/login/icon_account_black.png"></image>
					<input type="number" placeholder="请输入用户名" v-model="username" />
					<view class="lf-btn-empty" v-show="username" @click="emptyUsername"></view>
					<view class="lf-btn-empty__transparent" v-if="!username"></view>
				</view>
				<view class="lf-border-bottom-line">
					<image src="/static/login/icon_password_black.png"></image>
					<input type="password" placeholder="请输入密码" v-model="password" />
					<view class="lf-btn-empty" v-show="password" @click="emptyPassword"></view>
					<view class="lf-btn-empty__transparent" v-if="!password"></view>
				</view>
				<view class="psd match-width box ptb-50 align-hor-bet">
					<view 
						class="checkbox align-left"
						@click="changeRememberPassword">
						<view class="checkbox__inner align-center">
							<view 
								class="iconfont icon-gou" 
								v-if="isRememberPassword">
							</view>
						</view>
						<view class="ml-20">
							记住密码
						</view>
					</view>
					<view
						@click="register">
						注册
					</view>
					<view
						@click="pos">
						pos
					</view>
					<view 
						@click="forgetPassword">
						忘记密码
					</view>
					
					<!-- <navigator :url="'/pages/login/forgetPassword/forgetPassword?username=' + username"><text>忘记密码</text></navigator> -->
				</view>
			</view>
			<view 
				ref="login"
				class="lf-btn-login color-white" 
				type="default" 
				:loading="btnLoading" 
				:disabled="btnLoading"  
				@click="login">
				登录
			</view>
			<!-- <view class="lf-btn-login" @click="login">
				<text>登录</text>
			</view> -->
		</view>
		<view class="lf-mat"></view>
		<view class="lf-mat"></view>
		<view class="lf-mat"></view>
		<view class="match-width align-default">
			<view 
				class="comment-box match-width align-center"
				v-if="phone">
				联系电话：{{phone}}
			</view>
			<view 
				class="comment-box match-width align-center mt-10 mb-30 active"
				v-if="privacy || agreement">
				登录代表您同意<text @click="onShowPrivacy('privacy')" class="ml-10" v-if="privacy">隐私政策</text><text @click="onShowPrivacy('agreement')" class="ml-10" v-if="agreement">用户协议</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { login, getAccountInfo, getSiteInfo } from '@/api/vueAPI.js'
	import { LoginCache } from '../../../utils/cache/index.js'
	var posModule = uni.requireNativePlugin("DCloud-PosMoudle")
	export default {
		data() {
			return {
				screenHeight: '',	//屏幕高度
				isRememberPassword: false,	//记住密码
				username: '',	//账号 admin
				password: '',	//密码 123456
				btnLoading: false,
				remember: 'remember',
				phone: '',
				privacy: '',
				agreement: ''
			};
		},
		onReady() {
			console.log('我来到木木木木木木木木的世界x1', LoginCache)
			LoginCache.state = true
			console.log('我来到木木木木木木木木的世界x2', LoginCache)
			
			// 获取站点信息
			this.getSiteInfo()
			
			uni.getSystemInfo({
				success: (res) => {
					/* 屏幕高度设置 */
					this.screenHeight = res.screenHeight
					// console.log("屏幕高度："+res.screenHeight)
				}
			})
			/* 记住账号/密码 */
			let usernameCache = uni.getStorageSync('username')
			let passwordCache = uni.getStorageSync('password')
			let isRememberPassword = uni.getStorageSync('remember')
			let isLogin = uni.getStorageSync('isLogin')
			if(usernameCache){
				this.username = usernameCache
			}
			if(passwordCache){
				this.password = passwordCache
			}
			if (isRememberPassword) {
				this.isRememberPassword = isRememberPassword
			}
			// console.log('哪里来的账号', usernameCache, passwordCache)
			if (!isLogin && this.isRememberPassword && this.username && this.password) {
				this.login()
			}
			uni.setStorageSync('isLogin', false)
			
			// TODO
			// uni.setStorageSync('storeId', '1146454986568908800')
		},
		methods:{
			/* 清空账号 */
			emptyUsername() {
				this.username = ''
			},
			/* 清空密码 */
			emptyPassword() {
				this.password = ''
			},
			/* 记住密码点击事件 */
			changeRememberPassword () {
				this.isRememberPassword = !this.isRememberPassword
				uni.setStorageSync('remember', this.isRememberPassword)
			},
			/* 登录 */
			login() {
				/* 接口 */
				if( this.username.trim() === '' || this.password.trim() === '' ) {
					uni.showToast({
						title: '用户名或密码不能为空',
						icon: 'none'
					})
					return
				}
				console.log(this.username, typeof this.username)
				if (!/^\d{5,15}$/.test(this.username)) {
					return uni.showToast({
						title: '用户名仅限5-15位数字',
						icon: 'none'
					})
				}
				this.btnLoading = true;
				login( this.username.trim() , this.password.trim() ).then(res => {
					// console.log(777, res)
					// console.log(JSON.stringify(res.obj))
					/* 记住账户/密码 */
					if(this.isRememberPassword){
						uni.setStorageSync('password', this.password);
					}else{
						uni.removeStorageSync('password')
					}
					uni.setStorageSync('username', this.username);
					uni.setStorageSync('namename', res.obj.name);
					/* app中使用信息 */
					uni.setStorageSync('token', res.obj.token);
					uni.setStorageSync('userId', res.obj.userId);
					uni.setStorageSync('userType', res.obj.userType);
					uni.setStorageSync('storeId', res.obj.storeId || res.obj.store_id)
					uni.setStorageSync('merchantId', res.obj.merchantId)
					uni.setStorageSync('equipmentId', res.obj.equipmentId)
					// uni.switchTab({
					// 	url: '/pages/tabBar/home/home'
					// });
					// console.log("登录完成")
					this.btnLoading = false;
					// 缓存用户信息，客流统计用
					res && res.obj && uni.setStorageSync('customerCount', res.obj)
					getAccountInfo().then(res => {
						if (res && res.obj) {
							let merchantName = res.obj.merchantName || ''
							console.log('merchantName', merchantName)
							uni.setStorageSync('merchantName', merchantName)
							uni.switchTab({
								url: '/pages/tabBar/home/home'
							})
						}
					}).catch(err => {
						console.log(err)
					})
				}).catch((err) => {	
					console.log(err)
					this.btnLoading = false;
				})
			},
			// 忘记密码
			forgetPassword() {
				uni.showToast({
					title: '请联系管理员',
					icon: 'none'
				})
			},
			// 注册
			register(){
				uni.navigateTo({
					url: '/pages/login/register/register'
				})
			},
			// pos测试
			pos() {
				// testModule.gotoNativePage()
				posModule.toast()
				// testModule.pay('{"a":1}',this.posCallFn);
			},
			// 获取站点信息
			getSiteInfo() {
				getSiteInfo().then(res => {
					if (res && res.code === 200) {
						let { phone, privacy, agreement } = res.obj
						this.phone = phone || ''
						this.privacy = privacy || ''
						this.agreement = agreement || ''
					}	
				})
			},
			// 显示隐私政策
			onShowPrivacy(type) {
				if (type === 'privacy') {
					if (this.privacy) {
						uni.showModal({
							title: '隐私政策',
							content: this.privacy,
							showCancel: false
						})
					}
				} else if (type === 'agreement') {
					if (this.agreement) {
						uni.showModal({
							title: '用户协议',
							content: this.agreement,
							showCancel: false
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.icon-sm{
		width: 30upx;
		height: 30upx;
	}
	.prod-height{
		height: 30upx;
	}
	.margin-right-20{
		margin-right: 20upx;
	}
	.relative{
		position: relative;
	}
	
	.lf-login-box{
		width: 750upx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}
	.lf-logo image{
		height: 150upx;
		width: 400upx;
	}
	.yqf-logo image{
		width: 300upx;
		height: 300upx;
	}
	.lf-from{
		width: 670upx;
		height: 500upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.lf-from-content{
		width: 100%;
	}
	.lf-from-content > view{
		width: 100%;
		height: 100upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.lf-from-content > view > image{
		width: 50upx;
		height: 60upx;
	}
	.lf-from-content input{
		width: 500upx;
	}
	.lf-border-bottom-line{
		border-bottom: 1upx solid #4BA8FF;
	}
	.lf-btn-empty{
		width: 30upx;
		height: 30upx;
		background-image: url('../../../static/login/icon_cross.png');
		background-repeat: no-repeat;
		background-size: cover; 
	}
	.lf-btn-empty__transparent {
		width: 30upx;
		height: 30upx;
	}
	.lf-btn-login {
		width: 100%;
		height: 90upx;
		border-radius: 100upx;
		// background-image: url('../../../static/login/ok_btn_bg.png');
		// background-repeat: no-repeat;
		// background-size: 100% 100upx; 
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFF;
		font-size: 38upx;
		background-color: #4BA8FF;
		
		&:active {
			opacity: 0.8;
		}
	}
	.color-white {
		color: #FFF !important;
	}
	
	.psd {
		color: #333;
		font-size: 28upx !important;
		
		.checkbox {
			
			&__inner {
				width: 40upx;
				height: 40upx;
				box-sizing: border-box;
				border-radius: 8upx;
				border: 1upx solid #ddd;
			}
		}
	}
	
	.comment-box {
		box-sizing: border-box;
		font-size: 24upx;
		font-family: 500;
		color: #999;
		line-height: 1.8;
	
		text {
			color: #4BA8FF;
			text-decoration: underline;
			
			&.active {
				opacity: 0.8;
				color: #4BA8FF;
			}
		}
	}
</style>
