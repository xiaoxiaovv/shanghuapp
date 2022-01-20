<template>
	<view>
		<mescroll-uni @down="downCallback" @up="upCallback" :up="mescrollUp" @init="mescrollInit">
			<view class="lf-head">
				<image class="img" src="../../../../../static/home/line_452.png"></image>
				<text>会员共计{{memberAllNumber? memberAllNumber:"0"}}条</text>
				<image class="img" src="../../../../../static/home/line_452.png"></image>
			</view>
			<!-- 会员列表 -->
			<view class="lf-content-block padding" v-for="(member, key) in memberList" :class="{'lf-block-line': key!=0}" @click="memberJump(member.id)">
				<view class="flex flex-direction justify-between align-ver-left">
					<view class="flex align-center margin-bottom-10">
						<image class="img-head" :src="member.head ? member.head : '../../../../../static/home/icon_member_default.png'"></image>
						<view class="flex flex-direction justify-between height-80">
							<text class="text-lg">{{member.nickname? member.nickname:'佚名'}}</text>
							<view class="mt-10">
								<image  class="img-dot" src="../../../../../static/dot.png"></image>
								<text>{{member.phone ? member.phone : ''}}</text>
							</view>
						</view>
					</view>
					<text class="text-grey" v-if="member.lastPayDate">最近消费时间:{{member.lastPayDate ? member.lastPayDate : ''}}</text>
				</view>
				<image class="img-icon" src="../../../../../static/home/icon_go_arrow.png"></image>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import { getMemberList, baseURL } from '../../../../../api/vueAPI.js'
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
						icon: "../../../../../static/order/no-data.png", //图标,默认null,支持网络图
						tip: "暂无相关数据~" //提示
					}
				},
				isMescroll: false,	//onShow刷新指示
				memberList: [
					// {
					// 	img: '../../../../../static/home/icon_member_default.png',
					// 	iphone: '18344989229',
					// 	time: '2019.04.18 20:20:09',
					// 	isdot: true
					// },
					// {
					// 	img: '../../../../../static/home/icon_member_default.png',
					// 	iphone: '15759863975',
					// 	time: '',
					// 	isdot: true
					// },
				],
				memberAllNumber:'',		//会员总数
				phoneOrNum: '',		//会员电话或会员id
				pageNum: 1,		//页数
				nickname: '',
			};
		},
		onShow() {
			// this.getMemberLists();
			/* 刷新 */
			if(this.isMescroll){
				this.memberList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			}else{
				this.isMescroll = true
			}
		},
		onNavigationBarButtonTap (obj) {
			// console.log("点击导航栏btn-添加会员")
			// console.log(obj)
			uni.navigateTo({
				url: '/pagesA/home/memberCenter/memberManage/registeredMember/registeredMember'
			}) 
		},
		/* 搜索栏事件，文本变化触发 */
		onNavigationBarSearchInputChanged(e) {
			this.phoneOrNum = e.text
			this.memberList = []// 在这里手动置空列表,可显示加载中的请求进度
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
		methods: {
			/* 图片回显 */
			getPic(val) {
				var url = baseURL + '/fms/upload/resource/' + val
				return url
			},
			/* 会员详情跳转，附id */
			memberJump (id) {
				uni.navigateTo({
					url: '/pagesA/home/memberCenter/memberManage/membershipDetails/membershipDetails?id='+id
				})
			},
			/* 获取会员列表 */
			getMemberLists() {
				getMemberList(this.phoneOrNum, this.pageNum).then(res => {
					// console.log(res)
				}).catch(err => {
					console.log(err)
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
				this.getGoodsLists( mescroll.num, mescroll.size, (res) => {
					let nowList = res.data;
					// console.log("mescroll.num=" + mescroll.num + ", mescroll.size=" + mescroll.size + ", length=" + nowList.length);
					// mescroll.endSuccess(number);
					// console.log(nowList);
					for (let s of nowList) {
						s.imgSrc = '';
						s.imgSrc = this.getPic(s.head)
					}
					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					mescroll.endBySize(nowList.length, res.totalElements); //必传参数(当前页的数据个数, 总数据量)
					//设置列表数据
					if(mescroll.num == 1) this.memberList = []; //如果是第一页需手动制空列表
					this.memberList = this.memberList.concat(nowList); //追加新数据
					// console.log(666, res)
					this.memberAllNumber = res.totalCount
					// this.getImgList()
				}, (err) => {
					// console.log('error！！');
					// console.log("错误测试点",err)
					console.log(err);
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			/* 获取员工列表 */
			getGoodsLists(pageNumber, pageSize, successCallback, errorCallback) {
				// console.log("测试点0")
				getMemberList(this.phoneOrNum, pageNumber, pageSize).then((res) => {
					// console.log(res);
					// console.log(res.obj);
					/* 会员总数 */
					// this.memberAllNumber = res.obj.totalElement;
					// this.goodsList = res.obj;
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
			/* 获取图片列表（根据商品列表排列） */
			getImgList() {
				let that = this;
				for (let key in this.memberList) {
					if(that.memberList[key].head === null || that.memberList[key].head === ''){
						continue
					}
					//图片回显（flyio出错，换用uni接口）
					uni.downloadFile({
						url: baseURL +'/fms/upload/resource/thumbnail/'+ that.memberList[key].head,
						success: res => {
							// console.log('uploadImage success, res is:', res);
							if (res.statusCode === 200) {
								// console.log('下载成功');
								/* 将图片临时地址保存 */
								that.memberList[key].imgSrc = res.tempFilePath
								// console.log(that.memberList)
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
							// console.log(that.goodsList);
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
	.height-80{
		height: 80upx;
	}
	.margin-bottom-10{
		margin-bottom: 10upx;
	}
	.lf-head{
		width: 750upx;
		height: 100upx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background-color: #F8F9FD;
	}
	.lf-head .img{
		width: 220upx;
		height: 3upx;
	}
	.lf-content-block{
		width: 750upx;
		height: 180upx;
		background-color: #FFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-content-block .img-icon{
		width: 25upx;
		height: 40upx;
	}
	.lf-content-block .img-head{
		width: 100upx;
		height: 100upx;
		margin-right: 20upx;
		border-radius: 10upx;
	}
	.lf-content-block .img-dot{
		width: 20upx;
		height: 20upx;
		margin-right: 10upx;
	}
	.lf-block-line{
		border-top: 1upx solid #F8F9FD;
	}
</style>
