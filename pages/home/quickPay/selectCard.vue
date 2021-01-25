<template>
	<view>
		<view class="lf-orderList text-lg match-width align-left ptb-10 align-hor-bet" v-for="(item,index) in cardList" >
			<text @click="selectCard">
				{{item.bankName}} ({{item.accNo}})
			</text>
			下方两行可以放到卡管理页面
			<!-- <text class="edit ly-font-color-main" @click="jumpEditCark">编辑</text>
			<text class="ly-font-color-main" @click="delCard">删除</text> -->
		</view>
		<view class="lf-orderList text-lg match-width align-left ptb-10 align-hor-bet" @click="jumpAddCard">
			<text class="ly-font-color-main">+ 添加支付卡</text>
			<text class="ly-font-color-main">卡管理</text>
		</view>
	</view>
</template>

<script>
	// 后台接口
	import {bankCarkList} from '../../../api/vueAPI.js'
	export default {
		data(){
			return {
				cardList:[]
			}
		},
		onReady(){
			
		},
		onShow(){
			
		},
		onHide(){
			
		},
		onLoad(){
			this.bankCarkList()
		},
		watch:{
			
		},
		methods:{
			bankCarkList(){
				let merchantId = uni.getStorageSync('merchantId')
				console.log('merchantId==================',merchantId)
				bankCarkList(merchantId).then(data=>{
					this.cardList = data.obj;
				})
			},
			jumpAddCard(){
				uni.navigateTo({
					url: '/pages/home/quickPay/addOrEditCard'
				})
			}
		},
		}
</script>

<style>
	.lf-orderList{
		width: 100%;
		height: 120upx;
		padding: 0 30upx;
		/* display: flex;
		justify-content: space-between;
		align-items: center; */
		border-top: 1upx solid #EFEFEF;
	}
	.edit{
		margin-left: 80upx;
	}
</style>
