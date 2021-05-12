<template>
	<view>
		
		<view  class="lf-phone-frame padding">
			<input type="text" placeholder="输入支付宝账号" maxlength="30" v-model="alipayAccount">
		</view>
		<view  class="lf-phone-frame padding">
			<input type="text" placeholder="输入设备SN" maxlength="30" v-model="deviceSn">
			<view class="img-login" @click="submit">
				<text>查询</text>
			</view>
		</view>
		<view class="lf-mat"></view>
	</view>
</template>

<script>
	import {ruyiSubmit} from "../../../api/vueAPI.js"
	export default {
		data() {
			return {
				merchantNo: '',//支付宝商户号2088开头
				alipayAccount:'',//支付宝登录账号 邮箱/手机号
				deviceSn:'',//设备SN
			};
		},
		onShow() {
			// if(this.isMescroll){
			// 	this.goodsList = []// 在这里手动置空列表,可显示加载中的请求进度
			// 	this.mescroll.resetUpScroll()// 刷新列表数据
			// }else{
			// 	this.isMescroll = true
			// }
			// let nowLogin = uni.getStorageSync("loginDetail");
			// // console.log(222, nowLogin)
			// if(nowLogin){
			// 	this.findMember(nowLogin.phone)
			// 	this.isLogin = true;
			// }else{
			// 	this.isLogin = false;
			// }
		},
		watch:{
			// goodsList:{
			// 	handler(val, oldval){
					
			// 	},
			// 	deep:true
			// },
		},
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			// this.mescroll && this.mescroll.onReachBottom();
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			// this.mescroll && this.mescroll.onPageScroll(e);
		},
		onUnload() {
			// uni.removeStorageSync("loginDetail");
		},
		methods:{
			//查询代运营授权码
			submit() {
				if(!this.alipayAccount){
					uni.showToast({
						title: '请输入支付宝账号',
						icon: 'none'
					})
					return;
				}
				if(!this.deviceSn){
					uni.showToast({
						title: '请输入设备SN',
						icon: 'none'
					})
					return;
				}
				let customerInfo = uni.getStorageSync('customerCount')
				let serviceId = customerInfo.serviceId
				let merchantId = customerInfo.merchantId
				// console.log("测试点0")
				ruyiSubmit(serviceId,this.merchantNo,this.alipayAccount,merchantId,this.deviceSn).then((res) => {
					let wv = plus.webview.create( res.obj)
					let currentWebview = this.$mp.page.$getAppWebview()
					currentWebview.append(wv);
				}).catch(err => {
					console.log(err);
				})
			},
		}
	}
</script>

<style>
	body{
		background-color: #f1f1f3;
	}
	.text-weight{
		font-weight: 800;
	}
	.lf-phone-frame{
		border:1upx solid #F1F1F3;
		width: 750upx;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
	}
	.lf-phone-frame .img-login{
		width: 120upx;
		height: 60upx;
		color: #FFF;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #4BA8FF;
	}
	.lf-phone-login{
		border:1upx solid #F1F1F3;
		width: 750upx;
		height: 140upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
	}
	.lf-phone-login .one{
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
	}
	.lf-phone-login .one .text{
		height: 100upx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
	}
	.lf-phone-login .one > image{
		width: 100upx;
		height: 100upx;
		margin-right: 20upx;
	}
	.lf-phone-login .two{
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-start;
	}
	.lf-phone-login .two > view{
		width: 140upx;
		height: 50upx;
		margin-top: 10upx;
		border: 1px solid #4BA8FF;
		border-radius: 25upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lf-mat{
		height: 20upx;
	}
	.lf-card-box{
		width: 710upx;
		margin: 20upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: flex-start;
	}
	.lf-card{
		width: 345upx;
		height: 400upx;
		background-color: #FFF;
		border-radius: 15upx;
		margin-top: 20upx;
		position: relative;
	}
	.lf-card .up {
		height: 280upx;
	}
	.lf-card .up > image{
		width: 100%;
		height: 100%;
	}
	.lf-card .down {
		height: 120upx;
		padding: 20upx;
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		justify-content: space-between;
	}
	.lf-card .down > view{
		display: flex;
		justify-content: flex-start;
		align-content: center;
		margin-top: 10upx;
	}
	.lf-card .down > view > image{
		width: 40upx;
		height: 40upx;
		margin-right: 10upx;
	}
	.lf-not-integral{
		width: 160upx;
		height: 70upx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 100;
	}
	.btn {
		color: #4BA8FF !important;
		font-size: 24upx !important;
	}
</style>
