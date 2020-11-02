<template>
	<view>
		<view class="lf-warning" v-if="isShowWarning">
			<text class="text-sm">支付机构未通知支付结果，请下拉页面，刷新同步更新状态</text>
		</view>
		<view class="lf-list">
			<view>
				<text class="text-grey">订单金额</text>
				<text>
					<text>{{yenSymbol}}{{recordDetails.tradingMoney | dealWithMoney}}</text>
				</text>
			</view>
			<view>
				<text class="text-grey">会员优惠</text>
				<text>
					<text>{{yenSymbol}}{{recordDetails.giftMoney | dealWithMoney}}</text>
				</text>
			</view>
			<view>
				<text class="text-grey">扣款金额</text>
				<text>
					<text>{{yenSymbol}}{{(recordDetails.tradingMoney - recordDetails.giftMoney) | dealWithMoney}}</text>
				</text>
			</view>
			<view>
				<text class="text-grey">手机号</text>
				<text>
					<text>{{recordDetails.phone ? recordDetails.phone : ''}}</text>
				</text>
			</view>
			<view>
				<text class="text-grey">交易状态</text>
				<text>{{recordDetails.payStatus | paystatusFilters}}</text>
			</view>
			<!-- <view>
				<text class="text-grey">本次积分</text>
				<text>{{recordDetails.xxx}}积分</text>
			</view> -->
			<view>
				<text class="text-grey">会员余额</text>
				<text>{{yenSymbol}}{{recordDetails.postTradingMoney | dealWithMoney}}</text>
			</view>
			<view>
				<text class="text-grey">支付方式</text>
				<text>
					<view class=" prod prod-height"></view>
					<image class="margin-right-20 meat" :src="recordDetails.payWay | payWayImgFilters"></image>
					<!-- <text><image src="../../../static/order/icon_wechat.png"></image></text> -->
					<text class="meat">{{recordDetails.payWay | payWayFilters}}</text>
				</text>
			</view>
		</view>
		<view class="lf-mat"></view>
		<view class="lf-list">
			<view>
				<text class="text-grey">交易单号</text>
				<text>{{recordDetails.orderNumber ? recordDetails.orderNumber : ''}}</text>
			</view>
			<view>
				<text class="text-grey">支付终端</text>
				<text>{{recordDetails.source | payClientFilters}}</text>
				<!-- <text>-</text> -->
			</view>
			<view>
				<text class="text-grey">门店名</text>
				<text>{{recordDetails.storeName ? recordDetails.storeName : ''}}</text>
			</view>
			<view>
				<text class="text-grey">操作人</text>
				<text>{{recordDetails.operationUser ? recordDetails.operationUser : ''}}</text>
			</view>
			<view>
				<text class="text-grey">支付时间</text>
				<text>{{recordDetails.payTime === null ? '' : recordDetails.payTime}}</text>
			</view>
			<view>
				<text class="text-grey">创建时间</text>
				<text>{{recordDetails.createTime ? recordDetails.createTime : ''}}</text>
			</view>
			<!-- <view>
				<text class="text-grey">订单备注</text>
				<text>{{recordDetails.remarks | remarksFilters}}</text>
			</view> -->
		</view>
		<!-- <view class="lf-btn">
			<view class="bg-ff8800" @click="showRefundModal" v-if="recordDetails.status === 2 || recordDetails.status === 6">
				<text class="text-white">退款</text>
			</view>
			<view class="bg-ffcb90" v-else>
				<text class="text-white">退款</text>
			</view>
			<view @click="showEditRemarksModel">
				<text class="text-orange">编辑备注</text>
			</view>
		</view> -->
		<!-- 退款 -->
		<neil-modal 
			:show="showModal" 
			@close="closeModal" 
			auto-close="false"
			title="退款" 
			confirm-color="#ff8800"
			@cancel="bindBtn('cancel')" 
			@confirm="bindBtn('confirm')">
			<view class="lf-refund-modal" style="min-height: 90upx;padding: 32upx 24upx;">
				<view>
					<text><text class="icon-title text-orange"></text><text>可退金额:</text></text>
					<text class="text-llg">{{recordDetails.remainPrice}}</text>
					<text class="lf-btn-allRefund" @click="allRefundNumber">全退</text>
				</view>
				<view>
					<text><text class="icon-title text-orange"></text><text>退款金额:</text></text>
					<input type="number" v-model="refundPayPrice">
				</view>
				<view>
					<text><text class="icon-title text-orange"></text>密码:</text>
					<input type="password" v-model="password">
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
	</view>
</template>

