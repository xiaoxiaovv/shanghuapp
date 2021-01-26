<template>
	<view>
		<view class="lf-orderList text-lg match-width align-left ptb-10 align-hor-bet" v-for="(item,index) in cardList" >
			<text @click="selectCard">
				{{item.bankName}} ({{item.accNo}})
			</text>
			<text class="edit ly-font-color-main" @click="jumpAddOrEditCard(item.id)">编辑</text>
			<text class="ly-font-color-main" @click="delBankCard(item)">删除</text>
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
			this.bankCarkList()
		},
		onHide(){
			
		},
		onLoad(){
			
		},
		watch:{
			
		},
		methods:{
			bankCarkList(){
				let merchantId = uni.getStorageSync('merchantId')
				// console.log('merchantId==================',merchantId)
				bankCarkList(merchantId).then(data=>{
					this.cardList = data.obj;
				})
			},
			jumpAddOrEditCard(id){
				uni.navigateTo({
					url: '/pages/home/quickPay/addOrEditCard?id='+id
				})
			},
			delBankCard(item){
				uni.showModal({
					content: '确定删除该卡吗? '+item.bankName+' '+item.accNo,
					success(res) {
						if(res.confirm){
							delBankCard(item.id)
						}else{
							
						}
					}
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
