<template>
	<view>
		<view class="lf-head-box flex flex-direction justify-center align-center margin-top-xl" >
			<view class="lf-pic-head">
				<image class="imgs" :src="imgSrc"></image>
			</view>
			<text class="ly-font-size-36 ly-font-weight-bold  margin-top-lg">{{msg}}</text>
			
			
		</view>
		<view class="align-center">
			<view class="width mt-10">
				<text class="ly-font-size-20 align-center ly-font-color-9">金额： ¥ {{price}}</text>
				<text class="ly-font-size-20 align-center ly-font-color-9 mt-10" v-if="errTextShow">失败原因：{{failMsg}}</text>
				<text class="ly-font-size-20 align-center ly-font-color-9 mt-10" v-if="errTextShow">请至订单列表查看详情</text>
			</view>
		</view>
		<view class="lf-change-btn margin-top-xl">
			<view class="btn" @click="backPage">
				<text class="text-lg">{{backBtnMsg}}</text>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data(){
			return {
				resultFlag:'',
				msg:'',
				backBtnMsg:'',
				price:'',
				imgSrc:'',
				backUrl:'',
				failMsg:'',
				errTextShow:''
			}
		},
		onReady(){
			
		},
		onLoad(obj){
			this.price = obj.price;
			this.resultFlag = obj.resultFlag;
			this.failMsg = obj.failMsg
			this.init();
		},
		onShow(){
			
		},
		onHide(){
			
		},
		onReady(){
			
		},
		watch:{
			
		},
		 methods:{
			 init(){
				 if(this.resultFlag === '0'){
					 this.msg = '支付失败'
					 this.errTextShow = true;
					 this.backBtnMsg = '返回订单列表';
					 this.backUrl = '/pages/tabBar/order/order'
					 this.imgSrc = '../../../static/common/pay_fail_big.png'
				
				 }else if(this.resultFlag === '1'){
					 this.msg = '支付成功'
					 this.errTextShow = false;
					 this.backBtnMsg = '返回首页';
					 this.backUrl = '/pages/tabBar/home/home'
					 this.imgSrc = '../../../static/common/pay_success_big.png';
				 }
			 },
			 backPage(){
				 // console.log(22222222222222222)
				 uni.switchTab({
				 	url: this.backUrl
				 })
			 }
		 },
		 }
</script>

<style>
	.width{
		height: 300upx;
	}
	.lf-head-box{
		width: 750upx;
		height: 260upx;
		/* background-color: #007AFF; */
		background-repeat: no-repeat;
		background-size: cover;
		position: relative;
	}
	.lf-pic-head{
		position: relative;
		width: 160upx;
		height: 160upx;
		border-radius: 50%;
	}
	.lf-pic-head:before{
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.2);
	}
	.lf-pic-head .imgs {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 150upx;
		height: 150upx;
		background-color: #fff;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		overflow: hidden;
	}
	.lf-change-btn {
		width: 750upx;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.lf-change-btn .btn {
		width: 690upx;
		height: 80upx;
		border-radius: 40upx;
		color: #FFF;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #26c541;
	}
</style>
