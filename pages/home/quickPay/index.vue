<template>
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
			<view class="bg-ff8800" @click="transaction" v-if="fromPayChannel==='18'">
				<text class="text-white">立即支付</text>
			</view>
			<view class="bg-ff8800" @click="shuaLianAsyncFunc" v-if="fromPayChannel==='20'">
				<text class="text-white">刷脸并支付</text>
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
	import {showLoading} from '../../../common/wxapi.js'
	var shuaLianModule = uni.requireNativePlugin('DCloud-ShuaLianMoudle')
	export default {
		data(){
			return {
				bankName:'请选择支付卡',
				// VerificationCodeModelContent:'',
				showVerificationCodeModel:false,
				accNo:'',
				id:'',
				chSerialNo:'',
				verificationCodeModelContent:'',  //验证码
				serviceId:'', 
				chMerCode:'',
				orderCode:'',
				paymentMoney:'',
				fromPayChannel:'',
				bankCardInfo:{
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
			}
		},
		onReady(){
			
		},
		onLoad(obj){
			// console.log('77777777777777777:',obj)
			this.paymentMoney = obj.paymentMoney
			this.fromPayChannel = obj.fromPayChannel
			
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
			 shuaLianCallback(ret){
				 let shuaLianAuthResult = JSON.parse(ret)
				 if(shuaLianAuthResult.Code == 0){
					 this.shuaLianTransaction();
				 }else{
					 uni.showToast({
					 		title: '人脸验证失败',
					 		icon: 'none'
					 	})
				 	/* uni.showModal({
				 		content: `人脸验证失败`,
				 		showCancel: false
				 	}) */
				 }
				 /* validate_result	String 验证结果	-1,身份证和姓名不一致 -2,公安库中无此身份证记录 -3,公安身份证库中没有此号码的照片
				 -4 照片参数不合格 -5 照片相片体积过大 -6,请检查图片编码 -7,照片相片体积过小 1,系统分析为同一人 ，2,系统分析可能为同一人 3, 系统分析为不是同人 4,没检测到人脸 5,疑似非活体 6,出现多张脸 7,身份证和姓名一致，官方人脸比对失败

similarity	String	相似度 1~100 (当validate_result>0时，本值才有效(相似度>=45 为同一人； 40<=相似度<45 不确定为同一人； 相似度<40 确定为不同人))
*/
			 	/* if(ret){
					uni.showModal({
						content: ret,
						showCancel: false
					})
					let shuaLianAuthResult = JSON.parse(ret)
					if(shuaLianAuthResult.result.validate_result !== '1' || shuaLianAuthResult.result.similarity<45){
						uni.showModal({
							content: `人脸验证失败（代码：${shuaLianAuthResult.validate_result},${shuaLianAuthResult.similarity}）。`,
							showCancel: false
						})
					}else{
						this.shuaLianTransaction();
					}
				}else{
					uni.showModal({
						content: `人脸验证系统错误。`,
						showCancel: false
					})
				} */
				
				
			 },
			 shuaLianAsyncFunc() {
				 if(this.id === ''){
					 uni.showToast({
					 		title: '请选择支付卡',
					 		icon: 'none'
					 	})
						return
				 }
			 /* 	uni.showToast({
			 		title: 'shuaLianModule7777777777777777777'+shuaLianModule,
			 		icon: 'none'
			 	}) */
			 	let obj = {
			 			Name: this.bankCardInfo.realName,
			 			Number: this.bankCardInfo.idCard,
			 			Count:1
			 		};
			 		let objStr = JSON.stringify(obj)
			 	shuaLianModule.shuaLianAuth(objStr,
			 		(ret) => {
			 			this.shuaLianCallback(ret)
			 		})
			 	
			 },
			 jumpCardList(){
				 uni.navigateTo({
				 	url: `/pages/home/quickPay/selectCard?fromPayChannel=${this.fromPayChannel}`
				 })
			 },
			 shuaLianTransaction(){
			 	// 下单
			 	let userId = uni.getStorageSync('userId') || ''
			 	let merchantId = uni.getStorageSync('merchantId') || ''
			 	// let merchantId = '123213123213'
			 	let storeId = uni.getStorageSync('storeId') || ''
			 	let customerInfo = uni.getStorageSync('customerCount')
			 	let serviceId = customerInfo.serviceId
			 	// console.log('customerInfo==============',customerInfo)
			 	let totalPrice = this.paymentMoney
			 	/* let payWay = 8
			 	let payChannel = 18 //17 pos  18 网联 */
			 	let payWay = 10 //10:刷脸
			 	let payChannel = 20   //20:畅捷
			 	let id = this.id
			 	// console.log('this.id==============',this.id)
			 	showLoading(true)
			 	// return
			 	webPay(userId, merchantId, storeId, totalPrice, payWay, payChannel, serviceId, id).then(
			 	res=>{
			 		showLoading(false)
			 		let data = res.obj.jsPayResponse
			 		this.chSerialNo = data.chSerialNo;					
			 		this.chMerCode = data.chMerCode;
			 		this.orderCode = data.orderCode;
					uni.navigateTo({
						url: '/pages/home/quickPay/result?price='+this.paymentMoney+'&resultFlag=1'
					})
			 		// this.showSubmitVerificationCodeModel()
			 		// console.log('sucess==========',JSON.stringify(res))}
			 		//,data=>{console.log('fail==========',JSON.stringify(data))
			 		},err=>{
					// console.log('8888888888888888888888888888888',err)
					uni.navigateTo({
						url: '/pages/home/quickPay/result?price='+this.paymentMoney+'&resultFlag=0'+'&failMsg='+err.msg
					})
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
				/* let payWay = 10
				let payChannel = 20 //17 pos  18 畅捷 */
				let id = this.id
				// console.log('this.id==============',this.id)
				showLoading(true)
				// return
				webPay(userId, merchantId, storeId, totalPrice, payWay, payChannel, serviceId, id).then(
				res=>{
					showLoading(false)
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
				transactionSure(this.chSerialNo,this.verificationCodeModelContent,serviceId,this.chMerCode,this.orderCode).then(res=>{
					showLoading(false)
					uni.navigateTo({
						url: '/pages/home/quickPay/result?price='+this.paymentMoney+'&resultFlag=1'
					})
				},err=>{
					// console.log('8888888888888888888888888888888',err)
					uni.navigateTo({
						url: '/pages/home/quickPay/result?price='+this.paymentMoney+'&resultFlag=0'+'&failMsg='+err.msg
					})
				})
			},
			 /* 打开验证码输入模态框 */
			showSubmitVerificationCodeModel() {
				this.showVerificationCodeModel = true;
			},
			/* submitVerificationCode(){
				this.verificationCodeModelContent
			}, */
			/* 提交验证码确认 */
			submitVerificationCodeBtn(str) {
				if(str === 'confirm'){
					// console.log('进行修改');
					showLoading(true)
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