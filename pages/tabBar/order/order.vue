<template>
	<view @click="closeCover">
		<view class="lf-nav">
			<view class="lf-nav-order">
				<view class="lf-cover" v-if="isCover"></view>
				<view class="lf-nav-mat"></view>
				<!-- 导航栏-正常 -->
				<view class="lf-nav-content padding" v-if="isShowSearch === false">
					<image src="../../../static/order/icon_search_black.png" @click.stop="ShowSearch"></image>
					<view>
						<text v-if="isMerchant" class="text-weight" @click="jumpStoreSelect">
							<text class="text-lg">{{storeName? storeName:'全部门店'}}</text>
							<text class="icon-unfold"></text>
						</text>
						<text v-else class="text-weight">
							<text class="text-lg">{{storeName? storeName:''}}</text>
							<!-- <text class=""></text> -->
						</text>
					</view>
					<view class="relative">
						<!-- <image class="relative" src="../../../static/order/icon_jiahao.png" @click.stop="showMenu"></image>
						<view class="lf-menu-popup" v-if="isShowMenu">
							<view v-for="(menu,key) in addMenuList" @click="menuClick(menu.do)">
								<image :src="menu.img"></image>
								<view :class="{'lf-menu-text-line': key != addMenuList.length -1}">
									<text>{{menu.text}}</text>
								</view>
							</view>
						</view> -->
					</view>
				</view>
				<!-- 导航-搜索框 -->
				<view class="lf-nav-content padding" v-else>
					<view class="lf-search-bg">
						<image src="../../../static/order/icon_search.png"></image>
						<input type="number" v-model="searchOrderId" :focus="isSearchInputFocus"/>
					</view>
					<text @click="closeSearch">取消</text>
				</view>
			</view>
			<!-- 筛选栏 -->
			<view class="lf-screen shadow">
				<view class="lf-cover" v-if="isCover"></view>
				<view class="view" @click.stop="onShowDatePicker('rangetime')">
					<text>时间</text><text class="icon-unfold"></text>
				</view>
				<view class="lf-line1"></view>
				<view class="view" @click.stop="screenStatus">
					<text>{{parseInt(status) === 1? '未支付':parseInt(status) === 2? '支付成功':
						parseInt(status) === 3? '支付失败':parseInt(status) === 4? '已撤销':
						parseInt(status) === 5? '全额退款成功':parseInt(status) === 6? '部分退款成功':
						parseInt(status) === 7? '退款失败':parseInt(status) === 8? '退款中':
						parseInt(status) === 9? '撤销失败' : '状态'}}</text><text class="icon-unfold"></text>
					<view class="lf-popup" v-if="isShowPopupStatus">
						<view class="block" v-for="block in popupStatusList" @click="changeStatus(block.value)">
							<text class="text-sm">{{block.name}}</text>
						</view>
					</view>
				</view>
				<view class="lf-line2"></view>
				<view class="view" @click.stop="screenWay">
					<text style='width: 170upx;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;text-align: center;'>{{parseInt(payWay) === 1? '微信支付':parseInt(payWay) === 2? '支付宝支付':
							parseInt(payWay) === 3? '银行卡支付':parseInt(payWay) === 4? '会员卡支付':
							parseInt(payWay) === 5? '现金支付':parseInt(payWay) === 6? '会员+微信支付':
							parseInt(payWay) === 7? '会员+支付宝支付':'方式'}}</text><text class="icon-unfold"></text>
					<view class="lf-popup" v-if="isShowPopupScreenWay">
						<view class="block" v-for="block in popupScreenWayList" @click="changeScreenWay(block.value)">
							<text class="text-sm" >{{block.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="lf-mat"></view> -->
		
		<!-- 顶部间隔 -->
		<view 
			class="match-width" 
			style="height:390upx"
			v-if="start_payTime && end_payTime">
		</view>
		<view
			class="match-width" 
			style="height:210upx"
			v-else>
		</view>
		
		<!-- 时间段展示 -->
		<view
			class="lf-time-show active box plr-30 ptb-10"
			v-if="start_payTime && end_payTime">
			<view class="match-width pt-20 pb-10">
				{{start_payTime | timeFilter}} ~ {{end_payTime | timeFilter}}
			</view>
			<view class="small match-width pb-20">
				<view class="match-width align-left">
					<view class="match-left-space">订单总数：{{totalSummary['orderCount'] || 0}}笔</view>
					<view class="match-left-space align-left">
						<view
							class="iconfont icon-wenhao mr-10"
							@click="onQuestionClick"/>
						订单金额：{{yenSymbol}} {{totalSummary['allPrice'] | dealWithMoney}}
					</view>
					<!-- <image src='/static/assets/images/q.png' style="width: 30upx;height: 30upx;"/> -->
				</view>
				<view class="match-width align-left">
					<view class="match-left-space">商户实收：{{yenSymbol}} {{totalSummary['actPrice'] | dealWithMoney}}</view>
					<view class="match-left-space align-left">
						<view class="mr-36"></view>
						商户实退：{{yenSymbol}} {{totalSummary['refundPrice'] | dealWithMoney}}
					</view>
				</view>
			</view>
		</view>
		
		<!-- 订单详情 -->
		<mescroll-uni @down="downCallback" :up="mescrollUp" @up="upCallback" @init="mescrollInit">
			<view 
				class="match-width" 
				v-for="(timeList, index) in orderList" 
				:key="index">
				<view class="lf-time-show box plr-30">
					<view class="match-width pt-20 pb-10">
						{{index}}
					</view>
					<view class="small match-width pb-20">
						<view class="match-width align-left">
							<view class="match-left-space">订单总数：{{timeList['orderCount'] || 0}}笔</view>
							<view class="match-left-space align-left">
								<view 
									class="iconfont icon-wenhao mr-10"
									@click="onQuestionClick"/>
								订单金额：{{yenSymbol}} {{timeList['allPrice'] | dealWithMoney}}
							</view>
						</view>
						<view class="match-width align-left">
							<view class="match-left-space">商户实收：{{yenSymbol}} {{timeList['actPrice'] | dealWithMoney}}</view>
							<view class="match-left-space align-left">
								<view class="mr-36"></view>
								商户实退：{{yenSymbol}} {{timeList['refundPrice'] | dealWithMoney}}
							</view>
						</view>
					</view>
				</view>
				<view v-for="order in timeList.orders" :key="order.id" class="lf-orderList match-width align-left ptb-10" @click="jumpOrderDetails(order.orderNumber)">
					<!-- <image :src="order.payWay === 1? '../../../static/order/icon_wechat_list.png': 
						order.payWay === 2?'../../../static/order/icon_zhifubao_list.png':
						order.payWay === 3? '../../../static/order/icon_unionpay_list.png':order.payChannel === 17? '../../../static/order/icon_pos_list.png':order.payChannel === 18? '../../../static/order/icon_quick_pay_list.png':'../../../static/order/icon_receive_money.png'"/>		 -->				
					<image :src="order | payWayImgFilters"/>		
					<view class="match-left-space align-ver-left"> 			
						<view class="match-width align-hor-bet">
							<view>{{yenSymbol}} {{(order.actPayPrice)}}</view>
							<view class="ly-font-weight-500 ly-font-size-28">{{
								order.status === 1? "未支付" : order.status === 2? "支付成功" : order.status === 3? "支付失败" :
								order.status === 4? "已撤销" : order.status === 5? "全额退款成功" : order.status === 6? "部分退款成功" : 
								order.status === 7? "退款失败" : order.status === 8? "退款中" : order.status === 9? "撤销失败" : "未知状态码"
							}}</view>
						</view>
						<view class="ly-font-color-9 ly-font-size-24 match-width mt-10">
							<text>{{
								order.payTime[11]+order.payTime[12]+order.payTime[13]+order.payTime[14]+order.payTime[15]+order.payTime[16]+order.payTime[17]+order.payTime[18]
							}}</text>
							<!-- <text class=""><text class="text-sm">订单号：</text>{{order.orderNumber}}</text> -->
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<!-- 日期picker插件 -->
		<mx-date-picker :show="showPicker" :type="type" :value="showPickerdata" :show-tips="true" :begin-text="'开始'" :end-text="'结束'" :show-seconds="true" color="#4BA8FF" @confirm="onSelected" @cancel="onSelected" />
	</view>
</template>

<script>
	import { getOrderList, queryOrderSummary } from '@/api/vueAPI.js'
	import MescrollUni from "mescroll-uni/mescroll-uni.vue";
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import { showToast } from '../../../common/wxapi.js'
	export default {
		components: {
			MescrollUni, MxDatePicker
		},
		// {
		// 	img: '../../../static/order/icon_saoma.png',
		// 	text: '查询订单',
		// 	do: 'scanCode',
		// },
		data() {
			return {
				mescroll: null,
				mescrollUp: {
					empty: {
						icon: "../../../static/order/no-data.png", //图标,默认null,支持网络图
						tip: "暂无相关数据~" //提示
					}
				},
				isMescroll: false,	//onShow刷新指示
				yenSymbol: '\u00A5',	//金钱符号
				isSearchInputFocus: false,
				isShowSearch: false,
				isShowMenu: false,
				searchOrderId: '',
				codeResult: '',
				addMenuList: [
					{
						img: '../../../static/order/icon_print_bg.png',
						text: '打印流水',
						do: 'print',
					},
				],
				orderList: {},		//订单列表
				pageNumber: 1,		//查询页码
				pageSize: 10,		//每页显示数量
				start_payTime: '',	//开始时间
				end_payTime: '',	//结束时间
				payWay: '',			//支付方式
				status: '',			//订单状态
				bindedEquipment: '',	//已绑定打印机
				nowBuletoothIdObj: '',	//当前已绑定打印机参数
				orderNumber:'',
				storeId: '',
				storeName: '',
				isScreenTime: '',	//筛选-日期
				/* 日期picker~ */
				showPicker: false,
                date: '2019/01/01',
                time: '15:00:12',
                datetime: '2019/01/01 15:00:12',
                range: ['2019/01/01','2019/01/06'],
                rangetime: ['2019/01/08 14:00','2019/01/16 13:59'],
                type: 'rangetime',
                showPickerdata: '',
				/* ~日期picker */
				isCover: false,
				isShowPopupStatus: false,
				popupStatusList: [
					{
						name:'全部',
						value:''
					},
					{
						name:'未支付',
						value:1
					},
					{
						name:'支付成功',
						value:2
					},
					{
						name:'支付失败',
						value:3
					},
					{
						name:'已撤销',
						value:4
					},
					{
						name:'全额退款成功',
						value:5
					},
					{
						name:'部分退款成功',
						value:6
					},
					{
						name:'退款失败',
						value:7
					},
					{
						name:' 退款中',
						value:8
					},
					{
						name:' 撤销失败',
						value:9
					}
				],
				isShowPopupScreenWay: false,
				popupScreenWayList: [
					{
						name:'全部',
						value:''
					},
					{
						name:'微信支付',
						value:1
					},
					{
						name:'支付宝支付',
						value:2
					},
					{
						name:'银行卡支付',
						value:3
					},
					{
						name:'现金支付',
						value:5
					},
					{
						name:'会员+微信支付',
						value:6
					},
					{
						name:'会员+支付宝支付',
						value:7
					},
					{
						name:'手机pos和快捷支付',
						value:8
					},
					{
						name:'云闪付支付',
						value:9
					},
					{
						name:'协议支付',
						value:10
					},
					{
						name:'数字货币',
						value:11
					},
					{
						name:'翼支付',
						value:12
					},
					{
						name:'苏宁',
						value:13
					}/* ,
					{
						name:'刷脸支付',
						value:10
					} */
				],
				isMerchant:true,
				totalSummary: {}
			};
		},
		filters:{
			dateFilters(val) {
				let thatday = val.replace("-","/");
				let date = new Date();
				let y = date.getFullYear();
				let m = date.getMonth()+1;
				let d = date.getDate();
				let today = new Date(y+'/'+m+'/'+d);
				let valday = new Date(thatday)
				switch( parseInt(today - valday)/1000/60/60/24 ){
					case 0:
						return '今天';
						break;
					case 1:
						return '昨天';
						break;
					default:
						return thatday;
				}
			},
			statusFilters(val) {
				switch(parseInt(val)){
					case 1:
						return '未支付';
						break;
					case 2:
						return '支付成功';
						break;
					case 3:
						return '支付失败（已关闭）';
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
			payTimeFilters(val) {
				return val.split(' ')[1];
			},
			payWayImgFilters(order) {
				
				if(parseInt(order.payWay)===1){
					return '../../../static/order/icon_wechat_list.png';
				}else if(parseInt(order.payWay)===2){
					return '../../../static/order/icon_zhifubao_list.png';
				}else if(parseInt(order.payWay)===3){
					return '../../../static/order/icon_unionpay_list.png';
				}else if(parseInt(order.payWay)===9){
					return '../../../static/order/icon_yunshanfu_list.png';
				}else if(parseInt(order.payWay)===10){
					return '../../../static/order/icon_shualianfu_list.png';
				}else if(parseInt(order.payWay)===11){
					return '../../../static/order/icon_shuzihuobi_list.png';
				}else if(parseInt(order.payWay)===12){
					return '../../../static/order/icon_wing_pay_list.png';
				}else if(parseInt(order.payWay)===13){
					return '../../../static/order/icon_suning_list.png';
				}else if(parseInt(order.payChannel)===17){
					return '../../../static/order/icon_pos_list.png';
				}else if(parseInt(order.payChannel)===18){
					return '../../../static/order/icon_quick_pay_list.png';
				}else if(parseInt(order.payWay)===99){
					return '../../../static/order/icon_receive_money.png';
				}else{
					console.log("异常支付码："+val)
				}
				/* switch(parseInt(val)){
					case 1:		//微信支付
						return '../../../static/order/icon_wechat_list.png';
						break;
					case 2:		//支付宝支付
						return '../../../static/order/icon_zhifubao_list.png';
						break;
					case 3:		//银行卡支付
						return '../../../static/order/icon_unionpay_list.png';
						break;
					case 99:	//未知支付
						return '../../../static/order/icon_receive_money.png';
						break;
					default:
						console.log("异常支付码："+val)
				} */
			},
			// 金币保留两位小数
			dealWithMoney(money) {
				// console.log('过滤前', money)
				if (/^[0-9]+\.[0-9]$/.test(money)) {
					money = money + '0'
				} else if (/^[0-9]+$/.test(money)) {
					money = money + '.00'
				} else if (!money) {
					money = '0.00'
				}
				// console.log('过滤后', money)
				return money
			},
			// 时间过滤
			timeFilter(val) {
				let tmp = val.split(' ')
				if (tmp.length) {
					return tmp[0]
				}
				return val
			}
		},
		watch:{
			orderList: {
				handler(val, oldval){
					
				},
				deep:true
			},
			searchOrderId(val,oldVal){
				this.orderNumber = val
				this.orderList = {}// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			}
		},
		
		onLoad() {
			
		},
		
		onShow() {
			// console.log("onShow!")
			/* 刷新 */
			if(this.isMescroll){
				this.closeCover()
				this.start_payTime = '';
				this.end_payTime = '';
				this.status = '';
				this.payWay = '';
				if(this.showPicker === true){
					this.showPicker = false;
				}
				this.orderList = {}// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			}else{
				this.isMescroll = true
			}
			// 获取商店名称
			if(uni.getStorageSync('userType') == 1){
				this.isMerchant = true
			} else{
				this.isMerchant = false	
			}
			let storeDetail = uni.getStorageSync("nowStoreDetail")
			if(storeDetail != '' && storeDetail != null && storeDetail != undefined && storeDetail){
				this.storeName = storeDetail.storeName
			}
		},
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			this.mescroll && this.mescroll.onPageScroll(e);
		},
		methods:{
			/* 跳转选择门店页面 */
			jumpStoreSelect() {
				uni.navigateTo({
					url: '/pages/home/storeSelect/index/index'
				})
			},
			/* 显示导航栏-搜索框 */
			ShowSearch() {
				this.isShowSearch = true;
				this.isSearchInputFocus = true;
			},
			/* 隐藏导航栏-搜索框 */
			closeSearch() {
				this.isShowSearch = false;
				this.isSearchInputFocus = false;
				this.searchOrderId = '';
			},
			/* 显示右上菜单 */
			showMenu() {
				this.isShowMenu = true;
				this.isCover = true
			},
			/* 关闭相关菜单 */
			closeCover() {
				// console.log("关闭相关菜单")
				if(this.isShowMenu === true){
					this.isShowMenu = false;
				}
				if(this.isShowPopupStatus === true){
					this.isShowPopupStatus = false;
				}
				if(this.isShowPopupScreenWay === true){
					this.isShowPopupScreenWay = false;
				}
				if(this.isCover === true){
					this.isCover = false;
				}
			},
			/* 右上菜单 */
			menuClick(menuDo) {
				switch(menuDo) {
					case 'scanCode':
						this.scanCode();
						break;
					case 'print':
						this.print();
						break;
				}
			},
			/* 右上菜单-查询订单 */
			scanCode() {
				uni.scanCode({
					success(res) {
						this.codeResult = res.result
						// console.log("扫码内容："+res.result)
						// console.log("扫码类型："+res.scanType)
						// console.log('扫码成功，进行订单查询。。。');
					}
				})
			},
			/* 右上菜单-打印流水 */
			print() {
				// console.log("点击了打印按钮")
				let that = this;
				/* 查询是否有已绑定设备 */
				let bindedEquipmentOne = uni.getStorageSync('bindedEquipment')
				if(bindedEquipmentOne && bindedEquipmentOne !== {}){
					this.bindedEquipment = bindedEquipmentOne;
					// console.log("获取了已绑定设备："+this.bindedEquipment);
					// console.log(JSON.stringify(this.bindedEquipment));
					/* 存在已绑定设备，获取其信息 */
					this.nowBuletoothIdObj = uni.getStorageSync("nowBuletoothIdObj");
					// console.log(this.nowBuletoothIdObj)
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
										// console.log("连接成功")
										/* 询问是否打印 */
										uni.showModal({
											content: '是否进行打印',
											success(res) {
												uni.showToast({
													title:"敬请期待"
												})
												if(res.confirm){
													// console.log("确认进行打印")
													/* 进行打印 */
													// uni.writeBLECharacteristicValue({
													// 	deviceId: that.nowBuletoothIdObj.connectedDeviceId,
													// 	serviceId: that.nowBuletoothIdObj.notifyServiceId,
													// 	characteristicId: that.nowBuletoothIdObj.characteristicId,
													// 	value: "",
													// 	success() {
													// 		
													// 	}
													// })
													/* 关闭连接 */
													that.closeBluetooth();
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
			/* 关闭蓝牙连接 */
			closeBluetooth() {
				let that = this;
				uni.closeBLEConnection({
					deviceId:that.nowBuletoothIdObj.connectedDeviceId,
					success() {
						uni.closeBluetoothAdapter()
					}
				})
			},
			/* 跳转订单详情（附订单号） */
			jumpOrderDetails (orderNumber) {
				uni.navigateTo({
					url: '/pages/order/orderDetails/orderDetails?orderNumber='+ orderNumber
				})
			},
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调*/
			downCallback(mescroll){
				mescroll.resetUpScroll() // 重置列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				// console.log("测试点-1")
				this.getOrderLists( mescroll.num, mescroll.size, (res) => {
					console.log("测试点1");
					console.log(res);
					let nowList = res.content;
					// console.log(nowList);
					// this.orderList = [];
					let number = 0;		//本次数据数
					// console.log("测试点2");
					//设置列表数据
					if(mescroll.num == 1) {
						this.orderList = nowList; //如果是第一页需手动制空列表
					}else{
						let key_index = 0;	//key指示位-是否完成相同天键值匹配
								//想法优化，有漏洞：只判断新数据的第一条键值天（漏洞：可能会因自动排序问题，使最近一天变为最远一天。需测试）
						for (let key in nowList) {
							// console.log(key,this.orderList[key].orders,this.orderList)
							// console.log(nowList[key])
							//判断新数据的第一条键值天
							if(key_index === 0){
								// console.log("测试点2.1：进入新数据第一条键值判断",key,this.orderList)
								let orderListKey_index = 1;		//指示位：1-第一条键值无匹配 | 0-已匹配
								for (let orderListKey in this.orderList) {
									// console.log(key,orderListKey)
									if(key === orderListKey){
										let tmpArr = nowList[key].orders
										// 请求的数据可能发生变动
										// nowList[key].orders = nowList[key].orders.filter((item) => {
										// 	return (this.orderList[orderListKey].orders.filter((value) => {
										// 		return value['id'] === item['id']
										// 	}).length > 0)
										// })
										this.orderList[orderListKey].orders = this.orderList[orderListKey].orders.concat(nowList[key].orders);
										nowList[key].orders = tmpArr
										orderListKey_index = 0;
									}
								}
								//无匹配时，直接插入后面
								if(orderListKey_index){
									this.orderList[key] = nowList[key];
								}
								key_index = 1;	//已处理完第一条键值
							}else{//添加其他天的数据
								this.orderList[key] = nowList[key];
							}
							// console.log("测试点2.2：添加完毕数据的列表",this.orderList)
						}
					}
					
					// let this.orderList
					
					// console.log(6666666, this.orderList)
					for (let i in this.orderList) {
						this.orderList[i].orders = this.orderList[i].orders.map((item) => {
							if (/^[0-9]+\.[0-9]$/.test(item.actPayPrice)) {
								item.actPayPrice = item.actPayPrice + '0'
							} else if (/^[0-9]+$/.test(item.actPayPrice)) {
								item.actPayPrice = item.actPayPrice + '.00'
							}
							return item
						})
					}
					for(let i in nowList){
						number += nowList[i].orders.length;
					}
					// 增加每个时间点实时统计
					for (let time in this.orderList) {
						this.getCountInfo(time)
					}
					if (this.start_payTime && this.end_payTime) {
						this.getCountInfo(this.start_payTime, this.end_payTime)
					}
					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					mescroll.endBySize(number, res.totalElements); //必传参数(当前页的数据个数, 总数据量)
				}, (err) => {
					// console.log('error！！');
					console.log("错误测试点",err)
					// console.log(err);
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			/* 获取订单列表 */
			getOrderLists(pageNumber, pageSize, successCallback, errorCallback) {
				// console.log("测试点0", uni.getStorageSync('token'))
				let storeId = '';
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				getOrderList( pageNumber, pageSize, this.start_payTime, this.end_payTime, this.payWay, this.status, storeId, this.orderNumber).then((res) => {
					// console.log(res);
					// console.log(res.obj);
					// this.orderList = res.obj;
					// console.log("测试点0.5")
					//联网成功的回调
					successCallback && successCallback(res.obj);
				}).catch(err => {
					console.log('error！！');
					console.log(err);
					//联网失败的回调
					errorCallback && errorCallback(err);
				})
			},
			/* 筛选-日期 */
			screenTime() {
				// console.log("点击到筛选-日期")
			},
			/* 筛选-状态 */
			screenStatus() {
				// console.log("点击到筛选-状态")
				if(this.isShowPopupStatus === true){
					this.isShowPopupStatus = false
					this.isCover = false
				}else{
					this.isShowPopupStatus = true
					this.isCover = true
				}
			},
			/* 筛选-方式 */
			screenWay() {
				// console.log("点击到筛选-方式")
				if(this.isShowPopupScreenWay === true){
					this.isShowPopupScreenWay = false
					this.isCover = false
				}else{
					this.isShowPopupScreenWay = true
					this.isCover = true
				}
			},
			/* 日期picker~ */
			onShowDatePicker(type){//显示
                this.type = type;
                this.showPicker = true;
                this.value = this[type];
				// this.isCover = true
            },
            onSelected(e) {//选择
                this.showPicker = false;
                if(e) {
                    this[this.type] = e.value; 
                    //选择的值
                    // console.log('value => '+ e.value);
                    //原始的Date对象
                    // console.log('date => ' + e.date);
					let start_payTime = e.value[0].replace(/\//g,'-');
					let end_payTime = e.value[1].replace(/\//g,'-');
					let tmpResult = this.calcularTwoTmestamp(start_payTime, end_payTime)
					if (tmpResult === null) {
						return
					} else if (tmpResult > 60 * 24 * 60 * 60 * 1000) {
						showToast('开始时间和结束时间时间间隔不能超过60天')
						return
					}
					this.start_payTime = start_payTime
					this.end_payTime = end_payTime
					//刷新页面
					this.orderList = {}// 在这里手动置空列表,可显示加载中的请求进度
					this.mescroll.resetUpScroll()// 刷新列表数据
                }
				this.isCover = false
            },
			/* ~日期picker */
			/* 筛选-更改状态 */
			changeStatus(value){
				this.status = value;
				//刷新页面
				this.orderList = {}// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			},
			/* 筛选-更改方式 */
			changeScreenWay(value){
				this.payWay = value;
				//刷新页面
				this.orderList = {}// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			},
			// 计算两个时间戳的值
			calcularTwoTmestamp(beginTime, endTime) {
				if (!beginTime || !endTime) {
					return null
				}
				let tmpBeginTime = beginTime
				let tmpEndTime = endTime
				// tmpBeginTime = tmpBeginTime.split(' ')
				// tmpEndTime = tmpEndTime.split(' ')
				// tmpBeginTime = tmpBeginTime[0]
				// tmpEndTime = tmpEndTime[0]
				tmpBeginTime = new Date(tmpBeginTime).getTime()
				tmpEndTime = new Date(tmpEndTime).getTime()
				return Math.abs(tmpEndTime - tmpBeginTime)
			},
			// 获取每个时间点的统计信息
			getCountInfo(time, timeEnd = '') {
				if (timeEnd) {
					this.queryOrderSummarySingle(time, timeEnd).then((res) => {
						if (res && res.code === 200) {
							this.totalSummary = res.obj || {}
						}
					})
				} else {
					if (!this.orderList[time]['isRequestLocked']) {
						this.orderList[time]['isRequestLocked'] = true
						let ttt = time + ' 00:00:00'
						this.queryOrderSummarySingle(ttt).then(res => {
							if (res && res.code === 200) {
								let { actPrice, refundPrice, allPrice, orderCount } = res.obj
								this.orderList[time].actPrice = actPrice || ''
								this.orderList[time].refundPrice = refundPrice || ''
								this.orderList[time].allPrice = allPrice || ''
								this.orderList[time].orderCount = orderCount || ''
							}
						})
					}
				}
			},
			// 查询订单
			queryOrderSummarySingle(time, timeEnd = '') {
				let storeId = '';
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				return queryOrderSummary(time, storeId, this.status, this.payWay, timeEnd)
			},
			// 问号点击
			onQuestionClick() {
				uni.showToast({
					title: '订单金额不包括优惠金额',
					icon: 'none'
				})
			}
		}
	}
</script>

<style lang="scss">
	.relative{
		position: relative;
	}
	.margin-left-right-20{
		margin: 0 20upx;
	}
	.text-llg{
		font-size: 32upx;
	}
	.text-llg text{
		padding-right: 2upx;
		font-size: 20upx;
	}
	.text-weight{
		font-weight: 600;
	}
	.lf-nav{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		background-color: #FFF;
	}
	.lf-nav-order{
		width: 750upx;
		height: 130upx;
		background-color: #FFF;
	}
	.lf-nav-mat{
		width: 750upx;
		height: 50upx;
		background-color: #FFF;
	}
	.lf-nav-content{
		width: 750upx;
		height: 80upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-nav-content image{
		width: 40upx;
		height: 40upx;
	}
	.lf-search-bg{
		width: 85%;
		height: 40upx;
		background-color: #F1F1F3;
		border-radius: 20upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.lf-search-bg > image{
		width: 30upx;
		height: 30upx;
		margin: 0 10upx;
	}
	.lf-search-bg > input{
		width: 95%;
	}
	.lf-screen{
		width: 750upx;
		height: 88upx;
		border: 1upx solid #F1F1F3;
		border-size: 1upx 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: relative;
	}
	.lf-screen .view{
		width: 30%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.lf-line1{
		width: 1upx;
		height: 40upx;
		background-color: #EBEEF5;
		position: absolute;
		top: calc(50% - 20upx);
		left: 33.3%;
	}
	.lf-line2{
		width: 1upx;
		height: 40upx;
		background-color: #EBEEF5;
		position: absolute;
		top: calc(50% - 20upx);
		left: 66.6%;
	}
	.lf-menu-popup{
		min-width: 170upx;
		position: absolute;
		top: 80upx;
		right: -50%;
		z-index: 1010;
		border: 1upx solid #F1F1F1;
		background-color: #FFF;
	}
	.lf-menu-popup > view{
		min-width: 170upx;
		height: 70upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.lf-menu-popup image{
		width: 40upx;
		height: 40upx;
		margin: 0 20upx;
	}
	.lf-menu-popup > view > view{
		width: 170upx;
		height: 70upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.lf-menu-text-line{
		border-bottom: 1upx solid #F1F1F1;
	}
	.lf-mat{
		height: 218upx;
	}
	.lf-time-show {
		width: 100%;
		padding: 0 22upx;
		font-size: 32upx;
		color: #666;
		background-color: #F8F9FD;
		// background-color: rgba(100, 100, 100, 0.1);
		
		.small {
			font-size: 28upx;
		}
		
		&.active {
			background-color: #FFF;
			position: fixed;
			top: 210upx;
			left: 0;
			right: 0;
			z-index: 1;
			border-bottom: 1upx solid #F0F0F0;
			border-top: 1upx solid #F0F0F0;
			color: #333;
		}
	}
	.lf-orderList{
		width: 100%;
		height: 120upx;
		padding: 0 30upx;
		/* display: flex;
		justify-content: space-between;
		align-items: center; */
		border-bottom: 1upx solid #EFEFEF;
		
		image{
			width: 84upx;
			height: 84upx;
			margin: 0 20upx;
			margin-left: 0;
		}
	}
	.lf-orderList-right{
		/* width: 690upx;
		height: 120upx;
		display: flex;
		justify-content: space-between;
		align-items: center; */
	}
	.lf-orderList-right image{
		width: 84upx;
		height: 84upx;
		margin: 0 20upx;
		margin-left: 0;
	}
	.lf-right-text{
		/* width: 570upx; */
		/* height: 80upx; */
		/* display: flex;
		flex-direction: column;
		justify-content: space-between; */
	}
	.lf-right-text > view {
		font-size: 24upx;
	}
	/* 日期picker~ */
	.test{
        text-align: center;
        padding: 10px 0;
    }
    button{
        margin: 20upx;
        font-size: 28upx;
    }
	/* ~日期picker */
	.lf-popup{
		background: #FFF;
		position: absolute;
		top: 80upx;
		left: 0;
		z-index: 1010;
	}
	.lf-popup .block{
		width: 220upx;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1upx solid #F1F1F3;
	}
	.lf-cover{
		width: 750upx;
		height: 100vh;
		background: rgba(0,0,0,0.2);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 500;
	}
</style>
