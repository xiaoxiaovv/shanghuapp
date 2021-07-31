<template>
	<view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view class="lf-bottom-line" @click="showModal('name')">
				<text class="text-lg">二维码名称</text>
				<view>
					<view class="prod prod-height"></view>
					<text class="meat text-lg text-grey">{{qrcodeDetails.name ? qrcodeDetails.name : '请输入'}}</text>
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
					<text class="meat text-lg text-grey">{{(qrcodeDetails.money? qrcodeDetails.money : 0) | dealWithMoney}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
		</view>
		<view class="lf-mat-80">
			<text class="text-sm text-grey">未输入金额，则生成非固定金额二维码</text>
		</view>
		<uni-list>
			<view class="lf-list">
				<view class="lf-bottom-line match-width align-hor-bet box" @click="showModal('description')">
					<view class="align-left">
						<text class="text-lg">二维码描述</text>
						<text class="icon-question text-llg margin-left-10"></text>
					</view>
					<view class="align-left">
						<view class="prod prod-height"></view>
						<text class="meat text-lg text-grey">{{qrcodeDetails.description ? qrcodeDetails.description : ''}}</text>
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
					<text class="meat text-lg text-grey">{{qrcodeDetails.aliDeviceSn ? qrcodeDetails.aliDeviceSn : '请输入'}}</text>
					<text class="meat text-lllg icon-right"></text>
				</view>
			</view>
		</view>
		<neil-modal :show="modalShow" @close="closeModal" :title="modalType | modalTitleFilters" auto-close="false" @confirm="bindBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="15" v-if="modalType === 'name'">
				<input class="lf-modal-input" type="number" v-model="modalInput" maxlength="7" v-if="modalType === 'money'">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="20" v-if="modalType === 'description'">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="20" v-if="modalType === 'aliDeviceSn'">
			</view>
		</neil-modal>
	</view>
</template>

<script>
	import {uniList, uniListItem } from '@dcloudio/uni-ui'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import { changeQRcode, getQRcodeDetail} from '../../../../api/vueAPI.js'
	export default {
		components: {uniList, uniListItem, neilModal},
		data() {
			return {
				qrcodeDetails: '',
				storeId: '',		//门店编号
				storeName: '',		//门店名字
				userId: '',		//员工编号
				userName: '',		//员工名字
				modalType: 'name',	//当前模态框类型
				modalShow: false,	//模态框显示
				modalInput: '',		//模态框输入
				modalTitle: '',		//模态框标题
				id: '',		//二维码id
				isMerchant: true
			}
		},
		onLoad(obj) {
			this.id = obj.id
			getQRcodeDetail(this.id).then(res => {
				// console.log(res)
				this.qrcodeDetails = res.obj
				this.storeId = this.qrcodeDetails.storeId
				this.storeName = this.qrcodeDetails.storeName
				this.userId = this.qrcodeDetails.userId
				this.userName = this.qrcodeDetails.userName
			}).catch(err => {
				console.log(err)
			})
		},
		onNavigationBarButtonTap() {
			// console.log('点击到按钮-保存')
			if(this.qrcodeDetails.name.trim() === '' || this.storeId === '' || this.userId === ''){
				uni.showModal({
					content: '名称/门店/员工不能有空',
					showCancel: false
				});
				uni.hideLoading();
				return
			}
			changeQRcode( this.qrcodeDetails.name.trim(), this.storeId, this.userId, this.qrcodeDetails.money, this.qrcodeDetails.description, this.qrcodeDetails.id,this.qrcodeDetails.aliDeviceSn).then(res => {
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
						return "二维码名称"
					case 'money':
						return "二维码金额"
					case 'description':
						return "二维码描述"
					default:
						return "暂无"
				}
			},
			dealWithMoney(money) {
			  if (/^[0-9]+\.[0-9]$/.test(money)) {
				money = money + '0'
			  } else if (/^[0-9]+$/.test(money)) {
				money = money + '.00'
			  }
			  return money
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
						this.modalInput = this.qrcodeDetails.name
						break
					case 'money':
						this.modalInput = this.qrcodeDetails.money
						break
					case 'description':
						this.modalInput = this.qrcodeDetails.description
						break
					case 'aliDeviceSn':
						this.modalInput = this.qrcodeDetails.aliDeviceSn
						break
				}
				this.modalShow = true;
			},
			/* 模态框点击事件 */
			bindBtn(type) {
				if(type === 'confirm'){
					switch(this.modalType){
						case 'name':
							this.qrcodeDetails.name = this.modalInput
							break
						case 'money':
							this.qrcodeDetails.money = this.modalInput
							break
						case 'description':
							this.qrcodeDetails.description = this.modalInput
							break
						case 'aliDeviceSn':
							this.qrcodeDetails.aliDeviceSn = this.modalInput
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
						url: '../../selectStaff/index/index'
					})
				// }else{
					// uni.showToast({
						// title:"未选择门店"
					// })
				// }
			},
		},
		
		onShow() {
			// 获取商店名称
			if(uni.getStorageSync('userType') == 1){
				this.isMerchant = true
			} else{
				this.isMerchant = false	
			}
			let storeDetail = uni.getStorageSync("nowStoreDetail")
			if(storeDetail != '' && storeDetail != null && storeDetail != undefined && storeDetail){
				this.storeName = storeDetail.storeName
			}
		}
	}
</script>

<style>
	body{
		background-color: #F8F9FD;
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
	.lf-mat-80{
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
		border:1upx solid #FF9900;
		border-radius: 60upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
