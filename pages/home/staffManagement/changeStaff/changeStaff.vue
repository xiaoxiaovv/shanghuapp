<template>
	<view>
		<view class="lf-mat"></view>
		<view class="lf-store-loge flex-between bg-white" @click="photoUpload">
			<text class="text-lg">头像</text>
			<view class="flex justify-start align-center">
				<image :src=" imgSrc? imgSrc:'../../../../static/home/icon_default.png'"></image>
				<text class="text-lllg icon-right"></text>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view class="lf-bottom-line">
				<text class="text-lg">门店</text>
				<!-- <view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{ staffDetails.storeName ? staffDetails.storeName : ''}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view> -->
				<view v-if="isMerchant" @click="selectStore">
					<!-- <text class="meat text-lg text-grey">{{storeName? storeName : '请选择所属门店'}}</text>
					<text class="meat text-lllg icon-right"></text> -->
					<text class="meat text-lg text-grey">{{ staffDetails.storeName ? staffDetails.storeName : ''}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
				<view v-else>
					<text class="meat text-lg text-grey">{{storeName? storeName : ''}}</text>
				</view>
			</view>
			<view class="lf-bottom-line" @click="showPositionOnePicker">
				<text class="text-lg">职位</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{staffDetails.userType === '2'? '店长':'店员'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
			<view class="lf-bottom-line" @click="showModal('name')">
				<text class="text-lg">姓名</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{staffDetails.name}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
			<view @click="showModal('phone')">
				<text class="text-lg">手机号</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{staffDetails.phone}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view>
				<!--  @click="showModal('username')" -->
				<view>
					<text class="text-lg">账号</text>
				</view>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{staffDetails.username}}</text>
					<!-- <text class="meat text-lllg icon-right"></text> -->
				</view>
			</view>
		</view>
		<view class="lf-mat"></view>
		<uni-list>
			<uni-list-item title="员工状态" show-switch="true" show-arrow="false" @switchChange="switchChange" :switch-checked="staffDetails.status === 1? true:false"></uni-list-item>
		</uni-list>
		<!-- picker -->
		<wzp-picker ref="wzpPicker" :mode="mode" :pickerList="pickerList" :defaultIndex="defaultIndex"  @onConfirm="onConfirm"></wzp-picker>
		<!-- 模态框 -->
		<neil-modal :show="modalShow" @close="closeModal" :title="modalType | modalTitleFilters" auto-close="false" @confirm="bindBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="16" v-if="modalType === 'name'">
				<input class="lf-modal-input" type="number" v-model="modalInput" maxlength="11" v-if="modalType === 'phone'">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="16" v-if="modalType === 'username'">
			</view>
		</neil-modal>
	</view>
</template>

<script>
	import {uniList, uniListItem } from '@dcloudio/uni-ui'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import wzpPicker from "@/components/wzp-picker/wzpPicker.vue";
	import { baseURL, getStaffDetails, changeStaff} from '../../../../api/vueAPI.js'
	export default {
		components: {uniList, uniListItem, neilModal, wzpPicker},
		data() {
			return {
				staffDetails: '',
				storeId: '',
				storeName: '',
				/* picker~ */
				pickerValue: "",
				mode: '',
				pickerList: [],
				defaultIndex: [],
				/* ~picker */
				modalType: 'name',	//当前模态框类型
				modalShow: false,	//模态框显示
				modalInput: '',		//模态框输入
				modalTitle: '',		//模态框标题
				id: '',		//员工id
				imgSrc: '',
				avatar: '',
				ispPhotoUpload: false,	//onShow检查true时，上传图片
				isMerchant: true
			}
		},
		onLoad(obj) {
			this.id = obj.id
			this.getStaffDetail(this.id)
		},
		onNavigationBarButtonTap() {
			// console.log('点击到按钮-保存')
			if(this.staffDetails.id === '' || this.staffDetails.name.trim() === '' || this.staffDetails.phone === '' || this.staffDetails.storeId === '' || this.staffDetails.status === '' || this.staffDetails.userType === ''){
				// console.log('不能有空')
				return
			}
			changeStaff( this.staffDetails.id, this.staffDetails.name.trim(), this.staffDetails.phone, this.staffDetails.storeId, this.staffDetails.status, this.staffDetails.userType, this.staffDetails.photoId).then(res => {
				// console.log(res);
					uni.showToast({
						title: '修改成功',
						icon: 'success',
						duration: 1000
					});
					uni.navigateBack()
				}).catch(err => {
					console.log(err)
					uni.showModal({
						content: err.msg,
						showCancel: false
					});
					uni.hideLoading();
				})
		},
		filters:{
			modalTitleFilters(val) {
				switch(val) {
					case 'name':
						return "请输入姓名"
					case 'phone':
						return "请输入手机号"
					case 'username':
						return "请输入登录账号"
					default:
						return "暂无"
				}
			}
		},
		watch:{
			storeId(val,oldVal){
				// console.log(val);
				this.staffDetails.storeId = val
			},
			storeName(val,oldVal){
				// console.log(val);
				this.staffDetails.storeName = val
			}
		},
		methods: {
			/* 查看员工详情 */
			getStaffDetail(id) {
				let that = this
				getStaffDetails(id).then(res => {
					// console.log(res);
					this.staffDetails = res.obj;
					//图片回显（flyio出错，换用uni接口）
					if(this.staffDetails.photoId === null || this.staffDetails.photoId === ''){
						return
					}
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
					console.log(err);
				}) 
			},
			/* 选择所属门店 */
			selectStore() {
				uni.navigateTo({
					url: '../../storeSelect/index/index?status=1'
				}) 
			},
			/* 显示员工职位picker */
			showPositionOnePicker() {
				this.mode = 'one';
					this.pickerList = this.pickerList = [{
							label: "店长"
						},
						{
							label: "店员"
						}
					];
				this.defaultIndex = [0];
				this.$refs.wzpPicker.showPicker();
			},
			onConfirm(e) {
				if (this.mode == "one") {
					this.pickerValue = this.pickerList[e[0]].label;
					switch(this.pickerValue){
						case '店长':
							this.staffDetails.userType = '2'
							break
						case '店员':
							this.staffDetails.userType = '3'
							break
					}
				}
			},
			/* 打开模态框类型 */
			showModal(type) {
				this.modalType = type;
				if(this.modalType === ''){
					return
				}
				switch(this.modalType){
					case 'name':
						this.modalInput = this.staffDetails.name
						break
					case 'phone':
						this.modalInput = this.staffDetails.phone
						break
					case 'username':
						this.modalInput = this.staffDetails.username
						break
				}
				this.modalShow = true;
			},
			/* 模态框点击事件 */
			bindBtn(type) {
				if(type === 'confirm'){
					switch(this.modalType){
						case 'name':
							this.staffDetails.name = this.modalInput
							break
							break
						case 'phone':
							this.staffDetails.phone = this.modalInput
							break
						case 'username':
							this.staffDetails.username = this.modalInput
							break
					}
				}
			},
			/* 模态框关闭触发事件 */
			closeModal(){
				this.modalShow = false;
			},
			/* 状态切换switch触发 */
			switchChange(check){
				if(check.value === true){
					this.staffDetails.status = 1;
				}else if(check.value === false){
					this.staffDetails.status = 2;
				}
			},
			/* 进行图片上传操作 */
			photoUpload() {
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success(res) {
						const src = res.tempFilePaths[0];
			
						uni.navigateTo({
							url: '../../upload/upload?src=' + src
						})
					}
				});
			}
		},
		onShow() {
			// console.log("onShow~")
			if(this.ispPhotoUpload){
				let that = this;
				/* 预览图显示 */
				this.imgSrc = this.avatar
				
				//图片上传服务器（flyio出错，换用uni接口）
				uni.uploadFile({
					url: baseURL +'/fms/upload/files_upload/file/store',
					filePath: that.avatar,
					name: 'files',
					// formData: { token: token},
					success: res => {
						// console.log('uploadImage success, res is:', res);
						/* 将图片id保存 */
						that.staffDetails.photoId = JSON.parse(res.data).obj
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
						console.log('complate');
					}
				});
				/* 关闭图片更新指示 */
				this.ispPhotoUpload = false
			}
			/* 刷新页面 */
			// this.getStaffDetail(this.id)
			// console.log("~onShow")
			// 获取商店名称
			if(uni.getStorageSync('userType') == 1){
				this.isMerchant = true
			} else{
				this.isMerchant = false	
			}
			let storeDetail = uni.getStorageSync("nowStoreDetail")
			if(storeDetail != '' && storeDetail != null && storeDetail != undefined && storeDetail){
				this.storeName = storeDetail.storeName
				this.storeId = storeDetail.storeId
			}
		}
	}
</script>

<style>
	body{
		background-color: #F1F1F3;
	}
	.bg-white{
		background-color: #FFF;
	}
	.text-llg{
		font-size: 36upx;
	}
	.text-lllg{
		font-size: 48upx;
	}
	.flex-between{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-mat{
		height: 40upx;
	}
	.lf-store-loge{
		width: 750upx;
		height: 140upx;
		padding: 0 30upx;
	}
	.lf-store-loge image{
		width: 100upx;
		height: 100upx;
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
	.lf-list > view{
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
	.margin-left-10{
		margin-left: 10upx;
	}
	.prod-height{
		height: 36upx;
	}
	.lf-modal-input{
		border: 1upx solid #DDDDDD;
		border-radius: 10upx;
		padding: 0 20upx;
	}
</style>
