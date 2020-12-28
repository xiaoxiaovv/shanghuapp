<template>
	<view class="ly-bg-color-main">
		<view class="ly-gray-height"></view>
		<view class="lf-warning" v-if="isShowWarning">
			<text class="text-sm">支付机构未通知支付结果，请下拉页面，刷新同步更新状态</text>
		</view>
		<view class="lf-list">
			<view>
				<text class="ly-font-color-9">订单金额</text>
				<text>
					<text>{{orderDetails.totalPrice | dealWithMoney}}</text>
					<!-- <text class="icon-unfold"></text> -->
				</text>
			</view>
			<view>
				<text class="ly-font-color-9">订单状态</text>
				<text>{{orderDetails.status | orderStatusFilters}}</text>
			</view>
			<view>
				<text class="ly-font-color-9">门店</text>
				<text>{{orderDetails.storeName || ''}}</text>
			</view>
			<view>
				<text class="ly-font-color-9">收银员</text>
				<text>{{orderDetails.username || ''}}</text>
			</view>
		</view>
		<view class="ly-gray-height"></view>
		<view class="lf-list">
			<view>
				<text class="ly-font-color-9">订单编号</text>
				<text>{{orderDetails.orderNumber || ''}}</text>
			</view>
			<view>
				<text class="ly-font-color-9">支付方式</text>
				<text>
					<view class=" prod prod-height"></view>
					<image class="margin-right-20 meat" :src="orderDetails.payWay | payWayImgFilters"></image>
					<!-- <text><image src="../../../static/order/icon_wechat.png"></image></text> -->
					<text class="meat">{{orderDetails.payWay | payWayFilters}}</text>
				</text>
			</view>
			<view>
				<text class="ly-font-color-9">支付终端</text>
				<text>{{orderDetails.payClient | payClientFilters}}</text>
			</view>
			<view>
				<text class="ly-font-color-9">支付渠道</text>
				<text>{{orderDetails.payChannel | payChannelFilters}}</text>
			</view>
			<view>
				<text class="ly-font-color-9">支付时间</text>
				<text>{{orderDetails.payTime || ''}}</text>
			</view>
			<view>
				<text class="ly-font-color-9">创建时间</text>
				<text>{{orderDetails.createTime || ''}}</text>
			</view>
			<view>
				<text class="ly-font-color-9">参考号</text>
				<text v-if="orderDetails.payClient == 4">{{orderDetails.transactionId ? orderDetails.transactionId : ''}}</text>
				<text v-else></text>
			</view>
		</view>
		<view class="ly-gray-height"></view>
		<view class="lf-list">
			<view>
				<text class="ly-font-color-9">退款金额</text>
				<text>
					<!-- <text>{{ (orderDetails.actPayPrice - orderDetails.remainPrice) | dealWithMoney }}</text> -->
					<text>{{ (orderDetails.refundPayPrice) | dealWithMoney }}</text>
					<!-- <text class="icon-unfold"></text> -->
				</text>
			</view>
			<view v-if="orderDetails.refundTime">
				<text class="ly-font-color-9">退款时间</text>
				<text>{{orderDetails.refundTime | ''}}</text>
			</view>
			<view v-if="orderDetails.refundTime">
				<text class="ly-font-color-9">操作员</text>
				<text>{{orderDetails.refundUsername | ''}}</text>
			</view>
			<view>
				<text class="ly-font-color-9">订单备注</text>
				<text>{{orderDetails.remarks | remarksFilters}}</text>
			</view>
		</view>
		<view class="lf-btn">
			<view class="bg-ff8800" 
				  @click="showRefundModal" 
				  v-if="orderDetails.status == 2 || orderDetails.status == 6 || orderDetails.status === 7">
				<text class="text-white">退款</text>
			</view>
			<view class="bg-ffcb90 disabled" v-else>
				<text class="text-white">退款</text>
			</view>
			<view @click="showEditRemarksModel">
				<text class="ly-font-color-main">编辑备注</text>
			</view>
		</view>
		<!-- 退款 -->
		<neil-modal 
			:show="showModal" 
			@close="closeModal" 
			auto-close="false"
			title="退款" 
			confirm-color="#4BA8FF"
			@cancel="bindBtn('cancel')" 
			@confirm="bindBtn('confirm')">
			<view class="lf-refund-modal" style="min-height: 100upx;padding: 32upx 24upx;">
				<view class=''>
					<view style='width: 150upx' class='align-left'><view class="icon-title ly-font-color-main"></view><view>可退金额:</view></view>
					<text class="text-llg">{{orderDetails.remainPrice}}</text>
					<view class="lf-btn-allRefund align-center" @click="allRefundNumber">全退</view>
				</view>
				<view class='match-width mt-40'>
					<view style='width: 150upx' class='align-left'><view class="icon-title ly-font-color-main"></view><view>退款金额:</view></view>
					<input style='width: 330upx; text-align: left;' type="number" @input="onChange('refundPayPrice', $event)" :value="refundPayPrice"/>
					<!-- v-model="refundPayPrice" -->
				</view>
				<view class='match-width mt-40'>
					<view style='width: 150upx' class='align-left'><view class="icon-title ly-font-color-main"></view><view>密码:</view></view>
					<input style='width: 330upx; text-align: left;' type="password" @input="onChange('password', $event)" :value="password"/>
					<!-- v-model="password" -->
				</view>
			</view>
		</neil-modal> 
		<!-- 提示 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
		<!-- 修改订单备注 -->
		<neil-modal :show="showRemarksModel" @close="closeRemarksModel" title="编辑备注" @cancel="editRemarksBtn('cancel')" @confirm="editRemarksBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<view>
					<input class="lf-remarks-input" type="text" placeholder="请输入备注内容" maxlength="20" v-model="remarksModelContent">
				</view>
			</view>
		</neil-modal>
		
		
		<!-- 切换门店 -->
		<vma-modal
			ref="switchDialog"
			:index="1"
			:isTopJustify="true"
			@onModalConfirm="onModalConfirm"
			@onModalCancel="onModalCancel">
			<view class="text-center box match-width plr-50" style="font-size: 32upx;">
				当前系统选择的门店和订单上的门店不匹配，无法打印，是否切换门店？
			</view>
		</vma-modal>
		
		<!-- 退款 -->
		<vma-modal
			ref="switchDialogRefund"
			:index="2"
			:isTopJustify="true"
			@onModalConfirm="onModalConfirm"
			@onModalCancel="onModalCancel">
			<view class="text-center box match-width plr-50" style="font-size: 32upx;">
				当前系统选择的门店和订单上的门店不匹配，无法退款，是否切换门店？
			</view>
		</vma-modal>
		
		<!-- 添加打印机 -->
		<vma-modal
			ref="switchDialogPrinter"
			:index="3"
			:isTopJustify="true"
			@onModalConfirm="onModalConfirm"
			@onModalCancel="onModalCancel">
			<view class="text-center box match-width plr-50" style="font-size: 32upx;">
				没有检测到打印机，是否前往打印机设置添加打印机？
			</view>
		</vma-modal>
		
		<!-- 添加打印机 -->
		<vma-modal
			ref="switchDialogPrinterRefund"
			:index="4"
			:isTopJustify="true"
			@onModalConfirm="onModalConfirm"
			@onModalCancel="onModalCancel">
			<view class="text-center box match-width plr-50" style="font-size: 32upx;">
				没有检测到打印机，将无法打印，是否前往打印机设置添加打印机？
			</view>
		</vma-modal>
		
	</view>
