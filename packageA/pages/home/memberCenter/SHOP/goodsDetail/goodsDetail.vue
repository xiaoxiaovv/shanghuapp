<template>
	<view>
		<view class="lf-head">
			<image :src="imgSrc? imgSrc:'../../../../../../static/home/member_integral_list_default.png'"></image>
			<view class="text">
				<text class="text-llg text-weight">{{goodsDetail.productName? goodsDetail.productName:''}}</text>
				<text class="text-orange mt-10">仅剩{{goodsDetail.productNums != null && goodsDetail.exchangeNum != null && goodsDetail.productNums >= goodsDetail.exchangeNum && goodsDetail.exchangeNum >= 0 ? (goodsDetail.productNums - goodsDetail.exchangeNum) : 0}}件</text>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-content">
			<!-- 指示横条 -->
			<view class="lf-indication-bar">
				<view class="bar margin-right-20"></view>
				<text>兑换须知</text>
			</view>
			<view class="text">
				<text>
					<text class="margin-right-20 text-grey text-lg">兑换限制：</text>
					<text class="text-lg">{{goodsDetail.isLimited === 1? '每位用户限领'+goodsDetail.limitedNum+'张':'每位用户不限领取张数'}}</text>
				</text>
			</view>
			<view class="text">
				<text>
					<text class="margin-right-20 text-grey text-lg">商品价值：</text>
					<text class="text-lg">{{goodsDetail.productMoney? goodsDetail.productMoney:'10.00'}}</text>
				</text>
			</view>
			<view class="text">
				<text>
					<text class="margin-right-20 text-grey text-lg">兑换门店：</text>
					<text class="text-lg">商户旗下所有门店可兑</text>
				</text>
			</view>
			<view class="text">
				<text>
					<text class="margin-right-20 text-grey text-lg">兑换时间：</text>
					<text class="text-lg">{{goodsDetail.exchangeStart? goodsDetail.exchangeStart+'~'+goodsDetail.exchangeEnd:'无限'}}</text>
				</text>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-content">
			<!-- 指示横条 -->
			<view class="lf-indication-bar">
				<view class="bar margin-right-20"></view>
				<text>兑换说明</text>
			</view>
			<view class="text">
				<text class="text-grey text-lg">{{goodsDetail.exchangeMessage? goodsDetail.exchangeMessage:'商品兑换'}}</text>
			</view>
		</view>
		<view class="lf-footer">
			<view class="one">
				<text class="text-llg text-orange">{{goodsDetail.credits? goodsDetail.credits:'10'}}积分</text>
			</view>
			<view class="two" v-if="isNotHaveGoods" style="background: #F1F1F3;">
				<text class="text-llg text-white">库存不足</text>
			</view>
			<view class="two" v-else-if="!isLogin"  @click="doLoginModal">
				<text class="text-llg text-white">登录</text>
			</view>
			<view class="two" v-else-if="!isCanExchange" style="background: #F1F1F3;">
				<text class="text-llg text-white">积分不足</text>
			</view>
			<view class="two" v-else @click="exchangeGoods">
				<text class="text-llg text-white">立即兑换</text>
			</view>
		</view>
		<!-- 模态框 -->
		<neil-modal :show="modalShow" @close="closeModal" title="登录" auto-close="false" @confirm="bindBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<input class="lf-modal-input" type="text" v-model="modalInput" placeholder="请输入手机号">
			</view>
		</neil-modal>
	</view>
</template>

