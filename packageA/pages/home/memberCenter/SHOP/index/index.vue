<template>
	<view>
		<view v-if="isLogin" class="lf-phone-login padding">
			<view class="one">
				<image :src="loginDetail.head? loginDetail.head:'../../../../../../static/home/member_icon_default.png'"></image>
				<view class="text">
					<text class="text-lg">{{loginDetail.nickname? loginDetail.nickname: ''}}</text>
					<text class="text-orange">{{loginDetail.scores? loginDetail.scores: 0}}积分</text>
				</view>
			</view>
			<view class="two">
				<text class="text-grey text-lg">{{ loginDetail.phone? loginDetail.phone:'13333393239'}}</text>
				<view class="shadow" @click="quit"><text class="text-orange btn">切换会员</text></view>
			</view>
		</view>
		<view v-else class="lf-phone-frame padding">
			<input type="text" placeholder="请输入兑换的手机号" maxlength="11" v-model="phone">
			<view class="img-login" @click="loginPhone">
				<text>登录</text>
			</view>
		</view>
		<view class="lf-mat"></view>
		<!-- 列表 -->
		<mescroll-uni @down="downCallback" @up="upCallback" :up="mescrollUp" @init="mescrollInit">
			<view class="lf-card-box">
				<view class="lf-card" v-for="goods in goodsList" @click="jumpGoodsDetail(goods.id)">
					<image class="lf-not-integral" src="../../../../../../static/home/integral_not_enough.png" v-if="isLogin && goods.exchangeNum && (parseInt(goods.productNums) - parseInt(goods.exchangeNum)) > 0 && loginDetail.scores < goods.credits"></image>
					<image class="lf-not-integral" src="../../../../../../static/home/integral_all_exchange.png" v-if="goods.exchangeNum && (parseInt(goods.productNums) - parseInt(goods.exchangeNum)) <= 0"></image>
					<view class="up">
						<image 
							class="match-parent"
							:src="goods.imgUrl ? goods.imgUrl: '../../../../../../static/home/member_integral_list_default.png'"
							mode="scaleToFill">
						</image>
					</view>
					<view class="down">
						<text class="text-llg text-weight ellipsis match-width">{{goods.productName? goods.productName:'无名称'}}</text>
						<view>
							<image src="../../../../../../static/home/member_integral_item_icon.png"></image>
							<text class="text-orange">{{goods.credits? goods.credits:0}}积分</text>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import {getGoodsList, findMember, checkStatusGoods, baseURL} from "../../../../../../api/vueAPI.js"
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
						icon: "../../../../../../static/order/no-data.png", //图标,默认null,支持网络图
						tip: "暂无相关数据~" //提示
					}
				},
				isMescroll: false,	//onShow刷新指示
				pageNumber: 1,		//查询页码
				pageSize: 10,		//每页显示数量
				isLogin: false,
				integral: 0,	//积分
				phone: '',		//电话
				goodsList: [],
				status: 1,		//商品状态 0-未开始|1-进行中|2-已结束
				productName: '',	//商品名称（选）
				loginDetail: '',	//登录会员详情
				loginImgSrc: '',
			};
		},
		onShow() {
			if(this.isMescroll){
				this.goodsList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			}else{
				this.isMescroll = true
			}
			let nowLogin = uni.getStorageSync("loginDetail");
			// console.log(222, nowLogin)
			if(nowLogin){
				this.findMember(nowLogin.phone)
				this.isLogin = true;
			}else{
				this.isLogin = false;
			}
		},
		watch:{
			goodsList:{
				handler(val, oldval){
					
				},
				deep:true
			},
		},
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			this.mescroll && this.mescroll.onPageScroll(e);
		},
		onUnload() {
			uni.removeStorageSync("loginDetail");
		},
		methods:{
			/* 详情跳转 */
			jumpGoodsDetail(id) {
				uni.navigateTo({
					url: '../goodsDetail/goodsDetail?id='+ id
				})
			},
			onNavigationBarButtonTap (obj) {
				// console.log("点击导航栏btn-扫码核销卡券")
				uni.scanCode({
					onlyFromCamera: true,
					success: (res) => {
						this.codeResult = res.result
						// console.log("扫码内容："+res.result)
						// console.log("扫码类型："+res.scanType)
						// console.log('扫码成功，进行商品核销。。。');
						checkStatusGoods(res.result).then(res => {
							// console.log(res)
							uni.showToast({
								title:res.msg,
								icon:"success"
							})
						}).catch(err => {
							console.log(err)
						})
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
				this.getGoodsLists( mescroll.num, mescroll.size, (res) => {
					// console.log(666, res)
					let nowList = res.content;
					// console.log("mescroll.num=" + mescroll.num + ", mescroll.size=" + mescroll.size + ", length=" + nowList.length);
					// mescroll.endSuccess(number);
					// console.log(nowList);
					for (let s of nowList) {
						s.imgSrc = '';
					}
					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					mescroll.endBySize(nowList.length, res.totalElements); //必传参数(当前页的数据个数, 总数据量)
					//设置列表数据
					if(mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
					this.goodsList = this.goodsList.concat(nowList); //追加新数据
					// console.log('商品', this.goodsList)
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
			getGoodsLists(pageNumber, pageSize, successCallback, errorCallback) {
				// console.log("测试点0")
				getGoodsList(this.status, this.productName, pageNumber, pageSize).then((res) => {
					// console.log(res);
					// console.log(res.obj);
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
			/* 伪登录（手机号） */
			loginPhone() {
				if(this.phone.trim() === ''){
					uni.showToast({
						title: '输入不能为空',
						icon: 'none'
					})
					return
				}
				this.findMember(this.phone.trim());
			},
			/* 手机查找相应会员API */
			findMember(phone) {
				let that = this;
				// console.log(123)
				findMember(phone).then((res) => {
					// console.log(res);
					this.loginDetail = res.obj
					this.isLogin = true;
					uni.setStorageSync("loginDetail",this.loginDetail);
					if(this.loginDetail.head === null || this.loginDetail.head === ''){
						return
					}
					// console.log(456)
					//图片回显（flyio出错，换用uni接口）
					this.loginImgSrc = baseURL +'/fms/upload/resource/thumbnail/' + this.loginDetail.head
					// uni.downloadFile({
					// 	url: baseURL +'/fms/upload/resource/thumbnail/'+ this.loginDetail.head,
					// 	success: res => {
					// 		// console.log('uploadImage success, res is:', res);
					// 		if (res.statusCode === 200) {
					// 			// console.log('下载成功');
					// 			/* 将图片临时地址保存 */
					// 			that.loginImgSrc = res.tempFilePath
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
					// 	}
					// });
				}).catch(err => {
					// console.log('error！！');
					console.log(err);
					this.isLogin = false;
				})
			},
			/* 退出登录 */
			quit(){
				uni.removeStorageSync("loginDetail");
				this.phone = '';
				this.isLogin = false;
			},
			/* 获取图片列表（根据商品列表排列） */
			getImgList() {
				let that = this;
				for (let key in this.goodsList) {
					if(that.goodsList[key].imgUrl === null || that.goodsList[key].imgUrl === ''){
						continue
					}
					// console.log('5555', baseURL +'/fms/upload/resource/thumbnail/'+ that.goodsList[key].imgUrl)
					//图片回显（flyio出错，换用uni接口）
					that.goodsList[key].imgUrl = baseURL +'/fms/upload/resource/thumbnail/'+ that.goodsList[key].imgUrl
					// uni.downloadFile({
					// 	url: baseURL +'/fms/upload/resource/thumbnail/'+ that.goodsList[key].imgUrl,
					// 	success: res => {
					// 		console.log('uploadImage success, res is:', res);
					// 		if (res.statusCode === 200) {
					// 			// console.log('下载成功');
					// 			/* 将图片临时地址保存 */
					// 			that.goodsList[key].imgUrl = res.tempFilePath
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
					// 		// console.log(that.goodsList);
					// 	}
					// });
				}
			},
		}
	}
</script>

<style>
	body{
		background-color: #f1f1f3;
	}
	.text-weight{
		font-weight: 800;
	}
	.lf-phone-frame{
		border:1upx solid #F1F1F3;
		width: 750upx;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
	}
	.lf-phone-frame .img-login{
		width: 120upx;
		height: 60upx;
		color: #FFF;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #4BA8FF;
	}
	.lf-phone-login{
		border:1upx solid #F1F1F3;
		width: 750upx;
		height: 140upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
	}
	.lf-phone-login .one{
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
	}
	.lf-phone-login .one .text{
		height: 100upx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
	}
	.lf-phone-login .one > image{
		width: 100upx;
		height: 100upx;
		margin-right: 20upx;
	}
	.lf-phone-login .two{
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-start;
	}
	.lf-phone-login .two > view{
		width: 140upx;
		height: 50upx;
		margin-top: 10upx;
		border: 1px solid #4BA8FF;
		border-radius: 25upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lf-mat{
		height: 20upx;
	}
	.lf-card-box{
		width: 710upx;
		margin: 20upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: flex-start;
	}
	.lf-card{
		width: 345upx;
		height: 400upx;
		background-color: #FFF;
		border-radius: 15upx;
		margin-top: 20upx;
		position: relative;
	}
	.lf-card .up {
		height: 280upx;
	}
	.lf-card .up > image{
		width: 100%;
		height: 100%;
	}
	.lf-card .down {
		height: 120upx;
		padding: 20upx;
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		justify-content: space-between;
	}
	.lf-card .down > view{
		display: flex;
		justify-content: flex-start;
		align-content: center;
		margin-top: 10upx;
	}
	.lf-card .down > view > image{
		width: 40upx;
		height: 40upx;
		margin-right: 10upx;
	}
	.lf-not-integral{
		width: 160upx;
		height: 70upx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 100;
	}
	.btn {
		color: #4BA8FF !important;
		font-size: 24upx !important;
	}
</style>
