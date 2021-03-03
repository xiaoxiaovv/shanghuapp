<template>
	<view>
		<view class="lf-orderList text-lg match-width  ptb-10 align-hor-bet " v-for="(item,index) in cardList">
			<text @click="selectCard(item)">
				{{item.bankName}} ({{item.accNo | cardFilter}})
			</text>
			<!-- <view class="ly-font-color-main" @click="chanpayPreSign(item)">开通刷脸付</view> -->
		</view>
		<view class="lf-orderList text-lg match-width  ptb-10 align-hor-bet">			
			<text class="ly-font-color-main" @click="jumpManageCard">卡管理</text>
			<text class="ly-font-color-main" @click="jumpAddOrEditCard">+ 添加支付卡</text>
		</view>
	</view>
</template>

<script>
	// 后台接口
	import {
		bankCarkList,
		chanpayPreSign
	} from '../../../api/vueAPI.js';
	import{cardFilter, phoneFilter}from '../../../common/utils.js'
	export default {
		data() {
			return {
				cardList: [],
				fromPayChannel:''
			}
		},
		onReady() {

		},
		onShow() {
			this.bankCarkList()
		},
		onHide() {

		},
		onLoad(obj) {
			this.fromPayChannel = obj.fromPayChannel
		},
		watch: {

		},
		methods: {
			selectCard(item){
				let that = this;
				if(this.fromPayChannel==='20'&&item.chanpayStatus!==2){
					uni.showModal({
										content: `该卡尚未开通刷脸付功能，点击“确定”到《卡管理》列表进行开通`,
										success(res) {
											if (res.confirm) {
													// 跳转至卡管理列表
													that.jumpManageCard()
												
											} else {
					
											}
										}
									})
									rerurn
				}
				let pages = getCurrentPages();
				let currPage = pages[pages.length - 1]; //当前页面
				let prevPage = pages[pages.length - 2]; //上一个页面
				// console.log(prevPage)
				/* 修改上页面参数 */
				prevPage.id = item.id
				prevPage.$vm.id = item.id;
				prevPage.bankName = item.bankName
				prevPage.$vm.bankName = item.bankName;
				prevPage.accNo = item.accNo
				prevPage.$vm.accNo = item.accNo;
				/* 返回上页面 */
				uni.navigateBack();
			},
			bankCarkList() {
				let merchantId = uni.getStorageSync('merchantId')
				// console.log('merchantId==================', merchantId)
				bankCarkList(merchantId).then(data => {
					this.cardList = data.obj;
				})
			},
			jumpAddOrEditCard() {
				uni.navigateTo({
					url: '/pages/home/quickPay/addOrEditCard'
				})
			},
			jumpManageCard() {
				uni.navigateTo({
					url: '/pages/home/quickPay/manageCard'
				})

			}
		},
		filters:{
			cardFilter,
			phoneFilter
		}
	}
</script>

<style>
	.mb--10{
		margin-bottom: -10upx;
	}
	.lf-orderList {
		width: 100%;
		height: 120upx;
		padding: 0 30upx;
		/* display: flex;
		justify-content: space-between;
		align-items: center; */
		border-top: 1upx solid #EFEFEF;
	}

	.edit {
		margin-left: 80upx;
	}
</style>
