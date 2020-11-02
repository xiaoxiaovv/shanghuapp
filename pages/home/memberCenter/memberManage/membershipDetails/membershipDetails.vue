<template>
	<view class="page-membership box align-default">
		<view class="user-info">
			<view class="lf-member-bg">
				<image 
					class="match-parent" 
					src="../../../../../static/home/bg.png"
					mode="scaleToFill"/>
			</view>
			<view class="user-info__cover box align-default plr-30 pt-24">
				<view class="lf-content-head box pl-50">
					<view class="lf-head-img mr-30" @click="photoUpload">
						<image :src="imgSrc? imgSrc:'../../../../../static/common/avatar.png'"></image>
					</view>
					<view class="lf-head-text"> 
						<view>
							<text class="phone">{{memberDetail.phone? memberDetail.phone:''}}</text>
							<text>|</text>
							<image v-if="parseInt(memberDetail.sex) === 1" src="../../../../../static/common/male.png" mode="scaleToFill"></image>
							<image v-if="parseInt(memberDetail.sex) === 2" src="../../../../../static/common/female.png" mode="scaleToFill"></image>
						</view>
						<text>{{memberDetail.memberLevelId}}</text>
					</view>
				</view>
				<view class="lf-content-panel mt-20">
					<view>
						<view class="lf-panel-money flex justify-around align-hor-bet">
							<view @click="jumpstorageDetails">
								<text class="text-gray">余额</text>
								<text class="text-red text-lg mark">{{memberDetail.balance? memberDetail.balance:'0'}}</text>
							</view>
							<view class="line1"></view>
							<view @click="jumpintegralDetails">
								<text class="text-gray">可用积分</text>
								<text class="text-red text-lg mark">{{memberDetail.scores? memberDetail.scores:'0'}}</text>
							</view>
							<view class="line2"></view>
							<view @click="jumpcouponDetails">
								<text class="text-gray">优惠券</text>
								<text class="text-red text-lg mark">{{memberDetail.couponCount? memberDetail.couponCount:'0'}}</text>
							</view>
						</view>
						<view class="lf-panel-recharge flex justify-between align-center box pt-20" @click="jumpStoredValue">
							<text class="text-lg">账户充值</text>
							<view class="flex align-center align-start">
								<image src="../../../../../static/common/bank.png"></image>
								<text class="icon-right text-lg text-gray ml-10"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="match-width align-center">
			<view class="lf-content-information">
				<view class="cu-form-group box plr-40" @click="showNickNameModal">
					<view class="title">昵称</view>
					<text>
						<text>{{memberDetail.nickname? memberDetail.nickname:'暂未设置'}}</text>
						<text class="icon-right text-grey ml-10"></text>
					</text>
				</view>
				<view class="cu-form-group box plr-40">
					<view class="title">卡号</view>
					<text class="ml-10">{{memberDetail.memberNum? memberDetail.memberNum:''}}</text>
				</view>
				<view class="cu-form-group box plr-40">
					<view class="title">性别</view>
					<text class="ml-10">{{memberDetail.sex === 1? '男':memberDetail.sex === 2? '女':''}}</text>
				</view>
				<!-- <view class="cu-form-group">
					<view class="title">生日</view>
					<text>
						<text>{{memberDetail.birthday? memberDetail.birthday:'暂未设置'}}</text>
						<text class="icon-right text-grey"></text>
					</text>
				</view> -->
				<view class="cu-form-group box plr-40">
					<view class="title">生日</view>
					<picker mode="date" :value="memberDetail.birthday" start="1900-01-01" end="" @change="DateChange">
						<view class="picker">
							{{memberDetail.birthday ? memberDetail.birthday : '请选择生日'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group box plr-40">
					<view class="title">加入时间</view>
					<text class="ml-10">{{memberDetail.createTime? memberDetail.createTime:''}}</text>
				</view>
			</view>
		</view>
		<!-- 模态框 -->
		<neil-modal :show="modalShow" @close="closeModal" title="昵称修改" auto-close="false" @confirm="bindBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="16">
			</view>
		</neil-modal>
	</view>
</template>

<script>
	import {getMemberDetail, changeMember, baseURL, userFilesUpload, getImgThumbnail} from '../../../../../api/vueAPI.js'
	import { uniList } from '@dcloudio/uni-ui'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	
	export default {
		components: {uniList, neilModal},
		data() {
			return {
				id: '',
				nickname: '',
				memberDetail: '',
				modalShow: false,	//模态框显示
				modalInput: '',		//模态框输入
				imgSrc: '',
				avatar: '',
				ispPhotoUpload: false	//onShow检查true时，上传图片
			}
		},
		onLoad(obj) {
			if(obj.id){
				this.id = obj.id;
				this.getMemberDetail();
			}
		},
		methods: {
			/* 跳转储值页面 */
			jumpStoredValue() {
				uni.navigateTo({
					url: '../storedValue/storedValue?id='+ this.id
				})
			},
			/* 跳转储值明细 */
			jumpstorageDetails() {
				uni.navigateTo({
					url: '../storageDetails/index/index?memberId='+ this.id
				})
			},
			/* 跳转积分明细 */
			jumpintegralDetails() {
				uni.navigateTo({
					url: '../integralDetails/index/index?memberNum='+ this.memberDetail.memberNum
				})
			},
			/* 跳转优惠券明细 */
			jumpcouponDetails() {
				if(this.memberDetail.couponCount === null || this.memberDetail.couponCount === '' || this.memberDetail.couponCount <= 0){
					return
				}
				uni.navigateTo({
					url: '../couponDetails/couponDetails?memberId='+ this.id
				})
			},
			/* 获取会员详情 */
			getMemberDetail(){
				let that = this;
				getMemberDetail(this.id).then(res => {
					// console.log(555, res)
					this.memberDetail = res.obj
					that.imgSrc = this.memberDetail.head
					//图片回显（flyio出错，换用uni接口）
					// if(this.memberDetail.head === null || this.memberDetail.head === ''){
					// 	return
					// }
					// uni.downloadFile({
					// 	url: baseURL +'/fms/upload/resource/thumbnail/'+ this.memberDetail.head,
					// 	success: res => {
					// 		console.log('uploadImage success, res is:', res);
					// 		if (res.statusCode === 200) {
					// 			console.log('下载成功');
					// 			/* 将图片临时地址保存 */
					// 			that.imgSrc = res.tempFilePath
					// 			// console.log("data:image/jpeg;base64,"+ res.tempFilePath)
					// 		}
					// 	},
					// 	fail: err => {
					// 		console.log('uploadImage fail', err);
					// 		// uni.showModal({
					// 		// 	content: err.msg,
					// 		// 	showCancel: false
					// 		// });
					// 		uni.hideLoading();
					// 	},
					// 	complete: () => {
					// 		console.log('complate');
					// 	}
					// })
				}).catch(err => {
					console.log(err)
				})
			},
			/* 会员修改 */
			changeMember() {
				let that = this;
				uni.showLoading()
				changeMember(this.memberDetail.id, this.memberDetail.nickname.trim(), this.memberDetail.birthday, this.memberDetail.head).then(res => {
					// console.log(res)
					uni.hideLoading()
					uni.showToast({
						title:"修改成功",
						icon:"success",
						success() {
							that.getMemberDetail();
						}
					})
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
				})
			},
			/* 昵称模态框 */
			showNickNameModal() {
				this.modalShow = true;
			},
			/* 模态框点击事件 */
			bindBtn(type) {
				if(type === 'confirm'){
					if(this.modalInput.trim() === ''){
						uni.showToast({
							title:"不能为空",
							icon:"none"
						})
						return
					}
					this.nickname = this.modalInput
					this.memberDetail.nickname = this.modalInput
					this.changeMember();
				}
			},
			/* 模态框关闭触发事件 */
			closeModal(){
				this.modalShow = false;
			},
			/* 生日修改 */
			DateChange(e) {
				this.memberDetail.birthday = e.detail.value;
				this.changeMember();
			},
			/* 头像修改 */
			/* 进行图片上传操作 */
			photoUpload() {
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success(res) {
						const src = res.tempFilePaths[0];
			
						uni.navigateTo({
							url: '../../../upload/upload?src=' + src
						})
					}
				});
			}
		},
		filters: {
		},
		onShow() {
			// console.log("onShow~")
			if(this.ispPhotoUpload){
				let that = this;
				/* 预览图显示 */
				this.imgSrc = this.avatar
				uni.showLoading()
				//图片上传服务器（flyio出错，换用uni接口）
				// console.log('上传的头像', this.imgSrc)
				// userFilesUpload(this.avatar).then(res => {
				// 	console.log('rersresres:::::', res)
				// })
				uni.uploadFile({
					url: baseURL +'/fms/upload/files_upload/file/user',
					filePath: that.avatar,
					name: 'files',
					// formData: { token: token},
					success: res => {
						// console.log('uploadImage success, res is:', res);
						/* 将图片id保存 */
						let head = JSON.parse(res.data).obj
						that.memberDetail.head = baseURL + '/fms/upload/resource/thumbnail/' + head
						uni.hideLoading()
						that.changeMember()
					}, 
					fail: err => {
						console.log('uploadImage fail', err);
						uni.hideLoading();
						// uni.showModal({
						// 	content: err.errMsg,
						// 	showCancel: false
						// });
					},
					complete: () => {
						// console.log('complate');
					}
				});
				/* 关闭图片更新指示 */
				this.ispPhotoUpload = false
			}
			/* 刷新页面 */
			this.getMemberDetail();
			// console.log("~onShow")
		}
	}