</template>

<script>
	import { getOrderDetails, refund, editOrderRemarks, posRefundValid, posRefund } from '../../../api/vueAPI.js'
	import neilModal from '@/components/neil-modal/neil-modal.vue'
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	import encodeToGb2312 from '@/common/encodeToGb2312.js'
	import VmaModal from '@/components/vma-modal/index.vue'
	// pos接口
	import { isFuiouPlatform, onFuiouBankRefund } from '../../../api/fuiouApi.js'
	import { showToast, showLoading } from '../../../common/wxapi.js'
	import { print, isPrinterExist } from '../../../api/printApi.js'
	import { getPrintOrderDetailAndPrint, getOrderDetailsAndPrint } from '../../../api/orderApi.js'
	
	export default {
		components: { neilModal, HMmessages, 'vma-modal': VmaModal },
		data() {
			return {
				orderNumber: '',
				orderDetails: '',		//订单详情
				showModal: false,
				refundPayPrice: '',		//退款金额
				password: '',			//密 码
				showRemarksModel: false,
				remarksModelContent: '',
				isShowWarning: false,	//警告
				bindedEquipment: '',	//已绑定打印机
				nowBuletoothIdObj: '',	//当前已绑定打印机参数
				requestCount: 0,
				isLock: false
			}
		},
		
		onLoad(obj) {
			this.orderNumber = obj.orderNumber;
			this.getOrderDetail()
			// console.log(encodeToGb2312("一二三四1234"))
		},
		
		//打印
		onNavigationBarButtonTap() {
			if (this.isLock) {
				return
			}
			this.isLock = true
			setTimeout(() => {
				this.isLock = false
			}, 2000)
			// 门店和订单上的门店要保证一致
			let storeId = ''
			let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
			if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
				storeId = nowStoreDetail.storeId
			}
			if (this.orderDetails['storeId'] === storeId) {
				console.log('isPrinterExist', isPrinterExist())
				if (!isPrinterExist()) {
					this.$refs['switchDialogPrinter'].onModalOpen()
					return
				}
				// 打印
				getPrintOrderDetailAndPrint(this.orderDetails)
			} else {
				this.$refs['switchDialog'].onModalOpen()
			}
		},
		
		filters:{
			orderStatusFilters(val) {
				switch(parseInt(val)){
					case 1:
						return '未支付';
						break;
					case 2:
						return '支付成功';
						break;
					case 3:
						return '支付失败';
						break;
					case 4:
						return '已撤销';
						break;
					case 5:
						return '全额退款成功';
						break;
					case 6:
						return '部分退款成功';
						break;
					case 7:
						return '退款失败';
						break;
					case 8:
						return '退款中';
						break;
					case 9:
						return '撤销失败';
						break;
					default:
						console.log("异常状态值："+val);
				}
			},
			payWayFilters(val) {
				switch(parseInt(val)){
					case 1:		//微信支付
						return '微信';
						break;
					case 2:		//支付宝支付
						return '支付宝';
						break;
					case 3:		//银行卡支付
						return '银行卡';
						break;
					case 4:		//会员卡支付
						return '会员卡';
						break;
					case 5:		//现金支付
						return '现金';
						break;
					case 6:		//现金支付
						return '会员+微信';
						break;
					case 7:		//现金支付
						return '会员+支付宝';
						break;
					case 99:	//未知支付
						return '未知支付';
						break;
					default:
						console.log("异常支付码："+val)
				}
			},
			payWayImgFilters(val) {
				switch(parseInt(val)){
					case 1:		//微信支付
						return '../../../static/order/icon_wechat_list.png';
						break;
					case 2:		//支付宝支付
						return '../../../static/order/icon_zhifubao_list.png';
						break;
					case 3:		//银行卡支付
						return '../../../static/order/icon_unionpay_list.png';
						break;
					case 4:		//会员卡支付
						return '../../../static/home/icon_king.png';
						break;
					case 5:		//现金
						return '../../../static/home/icon_king.png';
						break;
					case 6:		//会员+微信
						return '../../../static/home/icon_king.png';
						break;
					case 7:		//会员+支付宝
						return '../../../static/home/icon_king.png';
						break;
					case 99:	//未知支付
						return '../../../static/order/icon_receive_money.png';
						break;
					default:
						console.log("异常支付码："+val)
				}
			},
			remarksFilters(val){
				if(val === null){
					return ''
				}
				return val
			},
			payClientFilters(val) {
				switch(parseInt(val)){
					case 1:
						return 'PC端'
					case 2:
						return 'App端'
					case 3:
						return '其它'
					case 4:
						return 'POS机'
				}
				return ''
			},
			dealWithMoney(money) {
				if (/^[0-9]+\.[0-9]$/.test(money)) {
					money = money + '0'
				} else if (/^[0-9]+$/.test(money)) {
					money = money + '.00'
				}
				return money
			},
			payChannelFilters(channel) {
				if (channel === 1) {
					channel = '官方'
				} else if (channel === 2) {
					channel = '会员宝'
				} else if (channel === 3) {
					channel = '易融码'
				} else if (channel === 4) {
					channel = '统统收'
				} else if (channel === 5) {
					channel = '慧闪付'
				} else if (channel === 6) {
					channel = '富友'
				} else if (channel === 7) {
					channel = '随行付'
				} else if (channel === 8) {
					channel = '拉卡拉'
				} else if (channel === 9) {
					channel = '威富通'
				} else if (channel === 10) {
					channel = '乐刷'
				} else if (channel === 11) {
					channel = '传化'
				} else if (channel === 12) {
					channel = '天阙随行付'
				} else if (channel === 13) {
					channel = '易生'
				} else if (channel === 14) {
					channel = '新大陆'
				} 
				return channel
			}
		},
		// onNavigationBarButtonTap() {
		// 	console.log("点击了打印按钮")
		// 	let that = this;
		// 	/* 查询是否有已绑定设备 */
		// 	let bindedEquipmentOne = uni.getStorageSync('bindedEquipment')
		// 	if(bindedEquipmentOne && bindedEquipmentOne !== {}){
		// 		this.bindedEquipment = bindedEquipmentOne;
		// 		console.log("获取了已绑定设备："+this.bindedEquipment);
		// 		console.log(JSON.stringify(this.bindedEquipment));
		// 		/* 存在已绑定设备，获取其信息 */
		// 		this.nowBuletoothIdObj = uni.getStorageSync("nowBuletoothIdObj");
		// 		console.log(this.nowBuletoothIdObj)
		// 	}else{
		// 		uni.showToast({
		// 			icon: 'none',
		// 			title: "未绑定相应的打印设备"
		// 		})
		// 		return
		// 	}
		// 	uni.showLoading({
		// 		title: "loading..."
		// 	})
		// 	/* 初始化蓝牙（检查是否打开手机蓝牙） */
		// 	setTimeout(() => {
		// 		uni.hideLoading()
		// 		uni.openBluetoothAdapter({
		// 			success() {
		// 				uni.showLoading({
		// 					title: "loading..."
		// 				})
		// 				/* 连接绑定打印机 */
		// 				setTimeout(() => {
		// 					uni.hideLoading()
		// 					uni.createBLEConnection({
		// 						deviceId: that.nowBuletoothIdObj.connectedDeviceId,
		// 						success() {
		// 							console.log("连接成功")
		// 							/* 询问是否打印 */
		// 							uni.showModal({
		// 								content: '是否进行打印',
		// 								success(res) {
		// 									uni.showToast({
		// 										title:"敬请期待"
		// 									})
		// 									if(res.confirm){
		// 										console.log("确认进行打印")
		// 										// that.sendDataToBLE(deviceId, serviceId, characteristicWriteId, printerText, function(success, msg) {
		// 										// 		//关闭与设备的连接
		// 										// 		app_intf.closeBLEConnectionAndAdapter(deviceId);
		// 										// 		if (success == 1) {
		// 										// 			emaosoft.show_none_toast("打印完成");
		// 										// 			calbackForLog("打印完成 ...");
		// 										// 			if (callbackIfFinish) {
		// 										// 				callbackIfFinish();
		// 										// 			}
		// 										// 		} else {
		// 										// 			//emaosoft.show_none_toast("打印失败:" + msg);
		// 										// 			calbackForLog("打印失败：" + msg);
		// 										// 		}
		// 										// 	});
		// 									}else{
		// 										console.log("取消了打印")
		// 									}
		// 								}
		// 							})
		// 						},
		// 						fail(err) {
		// 							uni.showToast({
		// 								title:"连接失败，可能是您没有开启对应打印机"
		// 							})
		// 						}
		// 					})
		// 				},1000)
		// 			},
		// 			fail(err) {
		// 				uni.hideLoading()
		// 				if(parseInt(err.errCode) === 10001){
		// 					uni.showToast({
		// 						title:"请打开蓝牙"
		// 					})
		// 				}
		// 			}
		// 		})
		// 	},1000)
		// },
		methods: {
			// input change
			onChange(type, e) {
				let value = e.detail.value
				// console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', this)
				if (type === 'refundPayPrice') {
					this.refundPayPrice = value
					// console.log('this.refundPayPrice', this.refundPayPrice)
				} else if (type === 'password') {
					this.password = value
				}
			},
			/* 订单详情 */
			getOrderDetail(){
				getOrderDetails(this.orderNumber).then(res => {
					console.log('xxxxxxxxxxxxxxx', res)
					console.log('xxxxxxxxxxxxxxxaaaaaaaaaaaaaaaaaaaaa', JSON.stringify(res.obj))
					this.orderDetails = res.obj
				}).catch(err => {
					console.log(err)
					// uni.navigateBack({
					// 	delta: 1
					// })
				})
			},
			/* 打开退款模态框 */
			showRefundModal() {
				// 判断订单跟门店的一致性
				let storeId = ''
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				if (this.orderDetails['storeId'] !== storeId) {
					// 打印
					// getPrintOrderDetailAndPrint(this.orderDetails)
					this.$refs['switchDialogRefund'].onModalOpen()
					return
				}
				// POS机平台的判断
				if (this.orderDetails && this.orderDetails.payClient === 4) {
					if (!isFuiouPlatform()) {
						uni.showToast({
							title: '银行卡消费订单只支持用POS机退款',
							icon: 'none'
						})
						return
					}
				}
				let issueArr = uni.getStorageSync('issueArr') || []
				if (issueArr.indexOf(this.orderDetails.orderNumber) !== -1) {
					uni.showToast({
						title: '当前订单无法退款，请联系客服',
						icon: 'none'
					})
					return
				}
				// 打印机设置
				if (!isPrinterExist()) {
					this.$refs['switchDialogPrinterRefund'].onModalOpen()
					return
				}
				this.showModal = true
			},
			/* 退款 */
			doRefund() {			
				// console.log('xxxxxxxxxx', this)
				// console.log('this.orderDetails.orderNumber', this.orderDetails.orderNumber)
				// console.log('this.refundPayPrice', this.refundPayPrice)
				// console.log('this.refundPayPrice', this.password)
				if (this.refundPayPrice || this.password) {
					refund( this.orderDetails.orderNumber, this.refundPayPrice, this.password).then(res => {
						// console.log(res);
						/* 提示栏 */
						this.HMmessages.show(res.msg,{icon:'success'});
						/* 刷新页面 */
						// this.getOrderDetail()
						getOrderDetails(this.orderDetails.orderNumber).then(res => {
							// console.log('xxxxxxxxxxxxxxx', res)
							this.orderDetails = res.obj
							// 打印
							getPrintOrderDetailAndPrint(this.orderDetails, false, true)
						}).catch(err => {
							console.log(err)
							// uni.navigateBack({
							// 	delta: 1
							// })
						})
					}).catch(err => { 
						console.log(err);
					})
				}
			},
			/* 模态框 确认/取消 事件 */
			bindBtn(str) {
				let that = this
				if(str === 'confirm'){
					if (that.refundPayPrice && that.password) {
						if (that.orderDetails && that.orderDetails.payClient === 4) {
							if (isFuiouPlatform()) {
								// console.log('打印x', that.orderDetails.orderNumber, that.refundPayPrice, that.password)
								let refundPayPrice = that.refundPayPrice
								let password = that.password
								posRefundValid(that.orderDetails.orderNumber, refundPayPrice, password).then(res => {
									if (res.code === 200) {
										onFuiouBankRefund(that.orderDetails.orderNumber, refundPayPrice, (amount) => {
											// console.log('amount', amount)
											// console.log('进行退款');
											// this.doRefund();
											// console.log('打印', that.orderDetails.orderNumber, refundPayPrice, password)
											// posRefund(that.orderDetails.orderNumber, refundPayPrice, password).then(res => {
											// 	console.log(res)
											// 	if (res.code === 200) {
											// 		/* 提示栏 */
											// 		that.HMmessages.show('退款成功',{icon:'success'});
											// 		/* 刷新页面 */
											// 		that.getOrderDetail()
											// 	}
											// })
											let issueArr = uni.getStorageSync('issueArr') || []
											issueArr = [
												...issueArr,
												that.orderDetails.orderNumber
											]
											uni.setStorageSync('issueArr', issueArr)
											that.posRefund(that.orderDetails.orderNumber, refundPayPrice, password)
										})
									}
								})
							} else {
								uni.showToast({
									title: '银行卡消费订单只支持用POS机退款',
									icon: 'none'
								})
							}
						} else {
							that.doRefund()
						}
					} else if (!that.refundPayPrice && that.password) {
						uni.showToast({
							title: '请输入付款金额',
							icon: 'none'
						})
					} else if (that.refundPayPrice && !that.password) {
						uni.showToast({
							title: '请输入密码',
							icon: 'none'
						})
					}
				}
				
				// /* 关闭模态框 */
				// this.showModal = false;
				// /* 模态框数据初始化 */
				// this.refundPayPrice = '';
				// this.password = '';
			},
			// 后台退款
			posRefund(orderNumber, refundPayPrice, password) {
				if (this.requestCount > 4) {
					this.requestCount = 0
					uni.showToast({
						title: '后台退款失败，请联系客服',
						icon: 'none'
					})
					return
				}
				let issueArr = uni.getStorageSync('issueArr') || []
				posRefund(orderNumber, refundPayPrice, password).then(res => {
					this.requestCount = 0
					// console.log(res)
					if (res.code === 200) {
						/* 提示栏 */
						this.HMmessages.show('退款成功',{icon:'success'});
						/* 刷新页面 */
						this.getOrderDetail()
						issueArr = issueArr.filter((item) => {
							return item !== orderNumber
						})
						uni.setStorageSync('issueArr', issueArr)
						// 打印
						getOrderDetailsAndPrint(orderNumber)
					}
				}).catch(err => {
					uni.showToast({
						title: '后台退款失败，尝试重新退款（第' + (this.requestCount + 1) + '次）',
						icon: 'none'
					})
					this.requestCount += 1
					setTimeout(() => {
						this.posRefund(orderNumber, refundPayPrice, password)
					}, 3000)
				})
			},
			/* 退款模态框关闭后事件 */
			closeModal() {
				setTimeout(() => {
					/* 关闭模态框 */
					this.showModal = false;
					/* 模态框数据初始化 */
					this.refundPayPrice = '';
					this.password = '';
				}, 200)
			},
			/* 全退按钮 */
			allRefundNumber() {
				this.refundPayPrice = parseFloat(this.orderDetails.remainPrice);
			},
			/* 打开修改备注模态框 */
			showEditRemarksModel() {
				this.showRemarksModel = true;
			},
			/* 编辑备注确认 */
			editRemarksBtn(str) {
				if(str === 'confirm'){
					// console.log('进行修改');
					this.editRemarks();
				}
				/* 关闭模态框 */
				this.showRemarksModel = false;
				/* 模态框数据初始化 */
				this.remarksModelContent = '';
			},
			/* 编辑备注模态框关闭后事件 */
			closeRemarksModel(){
				
			},
			/* 编辑备注 */
			editRemarks() {
				editOrderRemarks( this.orderNumber, this.remarksModelContent).then(res => {
					// console.log(res)
					/* 刷新页面 */
					this.getOrderDetail()
				}).catch(err => {
					console.log(err)
				})
			},
			/* 打印单 */
			printList() {
				
			},
			/* 打印 */
			sendData() {
				// console.log("尝试打印0")
				let str = "一二三四五\n\n\n"		//一次上限20字符，一行32字符，后台转gb2312字符
				// str = encodeToGb2312(str);
				let that = this;
				let dataBuffer = new ArrayBuffer(str.length)
				let dataView = new DataView(dataBuffer)
				for (var i = 0; i < str.length; i++) {
					dataView.setUint8(i, str.charAt(i).charCodeAt())
				}
				let dataHex = that.ab2hex(dataBuffer);
				this.writeDatas = that.hexCharCodeToStr(dataHex);
				// uni.createBLEConnection({
					// deviceId:"66:12:04:86:1C:22",
					// success() {
						
					// },fail(err) {
						// console.log("错误1:"+err)
						// console.log(JSON.stringify(err))
					// }
				// })
			},
			Print(content) {
				let that = this
				// console.log("尝试打印1")
				uni.writeBLECharacteristicValue({
					deviceId: that.connectedDeviceId,
					serviceId: that.notifyServiceId,
					characteristicId: that.characteristicId,
					value: content,
					success: function (res) {
						console.log('发送的数据：' + that.writeDatas)
						console.log('message发送成功')
					},
					fail: function (res) {
						console.log("错误2:"+err)
						console.log(JSON.stringify(err))
					},
					complete: function (res) {
						console.log("结束打印2")
					}
				})
			},
			/*转换成需要的格式*/
			buf2string(buffer) {
						var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
						return arr.map((char, i) => {
							return String.fromCharCode(char);
						}).join('');
			},
			receiveData(buf) {
				return this.hexCharCodeToStr(this.ab2hex(buf))
			},
			/*转成二进制*/
			ab2hex (buffer) {
				var hexArr = Array.prototype.map.call(
					new Uint8Array(buffer), function (bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('')
			},
			/*转成可展会的文字*/
			hexCharCodeToStr(hexCharCodeStr) {
				var trimedStr = hexCharCodeStr.trim();
				var rawStr = trimedStr.substr(0, 2).toLowerCase() === '0x' ? trimedStr.substr(2) : trimedStr;
				var len = rawStr.length;
				var curCharCode;
				var resultStr = [];
				for (var i = 0; i < len; i = i + 2) {
					curCharCode = parseInt(rawStr.substr(i, 2), 16);
					resultStr.push(String.fromCharCode(curCharCode));
				}
				return resultStr.join('');
			},
			sendDataToBLE: function(deviceId, serviceId, characteristicId, msg, callbackIfFinish) {
				
				function encode_utf8(s) {
					return unescape(encodeURIComponent(s));
				}
		 
				function str2ab(str) {
					var s = encode_utf8(str);
					var buf = new ArrayBuffer(s.length);
					var bufView = new Uint8Array(buf);
					for (var i = 0, strLen = s.length; i < strLen; i++) {
						bufView[i] = s.charCodeAt(i);
					}
					return bufView;
				}
		 
				function split_array(arr, len) {
					var a_len = arr.length;
					var result = []
					for (var i = 0; i < a_len; i += len) {
						result.push(arr.slice(i, i + len))
					}
					return result;
				}
				//var uint8Buf = str2ab(msg);		
				var uint8Array = new textencoding.TextEncoder("gb2312", {
					NONSTANDARD_allowLegacyEncoding: true
				}).encode(msg);
				var uint8Buf = Array.from(uint8Array);
				//拆分数组 每20个元素组成一个新数组 
				var sendloop = split_array(uint8Buf, 20);
		 
				function realWriteData(sendloop, i) {
					if (i >= sendloop.length) {
						if (callbackIfFinish) {
							callbackIfFinish(1, "");
						}
						return;
					}
					var tagName = "DeviceID:" + deviceId + " ServiceID:" + serviceId + " CharcWriteID:" + characteristicId + " -> 第【" +
						+"】次写入 => ";
					var newsenddata = sendloop[i]
					let buffer = new ArrayBuffer(newsenddata.length)
					let dataView = new DataView(buffer)
					for (var j = 0; j < newsenddata.length; j++) {
						dataView.setUint8(j, newsenddata[j]);
					}
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: characteristicId,
						// 这里的value是ArrayBuffer类型
						value: buffer,
						success: function(res) {
							realWriteData(sendloop, i + 1);
						},
						fail: function(err) {
							emaosoft.show_none_toast_20sec(tagName + err.errMsg);
							if (callbackIfFinish) {
								callbackIfFinish(0, tagName + err.errMsg);
							}
						}
					})
				}
				var i = 0;
				realWriteData(sendloop, 0);
			},
			// 模态框确定
			onModalConfirm(type) {
				if (type === 1 || type === 2) {
					// 切换门店模态框
					console.log('confirm')
					uni.navigateTo({
						url: '/pages/home/storeSelect/index/index'
					})
				} else if (type === 3 || type === 4) {
					// 添加打印机
					uni.navigateTo({
						url: '/pages/user/newPrinter/index/index'
					})
				}
			},
			// 模态框取消
			onModalCancel(type) {
				// nothing to do
				if (type === 3) {
					// 添加打印机 取消
				} else if (type === 4) {
					// 显示退款模态框
					this.showModal = true
				}
			}
		}
	}
