<template>
	<view>
		<uni-list>
			<!-- <uni-list-item :title="isWhatStatusBluetooth" show-switch="true" show-arrow="false" :switch-checked="isBluetoothChecked" @switchChange="changeBluetooth"></uni-list-item> -->
			<view class="lf-list">
				<view class="lf-bottom-line" @click="changeBluetooth">
					<text class="text-lg">{{isWhatStatusBluetooth}}</text>
					<text class="text-lllg icon-right"></text>
				</view>
				<view class="lf-bottom-line" @click="startSearchBluetooth">
					<text class="text-lg">搜索设备</text>
					<image v-if="isShowSearchBluetooth" class="img-lllg" src="../../../../static/user/loading.gif"></image>
					<text v-else class="text-lllg icon-search"></text>
				</view>
			</view>
			<uni-list-item title="付款凭证" show-switch="true" show-arrow="false"></uni-list-item>
			<uni-list-item title="退款凭证" show-switch="true" show-arrow="false"></uni-list-item>
			<uni-list-item title="流水明细" show-switch="true" show-arrow="false"></uni-list-item>
		</uni-list>
		
		<view class="lf-block-head">
			<text class="text-grey">已绑定设备</text>
		</view>
		<view class="lf-block-content" v-if="bindedEquipment">
			<text>名称: {{bindedEquipment.localName ? bindedEquipment.localName : '未知设备'}}</text>
			<image src="../../../../static/user/icon_link.png"></image>
		</view>
		<view class="lf-block-head">
			<text class="text-grey">已配对设备</text>
		</view>
		<view class="lf-block-content" v-for="(item,index) in pairedDevices" @click="linkUp(item.deviceId, index)">
			<text>名称: {{item.localName ? item.localName : '未知设备'}}</text>
			<image v-if="isConnectionPairedDevices[index] && !isPairedDevicesLink" src="../../../../static/user/loading.gif"></image>
			<text v-if="isConnectionPairedDevices[index] && isPairedDevicesLink" class="icon-check text-lg margin-right-40"></text>
		</view>
		<view class="lf-block-head">
			<text class="text-grey">未配对设备</text>
		</view>
		<view class="lf-block-content" v-for="(item,key) in BluetoothList" @click="canPairing(item.deviceId, key)">
			<text>名称: {{item.localName ? item.localName : '未知设备'}}</text>
			<image v-if="isConnection[key]" src="../../../../static/user/loading.gif"></image>
		</view>
		<!-- 提示框 -->
		<view class="buttonGroup">
            <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
        </view>
		
		<!-- 打印测试用按钮 -->
		<button type="primary" style="position: fixed;bottom: 100upx;right: 20upx;width: 200upx;height: 100upx;" @click="printTest">打印</button>
	</view>
</template>

