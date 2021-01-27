<<template>
	<view class="quick-pay">
		<view class="solid"></view>
		<view class=" align-center">
		<view class="quickPay-bb width  align-center text-xl  ly-font-color-6 padding-tb-sm quick-pay-fw">
			<!-- <text class="text-price">aaa</text> -->
			确认付款
		</view>
		
			<view class="quickPay-bb text-price width  align-center  text-xl  ly-font-color-6 padding-tb-sm quick-pay-fw">
				{{paymentMoney}}
			</view>
		
			<view class="quickPay-bb  width   text-lg   ly-font-color-6 padding-tb-sm quick-pay-fw"
			@click="jumpCardList"
			>
				<text class="">付款方式</text>
				
				<view class="fr arrow">
					<image
						class='match-parent'
						src='../../../static/homev2/right.png'
						mode='scaleToFill'
					/>
				</view>
				<text class="fr margin-right-xs">{{bankName}}</text>
			</view>
		
		<view class="lf-btn">
			<view class="bg-ff8800" @click="transaction">
				<text class="text-white">立即支付</text>
			</view>
		</view>
		
		<!-- 输入验证码 -->
		<neil-modal :show="showVerificationCodeModel" @close="closeVerificationCodeModel" title="验证码" @cancel="submitVerificationCodeBtn('cancel')" @confirm="submitVerificationCodeBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<view>
					<input class="lf-remarks-input" type="text" placeholder="请输入验证码" maxlength="10" v-model="verificationCodeModelContent">
				</view>
			</view>
		</neil-modal>
		
		</view>
		
	</view>
</template>
<script>
	// 后台接口
	import {webPay,transactionSure} from '../../../api/vueAPI.js'
	export default {
		data(){
			return {
				bankName:'请选择支付卡',
				VerificationCodeModelContent:'', //验证码
				showVerificationCodeModel:false,
				accNo:'',
				id:'',
				chSerialNo:'',
				verificationCodeModelContent:'',
				serviceId:'', 
				chMerCode:'',
				orderCode:'',
				paymentMoney:''
			}
		},
		onReady(){
			
		},
		onLoad(obj){
			this.paymentMoney = obj.paymentMoney
		},
		onShow(){
			
		},
		onHide(){
			
		},
		onReady(){
			
		},
		watch:{
			
		},
		 methods:{
			 jumpCardList(){
				 uni.navigateTo({
				 	url: '/pages/home/quickPay/selectCard'
				 })
			 },
			/**
			 * addOrEditBankCark  添加和编辑银行卡
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
			transaction(){
				// 下单
				let userId = uni.getStorageSync('userId') || ''
				let merchantId = uni.getStorageSync('merchantId') || ''
				// let merchantId = '123213123213'
				let storeId = uni.getStorageSync('storeId') || ''
				let customerInfo = uni.getStorageSync('customerCount')
				let serviceId = customerInfo.serviceId
				// console.log('customerInfo==============',customerInfo)
				let totalPrice = this.paymentMoney
				let payWay = 8
				let payChannel = 18 //17 pos  18 网联
				let id = this.id
				console.log('this.id==============',this.id)
				webPay(userId, merchantId, storeId, totalPrice, payWay, payChannel, serviceId, id).then(
				res=>{
					let data = res.obj.jsPayResponse
					this.chSerialNo = data.chSerialNo;					
					this.chMerCode = data.chMerCode;
					this.orderCode = data.orderCode;
					this.showSubmitVerificationCodeModel()
					// console.log('sucess==========',JSON.stringify(res))}
					//,data=>{console.log('fail==========',JSON.stringify(data))
					})
			},
			transactionSure(){
				// 下单确认
				let customerInfo = uni.getStorageSync('customerCount')
				let serviceId = customerInfo.serviceId
				transactionSure(this.chSerialNo,this.verificationCodeModelContent,serviceId,this.chMerCode,this.orderCode)
			},
			 /* 打开验证码输入模态框 */
			showSubmitVerificationCodeModel() {
				this.showVerificationCodeModel = true;
			},
			submitVerificationCode(){
				this.verificationCodeModelContent
			},
			/* 提交验证码确认 */
			submitVerificationCodeBtn(str) {
				if(str === 'confirm'){
					// console.log('进行修改');
					this.transactionSure();
				}
				/* 关闭模态框 */
				this.showVerificationCodeModel = false;
				/* 模态框数据初始化 */
				this.verificationCodeModelContent = '';
			},
			/* 编辑备注模态框关闭后事件 */
			closeVerificationCodeModel(){
				
			},
		}, 
		filters:{
			
		}
	}
</script>
<style lang="scss">
	.quickPay-bb{
		border-bottom:1upx solid #f1f1f3;
	}
	.quick-pay-fw{
		font-weight:500;
	}
	.width{
		width: 90%;
	}
	.pr{
		position: relative;
	}
	.arrow {
		width: 14upx;
		height: 25upx;
		margin-top: 7upx;
	}
	.lf-btn{
		width: 750upx;
		height: 160upx;
		padding: 0 40upx;
		display: flex;
		justify-content: center;
		// justify-content: space-between;
		align-items: center;
	}
	.lf-btn > view{
		width: 320upx;
		height: 80upx;
		border-radius: 50upx;
		border: 1upx solid #4BA8FF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-btn .bg-ff8800{
		background-color: #4BA8FF;
	}
</style>