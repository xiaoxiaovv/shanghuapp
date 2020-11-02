<template>
	<view>
		<uni-list>
			<view class="cu-form-group lf-surplus-box">
				<view class="lf-surplus-block">
					<text>储值余额</text>
					<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
						<view class="qiun-title-dot-light">{{memberDetail.phone? memberDetail.phone:''}}</view>
					</view>
				</view>
				<view>
					<text class="text-lg money">{{yenSymbol}}{{memberDetail.balance || memberDetail.balance === 0? memberDetail.balance:'0.00'}}</text>
				</view>
			</view>
		</uni-list>
		<view class="lf-mat"></view>
		<uni-list>
			<view class="cu-form-group">
				<text class="text-lg">选择充值规则</text>
			</view>
		</uni-list>
		<view class="padding flex justify-start flex-wrap align-left ">
			<view 
				class="lf-recharge-rule" 
				:class="{'lf-rule-select': block.clickStatus, 'ml-24': (key % 2 != 0), 'mt-20': (key != 0 && key != 1)}" 
				v-for="(block,key) in ruleList" 
				@click="clickSelect(key)">
				<view class="lf-tip" v-if="key === 0"><text class="text-sm">推荐</text></view>
				<view class='match-width align-default'>
					<text class="text-llg">{{block.name}}</text>
					<text class="text-llg ptb-10">{{yenSymbol}}{{block.storedMoney || 0}}</text>
					<text class="text-white lf-gift">{{block.description | descriptionFilter}}</text>
				</view>
			</view>
		</view>
		<view class="lf-cash-register shadow-white">
			<view @click="cashierScan">
				<image src="../../../../../static/home/icon_cashier.png"></image>
				<text>收银</text>
			</view>
		</view>
		<view class="lf-cash-mat"></view>
	</view>
</template>

<script>
	import { uniList } from '@dcloudio/uni-ui'
	import {storeMoney, getStoreMerchantId, getMemberDetail} from '../../../../../api/vueAPI.js'
	export default {
		components: {uniList},
		data() {
			return {
				yenSymbol: '\u00A5',		//金钱符号
				ruleList:[],
				memberDetail: '',
				memberId: '',	//会员id
				storeRuleId: '',	//储值规则id
				authCode: '',	//付款码
			}
		},
		onNavigationBarButtonTap (obj) {
			// console.log("点击导航栏btn-跳转储值明细")
			uni.navigateTo({
				url: '../storageDetails/index/index?memberId='+ this.memberId
			})
		},
		onLoad(obj) {
			this.memberId = obj.id
			this.getStoreMerchantId()
			// console.log('this.memberId', obj.id)
		},
		onShow() {
			this.getMemberDetail()
		},
		filters: {
			descriptionFilter(value) {
				if (value.indexOf('.00积分') !== -1) {
					value = value.replace('.00积分', '积分')
				}
				return value
			}
		},
		methods: {
			/* 会员详情获取 */
			getMemberDetail() {
				getMemberDetail(this.memberId).then(res => {
					// console.log(res)
					this.memberDetail = ''
					this.memberDetail = res.obj
				}).catch(err => {
					console.log(err)
				})
			},
			/* 充值规则获取 */
			getStoreMerchantId(){
				getStoreMerchantId(this.memberId).then(res => {
					// console.log(res)
					for (let rule of res.obj) {
						rule['clickStatus'] = false
					}
					this.ruleList = res.obj
					// console.log(this.ruleList)
				}).catch(err => {
					console.log(err)
				})
			},
			/* 选中状态 */
			clickSelect(key){
				for (let rule of this.ruleList) {
					rule.clickStatus = false
				}
				this.ruleList[key].clickStatus = true
				this.storeRuleId = this.ruleList[key].storeRuleId
			},
			/* 扫码收款 */
			cashierScan() {
				let that = this;
				// uni.navigateTo({
				// 	url:"../paymentSuccess/paymentSuccess"
				// })
				// return
				// 未选规则判断
				if(this.storeRuleId === ''){
					uni.showToast({
						title:"请选择充值规则",
						icon:'none'
					})
					return
				} 
				// let that = this;
				uni.scanCode({
					onlyFromCamera: true,
					success: (res) => {
						this.codeResult = res.result
						// console.log("扫码内容："+res.result)
						// console.log("扫码类型："+res.scanType)
						// console.log('扫码成功，进行收款。。。');
						uni.showLoading({
							title:"储值中"
						})
						let rule = that.ruleList.filter((item) => {
							return item.storeRuleId === that.storeRuleId
						})[0]
						let merchantId = uni.getStorageSync('merchantId') || ''
						let storeId = uni.getStorageSync('storeId') || ''
						let money = rule.storedMoney
						// console.log(that.memberId, that.storeRuleId, res.result, money, merchantId, storeId)
						storeMoney(that.memberId, that.storeRuleId, res.result, money, merchantId, storeId).then(res => {
							// console.log(res)
							uni.hideLoading()
							uni.showToast({
								title:"充值成功",
								icon:'success',
								complete() {
									that.getMemberDetail()
								}
							})
							// uni.navigateTo({
							// 	url:'../paymentSuccess/paymentSuccess?orderNumber='+ res.obj.orderNumber
							// })
						}).catch(err => {
							uni.hideLoading()
							// uni.showToast({
							// 	title:"储值失败",
							// 	icon:'success'
							// })
							console.log(err)
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.text-llg{
		font-size: 32upx;
	}
	.lf-surplus-box{
		height: 200upx;
		
		.money {
			color: #4BA8FF !important;
		}
	}
	.lf-surplus-block{
		height: 100upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.lf-mat{
		width: 750upx;
		height: 30upx;
		background-color: #F8F9FD;;
	}
	.lf-recharge-rule{
		width: 330upx;
		height: 220upx;
		padding: 30upx 0;
		border-radius: 10upx;
		border: 1upx solid #DDD;
		// margin: 10upx;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}
	.lf-rule-select{
		border: 1upx solid #DDD!important;
		background-color: #FFAF2C!important;
	}
	.lf-tip{
		position: absolute;
		top: 0;
		left: 0;
		width: 70upx;
		height: 40upx;
		border-radius: 10upx;
		background-color: #9000FF;
		display: flex;
		justify-content: space-around;
		align-items: center;
		color: #FFF;
		font-weight: 800;
	}
	.lf-cash-mat{
		width: 750upx;
		height: 250upx;
	}
	.shadow-white {
		box-shadow: 0upx -80upx 80upx 0upx rgba(255,255,255, 1);
	}
	.lf-cash-register{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 750upx;
		height: 250upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #FFF;
		/* border-top: 1upx solid #F1F1F3; */
	}
	.lf-cash-register > view {
		width: 680upx;
		height: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #4BA8FF;
		color: #FFF;
		font-size: 36upx !important;
		border-radius: 12upx;
	}
	.lf-cash-register > view > image {
		width: 40upx;
		height: 40upx;
		margin-right: 20upx;
	}
	.lf-gift{
		padding: 5upx 20upx;
		border-radius: 30upx;
		background-color: #4BA8FF;
		color: #FFF;
	}

.qiun-common-mt{margin-top:10upx;}
.qiun-bg-white{background:#FFFFFF;}
/* .qiun-title-bar{width:90%; padding:30upx 5%; flex-wrap:nowrap;border-bottom: 1upx solid #F1F1F3;} */
.qiun-title-dot-light{border-left: 10upx solid #4BA8FF; padding-left: 10upx; font-size: 32upx;color: #000000}
</style>
