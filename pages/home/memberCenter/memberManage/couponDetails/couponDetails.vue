<template>
	<view>
		<!-- 列表 -->
		<mescroll-uni @down="downCallback" :up="mescrollUp" @up="upCallback" @init="mescrollInit">
			<view class="lf-card-box">
				<view class="lf-card" v-for="coupon in couponList">
					<view class="one">
						<image :src="coupon.imgSrc? coupon.imgSrc:'../../../../../static/home/btn_card_verification.png'"></image>
						<view class="height flex flex-direction justify-between ml-30">
							<text class="text-llg text-weight">{{coupon.name? coupon.name:''}}</text>
							<view>
								<view class="prod prod-height"></view>
								<text class="meat text-red text-lllg text-weight margin-right-20">{{yenSymbol}}{{coupon.money? coupon.money:''}}</text>
								<text v-if="coupon.miniExpendLimit" class="meat tap">满{{coupon.miniExpendLimit? coupon.miniExpendLimit:''}}可用</text>
								<text v-else-if="coupon.miniExpendLimit === 0" class="meat tap">无门槛</text>
							</view>
						</view>
					</view>
					<view class="two">
						<text class="text-grey text-sm">
							使用有效时间至{{coupon.validTimeEnd? coupon.validTimeEnd:''}}
						</text>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import {getCouponList, baseURL } from '@/api/vueAPI.js'
	import MescrollUni from "mescroll-uni/mescroll-uni.vue";
	export default {
		components: {
			MescrollUni
		},
		data() {
			return {
				mescrollUp: {
					empty: {
						icon: "../../../../../static/order/no-data.png", //图标,默认null,支持网络图
						tip: "暂无相关数据~" //提示
					}
				},
				pageNumber: 1,		//查询页码
				pageSize: 10,		//每页显示数量
				memberId: '',		//会员id
				status: 1,			//支付方式
				couponList: [],
				mescroll: null,
				isMescroll: false,	//onShow刷新指示
				yenSymbol: '\u00A5',	//金钱符号
			};
		},
		watch:{
			couponList: {
				handler(val, oldval){
					
				},
				deep:true
			}
		},
		onLoad(obj) {
			this.memberId = obj.memberId
		},
		onShow() {
			// console.log("onShow!")
			/* 刷新 */
			if(this.isMescroll){
				this.recordsList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			}else{
				this.isMescroll = true
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
		methods:{
			/* 图片回显 */
			getPic(val) {
				var url = baseURL + '/fms/upload/resource/' + val
				return url
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
				this.getCouponList( mescroll.num, mescroll.size, (res) => {
					let nowList = res.content;
					// console.log("mescroll.num=" + mescroll.num + ", mescroll.size=" + mescroll.size + ", length=" + nowList.length);
					// mescroll.endSuccess(number);
					for (let s of nowList) {
						s.imgSrc = '';
						s.imgSrc = this.getPic(s.photoId)
					}
					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					mescroll.endBySize(nowList.length, res.totalElements); //必传参数(当前页的数据个数, 总数据量)
					//设置列表数据
					if(mescroll.num == 1) this.couponList = []; //如果是第一页需手动制空列表
					this.couponList=this.couponList.concat(nowList); //追加新数据
					// this.getImgList()
					// console.log('this.couponList', this.couponList)
				}, (err) => {
					// console.log('error！！');
					// console.log("错误测试点",err)
					console.log(err);
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			/* 获取列表 */
			getCouponList(pageNumber, pageSize, successCallback, errorCallback) {
				// console.log("测试点0")
				getCouponList( pageNumber, pageSize, this.memberId, this.status).then((res) => {
					let date = new Date()
					let now = date.getTime()
					if (res && res.obj && res.obj.content && Array.isArray(res.obj.content)) {
						// res.obj.content = res.obj.content.filter((item) => {
						// 	if (!item.validTimeEnd) {
						// 		return false
						// 	}
						// 	let tmpDate = new Date(item.validTimeEnd)
						// 	let tmpNow = tmpDate.getTime()
						// 	return now <= tmpNow
						// })
						// console.log(res.obj);
						// this.storeList = res.obj;
						// console.log("测试点0.5")
						//联网成功的回调
						successCallback && successCallback(res.obj);
					}
					
					
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
				for (let key in this.couponList) {
					if(that.couponList[key].photoId === null || that.couponList[key].photoId === ''){
						continue
					}
					//图片回显（flyio出错，换用uni接口）
					uni.downloadFile({
						url: baseURL +'/fms/upload/resource/thumbnail/'+ that.couponList[key].photoId,
						success: res => {
							// console.log('uploadImage success, res is:', res);
							if (res.statusCode === 200) {
								// console.log('下载成功');
								/* 将图片临时地址保存 */
								that.couponList[key].imgSrc = res.tempFilePath
								// console.log(that.couponList)
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
	.relative{
		position: relative;
	}
	.margin-left-right-20{
		margin: 0 20upx;
	}
	.text-llg{
		font-size: 36upx;
	}
	.text-lllg{
		font-size: 42upx;
	}
	.text-weight{
		font-weight: 600;
	}
	.margin-right-20{
		margin-right: 20upx;
	}
	.lf-card{
		width: 690upx;
		height: 240upx;
		background-image: url('../../../../../static/home/member_coupon_card.png');
		background-repeat: no-repeat;
		background-size: 690upx 240upx;
		margin: 30upx;
	}
	.lf-card .one{
		height: 180upx;
		padding: 20upx 40upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.lf-card .one .height{
		height: 120upx
	}
	.lf-card .one .tap{
		padding: 0 10upx;
		color: #FF4500;
		font-size: 12upx;
		border: 1upx solid #FF4500;
		border-radius: 8upx;
	}
	.lf-card .one image{
		width: 120upx;
		height: 120upx;
	}
	.prod-height{
		height: 42upx;
	}
	.lf-card .two{
		height: 60upx;
		padding: 0 40upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
</style>
