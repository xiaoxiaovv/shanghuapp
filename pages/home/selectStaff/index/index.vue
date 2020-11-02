<template>
	<view>
		<mescroll-uni @down="downCallback" @up="upCallback" :up="mescrollUp" @init="mescrollInit">
			<!-- @click="selectStaff(staff)" -->
			<view class="lf-staff" v-for="staff in staffList" @click="onSelectStaff(staff.id, staff.name)">
				<text>{{staff.name}}</text>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import { getstaffListSelectItem, getStaffList } from '../../../../api/vueAPI.js'
	import MescrollUni from "mescroll-uni/mescroll-uni.vue"
	export default {
		components: {
			MescrollUni
		},
		
		data() {
			return {
				staffList:[],
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
				userType: '', 
				status: '', 
				storeId: '', 
				name: ''
			}
		},
		
		onLoad(options) {
			// console.log(options)
			if (options.storename && options.storeid) {
				// this.name = options.storename
				this.storeId = options.storeid
			}
		},
		
		onShow() {
			
			// this.userType = uni.getStorageSync('userType')
			
			// 获取商店名称
			// if(uni.getStorageSync('userType') == 1){
			// 	this.isMerchant = true
			// } else{
			// 	this.isMerchant = false	
			// }
			// let storeDetail = uni.getStorageSync("nowStoreDetail")
			// if(storeDetail != '' && storeDetail != null && storeDetail != undefined && storeDetail){
			// 	this.name = storeDetail.storeName
			// }
			
			
			// getstaffListSelectItem().then(res => {
			// 	console.log(res)
			// 	this.staffList = res.obj
			// }).catch(err => {
			// 	console.log(err)
			// })
			
			
			/* 刷新 */
			if(this.isMescroll){
				this.closeCover()
				this.staffList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			}else{
				this.isMescroll = true
			}
			
			
		},
		methods: {
			/* 选择员工 */
			selectStaff(staffDetails) {
				// console.log(staffDetails)
				let pages = getCurrentPages();
				let currPage = pages[pages.length - 1]; //当前页面
				let prevPage = pages[pages.length - 2]; //上一个页面
				// console.log(prevPage)
				/* 修改上页面参数 */
				prevPage.userId = staffDetails.value;
				prevPage.userName = staffDetails.name;
				prevPage.$vm.userId = staffDetails.value;
				prevPage.$vm.userName = staffDetails.name;
				/* 返回上页面 */
				uni.navigateBack();
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
			/* 获取图片列表（根据列表排列） */
			getImgList() {
				let that = this;
				for (let key in this.staffList) {
					if(that.staffList[key].photoId === null || that.staffList[key].photoId === ''){
						continue
					}
					//图片回显（flyio出错，换用uni接口）
					uni.downloadFile({
						url: baseURL +'/fms/upload/resource/thumbnail/'+ that.staffList[key].photoId,
						success: res => {
							// console.log('uploadImage success, res is:', res);
							if (res.statusCode === 200) {
								// console.log('下载成功');
								/* 将图片临时地址保存 */
								that.staffList[key].imgSrc = res.tempFilePath
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
							// console.log(that.staffList);
						}
					});
				}
			},
			/* 获取员工列表 */
			getStaffLists(pageNumber, pageSize, successCallback, errorCallback) {
				// console.log("测试点0")
				getStaffList( pageNumber, pageSize, this.userType, this.status, this.storeId, this.name).then((res) => {
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
			// 选择员工
			onSelectStaff (id, name) {
				let pages = getCurrentPages();
				let currPage = pages[pages.length - 1]; //当前页面
				let prevPage = pages[pages.length - 2]; //上一个页面
				// console.log(prevPage)
				/* 修改上页面参数 */
				prevPage.userId = id;
				prevPage.userName = name;
				prevPage.$vm.userId = id;
				prevPage.$vm.userName = name;
				/* 返回上页面 */
				uni.navigateBack();
			}
		},
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			this.mescroll && this.mescroll.onPageScroll(e);
		},
	}
</script>

<style>
	.lf-staff{
		width: 750upx;
		height: 140upx;
		padding: 0 20upx;
		border-bottom: 1upx solid #F1F1F3;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
</style>
