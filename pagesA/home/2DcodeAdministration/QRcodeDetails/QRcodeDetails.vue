<template>
	<view>
		<view class="lf-mat"></view>
		<view class="lf-staff-head flex justify-center align-center">
			<image class="qrImg-box" src="../../../../static/home/qrImg_box.png"></image>
			<image class="qrImg" :src=" imgSrc? imgSrc : '../../../../static/home/icon_qrcode.png'"></image>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view class="lf-bottom-line">
				<text>二维码名称</text>
				<text>{{QRcodeDetails.name ? QRcodeDetails.name : ''}}</text>
			</view>
			<view class="lf-bottom-line">
				<text>绑定门店</text>
				<text>{{QRcodeDetails.storeName ? QRcodeDetails.storeName : '未绑定'}}</text>
			</view>
			<view class="lf-bottom-line">
				<text>绑定员工</text>
				<text>{{QRcodeDetails.userName ? QRcodeDetails.userName : '未绑定'}}</text>
			</view>
			<view class="lf-bottom-line">
				<text>二维码金额</text>
				<text>{{(QRcodeDetails.money ? QRcodeDetails.money : 0) | dealWithMoney}}</text>
			</view>
			<view>
				<text>二维码描述</text>
				<text>{{QRcodeDetails.description ? QRcodeDetails.description : ''}}</text>
			</view>
		</view>
		<!-- <view class="lf-mat"></view>
		<view class="lf-list">
			<view>
				<text>二维码状态</text>
				<text>{{QRcodeDetails.status | stutasFilters}}</text>
			</view>
		</view> -->
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view>
				<text>绑定设备</text>
				<text>{{QRcodeDetails.status ? QRcodeDetails.status:'未绑定'}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { baseURL, getQRcodeDetail} from '../../../../api/vueAPI.js'
	import tkiQrcode from "../../../components/tki-qrcode/tki-qrcode.vue"
	export default {
		components: {tkiQrcode},
		data() {
			return {
				QRcodeDetails: '',
				imgSrc: '',
				id: '',
			}
		},
		onLoad(obj) {
			this.id = obj.id
			// this.getstaffDetail(obj.id);
		},
		onNavigationBarButtonTap() {
			// console.log('点击到按钮-修改')
			// console.log(this.QRcodeDetails.id)
			uni.navigateTo({
				url: '../changeQRcode/changeQRcode?id='+this.QRcodeDetails.id
			})
		},
		filters:{
			stutasFilters(val) {
				return parseInt(val) === 1? '启用':'注销'
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
		onShow() {
			this.getQRcodeDetail(this.id);
		},
		methods: {
			getQRcodeDetail(id) {
				getQRcodeDetail(id).then(res => {
					// console.log(res)
					this.QRcodeDetails = res.obj
					// this.imgSrc = "http://192.168.1.150:10002" + "/resource/" + this.QRcodeDetails.qrCode
					this.imgSrc = baseURL + "/resource/" + this.QRcodeDetails.qrCode
				}).catch(err => {
					console.log(err)
				})
			},
		}
	}
</script>

<style>
	body{
		background-color: #F8F9FD;
		line-height: 1.8;
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
		height: 390upx;
		padding: 0 20px;
		background-color: #FFF;
	}
	.lf-staff-head .qrImg{
		width: 350upx;
		height: 350upx;
		position: relative;
		top:-626upx;
		left: 4upx;
	}
	.lf-staff-head .qrImg-box{
		
		height: 880upx;
		
	}
	.lf-list{
		width: 750upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		align-items: center;
		background-color: #FFF;
		position: relative;
		top:500upx
	}
	.lf-list view{
		width: 720upx;
		height: 80upx;
		padding: 0 30upx 0 5upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-bottom-line{
		border-bottom: 1upx solid #D9D9D9;
	}
</style>
