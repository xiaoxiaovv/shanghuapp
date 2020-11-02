<template>
	<view @click="closeCover">
		<view class="lf-nav">
			<view class="lf-cover" v-if="isCover"></view>
			<!-- <view class="lf-mat-100"></view> -->
			<!-- 筛选栏 -->
			<view class="lf-screen shadow">
				<view class="lf-cover" v-if="isCover"></view>
				<view v-if="isMerchant" class="view" @click.stop="jumpStoreSelect">
					<text>{{storeName? storeName:'全部门店'}}</text><text class="icon-unfold"></text>
				</view>
				<view v-else class="view">
					<text>{{storeName? storeName:''}}</text></text>
				</view>
				<view class="lf-line1"></view>
				<view class="view" @click.stop="screenPosition">
					<text>{{parseInt(userType) === 2? '店长':parseInt(userType) === 3? '店员':'职位选择'}}</text><text class="icon-unfold"></text>
					<view class="lf-popup" v-if="isShowPopupPosition">
						<view class="block" v-for="block in popupPositionList" @click="changePosition(block.value)">
							<text class="text-sm">{{block.name}}</text>
						</view>
					</view>
				</view>
				<view class="lf-line2"></view>
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
		<!-- 员工详情 -->
		<mescroll-uni @down="downCallback" @up="upCallback" :up="mescrollUp" @init="mescrollInit">
			<view v-for="(staff, key) in staffList">
				<!-- 员工列表 -->
				<view class="lf-staffList" :class="{'border-bottom-line': key !== staffList.length}" @click="jumpstaffDetails(staff.id)">
						<view class="flex justify-start align-center">
							<image 
								:class="['margin-right-20 ', staff.imgSrc ? 'active' : '']" 
								mode="scaleToFill"
								:src="staff.imgSrc? staff.imgSrc:'../../../../static/home/icon_default.png'"/>
							<view class="flex flex-direction justify-between height-100">
								<text class="text-lg">{{staff.name ? staff.name:''}}</text>
								<text class="text-grey">{{staff.phone ? staff.phone:''}}</text>
							</view>
						</view>
						<view class="flex flex-direction justify-between height-100">
							<text class="text-lg text-red text-right">{{parseInt(staff.userType) === 2? '店长':'店员'}}</text>
							<text class="text-grey">{{staff.storeName ? staff.storeName:''}}</text>
						</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import { getStaffList, baseURL, getStoreDetails } from '@/api/vueAPI.js'
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
				userType: '',		//要查的用户类型
				status: '', 	//查询员工状态
				staffList: [],
				storeId:'',
				storeName:'',
				name: '',
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
				isShowPopupPosition: false,
				popupPositionList: [
					{
						name:'全部',
						value:''
					},
					{
						name:'店长',
						value:2
					},
					{
						name:'店员',
						value:3
					},
				],
				isMerchant:true,
			}
		},
		filters:{
			
		},
		watch:{
			staffList: {
				handler(val, oldval){
					
				},
				deep:true
			}
		},
		onReady() {
			
		},
		onShow() {
			/* 刷新 */
			if(this.isMescroll){
				this.closeCover()
				this.staffList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			}else{
				this.isMescroll = true
			}
			
			// 获取商店名称
			if(uni.getStorageSync('userType') == 1){
				this.isMerchant = true
			}else{
				this.isMerchant = false
			}
			let storeDetail = uni.getStorageSync("nowStoreDetail")
			if(storeDetail != '' && storeDetail != null && storeDetail != undefined && storeDetail){
				this.storeName = storeDetail.storeName
			}
		},
		onNavigationBarButtonTap() {
			// console.log('点击到新增按钮，跳转新增页面')
			uni.navigateTo({
				url: '../addStaff/addStaff'
			})
		},
		/* 搜索栏事件，文本变化触发 */
		onNavigationBarSearchInputChanged(e) {
			this.name = e.text
			this.staffList = []// 在这里手动置空列表,可显示加载中的请求进度
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
			/* 跳转选择门店 */
			jumpStoreSelect() {
				uni.navigateTo({
					url: '/pages/home/storeSelect/index/index'
				})
			},
			/* 跳转员工详情（附员工号） */
			jumpstaffDetails (id) {
				uni.navigateTo({
					url: '/pages/home/staffManagement/staffDetails/staffDetails?id='+ id
				})
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
				this.getStaffLists( mescroll.num, mescroll.size, (res) => {
					let nowList = res.content;
					// console.log("mescroll.num=" + mescroll.num + ", mescroll.size=" + mescroll.size + ", length=" + nowList.length);
					// mescroll.endSuccess(number);
					for (let s of nowList) {
						s.imgSrc = '';
					}
					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					mescroll.endBySize(nowList.length, res.totalElements); //必传参数(当前页的数据个数, 总数据量)
					//设置列表数据
					if(mescroll.num == 1) this.staffList = []; //如果是第一页需手动制空列表
					this.staffList=this.staffList.concat(nowList); //追加新数据
					this.getImgList()
				}, (err) => {
					// console.log('error！！');
					// console.log("错误测试点",err)
					console.log(err);
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			/* 获取员工列表 */
			getStaffLists(pageNumber, pageSize, successCallback, errorCallback) {
				// console.log("测试点0")
				let storeId = '';
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				getStaffList( pageNumber, pageSize, this.userType, this.status, storeId, this.name).then((res) => {
					// console.log(res);
					// console.log(res.obj);
					// this.staffList = res.obj;
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
			/* 筛选-职位 */
			screenPosition() {
				// console.log("点击到筛选-职位")
				if(this.isShowPopupPosition === true){
					this.isShowPopupPosition = false
					this.isCover = false
				}else{
					this.isShowPopupPosition = true
					this.isCover = true
				}
			},
			/* 筛选-更改状态 */
			changeStatus(value){
				this.status = value;
				//刷新页面
				this.staffList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			},
			/* 筛选-更改职位 */
			changePosition(value){
				this.userType = value;
				//刷新页面
				this.staffList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			},
			/* 关闭相关菜单 */
			closeCover() {
				// console.log("关闭相关菜单")
				if(this.isShowPopupStatus === true){
					this.isShowPopupStatus = false;
				}
				if(this.isShowPopupPosition === true){
					this.isShowPopupPosition = false;
				}
				if(this.isCover === true){
					this.isCover = false;
				}
			},
			/* 获取图片列表（根据列表排列） */
			getImgList() {
				let that = this;
				for (let key in this.staffList) {
					if(that.staffList[key].photoId === null || that.staffList[key].photoId === ''){
						continue
					}
					that.staffList[key].imgSrc = baseURL +'/fms/upload/resource/thumbnail/'+ that.staffList[key].photoId;
					//图片回显（flyio出错，换用uni接口）
					// uni.downloadFile({
					// 	url: baseURL +'/fms/upload/resource/thumbnail/'+ that.staffList[key].photoId,
					// 	success: res => {
					// 		// console.log('uploadImage success, res is:', res);
					// 		if (res.statusCode === 200) {
					// 			console.log('下载成功');
					// 			/* 将图片临时地址保存 */
					// 			that.staffList[key].imgSrc = res.tempFilePath
					// 			/* .replace('blob:','') */
					// 			// console.log("data:image/jpeg;base64,"+ res.tempFilePath)
					// 		}
					// 	},
					// 	fail: err => {
					// 		console.log('uploadImage fail', err);
					// 		// uni.showModal({
					// 		// 	content: err.msg,
					// 		// 	showCancel: false
					// 		// });
					// 		// uni.hideLoading();
					// 	},
					// 	complete: () => {
					// 		// console.log('complate');
					// 		// console.log(that.staffList);
					// 	}
					// });
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
		top: 0;
		left: 0;
		z-index: 100;
	}
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
		width: 30%;
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
		left: 0;
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
		left: 33.3%;
	}
	.lf-line2{
		width: 1upx;
		height: 40upx;
		background-color: #EBEEF5;
		position: absolute;
		top: calc(50% - 20upx);
		left: 66.6%;
	}
	.lf-mat{
		height: 100upx;
	}
	.lf-staffList{
		width: 750upx;
		height: 150upx;
		background-color: #FFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30upx;
	}
	.lf-staffList image{
		width: 120upx;
		height: 120upx;
		border-radius: 50%;
		box-sizing: border-box;
	}
	.lf-staffList image.active {
		border: 1upx solid #DDD;
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