<script>
	import {uniList, uniListItem} from '@dcloudio/uni-ui'
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	import encodeToGb2312 from '@/common/encodeToGb2312.js'
	import qs from 'qs'
	const BLUETOOTH_OK = 0		//蓝牙正常
	const BLUETOOTH_NOT_INIT = 10000		//蓝牙未初始化
	const BLUETOOTH_NOT_AVAILABLE = 10001		//蓝牙适配器不可用  (蓝牙没开)
	const BLUETOOTH_NO_DEVICE = 10002		//蓝牙没有找到指定设备
	const BLUETOOTH_CONNECTION_FAIL = 10003		//蓝牙连接失败
	const BLUETOOTH_NO_SERVICE = 10004		//蓝牙没有找到指定服务
	const BLUETOOTH_NO_CHARACTERISTIC = 10005		//蓝牙没有找到指定特征值
	const BLUETOOTH_NO_CONNECTION = 10006		//蓝牙当前连接已断开
	const BLUETOOTH_PROPERTY_NOT_SUPPORT = 10007		//蓝牙当前特征值不支持此操作
	const BLUETOOTH_SYSTEM_ERROR = 10008		//蓝牙其余所有系统上报的异常
	const BLUETOOTH_SYSTEM_NOT_SUPPORT = 10009		//Android 系统特有，系统版本低于 4.3 不支持 BLE
	export default {
		components: { uniList, uniListItem, HMmessages},
		data() {
			return {
				BluetoothAdapter: null,		//5+plus的蓝牙模块
				BAdapter: null,		//5+plus的蓝牙模块-打开蓝牙用
				isWhatStatusBluetooth: '打开蓝牙',
				isBluetoothChecked: false,
				isShowMiddlePopup: false,
				isShowSearchBluetooth: false,		//是否正在搜索
				BluetoothList: [],		//蓝牙设备列表-未配对设备
				key: '',	//未配对设备列表的当前点击下标
				isConnection:[],	//未配对设备连接中标示
				pairedDevices: [],		//已配对设备
				keyPairedDevices: '',	//已配对设备列表的当前点击下标
				isConnectionPairedDevices: [],	//已配对设备连接中标示
				isPairedDevicesLink: false,	//已配对设备连接成功标示
				isLinkSuccess: false,		//已成功匹配设备相应服务特征值
				bindedEquipment: '',	//已绑定设备
				deviceId:'',		//当前正在连接的蓝牙（包括断开后）
				services: '',		//某蓝牙的所有服务
				connectedDeviceId: '',		//当前连接蓝牙DeviceId
				notifyServiceId: '',		//当前连接蓝牙ServiceId
				characteristicId: '',		//当前连接蓝牙characteristicId
				balanceData: '',
				hexstr: '',
				nowBuletoothIdObj: '',
				
				writeDatas:'',
			};
		},
		onReady() {
			
			this.BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter")
			this.BAdapter = this.BluetoothAdapter.getDefaultAdapter()
			
			// uni.clearStorageSync('pairedDevices')
			// uni.clearStorageSync('bindedEquipment')
			// uni.clearStorageSync('nowBuletoothIdObj')
			let that = this;
			/* 蓝牙自动初始化（同时判断手机是否已开启蓝牙） */
			this.isOpenBluetooth().then(res => {
				console.log(777, res)
				this.isWhatStatusBluetooth = '关闭蓝牙'
				this.isBluetoothChecked = true
				uni.showToast({
					title: "已打开蓝牙",
					icon:"success"
				})
			}).catch( err => {
				console.log(666, err)
				if(parseInt(err) === 10001){
					console.log('todo')
					uni.showModal({
						showCancel: true,
						content:"蓝牙处于关闭状态，是否打开？",
						success: (res) => {
							if (res.confirm) {
								that.changeBluetooth()
							}
						}
					})
				}else{
					that.BluetoothErrorSwitch(err);
				}
				this.isWhatStatusBluetooth = '打开蓝牙'
				this.isBluetoothChecked = false
			})
			/* 查询是否有已配对设备 */
			let pairedDevicesCache = uni.getStorageSync('pairedDevices')
			if(pairedDevicesCache && pairedDevicesCache !== []){
				for(let i=0; i<pairedDevicesCache.length;i++){
					this.isConnectionPairedDevices.push(false);
				}
				console.log("增加了已配对列表对应标示数组："+this.isConnectionPairedDevices)
				this.pairedDevices = pairedDevicesCache;
				console.log("获取了已配对列表："+this.pairedDevices)
				console.log(JSON.stringify(this.pairedDevices))
			}
			/* 查询是否有已绑定设备 */
			let bindedEquipmentOne = uni.getStorageSync('bindedEquipment')
			if(bindedEquipmentOne && bindedEquipmentOne !== {}){
				this.bindedEquipment = bindedEquipmentOne
				console.log("获取了已绑定设备："+this.bindedEquipment)
				console.log(JSON.stringify(this.bindedEquipment))
				//给已配对列表对应设备添加标示
				this.isPairedDevicesLink = true;
				for (let key in this.pairedDevices) {
					if(this.pairedDevices[key].deviceId === this.bindedEquipment.deviceId){
						this.isConnectionPairedDevices[key] = true;
					}
				}
			}
		},
		onUnload() {
			let that = this;
			if(this.pairedDevices && this.pairedDevices !== []){
				uni.setStorageSync('pairedDevices',this.pairedDevices)
				console.log("储存了已配对列表")
			}
			// if(this.bindedEquipment){
			// 	uni.setStorageSync('bindedEquipment',this.bindedEquipment)
			// 	console.log("储存了已绑定设备")
			// }
			/* 退出页面时，关闭蓝牙 */
			if(this.isBluetoothChecked){
				uni.closeBluetoothAdapter()
			}
		},
		watch:{
			isBluetoothChecked(val, oldVal){
				if(val === true){
					this.isWhatStatusBluetooth = '关闭蓝牙'
				}else{
					this.isWhatStatusBluetooth = '打开蓝牙'
				}
			},
			isConnectionPairedDevices(val , oldVal){
				console.log("改变的已配对标示数组"+val)
			}
		},
		methods:{
			//初始化蓝牙(打开/关闭蓝牙)
			changeBluetooth(){
				let that = this;
				//进行打开蓝牙
				if(this.isBluetoothChecked === false){
					this.isOpenBluetooth().then(res => {
						this.isBluetoothChecked = true
						that.HMmessages.show('蓝牙打开成功',{icon:'success'});
					}).catch(err => {
						console.log("打开错误")
						console.log(err)
						this.isBluetoothChecked = false
						if(err === 10001){
							uni.showToast({
								title: "请打开蓝牙",
								position: 'top'
							})
						}else{
							that.BluetoothErrorSwitch(err);
						}
						// that.HMmessages.show('蓝牙打开失败',{icon:'error'});
					})
				}else{//关闭蓝牙
					that.closeBluetooth();
				}
			},
			/* 开始搜索附近蓝牙设备 -功能 */
			startSearchBluetooth() {
				let that = this;
				this.stopSearchBluetooth();
				console.log("开始搜索附近设备。。。")
				/* 搜索附近蓝牙设备 */
				uni.startBluetoothDevicesDiscovery({
					success(res) {
						console.log("进行搜索...")
						console.log(res)
						that.BluetoothList = [];
						that.isConnection = [];
						uni.onBluetoothDeviceFound((devices) => {
							console.log('搜索到新设备')
							console.log(devices)
							// console.dir(devices)
							// console.dir(JSON.stringify(devices))
							// console.dir(JSON.stringify(devices['devices'][0]))
							// console.log(that.ab2hex(devices[0].advertisData))
							let index = true;
							for (let s of that.pairedDevices) {
								if(s.deviceId === devices['devices'][0].deviceId){
									index = false;
								}
							}
							if(index){
								that.isConnection.push(false);
								that.BluetoothList.push(devices['devices'][0]);
							}
						})
					},
					fail(err) {
						console.log("搜索失败")
						console.log(err)
						that.BluetoothErrorSwitch(err);
					}
				})
				
			},
			/* 停止搜索 */
			stopSearchBluetooth() {
				uni.stopBluetoothDevicesDiscovery({
					success(res) {
						console.log("已停止搜索")
						console.log(res)
					}
				})
			},
			/* 未配对设备进行配对 */
			canPairing(deviceId, key) {
				console.log("开始配对，停止搜索")
				this.stopSearchBluetooth();
				this.isConnection[key] = true;
				this.deviceId = deviceId;	//当前信息
				this.key = key;	//当前信息
				let that = this;
				setTimeout(() => {
					console.log("deviceId为"+that.deviceId)
					console.log("进行蓝牙连接。。。")
					uni.createBLEConnection({
						deviceId: that.deviceId,
						success(res) {
							console.log('蓝牙连接成功:'+res)
							console.log(JSON.stringify(res))
							that.isConnectionPairedDevices.push(false)
							that.pairedDevices.push(that.BluetoothList[key])
							that.BluetoothList.splice(key,1)
							//已将该设备加入已配对，断开连接
							uni.closeBLEConnection({
								deviceId: that.deviceId
							})
						},
						fail(err) {
							that.BluetoothErrorSwitch(err);
							that.isConnection[key] = false;
						},complete() {
							that.isConnection[key] = false;
						}
					})
				},1000)
			},
			/* 已配对设备，进行连接绑定 */
			linkUp(deviceId, key) {
				console.log("开始配对，停止搜索")
				this.stopSearchBluetooth();
				//如果有正在连接的蓝牙，断开该蓝牙
				if(this.connectedDeviceId){
					uni.closeBLEConnection({
						deviceId: this.deviceId
					})
				}
				this.isPairedDevicesLink = false;
				this.isLinkSuccess = false;
				//将当前点击标示
				this.isConnectionPairedDevices[key] = true;
				this.connectedDeviceId = deviceId	//当前连接蓝牙的信息
				this.keyPairedDevices = key
				console.log('当前点击下标'+this.keyPairedDevices)
				let that = this;
				setTimeout(() => {
					console.log("deviceId为"+that.connectedDeviceId)
					console.log("进行蓝牙连接。。。")
					uni.createBLEConnection({
						deviceId: that.connectedDeviceId,
						success(res) {
							console.log('蓝牙连接成功:'+res)
							console.log(JSON.stringify(res))
							/* 获取蓝牙设备所有服务 */
							that.getServices();
						},
						fail(err) {
							that.BluetoothErrorSwitch(err);
							that.isConnectionPairedDevices[that.keyPairedDevices] = false;
							that.isPairedDevicesLink = true;
							console.log("绑定失败：")
							console.log(err)
						}
					})
				},1000)
			},
			/* 获取蓝牙设备所有服务 */
			getServices() {
				let that = this;
				setTimeout(() => {
					console.log('进行服务获取。。。')
					uni.getBLEDeviceServices({
						deviceId: that.connectedDeviceId,
						success(res) {
							console.log('服务获取成功:'+res)
							console.log(JSON.stringify(res))
							that.services = res.services
							
							for (let item of that.services) {
								that.getCharacteristics(item.uuid)
							}
							// that.getCharacteristics()
							setTimeout(() => {
								if(!that.isLinkSuccess){
									uni.showToast({
										title: "该设备无相应服务",
										position: 'top'
									})
								}
							},10000)
						},fail(err) {
							that.BluetoothErrorSwitch(err);
							that.isConnectionPairedDevices[that.keyPairedDevices] = false;
							that.isPairedDevicesLink = true;
							console.log("获取服务失败：")
							console.log(err)
						}
					})
				},2000)
			},
			/* 获取蓝牙中某服务的所有特征值 */
			getCharacteristics(serviceId) {
				let that = this;
				setTimeout(() => {
					/* 获取蓝牙中某服务的所有特征值 */
					console.log('进行蓝牙中某服务的所有特征值的获取。。。')
					uni.getBLEDeviceCharacteristics({
						deviceId: that.connectedDeviceId,
						serviceId: serviceId,
						success(res) {
							console.log("特征值获取成功")
							console.log(res)
							console.log(JSON.stringify(res))
							for (let i = 0; i < res.characteristics.length; i++) {
								if ((res.characteristics[i].properties.notify || res.characteristics[i].properties.indicate) &&
									(res.characteristics[i].properties.read && res.characteristics[i].properties.write)) {
									console.log(res.characteristics[i].uuid, '蓝牙特征值 ==========')
									console.log("步骤1")
									that.notifyServiceId = serviceId;
									/* 获取蓝牙特征值 */
									that.characteristicId = res.characteristics[i].uuid;
									console.log("步骤2")
									//将已绑定设备渲染
									that.bindedEquipment = that.pairedDevices[that.keyPairedDevices];
									// 启用低功耗蓝牙设备特征值变化时的 notify 功能
									// that.notifyBLECharacteristicValueChange()
									//已获取全部信息，绑定成功
									console.log("步骤3")
									//将相关信息储存
									uni.setStorageSync('nowBuletoothIdObj',{
										connectedDeviceId: that.connectedDeviceId,
										notifyServiceId: that.notifyServiceId,
										characteristicId: that.characteristicId
									})
									uni.setStorageSync('bindedEquipment',that.bindedEquipment)
									console.log("储存了已绑定设备")
									// 初始化标示
									console.log("步骤4")
									console.log("初始化标示:"+that.isConnectionPairedDevices)
									for (let s of that.isConnectionPairedDevices) {
										s = false
									}
									console.log("步骤5")
									/* 设置对应位置标示 */
									that.isConnectionPairedDevices[that.keyPairedDevices] = true;
									that.isPairedDevicesLink = true;
									that.isLinkSuccess = true;
									console.log("步骤6")
									uni.showToast({
										title: "设备绑定成功",
										icon:"success"
									})
									/* 断开连接 */
									uni.closeBLEConnection({
										deviceId: that.bindedEquipment.deviceId
									})
								}
							}
						},fail(err) {
							that.BluetoothErrorSwitch(err);
							that.isConnectionPairedDevices[that.keyPairedDevices] = false;
							that.isPairedDevicesLink = true;
							console.log("获取特征值失败："+err)
						}
					})
				},1000)
			},
			/* 关闭蓝牙 */
			closeBluetooth() {
				let that = this;
				uni.closeBluetoothAdapter({
					success(res) {
						that.HMmessages.show('蓝牙已关闭',{icon:'success'});
						that.isBluetoothChecked = false;
						// console.log("关闭蓝牙")
						// console.log(res)
					}
				})
			},
			/* 蓝牙初始化（同步函数） */
			async isOpenBluetooth() {
				let BlueStatus = await this.openBluetoothAdapter();
			},
			/* 初始化蓝牙（手机蓝牙） */
			openBluetoothAdapter() {
				let that = this;
				return new Promise((resolve, reject) => {
					uni.openBluetoothAdapter({
						success:function(e){
							console.log("蓝牙成功初始化")
							console.log('open success: '+JSON.stringify(e));
							resolve(e.errCode);
						},
						fail:function(e){
							console.log("蓝牙初始化失败")
							console.log('open failed: '+JSON.stringify(e));
							reject(e.errCode);
						}
					});
				})
			},
			/* 蓝牙错误筛选 */
			BluetoothErrorSwitch(errCode){
				console.log("错误代码：")
				console.log(errCode)
				switch(parseInt(errCode)){
					//0成功
					case BLUETOOTH_OK:
						this.HMmessages.show('蓝牙状态正常',{icon:'success'});
						break;
					//10000错误
					case BLUETOOTH_NOT_INIT:
						// uni.showToast({
						// 	title: '蓝牙未初始化',
						// 	icon: 'none',
						// 	position: 'top'
						// })
						this.HMmessages.show('蓝牙未初始化',{icon:'error'});
						break;
					//10001错误
					case BLUETOOTH_NOT_AVAILABLE:
						this.HMmessages.show('蓝牙未打开',{icon:'error'});
						break;
					//10002错误
					case BLUETOOTH_NO_DEVICE:
						this.HMmessages.show('蓝牙没有找到指定设备',{icon:'error'});
						break;
					//10003错误
					case BLUETOOTH_CONNECTION_FAIL:
						this.HMmessages.show('蓝牙连接失败',{icon:'error'});
						break;
					//10004错误
					case BLUETOOTH_NO_SERVICE:
						this.HMmessages.show('蓝牙没有找到指定服务',{icon:'error'});
						break;
					//10005错误
					case BLUETOOTH_NO_CHARACTERISTIC:
						this.HMmessages.show('蓝牙没有找到指定特征值',{icon:'error'});
						break;
					//10006错误
					case BLUETOOTH_NO_CONNECTION:
						this.HMmessages.show('蓝牙当前连接已断开',{icon:'error'});
						break;
					//10007错误
					case BLUETOOTH_PROPERTY_NOT_SUPPORT:
						this.HMmessages.show('蓝牙当前特征值不支持此操作',{icon:'error'});
						break;
					//10008错误
					case BLUETOOTH_SYSTEM_ERROR:
						this.HMmessages.show('蓝牙其余所有系统上报的异常',{icon:'error'});
						break;
					//10009错误
					case BLUETOOTH_SYSTEM_NOT_SUPPORT:
						this.HMmessages.show('系统版本低于 4.3 不支持 BLE',{icon:'error'});
						break;
					default: 
						console.log("该错误部分筛选未开发" )
						// console.log("该错误部分筛选未开发，错误代码："+JSON.stringify(errCode) )
				}
			},
			
			// ArrayBuffer转16进度字符串示例
			ab2hex(buffer) {
				const hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function (bit) {
					return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('')
			},
			//转ArrayBuffer
			str2ArrayBuffer(s, f) {
				let b = new Blob([s],{type:'text/plain'});
				let r = new FileReader();
				r.readAsArrayBuffer(b);
				r.onload = function(){if(f)f.call(null,r.result)}
			},
			
			/* 打印测试用 */
			printTest() {
				let str = "一二三四五\n\n\n"		//一次上限20字符，一行32字符，后台转gb2312字符
				// str = encodeToGb2312(str);
				console.log("点击了打印按钮")
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
												if(res.confirm){
													console.log("确认进行打印")
													// uni.showToast({
													// 	title:"敬请期待"
													// })
													
													// let string = "打印测试\r\n";  
													// let bytes = plus.android.invoke(string, 'getBytes', 'gbk');
													// console.log("开始进行打印")
													// console.log(bytes)
													// /* 进行打印 */
													// uni.writeBLECharacteristicValue({
													// 	deviceId: that.nowBuletoothIdObj.connectedDeviceId,
													// 	serviceId: that.nowBuletoothIdObj.notifyServiceId,
													// 	characteristicId: that.nowBuletoothIdObj.characteristicId,
													// 	value: bytes,
													// 	success() {
													// 		uni.showToast({
													// 			title:"打印成功"
													// 		})
													// 	}
													// })
													
													console.log("尝试打印0") 
													let str = "print test now\n\n\n"		//一次上限20字符，一行32字符，后台转gb2312字符
													str = encodeToGb2312(str);
													let dataBuffer = new ArrayBuffer(str.length)
													let dataView = new DataView(dataBuffer)
													for (var i = 0; i < str.length; i++) {
														dataView.setUint8(i, str.charAt(i).charCodeAt())
													}
													let dataHex = that.ab2hex(dataBuffer);
													that.writeDatas = that.hexCharCodeToStr(dataHex);
													console.log("尝试打印1")
													console.log(dataBuffer)
													// uni.createBLEConnection({
														// deviceId:"66:12:04:86:1C:22",
														// success() {
															console.log("尝试打印2")
															uni.writeBLECharacteristicValue({
																deviceId: that.nowBuletoothIdObj.connectedDeviceId,
																serviceId: that.nowBuletoothIdObj.notifyServiceId,
																characteristicId: that.nowBuletoothIdObj.characteristicId,
																value: dataBuffer,
																success: function (res) {
																	console.log('发送的数据：' + that.writeDatas)
																	console.log('message发送成功')
																},
																fail: function (res) {
																	console.log("错误2:"+err)
																	console.log(JSON.stringify(err))
																}, 
																complete: function (res) {
																	console.log("尝试打印3")
																}
															})
														// },fail(err) {
															// console.log("错误1:"+err)
														// }
													// })
													
													/* 关闭连接 */
													// that.closeBluetooth();
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
			/* 打印 */
			sendData() {
				console.log("尝试打印0")
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
				console.log("尝试打印1")
				// uni.createBLEConnection({
					// deviceId:"66:12:04:86:1C:22",
					// success() {
						console.log("尝试打印2")
						uni.writeBLECharacteristicValue({
							deviceId: "66:12:04:86:1C:22",
							serviceId: "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2",
							characteristicId: "BEF8D6C9-9C21-4C9E-B632-BD58C1009F9F",
							value: dataBuffer,
							success: function (res) {
								console.log('发送的数据：' + that.writeDatas)
								console.log('message发送成功')
							},
							fail: function (res) {
								console.log("错误2:"+err)
								console.log(JSON.stringify(err))
							},
							complete: function (res) {
								console.log("尝试打印3")
							}
						})
					// },fail(err) {
						// console.log("错误1:"+err)
					// }
				// })
			},
			notifyBLECharacteristicValueChange() { // 启用低功耗蓝牙设备特征值变化时的 notify 功能
				var that = this;
				console.log('6.启用低功耗蓝牙设备特征值变化时的 notify 功能')
				wx.notifyBLECharacteristicValueChange({
					state: true,
					deviceId: that.deviceId,
					serviceId: that.notifyServicweId,
					characteristicId: that.characteristicId,
					complete(res) {
						/*用来监听手机蓝牙设备的数据变化*/
						uni.onBLECharacteristicValueChange(function(res) {
							/**/
							that.balanceData += that.buf2string(res.value)
							that.hexstr += that.receiveData(res.value)
						})
					},
					fail(res) {
						console.log(res, '启用低功耗蓝牙设备监听失败')
						that.measuringTip(res)
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
		}
	}
</script>

<style>
	.bg-white{
		background-color: #FFF;
	}
	.text-llg{
		font-size: 36upx;
	}
	.text-lllg{
		font-size: 48upx;
	}
	.img-lllg{
		width: 48upx;
		height: 48upx;
	}
	.lf-block-head{
		width: 750upx;
		height: 80upx;
		background-color: #F1F1F3;
		line-height: 80upx;
		padding-left: 20upx;
	}
	.lf-block-content{
		width: 750upx;
		height: 100upx;
		background-color: #FFFFFF;
		line-height: 100upx;
		padding-left: 20upx;
		border-bottom: 1upx #F1F1F3;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-block-content image{
		width: 40upx;
		height: 40upx;
		margin-right: 30upx;
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
		padding: 0 30upx 0 0;
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
	.margin-right-40{
		margin-right: 40upx;
	}
</style>