</script>

<style>
	body{
		background-color: #F1F1F3;
	}
	.text-llg{
		font-size: 38upx;
	}
	.margin-right-20{
		margin-right: 20upx;
	}
	.prod-height{
		height: 36upx;
	}
	.lf-warning{
		width: 750upx;
		height: 60upx;
		padding-left: 30upx;
		/* font-size: 12upx; */
		color: #ffa500;
		background-color: #ffe372;
		display: flex;
		align-items: center;
	}
	.lf-list > view{
		width: 750upx;
		height: 98upx;
		padding: 0 29upx;
		font-size: 32upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FFF;
		border-bottom: 1upx solid #F1F1F3;
		font-weight: 500;
	}
	.lf-list image{
		width: 36upx;
		height: 36upx;
	}
	.lf-mat{
		width: 750upx;
		height: 40upx;
	}
	.lf-btn{
		width: 750upx;
		height: 160upx;
		padding: 0 40upx;
		display: flex;
		justify-content: space-between;
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
	.lf-btn .bg-ffcb90{
		background-color: #4BA8FF;
	}
	.lf-refund-modal > view{
		height: 60upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-refund-modal input{
		border-bottom: 1upx solid #E5E5E5;
	}
	.lf-btn-allRefund{
		width: 80upx;
		height: 50upx;
		/* padding: 5upx 8upx; */
		background-color: #32C6E9;
		color: #FFF;
		border-radius: 5upx;
	}
	.lf-remarks-input{
		border: 1upx solid #EFEFEF;
		padding: 0 5upx;
		border-radius: 10upx;
	}
	.text-white {
		color: #FFF;
	}
	.disabled {
		background-color: #DDD !important;
		color: #999 !important;
		border: 1upx solid transparent !important;
	}
</style>