</script>

<style lang="scss">
	.page-membership {
		width: 100%;
		height: 100%;
		background-color: #F8F9FD;
		font-weight: 500;
		font-size: 24upx;
		color: #333333;
	}
	.user-info {
		width: 100%;
		height: 550upx;
		position: relative;
		
		&__cover {
			width: 100%;
			position: absolute;
			top: 0;
				
			.mark {
				color: #4BA8FF;
			}
		}
	}
	.lf-member-bg{
		width: 100%;
		height: 366upx;
	}
	.lf-content-head{
		width: 100%;
		height: 150upx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	.lf-head-img{
		width: 110upx;
		height: 110upx;
		// background-color: #ffbf7b;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lf-head-img image{
		width: 110upx;
		height: 110upx;
		border-radius: 50%;
	}
	.lf-head-text{
		width: 340upx;
		height: 100upx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		color: #FFF;
		font-size: 24upx;
		
		.phone {
			font-size: 34upx;
		}
		
		image {
			width: 28upx !important;
			height: 28upx !important;
		}
	}
	.lf-head-text > view{
		width: 100%;
		height: 60upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-head-text image{
		width: 40upx;
		height: 40upx;
	}
	.lf-content-panel{
		margin: 20upx 3%;
		width: 94%;
		height: 300upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32upx;
		background: #FFF;
		box-shadow: 0 15upx 15upx 0 rgba(141, 141, 141, 0.2);
		border-radius: 12upx;
	}
	.lf-content-panel > view{
		width: 86%;
		height: 220upx;
		display: flex;
		flex-wrap: wrap;
	}
	.lf-panel-money{
		width: 100%;
		height: 60%;
		border-bottom: 1upx solid #E6E6E6;
		position: relative;
		
		text {
			color: #666;
		}
	}
	.lf-panel-money view{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		text-align: center;
		width: 150upx;
		height: 90upx;
	}
	.lf-panel-money .line1{
		width: 1upx;
		height: 60upx;
		background-color: #E6E6E6;
		position: absolute;
		top: calc(50%-30upx);
		left: 33.3%;
	}
	.lf-panel-money .line2{
		width: 1upx;
		height: 60upx;
		background-color: #E6E6E6;
		position: absolute;
		top: calc(50%-30upx);
		left: 66.6%;
	}
	.lf-panel-recharge{
		width: 100%;
		height: 40%;
		display: flex;
		justify-content: space-between;
		font-size: 32upx !important;
	}
	.lf-panel-recharge image{
		width: 60upx;
		height: 60upx;
	}
	.lf-content-information{
		width: 100%;
		font-size: 28upx;
		color: #333;
		
		.cu-form-group {
			// border-bottom: 1upx solid #DDD;
			background-color: #FFF;
		}
		
		.icon-right {
			color: #999;
			font-size: 28upx !important;
		}
	}
	.lf-modal-input{
		border: 1upx solid #DDDDDD;
		border-radius: 10upx;
		padding: 0 20upx;
	}
	.cu-form-group uni-picker::after {
		font-size: 28upx;
	}
</style>
