<template>
	<view>
		<view class="lf-mat"></view>
		<view class="lf-store-head">
			<view class="one flex justify-start align-center border-bottom-line">
				<image 
					class="margin-right-20" 
					:src=" imgSrc? imgSrc : '../../../../static/home/store_icon1.png'"/>
				<view class="flex flex-direction justify-between height-100">
					<text class="text-lg">{{storeDetails.name ? storeDetails.name : ''}}</text>
					<text class="text-grey text-sm">创建于 {{storeDetails.createTime ? storeDetails.createTime : ''}}</text>
				</view>
			</view>
			<view class="two flex justify-between align-center">
				<view class="text-grey">
					<view class="prod prod-height"></view>
					<text class="meat icon-location text-llg margin-right-20"></text>
					<text class="meat text-grey">{{storeDetails.province ? storeDetails.province : ''}} {{storeDetails.city ? storeDetails.city : ''}} {{storeDetails.address ? storeDetails.address : ''}}</text>
				</view>
				<image src="../../../../static/home/icon_call_phone.png" @click="callPhone(storeDetails.phone)"></image>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view class="lf-bottom-line">
				<text>门店编号</text>
				<text>{{storeDetails.storeNo ? storeDetails.storeNo : ''}}</text>
			</view>
			<view>
				<text>门店人数</text>
				<text>{{storeDetails.storeUserNum}}</text>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view class="lf-bottom-line">
				<text>支付凭证描述</text>
				<text>{{storeDetails.paymentDesciption ? storeDetails.paymentDesciption : ''}}</text>
			</view>
			<view>
				<text>门店状态</text>
				<text>{{storeDetails.status | stutasFilters}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { baseURL, getStoreDetails, getImgThumbnail} from '../../../../api/vueAPI.js'
	export default {
		data() {
			return {
				storeDetails: '',
				imgSrc: '',
				id: '',
			}
		},
		onLoad(obj) {
			this.id = obj.id
			// this.getStoreDetail(obj.id);
		},
		onNavigationBarButtonTap() {
			// console.log('点击到按钮-修改')
			// console.log(this.storeDetails.id)
			uni.navigateTo({
				url: '../changeStore/changeStore?id='+ this.storeDetails.id
			})
		},
		filters:{
			stutasFilters(val) {
				return parseInt(val) === 1? '启用':'注销'
			}
		},
		onShow() {
			/* 刷新页面 */
			this.getStoreDetail(this.id);
		},
		methods: {
			/* 获取详情 */
			getStoreDetail(id) {
				let that = this;
				getStoreDetails( id).then(res => {
					// console.log(res);
					this.storeDetails = res.obj;
					/* 判断是否有图片 */
					if(this.storeDetails.photoId === null){
						return
					}
					// console.log(this.storeDetails.photoId)
					/* 图片回显 */
					// getImgThumbnail( this.storeDetails.photoId).then(res =>{
					// 	console.log(res)
					// }).catch(err => {
					// 	console.log(err)
					// })
					
					//图片回显（flyio出错，换用uni接口）
					if(this.storeDetails.photoId === null || this.storeDetails.photoId === ''){
						return
					}
					uni.downloadFile({
						url: baseURL+'/fms/upload/resource/thumbnail/'+ this.storeDetails.photoId,
						success: res => {
							// console.log('uploadImage success, res is:', res);
							if (res.statusCode === 200) {
								// console.log('下载成功');
								/* 将图片临时地址保存 */
								that.imgSrc = res.tempFilePath
								// console.log(that.imgSrc)
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
			/* 打电话 */
			callPhone(phone) {
				if(phone){
					uni.makePhoneCall({
						phoneNumber: phone
					})
					return
				}
				uni.showToast({
					title:'该门店无电话'
				})
			}
		}
	}
</script>

<style>
	body{
		background-color: #F1F1F3;
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
	.lf-store-head{
		width: 750upx;
		height: 240upx;
		padding: 0 20px;
		background-color: #FFF;
	}
	.lf-store-head .one{
		width: 100%;
		height: 140upx;
	}
	.lf-store-head .one image{
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}
	.lf-store-head .two{
		width: 100%;
		height: 100upx;
	}
	.lf-store-head .two image{
		width: 50upx;
		height: 50upx;
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
</style>
