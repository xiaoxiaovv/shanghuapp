<template>
	<view>
		<view class="lf-list" v-for="(item,index) in cardList" >
			<view class="match-width">
			<text @click="selectCard" class="line-height">
				{{item.bankName}}
				{{item.accNo}}
			</text>
			<view>
				<text class="edit ly-font-color-main" @click="jumpAddOrEditCard(item.id)">编辑</text>
				<text class="ly-font-color-main" @click="delBankCard(item)">删除</text>
			</view>
			</view>
			<!-- <text class="edit ly-font-color-main" @click="jumpAddOrEditCard(item.id)">编辑</text>
			<text class="ly-font-color-main del" @click="delBankCard(item)">删除</text> -->
		</view>
		
	</view>
</template>

<script>
	// 后台接口
	import {bankCarkList, delBankCard} from '../../../api/vueAPI.js'
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
				let that = this;
				uni.showModal({
					content: '确定删除该卡吗? '+item.bankName+' '+item.accNo,
					success(res) {
						if(res.confirm){
							delBankCard(item.id).then(res=>{
								// 更新列表
								that.bankCarkList()
							})
						}else{
							
						}
					}
				})
				
			}
		},
		}
</script>

<style>
	.lf-list{
		/* // width: 720upx; */
		width: 100%;
		/* // padding-left: 40upx; */
		background-color: #FFF;
		border-top: 1upx solid #F0F0F0;
		color: #666666;
		font-size: 32upx;
		font-weight: 500;
		box-sizing: border-box;
	}
	.lf-list:nth-last-child(1)
	{
	border-bottom: 1upx solid #F0F0F0;
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
	.edit{
		margin-right: 30upx;
	}
		
	.line-height{
		line-height: 44upx;
	}
	
</style>
