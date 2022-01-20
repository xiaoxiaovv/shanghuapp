<template>
	<view @click="closeCover">
		<view class="lf-nav">
			<view class="lf-cover" v-if="isCover"></view>
			<!-- <view class="lf-mat-100" style="height: 100upx;"></view> -->
			<!-- 筛选栏 -->
			<view class="lf-screen shadow">
				<view class="lf-cover" v-if="isCover"></view>
				<view class="view" @click.stop="showCityPopup">
					<text>{{city? city:'城市'}}</text><text class="icon-unfold"></text>
				</view>
				<view class="lf-line1"></view>
				<view class="view" @click.stop="screenStatus">
					<text>{{parseInt(status) === 1? '启用':parseInt(status) === 2? '注销':'状态'}}</text><text class="icon-unfold"></text>
					<view class="lf-popup" v-if="isShowPopupStatus">
						<view class="block" v-for="block in popupStatusList" @click="changeStatus(block.value)">
							<text class="text-sm">{{block.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="lf-mat"></view>
		<!-- #ifdef MP-WEIXIN || MP-ALIPAY -->
		<view style="display: flex;justify-content: space-between;padding: 10px 10px 10px 30px;background-color: #fff;">
			<input v-model="name" @input="nameInput" placeholder="搜索" style="width: 80%;border-radius: 20px;border: 1px solid #D9D9D9;height: 30px;padding: 0 10px;"/>
			<button type="primary" @click="addQRcode" size="mini">新增</button>
		</view>
		<!-- #endif -->
		<!-- 门店详情 -->
		<mescroll-uni @down="downCallback" @up="upCallback" :up="mescrollUp" @init="mescrollInit">
			<view v-for="(store, key) in storeList">
				<!-- 门店列表 -->
				<view class="lf-storeList" :class="{'border-bottom-line': key !== storeList.length}" @click="jumpStoreDetails(store.id)">
					<view class="flex justify-start align-center">
						<!-- {{photoIdFilters(store.photoId,key)}} -->
						<image class="margin-right-20" :src="store.imgSrc? store.imgSrc :'../../../../static/home/store_icon1.png'"></image>
						<view class="flex flex-direction justify-between height-100">
							<text class="text-lg">{{store.name}}</text>
							<text class="text-grey text-sm">门店编号：{{store.storeNo}}</text>
						</view>
					</view>
					<text class="text-lg">{{store.status | statusFilters}}</text>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import { baseURL, getStoreList } from '@/api/vueAPI.js'
	import MescrollUni from "mescroll-uni/mescroll-uni.vue";
	export default {
		components: {
			MescrollUni
		},
		data() {
			return {
				mescroll: null,
				mescrollUp: {
					empty: {
						icon: "../../../../static/order/no-data.png", //图标,默认null,支持网络图
						tip: "暂无相关数据~" //提示
					}
				},
				isMescroll: false,	//onShow刷新指示
				pageNumber: 1,		//查询页码
				pageSize: 10,		//每页显示数量
				name: '',
				status: '',
				storeList: [],
				imgSrcList:[],
				city: '',
				isCover: false,
				isShowPopupStatus: false,
				popupStatusList: [
					{
						name:'全部',
						value:''
					},
					{
						name:'启用',
						value:1
					},
					{
						name:'注销',
						value:2
					},
				],
			};
		},
		filters:{
			statusFilters(val) {
				return parseInt(val) === 1? '启用' : '注销'
			},
		},
		watch:{
			storeList: {
				handler(val, oldval){
					
				},
				deep:true
			}
		},
		onShow() {
			// getStoreList( this.pageNumber, this.pageSize, this.name, this.status).then((res) => {
			// 	console.log(res);
			// 	this.storeList = res.obj.content;
			// }).catch(err => {
			// 	console.log('error！！');
			// 	console.log(err);
			// })
			/* 刷新 */
			if(this.isMescroll){
				this.storeList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			}else{
				this.isMescroll = true
			}
		},
		/* 导航右上按钮点击事件 */
		onNavigationBarButtonTap() {
			// console.log('点击到按钮，按钮信息：')
			uni.navigateTo({
				url: '/pagesA/home/storeAdministration/addStore/addStore'
			})
		},
		/* 搜索栏事件，文本变化触发 */
		onNavigationBarSearchInputChanged(e) {
			this.name = e.text
			this.storeList = []// 在这里手动置空列表,可显示加载中的请求进度
			this.mescroll.resetUpScroll()// 刷新列表数据
		},
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			this.mescroll && this.mescroll.onPageScroll(e);
		},
		methods:{
			nameInput() {
				this.storeList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			},
			addQRcode() {
				uni.navigateTo({
					url: '/pagesA/home/storeAdministration/addStore/addStore'
				})
			},
			/* 跳转门店详情（附门店号） */
			jumpStoreDetails (storeId) {
				uni.navigateTo({
					url: '/pagesA/home/storeAdministration/storeDetails/storeDetails?id='+ storeId
				})
			},
			/* 图片回显 过滤器 */
			photoIdFilters(val,key) {
				let that = this
				if(this.storeList[key].photoId){
					return
				}
				//图片回显（flyio出错，换用uni接口）
				uni.downloadFile({
					url: baseURL +'/fms/upload/resource/thumbnail/'+ val,
					success: res => {
						// console.log('uploadImage success, res is:', res);
						if (res.statusCode === 200) {
							// console.log('下载成功');
							/* 将图片临时地址保存 */
							that.imgSrcList[key] = res.tempFilePath
							// console.log(that.imgSrcList)
						}
					},
					fail: err => {
						console.log('uploadImage fail', err);
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
						uni.hideLoading();
					},
					complete: () => {
						// console.log('complate');
					}
				});
			},
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调*/
			downCallback(mescroll){
				mescroll.resetUpScroll() // 重置列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				// console.log("测试点-1")
				this.getStoreLists( mescroll.num, mescroll.size, (res) => {
					let nowList = res.content;
					// console.log("mescroll.num=" + mescroll.num + ", mescroll.size=" + mescroll.size + ", length=" + nowList.length);
					// mescroll.endSuccess(number);
					for (let s of nowList) {
						s.imgSrc = '';
					}
					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					mescroll.endBySize(nowList.length, res.totalElements); //必传参数(当前页的数据个数, 总数据量)
					//设置列表数据
					if(mescroll.num == 1) this.storeList = []; //如果是第一页需手动制空列表
					this.storeList=this.storeList.concat(nowList); //追加新数据
					this.getImgList();
				}, (err) => {
					// console.log('error！！');
					// console.log("错误测试点",err)
					console.log(err);
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			/* 获取门店列表 */
			getStoreLists(pageNumber, pageSize, successCallback, errorCallback) {
				// console.log("测试点0")
				getStoreList( pageNumber, pageSize, this.name, this.status).then((res) => {
					// console.log(res);
					// console.log(res.obj);
					// this.storeList = res.obj;
					// console.log("测试点0.5")
					//联网成功的回调
					successCallback && successCallback(res.obj);
				}).catch(err => {
					// console.log('error！！');
					console.log(err);
					//联网失败的回调
					errorCallback && errorCallback(err);
				})
			},
			/* 筛选-城市 */
			showCityPopup() {
				// console.log("点击到筛选-城市")
				uni.showToast({
					title:"敬请期待",
					icon:"none"
				})
			},
			/* 筛选-状态 */
			screenStatus() {
				// console.log("点击到筛选-状态")
				if(this.isShowPopupStatus === true){
					this.isShowPopupStatus = false
					this.isCover = false
				}else{
					this.isShowPopupStatus = true
					this.isCover = true
				}
			},
			/* 筛选-更改状态 */
			changeStatus(value){
				this.status = value;
				//刷新页面
				this.storeList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			},
			/* 关闭相关菜单 */
			closeCover() {
				// console.log("关闭相关菜单")
				if(this.isShowPopupStatus === true){
					this.isShowPopupStatus = false;
				}
				if(this.isCover === true){
					this.isCover = false;
				}
			},
			/* 获取图片列表（根据列表排列） */
			getImgList() {
				let that = this;
				for (let key in this.storeList) {
					if(that.storeList[key].photoId === null || that.storeList[key].photoId === ''){
						continue
					}
					//图片回显（flyio出错，换用uni接口）
					uni.downloadFile({
						url: baseURL +'/fms/upload/resource/thumbnail/'+ that.storeList[key].photoId,
						success: res => {
							// console.log('uploadImage success, res is:', res);
							if (res.statusCode === 200) {
								// console.log('下载成功');
								/* 将图片临时地址保存 */
								that.storeList[key].imgSrc = res.tempFilePath
								/* .replace('blob:','') */
								// console.log("data:image/jpeg;base64,"+ res.tempFilePath)
							}
						},
						fail: err => {
							console.log('uploadImage fail', err);
							// uni.showModal({
							// 	content: err.msg,
							// 	showCancel: false
							// });
							// uni.hideLoading();
						},
						complete: () => {
							// console.log('complate');
							// console.log(that.storeList);
						}
					});
				}
			},
		}
	}
</script>

<style>
	body{
		background-color: #F8F9FD;
	}
	.relative{
		position: relative;
	}
	.margin-left-right-20{
		margin: 0 20upx;
	}
	.text-llg{
		font-size: 40upx;
	}
	.text-weight{
		font-weight: 600;
	}
	.lf-nav{
		position: fixed;
		top: 43px;
		left: 0;
		z-index: 100;
	}
	/* #ifndef H5*/
	.lf-nav{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
	}
	/* #endif */
	.lf-screen{
		width: 750upx;
		height: 80upx;
		border: 1upx solid #F1F1F3;
		background-color: #FFF;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: relative;
	}
	.lf-screen .view{
		width: 45%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.lf-popup{
		background: #FFF;
		position: absolute;
		top: 80upx;
		left: 50upx;
		z-index: 1010;
	}
	.lf-popup .block{
		width: 220upx;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1upx solid #F1F1F3;
	}
	.lf-cover{
		width: 750upx;
		height: 100vh;
		background: rgba(0,0,0,0.2);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 500;
	}
	.lf-line1{
		width: 1upx;
		height: 40upx;
		background-color: #EBEEF5;
		position: absolute;
		top: calc(50% - 20upx);
		left: 50%;
	}
	.lf-mat{
		height: 100upx;
	}
	.lf-storeList{
		width: 750upx;
		height: 150upx;
		background-color: #FFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30upx;
	}
	.lf-storeList image{
		width: 120upx;
		height: 120upx;
		border-radius: 50%;
	}
	.margin-right-20{
		margin-right: 20upx;
	}
	.height-100{
		height: 100upx;
	}
	.border-bottom-line{
		border-bottom: 1upx solid #F1F1F3;
	}
</style>
