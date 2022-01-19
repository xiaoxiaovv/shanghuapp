<template>
	<view>
		<view class="lf-mat"></view>
		<view class="lf-staff-head">
			<view class="one flex justify-start align-center">
				<image class="margin-right-20" :src=" imgSrc? imgSrc:'../../../../static/home/icon_default.png'"></image>
				<view class="flex flex-direction justify-between height-100">
					<text class="text-lg">{{staffDetails.name ? staffDetails.name : ''}}</text>
					<text class="text-grey">{{staffDetails.username ? staffDetails.username : ''}}</text>
				</view>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view class="lf-bottom-line">
				<text class="text-lg">性别</text>
				<text class="text-grey text-lg">{{parseInt(staffDetails.sex) === 1? '男' : parseInt(staffDetails.sex) === 2? '女' : ''}}</text>
			</view>
			<view class="lf-bottom-line">
				<text class="text-lg">手机号</text>
				<text class="text-grey text-lg">{{staffDetails.phone ? staffDetails.phone : ''}}</text>
			</view>
			<view class="lf-bottom-line">
				<text class="text-lg">门店</text>
				<text class="text-grey text-lg">{{staffDetails.storeName ? staffDetails.storeName : ''}}</text>
			</view>
			<view>
				<text class="text-lg">职位</text>
				<text class="text-grey text-lg">{{parseInt(staffDetails.userType) === 2? '店长':'店员'}}</text>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view>
				<text class="text-lg">状态</text>
				<text class="text-grey text-lg">{{staffDetails.status === 1? '启用':'注销'}}</text>
			</view>
		</view>
		<view class="lf-reset-btn">
			<view class="btn" @click="clickResetPassword">
				<text class="text-lg text-white">重置密码</text>
			</view>
		</view>
		<!-- 模态框 -->
		<neil-modal :show="modalShow" @close="closeModal" title="重置密码" auto-close="false" @confirm="bindBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;" class="relative">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="18" placeholder="请填写新密码">
				<view class="lf-modal-num">
					<text>{{modalInput.length}}/18</text>
				</view>
			</view>
		</neil-modal>
	</view>
</template>

<script>
	import { baseURL, getStaffDetails, resetStaffPassword} from '../../../../api/vueAPI.js'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	export default {
		components: { neilModal},
		data() {
			return {
				staffDetails: '',
				id: '',
				imgSrc: '',
				modalShow: false,	//模态框显示
				modalInput: '',		//模态框输入
			}
		},
		onNavigationBarButtonTap() {
			// console.log('点击到按钮-修改')
			// console.log(this.staffDetails.id)
			uni.navigateTo({
				url: '../changeStaff/changeStaff?id='+ this.staffDetails.id
			})
		},
		onLoad(obj) {
			this.id = obj.id
			// this.getStaffDetail(this.id)
		},
		onShow() {
			uni.showLoading()
			this.getStaffDetail(this.id)
		},
		watch: {
			/* 正则限制输入-数/英可通过 */
			modalInput:{
				handler(newValue, oldValue) {
					this.modalInput=newValue.replace(/[\W]/g,'');
				}
			}
		},
		methods: {
			/* 点击重置密码 */
			clickResetPassword() {
				this.modalShow = true;
			},
			/* 模态框关闭触发事件 */
			closeModal(){
				this.modalShow = false;
			},
			/* 模态框按钮点击事件 */
			bindBtn(type) {
				//确定按钮
				if(type === 'confirm'){
					if(this.modalInput === ''){
						uni.showToast({
							title:"新密码不能为空"
						})
						return
					}
					this.resetPassword()
				}
			},
			/* 重置密码 */
			resetPassword() {
				let that = this
				// console.log("进行重置密码")
				uni.showLoading({title:'重置中'})
				resetStaffPassword(this.staffDetails.username, this.modalInput).then(res => {
					// console.log(res);
					uni.hideLoading()
					uni.showToast({
						title: res.msg,
						complete() {
							that.getStaffDetail(that.id);
						}
					})
				}).catch(err => {
					uni.hideLoading()
					console.log(err);
				})
			},
			/* 获取详情 */
			getStaffDetail(id) {
				let that = this
				getStaffDetails( id).then(res => {
					uni.hideLoading()
					// console.log(res);
					this.staffDetails = res.obj;
					//图片回显（flyio出错，暂换用uni接口）
					uni.downloadFile({
						url: baseURL +'/fms/upload/resource/thumbnail/'+ this.staffDetails.photoId,
						success: res => {
							// console.log('uploadImage success, res is:', res);
							if (res.statusCode === 200) {
								// console.log('下载成功');
								/* 将图片临时地址保存 */
								that.imgSrc = res.tempFilePath
								// console.log("data:image/jpeg;base64,"+ res.tempFilePath)
							}
						},
						fail: err => {
							console.log('uploadImage fail', err);
							uni.showModal({
								content: err.msg,
								showCancel: false
							});
							uni.hideLoading();
						},
						complete: () => {
							console.log('complate');
						}
					});
				}).catch(err => {
					uni.hideLoading()
					console.log(err);
				})
			}
		}
	}
</script>

<style>
	body{
		background-color: #F1F1F3;
	}
	.relative{
		position: relative;
	}
	.text-llg{
		font-size: 48upx;
	}
	.prod-height{
		height: 48upx;
	}
	.lf-mat{
		height: 40upx;
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
	.lf-staff-head{
		width: 750upx;
		height: 180upx;
		padding: 0 20px;
		background-color: #FFF;
	}
	.lf-staff-head .one{
		width: 100%;
		height: 100%;
	}
	.lf-staff-head .one image{
		width: 140upx;
		height: 140upx;
		border-radius: 50%;
	}
	.lf-list{
		width: 750upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		align-items: center;
		background-color: #FFF;
	}
	.lf-list view{
		width: 720upx;
		height: 100upx;
		padding: 0 30upx 0 5upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-bottom-line{
		border-bottom: 1upx solid #D9D9D9;
	}
	.lf-reset-btn{
		width: 750upx;
		height: 300upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-reset-btn .btn{
		width: 690upx;
		height: 100upx;
		border-radius: 50upx;
		background-color: #4BA8FF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-modal-input{
		border: 1upx solid #DDDDDD;
		border-radius: 10upx;
		padding: 0 20upx;
	}
	.lf-modal-num{
		position: absolute;
		top: 40upx;
		right: 30upx;
	}
</style>
