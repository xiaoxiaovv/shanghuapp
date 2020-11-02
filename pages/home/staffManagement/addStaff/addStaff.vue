<template>
	<view>
		<view class="lf-mat"></view>
		<view class="lf-staff-loge flex-between bg-white" @click="photoUpload">
			<text class="text-lg">头像</text>
			<view class="flex justify-start align-center">
				<image :src=" imgSrc? imgSrc:'../../../../static/home/icon_default.png'"></image>
				<text class="text-lllg icon-right"></text>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view class="lf-bottom-line">
				<text class="text-lg">所属门店</text>
				<!-- <view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{ storeName ? storeName:'请选择所属门店'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view> -->
				<view v-if="isMerchant" @click="selectStore">
					<text class="meat text-lg text-grey">{{storeName? storeName : '请选择所属门店'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
				<view v-else>
					<text class="meat text-lg text-grey">{{storeName? storeName : ''}}</text>
				</view>
			</view>
			<view class="lf-bottom-line" @click="showPositionOnePicker">
				<text class="text-lg">员工职位</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{pickerValue ? pickerValue:'请选择员工职位'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
			<view class="lf-bottom-line" @click="showModal('name')">
				<text class="text-lg">员工姓名</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{name ? name:'请输入员工姓名'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
			<view class="lf-bottom-line" @click="showSexOnePicker">
				<text class="text-lg">员工性别</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{ sex === 1? '男': sex === 2? '女' : '请选择员工性别'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
			<view @click="showModal('phone')">
				<text class="text-lg">手机号码</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{phone ? phone:'请输入手机号码'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view class="lf-bottom-line" @click="showModal('username')">
				<text class="text-lg">登录账号</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{ username ? username:'请输入登录账号'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
			<view @click="showModal('password')">
				<text class="text-lg">登录密码</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{ password ? password:'请输入登录密码'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
		</view>
		<view class="lf-mat"></view>
		<uni-list>
			<uni-list-item title="状态" show-switch="true" show-arrow="false" switch-checked="true" @switchChange="switchChange"></uni-list-item>
		</uni-list>
		<!-- picker-职位 -->
		<wzp-picker ref="wzpPicker" :mode="mode" :pickerList="pickerList" :defaultIndex="defaultIndex"  @onConfirm="onConfirm"></wzp-picker>
		<!-- picker-性别 -->
		<wzp-picker ref="wzpPickerSex" :mode="modeSex" :pickerList="pickerListSex" :defaultIndex="defaultIndexSex"  @onConfirm="onConfirmSex"></wzp-picker>
		<!-- 模态框 -->
		<neil-modal :show="modalShow" @close="closeModal" :title="modalType | modalTitleFilters" auto-close="false" @confirm="bindBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="16" v-if="modalType === 'name'">
				<input class="lf-modal-input" type="number" v-model="modalInput" maxlength="11" v-if="modalType === 'phone'">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="16" v-if="modalType === 'username'">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="16" v-if="modalType === 'password'">
			</view>
		</neil-modal>
	</view>
</template>

<script>
	import {uniList, uniListItem } from '@dcloudio/uni-ui'
	import wzpPicker from "@/components/wzp-picker/wzpPicker.vue";
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import { baseURL, addStaff} from '../../../../api/vueAPI.js'
	export default {
		components: {uniList, uniListItem, wzpPicker, neilModal},
		data() {
			return {
				username: '',
				password: '',
				name: '',
				phone: '',
				storeId: '',
				status: 1,
				userType: '',
				photoId: '',
				nowLoginUserType: '',
				storeName: '',
				sex: '',
				/* picker~ */
				pickerValue: "",
				mode: '',
				pickerList: [],
				defaultIndex: [],
				pickerValueSex: "",
				modeSex: '',
				pickerListSex: [],
				defaultIndexSex: [],
				/* ~picker */
				modalType: 'name',	//当前模态框类型
				modalShow: false,	//模态框显示
				modalInput: '',		//模态框输入
				modalTitle: '',		//模态框标题
				imgSrc: '',
				avatar: '',
				ispPhotoUpload: false,	//onShow检查true时，上传图片
				isMerchant: true
			}
		},
		created() {
			this.nowLoginUserType = uni.getStorageSync('userType');
		},
		onNavigationBarButtonTap() {
			// console.log('点击到按钮-保存')
			this.addStaff();
		},
		filters:{
			modalTitleFilters(val) {
				switch(val) {
					case 'name':
						return "员工姓名"
					case 'phone':
						return "手机号码"
					case 'username':
						return "登录账号"
					case 'password':
						return "登录密码"
					default:
						return "暂无"
				}
			}
		},
		methods: {
			/* 选择所属门店 */
			selectStore() {
				uni.navigateTo({
					url: '../../storeSelect/index/index'
				})
			},
			/* 打开模态框类型 */
			showModal(type) {
				this.modalType = type;
				if(this.modalType === ''){
					return
				}
				switch(this.modalType){
					case 'name':
						this.modalInput = this.name
						break
					case 'phone':
						this.modalInput = this.phone
						break
					case 'username':
						this.modalInput = this.username
						break
					case 'password':
						this.modalInput = this.password
						break
				}
				this.modalShow = true;
			},
			/* 模态框点击事件 */
			bindBtn(type) {
				if(type === 'confirm'){
					switch(this.modalType){
						case 'name':
							this.name = this.modalInput
							break
						case 'phone':
							this.phone = this.modalInput
							break
						case 'username':
							if (this.modalInput && !/^\d{5,15}$/.test(this.modalInput)) {
								uni.showToast({
									title: '用户名仅限5-15位数字',
									icon: 'none'
								})
							} else {
								this.username = this.modalInput
							}
							break
						case 'password':
							this.password = this.modalInput
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
				this.status = check.value === true? 1:2;
			},
			/* 添加员工 */
			addStaff() {
				if(this.username.trim() === '' || this.password.trim() === '' || this.name.trim() === '' || this.phone === '' || this.storeId === '' || this.status === '' || this.userType === '' || this.sex === ''){
					uni.showModal({
						content: '不能有空',
						showCancel: false
					});
					uni.hideLoading();
					return
				}
				if (!/^\d{5,15}$/.test(this.username)) {
					return uni.showToast({
						title: '用户名仅限5-15位数字',
						icon: 'none'
					})
				}
				addStaff( this.username.trim(), this.password.trim(), this.name.trim(), this.phone, this.storeId, this.status, this.userType, this.photoId, this.sex).then(res => {
					// console.log(res)
					uni.showToast({
						title: '添加成功',
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
							this.userType = 2
							break
						case '店员':
							this.userType = 3
							break
					}
				}
			},
			/* 显示性别picker */
			showSexOnePicker() {
				this.modeSex = 'one';
					this.pickerListSex = this.pickerListSex = [{
							label: "男"
						},
						{
							label: "女"
						}
					];
				this.defaultIndexSex = [0];
				this.$refs.wzpPickerSex.showPicker();
			},
			onConfirmSex(e) {
				if (this.modeSex == "one") {
					this.pickerValueSex = this.pickerListSex[e[0]].label;
					switch(this.pickerValueSex){
						case '男':
							this.sex = 1
							break
						case '女':
							this.sex = 2
							break
					}
					// console.log(this.sex)
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
						// console.log("chooseImage",res)
						uni.navigateTo({
							url: '../../upload/upload?src=' + src
						})
					}
				});
			}
		},
		onBackPress() {
			if (this.$refs.wzpPicker.pickerShow) {
				this.$refs.wzpPicker.closePicker();
				return true;
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
					url: baseURL +'/fms/upload/files_upload/file/user',
					filePath: that.avatar,
					name: 'files',
					// formData: { token: token},
					success: res => {
						// console.log('uploadImage success, res is:', res);
						/* 将图片id保存 */
						that.photoId = JSON.parse(res.data).obj
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
				
				this.ispPhotoUpload = false
			}
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
	.lf-staff-loge{
		width: 750upx;
		height: 140upx;
		padding: 0 30upx;
	}
	.lf-staff-loge image{
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
