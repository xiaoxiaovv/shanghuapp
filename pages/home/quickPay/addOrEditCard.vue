<template>
	<view>
		<view>
			<uni-list>
				<view class="lf-from-block text-lg lf-top-line">
					<text>银行名称</text>
					<input type="text" placeholder="请输入银行名称" v-model="bankName">
				</view>
				<view class="lf-from-block text-lg lf-top-line">
					<text>开户人姓名</text>
					<input type="text" placeholder="请输入开户人姓名" v-model="realName">
				</view>
				<view class="lf-from-block text-lg lf-top-line">
					<text>银行卡号</text>
					<input type="text" placeholder="请输入银行卡号" v-model="accNo">
				</view>
				<view class="lf-from-block text-lg lf-top-line">
					<text>有效期</text>
					<input type="text" placeholder="四位有效期" v-model="validity">
				</view>
				<view class="lf-from-block text-lg lf-top-line">
					<text>安全校验码</text>
					<input type="text" placeholder="卡背面后三位" v-model="cvv2">
				</view>
				<view class="lf-from-block text-lg lf-top-line lf-bottom-line">
					<text>预留手机号</text>
					<input type="text" placeholder="请输入预留手机号" v-model="mobile">
				</view>
			</uni-list>
			<view class="lf-change-btn margin-top-xl">
				<view class="btn" @click="addOrEditBankCark">
					<text class="text-lg">提交</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {addOrEditBankCark} from '../../../api/vueAPI.js'
	export default {
		data(){
			return {
				editFlag:null,
				bankName:'',
				realName:'',
				accNo:'',
				validity:'',
				cvv2:'',
				mobile:'',
				idCard:''
			}
		},
		onReady(){
			
		},
		onShow(){
			
		},
		onHide(){
			
		},
		onLoad(obj){
			if(obj.editFlag&&obj.editFlag === '1'){
				
			}
			
		},
		watch:{
			
		},
		methods:{
			/**
			 * addOrEditBankCark  添加和编辑银行卡
			 * @param {Object} merchantId 商户ID
			 * @param {Object} realName 开户人名称
			 * @param {Object} idCard  身份证号
			 * @param {Object} accNo  支付卡号
			 * @param {Object} mobile  手机号
			 * @param {Object} cvv2 银行卡背面 后三位
			 * @param {Object} validity 有效期 格式： MMYY
			 */
			addOrEditBankCark(){
				/* let merchantId = uni.getStorageSync('merchantId')
				let realName = '张国军'
				let idCard = '130533198309185913'
				let accNo = '6226880385610282'
				let mobile = '15803196620'
				let cvv2 = '947'
				let validity = '0523' */
				
				addOrEditBankCark(this.merchantId, this.realName, this.accNo, this.mobile, this.cvv2, this.validity, this.bankName, this.idCard)
			}
		},
		}
</script>

<style>
	body{
		background-color: #F1F1F3;
	}
	.lf-top-line{
		border-top: 1upx solid #F1F1F3;
	}
	.lf-bottom-line{
		border-bottom: 1upx solid #F1F1F3;
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