<script>
	import {getGoodsDetail, exchangeGoods, findMember, getAccountInfo, baseURL} from "../../../../../../api/vueAPI.js"
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	export default {
		components: {neilModal},
		data() {
			return {
				goodsDetail:'',
				isGetDetail: false,	//onShow刷新指示
				id: '',		//商品id
				operator: '',	//操作人
				phone: '',	//兑换手机号
				productId: '',	//商品id
				memberId: '',	//会员id
				isCanExchange: false,
				isLogin: false,
				isNotHaveGoods: false,
				loginDetail: '',	//登录信息
				modalShow: false,	//模态框显示
				modalInput: '',		//模态框输入
				modalTitle: '',		//模态框标题
				imgSrc: '',
			}
		},
		onLoad(obj) {
			if(obj.id){
				this.id = obj.id;
				this.getGoodsDetail();
			}
			let nowLogin = uni.getStorageSync("loginDetail");
			if(nowLogin){
				this.loginDetail = nowLogin
				this.integralContrast()
				this.isLogin = true;
			}else{
				this.isLogin = false;
			}
			/* 获取操作人信息 */
			getAccountInfo().then(res => {
				// console.log(res)
				this.operator = res.obj.name
			}).catch(err => {
				console.log(err)
			})
		},
		onShow() {
			if(this.isGetDetail){
				this.getGoodsDetail();
			}else{
				this.isGetDetail = true
			}
			this.integralContrast()
		},
		methods: {
			/* 详情获取 */
			getGoodsDetail(){
				let that = this;
				getGoodsDetail(this.id).then(res => {
					// console.log(res);
					this.goodsDetail = res.obj;
					if(this.goodsDetail.exchangeNum){
						if(parseInt(this.goodsDetail.productNums) - parseInt(this.goodsDetail.exchangeNum) <= 0){
							this.isNotHaveGoods = true
						}
					}
					this.integralContrast()
					//图片回显（flyio出错，换用uni接口）
					if(this.goodsDetail.imgUrl === null || this.goodsDetail.imgUrl === ''){
						return
					}
					this.imgSrc = baseURL +'/fms/upload/resource/thumbnail/' + this.goodsDetail.imgUrl
					// uni.downloadFile({
					// 	url: baseURL +'/fms/upload/resource/thumbnail/'+ this.goodsDetail.imgUrl,
					// 	success: res => {
					// 		// console.log('uploadImage success, res is:', res);
					// 		if (res.statusCode === 200) {
					// 			// console.log('下载成功');
					// 			/* 将图片临时地址保存 */
					// 			that.imgSrc = res.tempFilePath
					// 			// console.log("data:image/jpeg;base64,"+ res.tempFilePath)
					// 		}
					// 	},
					// 	fail: err => {
					// 		console.log('uploadImage fail', err);
					// 		uni.showModal({
					// 			content: err.msg,
					// 			showCancel: false
					// 		});
					// 		uni.hideLoading();
					// 	},
					// 	complete: () => {
					// 		console.log('complate');
					// 	}
					// });
				}).catch(err => {
					console.log(err);
				})
			},
			/* 商品兑换 */
			exchangeGoods() {
				let that = this;
				uni.showModal({
					content:"确定兑换吗",
					confirmColor: "#ff4500",
					success(obj) {
						if(obj.confirm === true){
							that.phone = that.loginDetail.phone;
							that.productId = that.goodsDetail.id;
							that.memberId = that.loginDetail.id;
							// console.log(that.loginDetail);
							/* 商户id获取 */
							let storeId = '';
							let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
							if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
								storeId = nowStoreDetail.storeId
							}
							exchangeGoods(that.operator, that.phone, that.productId, that.memberId, 1, storeId).then(res => {
								// console.log(res);
								uni.showToast({
									title: "兑换成功",
									icon:"success"
								})
								that.getGoodsDetail();
							}).catch(err => {
								console.log(err);
							})
						}else{
							return
						}
					}
				})
			},
			/* 登录弹窗 */
			doLoginModal() {
				this.modalInput = '';
				this.modalShow = true;
			},
			/* 模态框点击事件 */
			bindBtn(type) {
				/* 确定登录 */
				if(type === 'confirm'){
					this.doLogin()
				}
			},
			/* 伪登录（手机号） */
			doLogin(){
				if(this.modalInput.trim() === ''){
					uni.showToast({
						title: '输入不能为空'
					})
					return
				}
				findMember(this.modalInput.trim()).then((res) => {
					// console.log(res);
					this.loginDetail = res.obj
					this.isLogin = true
					this.integralContrast()
					uni.setStorageSync("loginDetail",this.loginDetail);
					// console.log("伪登录成功")
				}).catch(err => {
					// console.log('error！！');
					console.log(err);
				})
			},
			/* 模态框关闭触发事件 */
			closeModal(){
				this.modalShow = false;
			},
			/* 积分对比 */
			integralContrast() {
				if(this.loginDetail.scores >= this.goodsDetail.credits){
					this.isCanExchange = true
				}else{
					this.isCanExchange = false
				}
			}
		}
	}
</script>

<style>
	body{
		background-color: #F1F1F3;
	}
	.text-weight{
		font-weight: 800;
	}
	.text-llg{
		font-size: 36upx;
	}
	.lf-head{
		width: 750upx;
		height: 200upx;
		display: flex;
		justify-content: flex-start;
		padding: 30upx;
		background-color: #FFF;
		border-top: 1upx solid #F1F1F3;
	}
	.lf-head > image{
		width: 130upx;
		height: 130upx;
		border-radius: 15upx;
		margin-right: 30upx;
	}
	.lf-head .text{
		height: 130upx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-start;
	}
	.lf-mat{
		height: 30upx;
	}
	.lf-content{
		width: 750upx;
		padding-left: 30upx;
		background-color: #FFF;
	}
	.height-500{
		height: 500upx;
	}
	.height-200{
		height: 200upx;
	}
	.lf-indication-bar{
		width: 730upx;
		height: 100upx;
		padding-left: 20upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom: 1upx solid #F1F1F3;
	}
	.lf-indication-bar .bar{
		width: 10upx;
		height: 30upx;
		background-color: #4BA8FF;
	}
	.margin-right-20{
		margin-right: 20upx;
	}
	.lf-content .text{
		height: 80upx;
		display: flex;
		align-items: center;
	}
	.lf-footer{
		width: 750upx;
		height: 100upx;
		display: flex;
		justify-content: flex-start;
		background-color: #FFF;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1000;
	}
	.lf-footer .one{
		width: 500upx;
		height: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding-left: 40upx;
		background-color: #FFF;
	}
	.lf-footer .two{
		width: 250upx;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #4BA8FF;
	}
	.lf-modal-input{
		border: 1upx solid #DDDDDD;
		border-radius: 10upx;
		padding: 0 20upx;
	}
	.text-white {
		color: #FFF;
	}
	.text-orange {
		color: #4BA8FF;
	}
</style>
