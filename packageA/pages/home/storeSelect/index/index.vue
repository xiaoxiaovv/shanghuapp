<template>
	<view>
		<view class="lf-search-box">
			<view class="lf-search">
				<image src="../../../../../static/home/icon_search.png"></image>
				<input type="text" v-model="searchName" placeholder="门店名称"/>
			</view>
		</view>
		<view class="lf-block store" @click="selectAllStore" v-if="isNoChangeStaff">
			<text>全部</text>
		</view>
		<!-- <view v-for="(store,key) in storeList">
			<view class="lf-block address">
				<text class="text-grey">{{store.address}}</text>
			</view>
			<view class="lf-block store" v-for="(item,index) in store.storeList" @click="selectStore(item.storeId)">
				<text>{{item.storeName}}</text>
			</view>
		</view> -->
		<view class="lf-block address">
			<text class="text-grey">门店</text>
		</view>
		<view class="lf-block store" v-for="item in storeList" @click="selectStore(item)">
			<text>{{item.name}}</text>
		</view>
	</view>
</template>.

<script>
	import {getSelectStoreList} from '../../../../../api/vueAPI.js'
	export default {
		data() {
			return {
				storeList: [
					/* {
						address: '厦门',
						storeList: [
							{
								storeId: '1001',
								storeName: '茗香茶业厦门分店'
							},
							{
								storeId: '1002',
								storeName: '张昊天'
							}
						]
					},
					{
						address: '泉州',
						storeList: [
							{
								storeId: '2001',
								storeName: '凌云茶业泉州分店'
							}
						]
					} */
				],
				searchName: '',
				isNoChangeStaff: true,
				storeId: '',
				storeName: '',
				isHome: false
			}
		},
		onLoad(obj) {
			if(obj.status === 1){
				this.isNoChangeStaff = false
			}
			// console.log(666, obj)
			if (obj.ishome == 1) {
				this.isHome = true
			}
		},
		onShow() {
			this.getSelectStoreList();
		},
		watch:{
			searchName(val,oldVal){
				this.getSelectStoreList();
			}
		},
		methods:{
			/* 获取选择门店列表 */
			getSelectStoreList(){
				getSelectStoreList(this.searchName).then(res => {
					// console.log(res)
					this.storeList = res.obj
				}).catch(err => {
					console.log(err)
				})
			},
			/* 选择门店 */
			selectStore(storeDetails) {
				console.log('选择门店=====',storeDetails)
				this.storeId = storeDetails.value;
				this.storeName = storeDetails.name;
				// uni.setStorageSync('storeId', this.storeId)				
				uni.setStorageSync('nowStoreDetail',{
					storeId: this.storeId,
					storeName: this.storeName,
					status: true,
					isOpen:storeDetails.isOpen
				})
				let pages = getCurrentPages();
				let currPage = pages[pages.length - 1]; //当前页面
				let prevPage = pages[pages.length - 2]; //上一个页面
				// console.log(prevPage)
				/* 修改上页面参数 */
				prevPage.storeId = storeDetails.value;
				prevPage.storeName = storeDetails.name;
				prevPage.$vm.storeId = storeDetails.value;
				prevPage.$vm.storeName = storeDetails.name;
				/* 返回上页面 */
				uni.navigateBack();
			},
			/* 选择全部 */
			selectAllStore() {
				this.storeId = '';
				this.storeName = '';
				uni.setStorageSync('nowStoreDetail',{
					storeId: this.storeId,
					storeName: this.storeName,
					status: true
				})
				let pages = getCurrentPages();
				let currPage = pages[pages.length - 1]; //当前页面
				let prevPage = pages[pages.length - 2]; //上一个页面
				// console.log(prevPage)
				/* 修改上页面参数 */
				prevPage.storeId = '';
				prevPage.storeName = '';
				prevPage.$vm.storeId = '';
				prevPage.$vm.storeName = '';
				/* 返回上页面 */
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	.lf-search-box{
		width: 750upx;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #D8D8D8;
	}
	.lf-search{
		width: 710upx;
		height: 80upx;
		padding: 0 30upx;
		display: flex;
		align-items: center;
		background-color: #FFFFFF;
		border-radius: 10upx;
	}
	.lf-search image{
		width: 30upx;
		height: 30upx;
		margin-right: 30upx;
	}
	.lf-search input{
		font-size: 32upx;
		width: 600upx;
	}
	.lf-block{
		width: 750upx;
		padding: 0 40upx;
		display: flex;
		align-items: center;
	}
	.store{
		height: 100upx;
		background-color: #FFFFFF;
	}
	.store text{
		font-size: 36upx;
	}
	.address{
		height: 80upx;
		background-color: #F1F1F3;
	}
	.address text{
		font-size: 28upx;
	}
</style>
