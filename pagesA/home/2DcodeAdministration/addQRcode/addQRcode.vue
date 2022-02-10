<template>
	<view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view class="lf-bottom-line" @click="showModal('name')">
				<text class="text-lg">二维码名称</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{name ? name : '请输入'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
			<view class="align-hor-bet match-width">
				<text class="text-lg">绑定门店</text>
				<view>
					<!-- <view class="prod prod-height"></view> -->
					<view v-if="isMerchant" @click="selectStore">
						<text class="meat text-lg text-grey">{{storeName? storeName : '请选择'}}</text>
						<text class="meat text-lllg icon-right"></text>
					</view>
					<view v-else>
						<text class="meat text-lg text-grey">{{storeName? storeName : ''}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view class="lf-bottom-line" @click="selectStaff">
				<text class="text-lg">绑定员工</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{userName ? userName : '请选择'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
			<view @click="showModal('money')">
				<text class="text-lg">二维码金额</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{money? money : '请输入'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
		</view>
		<view class="lf-mat-text">
			<text class="text-sm text-grey">未输入金额，则生成非固定金额二维码</text>
		</view>
		<uni-list>
			<view class="lf-list">
				<view @click="showModal('description')">
					<view>
						<text class="text-lg">二维码描述</text>
						<text class="icon-question text-llg margin-left-10"></text>
					</view>
					<view>
						<view class="prod prod-height"></view>
						<text class="meat text-lg text-grey">{{description? description : '请输入'}}</text>
						<text class="meat text-lllg icon-right"></text>
					</view>
				</view>
			</view>
		</uni-list>
		<view class="lf-list">
			<view class="lf-bottom-line" @click="showModal('aliDeviceSn')">
				<text class="text-lg">设备SN</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{aliDeviceSn ? aliDeviceSn : '请输入'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
		</view>
		<view class="lf-btn-box">
			<view class="bg-orange" @click="scanCode"><text class="text-lg text-white">扫码激活</text></view>
			<view class="bg-orange text-orange" @click="systemSave"><text class="text-lg ">系统生成</text></view>
		</view>
		<neil-modal :show="modalShow" @close="closeModal" :title="modalType | modalTitleFilters" auto-close="false" @confirm="bindBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;" class="relative">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="15" v-if="modalType === 'name'">
				<input class="lf-modal-input" type="number" v-model="modalInput" maxlength="7" v-if="modalType === 'money'">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="20" v-if="modalType === 'description'">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="20" v-if="modalType === 'aliDeviceSn'">
				<view class="lf-modal-num">
					<text>{{modalInput.length}}/{{modalInputNum}}</text>
				</view>
			</view>
		</neil-modal>
	</view>
</template>

<script>
	import {uniList, uniListItem } from '@dcloudio/uni-ui'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import { addQRcode, scanBlankQRcode} from '../../../../api/vueAPI.js'
	export default {
		components: {uniList, uniListItem, neilModal},
		data() {
			return {
				name: '',		//二维码名称
				storeId: '',		//门店编号
				storeName: '',		//门店名字
				userId: '',		//员工编号
				userName: '',		//员工名字
				money: '',		//二维码金额
				description: '',		//支付凭证描述
				status: 1,		//二维码状态
				blankQrCodeId: '',	//空二维码id
				codeResult: '',		//扫码内容
				modalType: 'name',	//当前模态框类型
				modalShow: false,	//模态框显示
				modalInput: '',		//模态框输入
				modalTitle: '',		//模态框标题
				modalInputNum: 15,	//模态框限定字符数
				isMerchant: true,
				aliDeviceSn:''//如意设备SN
			}
		},
		filters:{
			modalTitleFilters(val) {
				switch(val) {
					case 'name':
						return "二维码名称"
					case 'money':
						return "二维码金额"
					case 'description':
						return "二维码描述"
					default:
						return "暂无"
				}
			}
		},
		methods: {
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
					case 'money':
						this.modalInput = this.money
						break
					case 'description':
						this.modalInput = this.description
						break
					case 'aliDeviceSn':
						this.modalInput = this.aliDeviceSn
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
						case 'money':
							this.money = this.modalInput
							break
						case 'description':
							this.description = this.modalInput
							break
						case 'aliDeviceSn':
							this.aliDeviceSn = this.modalInput
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
			/* 选择所属门店 */
			selectStore() {
				uni.navigateTo({
					url: '../../storeSelect/index/index'
				})
			},
			/* 选择所属员工 */
			selectStaff() {
				if (!this.storeName) {
					uni.showToast({
						title: '请先选择门店',
						icon: 'none'
					})
					return 
				}
				// if(this.storeId){
					uni.navigateTo({
						url: ('../../selectStaff/index/index?storename=' + this.storeName + '&storeid=' + this.storeId)
					})
				// }else{
					// uni.showToast({
						// title:"未选择门店"
					// })
				// }
			},
			/* 扫码激活 */
			scanCode() {
				if(this.name.trim() === '' || this.storeId === '' || this.userId === '' ){
					uni.showModal({
						content: '名称/门店/员工不能有空',
						showCancel: false
					});
					return
				}
				let that = this;
				uni.scanCode({
					onlyFromCamera: true,
					success(res) {
						that.codeResult = res.result
						// console.log("扫码内容："+res.result)
						// console.log("扫码类型："+res.scanType)
						// console.log('扫码成功，进行激活。。。');
						that.blankQrCodeId = res.result.split("?id=")[1]
						// console.log(that.blankQrCodeId)
						that.addQR(1)
					}
				})
			},
			/* 系统生成 */
			systemSave() {
				uni.showToast({
					title:"请用扫码绑定~",
					icon: "none"
				})
				// console.log(this.name, this.storeId, this.userId)
				// if(this.name.trim() === '' || this.storeId === '' || this.userId === ''){
				// 	uni.showModal({
				// 		content: '名称/门店/员工不能有空',
				// 		showCancel: false
				// 	});
				// 	return
				// }
				// this.addQR(2)
			},
			/* 新增二维码 */
			addQR(flag) {
				// console.log('新增二维码', this.name, this.storeId, this.userId, this.money, this.description, flag, this.blankQrCodeId)
				addQRcode(this.name, this.storeId, this.userId, this.money, this.description, flag, this.blankQrCodeId,this.aliDeviceSn).then(res => {
					// console.log(res)
					uni.showToast({
						title:"添加成功",
						icon: "success"
					})
					uni.navigateBack()
				}).catch(err => {
					console.log(err)
				})
			},
		},
		
		onShow() {
			// console.log('商店', this.storeId)
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
	.text-ssm{
		font-size: 12upx;
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
	.lf-mat-text{
		height: 80upx;
		padding: 20upx 40upx;
		
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
	.lf-btn-box{
		width: 750upx;
		height: 180upx;
		padding: 0 30upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.lf-btn-box > view{
		width: 320upx;
		height: 100upx;
		/* border:1upx solid #FF9900; */
		border-radius: 60upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lf-modal-num{
		position: absolute;
		top: 40upx;
		right: 30upx;
	}
	.bg-orange {
		background-color: #4BA8FF;
		color: #FFF;
		border: 1upx solid transparent;
		box-sizing: border-box;
	}
	.bg-orange.text-orange {
		background-color: #FFF;
		color: #4BA8FF;
		border: 1upx solid #4BA8FF;
		box-sizing: border-box;
	}
	.bg-orange:active {
		opacity: 0.8;
	}
</style>
