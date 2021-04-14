<template>
	<view>
		<view>
			<view class="lf-list" v-for="(item,index) in cardList">
				<view class="match-width">
					<text @click="selectCard" class="line-height">
						{{item.bankName}}
						{{item.accNo | cardFilter}}
					</text>
					<view>
						<!-- <text class="edit ly-font-color-main" @click="jumpAddOrEditCard(item.id)">编辑</text> -->
						<text class="ly-font-color-main" @click="delBankCard(item)">删除</text>
						<text class="ly-font-color-main ml-30" @click="chanpayPreSign(item)" v-if="item.chanpayStatus !==2">开通刷脸付</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 输入验证码 -->
		<neil-modal :show="showVerificationCodeModel" @close="closeVerificationCodeModel" title="验证码" @cancel="submitVerificationCodeBtn('cancel')"
		 @confirm="submitVerificationCodeBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<view>
					<input class="lf-remarks-input" type="text" placeholder="请输入验证码" maxlength="10" v-model="captcha">
				</view>
			</view>
		</neil-modal>
	</view>
</template>

<script>
	// 后台接口
	import {
		bankCarkList,
		delBankCard,
		chanpayPreSign,
		chanpayPreSignSure
	} from '../../../api/vueAPI.js'
	import {
		showLoading
	} from '../../../common/wxapi.js'
	import {
		cardFilter,
		phoneFilter
	} from '../../../common/utils.js'
	export default {
		data() {
			return {
				cardList: [],
				captcha: '', //验证码
				showVerificationCodeModel: false,
				currentAccNo: ''
			}
		},
		onReady() {

		},
		onShow() {
			this.bankCarkList()
		},
		onHide() {

		},
		onLoad() {

		},
		watch: {

		},
		methods: {
			bankCarkList() {
				let merchantId = uni.getStorageSync('merchantId')
				// console.log('merchantId==================',merchantId)
				bankCarkList(merchantId).then(data => {
					this.cardList = data.obj;
				})
			},
			jumpAddOrEditCard(id) {
				uni.navigateTo({
					url: '/packageA/pages/home/quickPay/addOrEditCard?id=' + id
				})
			},
			delBankCard(item) {
				let that = this;
				uni.showModal({
					content: `确定删除该卡吗?
${item.bankName}  ${cardFilter(item.accNo)}`,
					success(res) {
						if (res.confirm) {
							delBankCard(item.id).then(res => {
								// 更新列表
								that.bankCarkList()
							})
						} else {

						}
					}
				})

			},
			chanpayPreSign(item) {
				this.currentAccNo = item.accNo
				this.showSubmitVerificationCodeModel();
				// return
				chanpayPreSign(item.accNo).then(res => {
					console.log('畅捷绑卡结果：---------' + res)
					// this.showSubmitVerificationCodeModel();

				})
			},
			/* 打开验证码输入模态框 */
			showSubmitVerificationCodeModel() {
				this.showVerificationCodeModel = true;
			},
			/* 提交验证码确认 */
			submitVerificationCodeBtn(str) {
				if (str === 'confirm') {
					// console.log('进行修改');
					showLoading(true)
					this.chanpayPreSignSure(this.currentAccNo, this.captcha);
				}
				/* 关闭模态框 */
				this.showVerificationCodeModel = false;
				/* 模态框数据初始化 */
				this.captcha = '';
			},
			chanpayPreSignSure(accNo, captcha) {
				// 预授权确认

				let customerInfo = uni.getStorageSync('customerCount')
				let serviceId = customerInfo.serviceId
				chanpayPreSignSure(accNo, captcha).then(
					res => {
						showLoading(false)
					}, err => {
						showLoading(false)

					})
			}
		},
		filters: {
			cardFilter,
			phoneFilter
		}
	}
</script>

<style>
	.lf-list {
		/* // width: 720upx; */
		width: 100%;
		/* // padding-left: 40upx; */
		background-color: #FFF;
		border-top: 1upx solid #F0F0F0;
		/* border-bottom: 1upx solid #F0F0F0; */
		color: #666666;
		font-size: 32upx;
		font-weight: 500;
		box-sizing: border-box;
	}

	.lf-list:nth-last-child(1) {
		border-bottom: 1upx solid #F0F0F0;
	}

	.lf-list>view {
		width: 100%;
		height: 120upx;
		padding: 0 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
	}

	.lf-list>view>image {
		width: 20upx;
		height: 30upx;
	}

	.lf-list>view>view>image {
		width: 50upx;
		height: 50upx;
		margin-right: 20upx;
	}

	.edit {
		margin-right: 30upx;
	}

	.line-height {
		line-height: 44upx;
	}
</style>
