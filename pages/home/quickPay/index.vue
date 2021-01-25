<<template>
	<view class="quick-pay">
		<view class="solid"></view>
		<view class=" align-center">
		<view class="quickPay-bb width  align-center text-xl  ly-font-color-6 padding-tb-xs quick-pay-fw">
			<!-- <text class="text-price">aaa</text> -->
			确认付款
		</view>
		
			<view class="quickPay-bb text-price width  align-center  text-xl  ly-font-color-6 padding-tb-xs quick-pay-fw">
				200
			</view>
		
			<view class="quickPay-bb  width   text-lg   ly-font-color-6 padding-tb-xs quick-pay-fw"
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
				<text class="fr margin-right-xs" v-text="cardName"></text>
			</view>
		
		<view class="lf-btn">
			<view class="bg-ff8800">
				<text class="text-white">立即支付</text>
			</view>
		</view>
		
		
		
		</view>
		
	</view>
</template>
<script>
	// 后台接口
	import {addOrEditBankCark, bankCarkList, bankCardInfo, delBankCard, orderSure } from '../../../api/vueAPI.js'
	export default {
		data(){
			return {
				cardList:[],
				cardName:'请选择支付卡'
			}
		},
		onReady(){
			
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
			 */
			addOrEditBankCark(){
				let merchantId = uni.getStorageSync('merchantId')
				let realName = '张国军'
				let idCard = '130533198309185913'
				let accNo = '6226880385610282'
				let mobile = '15803196620'
				let cvv2 = '947'
				let validity = '0523'
				addOrEditBankCark(merchantId, realName, idCard, accNo, mobile, cvv2, validity)
			},
			bankCarkList(){
				let merchantId = uni.getStorageSync('merchantId')
				bankCarkList(merchantId).then(data=>{
					
				}
				,err=>{
					console.log('fail==========',JSON.stringify(err))
				})
			},
			 bankCardInfo(bankCardId){
				bankCardInfo('1345981813639208960')
			},
			delBankCard(bankCardId){
				delBankCard('1345981813639208960')
			},
			transaction(){
				// 下单
				let userId = uni.getStorageSync('userId') || ''
				let merchantId = uni.getStorageSync('merchantId') || ''
				// let merchantId = '123213123213'
				let storeId = uni.getStorageSync('storeId') || ''
				let customerInfo = uni.getStorageSync('customerCount')
				let serviceId = customerInfo.serviceId
				// console.log('customerInfo==============',customerInfo)
				let totalPrice = '11' //this.paymentMoney || '0.01'
				let payWay = 8
				let payChannel = 18 //17 pos  18 网联
				let bankCardId = '1345981813639208960'
				webPay(userId, merchantId, storeId, totalPrice, payWay, payChannel, serviceId, bankCardId).then(
				data=>{
					this.cardList = data.obj
					console.log('sucess==========',JSON.stringify(data))}
					,data=>{console.log('fail==========',JSON.stringify(data))})
			},
			transactionSure(bankCardId){
				// 下单确认
				let customerInfo = uni.getStorageSync('customerCount')
				let serviceId = customerInfo.serviceId
				transactionSure('20210104143544242783','332633',serviceId,'C070820113023698','202101041435446833')
			}
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