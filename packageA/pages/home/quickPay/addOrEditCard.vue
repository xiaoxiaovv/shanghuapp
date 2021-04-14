<template>
	
		<view class="bg-white">
			<uni-list>
				<view class="lf-from-block text-lg lf-top-line">
					<text>银行名称</text>
					<input type="text" placeholder="银行名称与卡面名称保持一致" maxlength="16" v-model="bankName">
				</view>
				<!-- <view class="lf-from-block text-lg lf-top-line">
					<text>开户人姓名</text>
					<input type="text" placeholder="请输入开户人姓名" maxlength="8"  v-model="realName">
				</view>
				<view class="lf-from-block text-lg lf-top-line">
					<text>身份证号</text>
					<input type="text" placeholder="请输入身份证号" maxlength="18"  v-model="idCard">
				</view> -->
				<view class="lf-from-block text-lg lf-top-line">
					<text>银行卡号</text>
					<input type="text" placeholder="请输入银行卡号" maxlength="26"  v-model="accNo">
				</view>
				<view class="lf-from-block text-lg lf-top-line">
					<text>有效期</text>
					<input type="text" placeholder="四位有效期" maxlength="4" v-model="validity">
				</view>
				<view class="lf-from-block text-lg lf-top-line">
					<text>安全校验码</text>
					<input type="text" placeholder="卡背面后三位" maxlength="3" v-model="cvv2">
				</view>
				<view class="lf-from-block text-lg lf-top-line lf-bottom-line">
					<text>预留手机号</text>
					<input type="text" placeholder="请输入预留手机号" maxlength="11"  v-model="mobile">
				</view>
			</uni-list>
			<view class="lf-change-btn margin-top-xl">
				<view class="btn" @click="addOrEditBankCard">
					<text class="text-lg">提交</text>
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
	import {
		addOrEditBankCard,
		bankCardInfo,
		chanpayPreSign,
		chanpayPreSignSure,
		getUserInfo
	} from '../../../../api/vueAPI.js'
	import { uniList, uniListItem } from '@dcloudio/uni-ui'
	import {showLoading} from '../../../../common/wxapi.js'
	export default {
		components: {uniList},
		data() {
			return {
				bankName: '',
				realName: '', //开户人名称
				idCard:'',
				accNo: '',
				validity: '',
				cvv2: '',
				mobile: '',
				idCard: '',
				id:'0', //添加时传随意值
				merchantId:'',
				showVerificationCodeModel:false,
				captcha: ''//验证码
			}
		},
		onReady() {

		},
		onShow() {

		},
		onHide() {

		},
		onLoad(obj) {
			if (obj.id) {
				// 编辑页面跳转过来携带的数据
				this.bankCardInfo(obj.id)
			}
          this.getUserInfo();
		},
		watch: {

		},
		methods: {
			getUserInfo(){
				this.merchantId = uni.getStorageSync('merchantId')
				getUserInfo(this.merchantId).then(res=>{
					this.certificateNum = res.obj.certificateNum;
					this.representativeName = res.obj.representativeName;
				    console.log(this.certificateNum,this.representativeName)
					
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
					this.chanpayPreSignSure(this.accNo, this.captcha);
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
			},
			/**
			 * addOrEditBankCard  添加和编辑银行卡
			 * @param {Object} merchantId 商户ID
			 * @param {Object} realName 开户人名称
			 * @param {Object} idCard  身份证号
			 * @param {Object} accNo  支付卡号
			 * @param {Object} mobile  手机号
			 * @param {Object} cvv2 银行卡背面 后三位
			 * @param {Object} validity 有效期 格式： MMYY
			 * @param {Object} id 记录id
			 * @param {Object} bankName 银行名称
			 */
			addOrEditBankCard() {
				this.merchantId = uni.getStorageSync('merchantId')
				/* let merchantId = uni.getStorageSync('merchantId')
				let realName = '张国军'
				let idCard = '130533198309185913'
				let accNo = '6226880385610282'
				let mobile = '15803196620'
				let cvv2 = '947'
				let validity = '0523' */
				if(!this.bankName.trim() || !this.accNo.trim() || !this.validity.trim() || !this.cvv2.trim() || !this.mobile.trim()){
					uni.showToast({
						title:"请补全内容",
						icon:'none'
					})
					return
				}
				/* if(this.idCard.length !== 18){
					uni.showToast({
						title:"身份证号格式错误",
						icon:'none'
					})
					return
				} */
				if(this.validity.length !== 4){
					uni.showToast({
						title:"有效期格式错误",
						icon:'none'
					})
					return
				}
				if(this.cvv2.length !== 3){
					uni.showToast({
						title:"安全校验码格式错误",
						icon:'none'
					})
					return
				}
				if(this.mobile.length !== 11){
					uni.showToast({
						title:"手机号码格式错误",
						icon:'none'
					})
					return
				}


				let that = this;
				this.realName = this.representativeName;
				this.idCard = this.certificateNum;
				console.log('2222222222',this.realName,this.idCard)
				addOrEditBankCard(this.merchantId, this.realName, this.accNo, this.mobile, this.cvv2, this.validity, this.bankName,
					this.idCard, this.id).then(res=>{
						uni.showToast({
							title:'提交成功',
							icon:'none'
						})
						uni.showModal({
							content: '是否开通刷脸付？您也可以到卡管理列表开通',
							success(res) {
								if(res.confirm){
									chanpayPreSign(that.accNo).then(res=>{
										that.showSubmitVerificationCodeModel()
									})
								}else{
									
								}
							}
						})
					})
			},
			bankCardInfo(bankCardId) {
				bankCardInfo(bankCardId).then(res => {
					let data = res.obj
					this.merchantId = data.merchantId;
					this.realName = data.realName;
					this.accNo = data.accNo;
					this.mobile = data.mobile;
					this.cvv2 = data.cvv2;
					this.validity = data.validity;
					this.bankName = data.bankName;
					this.idCard = data.idCard;
					this.id = data.id
				})
			}
		},
	}
</script>

<style>
	.lf-top-line {
		border-top: 1upx solid #F1F1F3;
	}

	.lf-bottom-line {
		border-bottom: 1upx solid #F1F1F3;
	}

	.lf-from-block {
		width: 750upx;
		height: 100upx;
		padding: 0 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.lf-from-block input {
		width: 70%;
	}

	.lf-change-btn {
		width: 750upx;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.lf-change-btn .btn {
		width: 690upx;
		height: 80upx;
		border-radius: 40upx;
		color: #FFF;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #4BA8FF;
	}
</style>
