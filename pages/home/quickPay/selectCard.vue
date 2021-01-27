<template>
	<view>
		<view class="lf-orderList text-lg match-width align-left ptb-10 align-hor-bet" v-for="(item,index) in cardList">
			<text @click="selectCard(item)">
				{{item.bankName}} ({{item.accNo}})
			</text>
		</view>
		<view class="lf-orderList text-lg match-width align-left ptb-10 align-hor-bet">
			
			<text class="ly-font-color-main" @click="jumpManageCard">卡管理</text>
			<text class="ly-font-color-main" @click="jumpAddOrEditCard">+ 添加支付卡</text>
		</view>
	</view>
</template>

<script>
	// 后台接口
	import {
		bankCarkList
	} from '../../../api/vueAPI.js'
	export default {
		data() {
			return {
				cardList: []
			}
		},
		onReady() {

		},
		onShow() {
			this.bankCarkList()
		},
		onHide() {

		},
		onLoad() {
			
		},
		watch: {

		},
		methods: {
			selectCard(item){
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
			jumpManageCard(item) {
				uni.navigateTo({
					url: '/pages/home/quickPay/manageCard'
				})

			}
		}
	}
</script>

<style>
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