<script>
	import { getRecordDetail, refund, editOrderRemarks} from '../../../../api/vueAPI.js'
	import neilModal from '@/components/neil-modal/neil-modal.vue'
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	import encodeToGb2312 from '@/common/encodeToGb2312.js'
	export default {
		components: { neilModal, HMmessages},
		data() {
			return {
				yenSymbol: '\u00A5',	//金钱符号
				orderNumber: '',
				recordDetails: '',		//订单详情
				showModal: false,
				refundPayPrice: '',		//退款金额
				password: '',			//密码
				showRemarksModel: false,
				remarksModelContent: '',
				isShowWarning: false,	//警告
				bindedEquipment: '',	//已绑定打印机
				nowBuletoothIdObj: '',	//当前已绑定打印机参数
			}
		},
		onLoad(obj) {
			this.id = obj.id;
			this.getRecordDetail();
		},
		filters:{
			paystatusFilters(val) {
				switch(parseInt(val)){
					case 1:
						return '未支付';
						break;
					case 2:
						return '支付成功';
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
					case 3:		//会员储值卡支付
						return '会员储值卡';
						break;
					case 4:		//H5支付
						return 'H5';
						break;
					case 5:		//导入支付
						return '导入';
						break;
					default:
						console.log("异常支付码："+val)
				}
			},
			payWayImgFilters(val) {
				switch(parseInt(val)){
					case 1:		//微信支付
						return '../../../../static/order/icon_wechat_list.png';
						break;
					case 2:		//支付宝支付
						return '../../../../static/order/icon_zhifubao_list.png';
						break;
					case 3:		//会员储值卡支付
						return '../../../../static/order/icon_member_card.png';
						break;
					case 4:		//H5支付
						return '../../../../static/home/icon_member_analysis.png';
						break;
					case 5:		//导入支付
						return '../../../../static/order/icon_unionpay_list.png';
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
					case 3:
					case 4:
						return 'App端'
				}
			},
			// 金币保留两位小数
			dealWithMoney(money) {
				// console.log('过滤前', money)
				if (/^[0-9]+\.[0-9]$/.test(money)) {
					money = money + '0'
				} else if (/^[0-9]+$/.test(money)) {
					money = money + '.00'
				}
				// console.log('过滤后', money)
				return money
			}
		},
		onNavigationBarButtonTap() {
			// console.log("点击了打印按钮")
			let that = this;
			/* 查询是否有已绑定设备 */
			let bindedEquipmentOne = uni.getStorageSync('bindedEquipment')
			if(bindedEquipmentOne && bindedEquipmentOne !== {}){
				this.bindedEquipment = bindedEquipmentOne;
				console.log("获取了已绑定设备："+this.bindedEquipment);
				console.log(JSON.stringify(this.bindedEquipment));
				/* 存在已绑定设备，获取其信息 */
				this.nowBuletoothIdObj = uni.getStorageSync("nowBuletoothIdObj");
				console.log(this.nowBuletoothIdObj)
			}else{
				uni.showToast({
					icon: 'none',
					title: "未绑定相应的打印设备"
				})
				return
			}
			uni.showLoading({
				title: "loading..."
			})
			/* 初始化蓝牙（检查是否打开手机蓝牙） */
			setTimeout(() => {
				uni.hideLoading()
				uni.openBluetoothAdapter({
					success() {
						uni.showLoading({
							title: "loading..."
						})
						/* 连接绑定打印机 */
						setTimeout(() => {
							uni.hideLoading()
							uni.createBLEConnection({
								deviceId: that.nowBuletoothIdObj.connectedDeviceId,
								success() {
									console.log("连接成功")
									/* 询问是否打印 */
									uni.showModal({
										content: '是否进行打印',
										success(res) {
											uni.showToast({
												title:"敬请期待"
											})
											if(res.confirm){
												console.log("确认进行打印")
												// that.sendDataToBLE(deviceId, serviceId, characteristicWriteId, printerText, function(success, msg) {
												// 		//关闭与设备的连接
												// 		app_intf.closeBLEConnectionAndAdapter(deviceId);
												// 		if (success == 1) {
												// 			emaosoft.show_none_toast("打印完成");
												// 			calbackForLog("打印完成 ...");
												// 			if (callbackIfFinish) {
												// 				callbackIfFinish();
												// 			}
												// 		} else {
												// 			//emaosoft.show_none_toast("打印失败:" + msg);
												// 			calbackForLog("打印失败：" + msg);
												// 		}
												// 	});
											}else{
												console.log("取消了打印")
											}
										}
									})
								},
								fail(err) {
									uni.showToast({
										title:"连接失败，可能是您没有开启对应打印机"
									})
								}
							})
						},1000)
					},
					fail(err) {
						uni.hideLoading()
						if(parseInt(err.errCode) === 10001){
							uni.showToast({
								title:"请打开蓝牙"
							})
						}
					}
				})
			},1000)
		},
		methods: {
			/* 订单详情 */
			getRecordDetail(){
				getRecordDetail( this.id).then(res => {
					// console.log(res)
					this.recordDetails = res.obj
				}).catch(err => {
					console.log(err)
				})
			},
			/* 打开退款模态框 */
			showRefundModal() {
				this.showModal = true;
			},
			/* 退款 */
			doRefund() {
				refund( this.recordDetails.orderNumber, this.refundPayPrice, this.password).then(res => {
					// console.log(res);
					/* 提示栏 */
					this.HMmessages.show(res.msg,{icon:'success'});
					/* 刷新页面 */
					this.getOrderDetail()
				}).catch(err => { 
					console.log(err);
				})
			},
			/* 模态框 确认/取消 事件 */
			bindBtn(str) {
				if(str === 'confirm'){
					// console.log('进行退款');
					this.doRefund();
				}
				/* 关闭模态框 */
				this.showModal = false;
				/* 模态框数据初始化 */
				this.refundPayPrice = '';
				this.password = '';
			},
			/* 退款模态框关闭后事件 */
			closeModal() {
				
			},
			/* 全退按钮 */
			allRefundNumber() {
				this.refundPayPrice = parseFloat(this.recordDetails.remainPrice);
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
						// console.log('发送的数据：' + that.writeDatas)
						// console.log('message发送成功')
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
		height: 100upx;
		padding: 0 40upx;
		font-size: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FFF;
		border-bottom: 1upx solid #F1F1F3;
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
		border: 1upx solid #ff8800;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-btn .bg-ff8800{
		background-color: #ff8800;
	}
	.lf-btn .bg-ffcb90{
		background-color: #ffcb90;
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
		padding: 5upx 8upx;
		background-color: #32C6E9;
		color: #FFF;
		border-radius: 5upx;
	}
	.lf-remarks-input{
		border: 1upx solid #EFEFEF;
		padding: 0 5upx;
		border-radius: 10upx;
	}
</style>
