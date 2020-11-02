<template>
	<view>
		<view class="lf-mat"></view>
		<view class="lf-store-loge flex-between bg-white" @click="photoUpload">
			<text class="text-lg">门店logo</text>
			<view class="flex justify-start align-center">
				<image :src="imgSrc ? imgSrc : '../../../../static/home/store_icon1.png'"></image>
				<text class="text-lllg icon-right"></text>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view class="lf-bottom-line" @click="showModal('storeNo')">
				<text class="text-lg">门店编号</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{storeDetails.storeNo ? storeDetails.storeNo : ''}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
			<view class="lf-bottom-line" @click="showModal('name')">
				<text class="text-lg">门店名称</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{storeDetails.name ? storeDetails.name : ''}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
			<view class="lf-bottom-line" @click="showModal('phone')">
				<text class="text-lg">门店电话</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{storeDetails.phone ? storeDetails.phone : ''}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
			<view @click="showModal('address')">
				<text class="text-lg">门店地址</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-grey">{{storeDetails.province ? storeDetails.province : ''}} {{storeDetails.city ? storeDetails.city : ''}} {{storeDetails.address ? storeDetails.address : ''}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
		</view>
		<view class="lf-mat"></view>
		<uni-list>
			<view class="lf-list">
				<view class="lf-bottom-line" @click="showModal('paymentDesciption')">
					<view>
						<text class="text-lg">支付凭证描述</text>
						<text class="icon-question text-llg margin-left-10"></text>
					</view>
					<view>
						<view class="prod prod-height"></view>
						<text class="meat text-lg text-grey">{{storeDetails.paymentDesciption ? storeDetails.paymentDesciption : ''}}</text>
						<text class="meat text-lllg icon-right"></text>
					</view>
				</view>
			</view>
			<uni-list-item title="门店状态" show-switch="true" show-arrow="false" @switchChange="switchChange" :switch-checked="storeDetails.status === 1? true:false"></uni-list-item>
		</uni-list>
		<neil-modal :show="modalShow" @close="closeModal" :title="modalType | modalTitleFilters" auto-close="false" @confirm="bindBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<input class="lf-modal-input" type="number" v-model="modalInput" maxlength="10" v-if="modalType === 'storeNo'">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="18" v-if="modalType === 'name'">
				<input class="lf-modal-input" type="number" v-model="modalInput" maxlength="11" v-if="modalType === 'phone'">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="20" v-if="modalType === 'paymentDesciption'">
				<view class="lf-modal-city" v-if="modalType === 'address'">
					<view @click="showCityPicker">
						<text class="text-lg">省市选择:</text>
						<view class="picker-city">
							<view>
								<text>{{modalInput.province}}</text>
								<text>{{modalInput.city}}</text>
							</view>
							<view>
								<text class="text-lg icon-right text-right"></text>
							</view>
						</view>
					</view>
					<view>
						<text class="text-lg">详细地址:</text>
						<input class="lf-city-input" type="text" maxlength="10" v-model="modalInput.address">
					</view>
				</view>
			</view>
		</neil-modal>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
	import {uniList, uniListItem } from '@dcloudio/uni-ui'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import { baseURL, getStoreDetails, getImgThumbnail, changeStore} from '../../../../api/vueAPI.js'
    import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    import cityData from '@/common/city.data.js';
	export default {
		components: {uniList, uniListItem, neilModal, mpvuePicker},
		data() {
			return {
				storeDetails: '',
				imgSrc: '',
				id: '',
				modalType: 'name',	//当前模态框类型
				modalShow: false,	//模态框显示
				modalInput: '',		//模态框输入
				modalTitle: '',		//模态框标题
				avatar: '',
				ispPhotoUpload: false,	//onShow检查true时，上传图片
				/* mpvue-picker~ */
                mulLinkageTwoPicker: cityData,
                themeColor: '#007AFF',
                pickerText: '',
                mode: '',
                deepLength: 1,
                pickerValueDefault: [0],
                pickerValueArray:[],
				/* ~mpvue-picker */
			}
		},
		onLoad(obj) {
			this.id = obj.id
			this.getStoreDetail(this.id);
		},
		onNavigationBarButtonTap() {
			// console.log('点击到按钮-保存')
			if(this.storeDetails.name.trim() === '' || this.storeDetails.storeNo === '' || this.storeDetails.province === '' || this.storeDetails.city === '' || this.storeDetails.address === '' || this.storeDetails.phone === '' || this.storeDetails.status === ''){
				uni.showModal({
					content: '不能有空',
					showCancel: false
				});
				uni.hideLoading();
				return
			}
			changeStore(this.storeDetails.name.trim(), this.storeDetails.storeNo, this.storeDetails.province, this.storeDetails.city, this.storeDetails.address, this.storeDetails.phone, this.storeDetails.paymentDesciption.trim(), this.storeDetails.status, this.storeDetails.photoId, this.storeDetails.id).then(res => {
				if (res.code === 200) {
					uni.showToast({
						title: '修改成功',
						icon: 'success',
						duration: 3000
					})
				}				
				setTimeout(() => {
					uni.navigateBack()
				}, 1000)
			}).catch(err => {
				console.log(err)
				uni.showModal({
					content: "修改失败",
					showCancel: false
				});
				uni.hideLoading();
			})
		},
		filters:{
			modalTitleFilters(val) {
				switch(val) {
					case 'name':
						return "门店名称"
					case 'storeNo':
						return "门店编号"
					case 'phone':
						return "门店电话"
					case 'paymentDesciption':
						return "支付凭证描述"
					case 'address':
						return "门店地址"
					default:
						return "错误数值："+ val
				}
			}
		},
		methods: {
			/* 获取详情 */
			getStoreDetail(id) {
				let that = this;
				getStoreDetails( id).then(res => {
					// console.log(res);
					this.storeDetails = res.obj;
					// console.log(res.obj.photoId === null? true:false)
					if(res.obj.photoId === null){
						return
					}
					//图片回显（flyio出错，换用uni接口）
					if(this.storeDetails.photoId === null || this.storeDetails.photoId === ''){
						return
					}
					uni.downloadFile({
						url: baseURL +'/fms/upload/resource/thumbnail/'+ this.storeDetails.photoId,
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
			/* 打开模态框类型 */
			showModal(type) {
				this.modalType = type;
				if(this.modalType === ''){
					return
				}
				switch(this.modalType){
					case 'name':
						this.modalInput = this.storeDetails.name
						break
					case 'storeNo':
						this.modalInput = this.storeDetails.storeNo
						break
					case 'phone':
						this.modalInput = this.storeDetails.phone
						break
					case 'paymentDesciption':
						this.modalInput = this.storeDetails.paymentDesciption
						break
					case 'address':
						this.modalInput = {
							province:this.storeDetails.province,
							city:this.storeDetails.city,
							address:this.storeDetails.address
						}
						break
				}
				this.modalShow = true;
			},
			/* 模态框点击事件 */
			bindBtn(type) {
				if(type === 'confirm'){
					switch(this.modalType){
						case 'name':
							this.storeDetails.name = this.modalInput
							break
						case 'storeNo':
							this.storeDetails.storeNo = this.modalInput
							break
						case 'phone':
							this.storeDetails.phone = this.modalInput
							break
						case 'paymentDesciption':
							this.storeDetails.paymentDesciption = this.modalInput
							break
						case 'address':
							this.storeDetails.province = this.modalInput.province;
							this.storeDetails.city = this.modalInput.city;
							this.storeDetails.address = this.modalInput.address;
					}
					uni.hideKeyboard()
				}
			},
			/* 模态框关闭触发事件 */
			closeModal(){
				this.modalShow = false;
				uni.hideKeyboard()
			},
			/* 状态切换switch触发 */
			switchChange(check){
				// console.log(check.value)
				this.storeDetails.status = check.value === true? 1:2;
				// console.log(this.storeDetails.status)
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
			},
			/* city-picker */
			//取消
			onCancel(e) {
				// console.log(e)
			},
			// 二级联动选择
			showCityPicker() {
				this.pickerValueArray = this.mulLinkageTwoPicker
				this.mode = 'multiLinkageSelector'
				this.deepLength = 2
				this.pickerValueDefault = [0, 0]
				this.$refs.mpvuePicker.show()
			},
			//省/市联动确定按钮回调
			onConfirm(e) {
				this.pickerText = JSON.stringify(e)
				// console.log(this.pickerValueDefault)
				// console.log(this.pickerValueArray)
				// console.log(JSON.parse(this.pickerText) )
				this.modalInput.province = JSON.parse(this.pickerText).label.split('-')[0]
				this.modalInput.city = JSON.parse(this.pickerText).label.split('-')[1]
				// console.log(this.modalInput)
			}
		},
		onBackPress() {
		  if (this.$refs.mpvuePicker.showPicker) {
			this.$refs.mpvuePicker.pickerCancel();
			return true;
		  }
		},
		onUnload() {
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel()
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
						that.storeDetails.photoId = JSON.parse(res.data).obj
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
				
				this.ispPhotoUpload = false
			}
			/* 刷新页面 */
			// this.getStoreDetail(this.id);
			// console.log("~onShow")
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
	.lf-modal-city{
		height: 160upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-content: center;
	}
	.lf-modal-city > view{
		width: 100%;
		height: 60upx;
		margin: 10upx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-modal-city .picker-city{
		width: 300upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-modal-city .picker-city text{
		margin: 0 10upx;
	}
	.lf-modal-city .picker-city > view{
		display: inline-block;
		
	}
	.lf-city-input{
		border-bottom: 1upx solid #DDDDDD;
		padding: 0 20upx;
	}
</style>