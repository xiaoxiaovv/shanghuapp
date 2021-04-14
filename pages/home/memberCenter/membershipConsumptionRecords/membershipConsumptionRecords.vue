<template>
	<view @click="closeCover">
		<view class="lf-nav">
			<view class="lf-nav-order">
				<view class="lf-cover" v-if="isCover"></view>
				<view class="lf-nav-mat"></view>
				<!-- 导航栏-正常 -->
				<view class="lf-nav-content padding" v-if="isShowSearch === false">
					<view class="flex justify-start align-center">
						<image src="../../../../static/home/the_arrow_icon_black1.png" @click.stop="goBack"></image>
						<view class="lf-img-mat"></view>
					</view>
				<!-- 	<view>
						<text class="text-weight" @click="jumpStoreSelect">
							<text class="text-lg">{{storeName? storeName:'全部门店'}}</text>
							<text class="icon-unfold"></text>
						</text>
					</view> -->
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
					<view class="flex justify-between align-center">
						<image class="lf-img-search margin-right-40" src="../../../../static/home/icon_search.png" @click.stop="ShowSearch"></image>
						<!-- <view class="relative">
							<image class="relative" src="../../../../static/order/icon_jiahao.png" @click.stop="showMenu"></image>
							<view class="lf-menu-popup" v-if="isShowMenu">
								<view v-for="(menu,key) in addMenuList" @click="menuClick(menu.do)">
									<image :src="menu.img"></image>
									<view :class="{'lf-menu-text-line': key != addMenuList.length -1}">
										<text>{{menu.text}}</text>
									</view>
								</view>
							</view>
						</view> -->
					</view>
				</view>
				<!-- 导航-搜索框 -->
				<view class="lf-nav-content padding" v-else>
					<view class="lf-search-bg">
						<image src="../../../../static/order/icon_search.png"></image>
						<input type="number" v-model="searchOrderId" :focus="isSearchInputFocus" placeholder="请输入订单号"/>
					</view>
					<text @click="closeSearch">取消</text>
				</view>
			</view>
			<!-- 筛选栏 -->
			<view class="lf-screen shadow">
				<view class="lf-cover" v-if="isCover"></view>
				<view class="view" @click.stop="onShowDatePicker('range')">
					<text>时间</text><text class="icon-unfold"></text>
				</view>
				<view class="lf-line1"></view>
				<view class="view" @click.stop="screenStatus">
					<text>状态</text><text class="icon-unfold"></text>
					<view class="lf-popup" v-if="isShowPopupStatus">
						<view class="block" v-for="block in popupStatusList" @click="changeStatus(block.value)">
							<text class="text-sm">{{block.name}}</text>
						</view>
					</view>
				</view>
				<view class="lf-line2"></view>
				<view class="view" @click.stop="screenWay">
					<text>方式</text><text class="icon-unfold"></text>
					<view class="lf-popup" v-if="isShowPopupScreenWay">
						<view class="block" v-for="block in popupScreenWayList" @click="changeScreenWay(block.value)">
							<text class="text-sm">{{block.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="lf-mat"></view>
		<!-- 订单详情 -->
		<mescroll-uni @down="downCallback" @up="upCallback" :up="mescrollUp" @init="mescrollInit">
			<view v-for="record in recordsList" :key="record.id">
				<view class="lf-orderList" @click="jumpRecordDetails(record.id)">
					<view class="lf-orderList-right">
						<image :src="record.payWay === 1? '../../../../static/order/icon_wechat_list.png': 
							record.payWay === 2?'../../../../static/order/icon_zhifubao_list.png': 
							record.payWay === 3? '../../../../static/order/icon_member_card.png':
							record.payWay === 4? '../../../../static/order/icon_member_analysis.png':
							record.payWay === 5? '../../../../static/order/icon_unionpay_list.png':
							'../../../../static/order/icon_receive_money.png'"></image>
						<view class="lf-right-text">
							<view>
								<text class="text-llg text-weight">{{yenSymbol}}{{record.tradingMoney | dealWithMoney}}</text>
								<text class="text-grey">{{record.payStatus === 1? '未支付':'支付成功'}}</text>
							</view>
							<view>
								<text class="text-sm text-grey">订单号：{{record.orderNumber}}</text>
								<text class="text-grey">{{record.createTime.split(' ')[1]}}</text>
							</view>
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
	import {getMemberRecord, getRecordDetail } from '@/api/vueAPI.js'
	import MescrollUni from "mescroll-uni/mescroll-uni.vue";
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	export default {
		components: {
			MescrollUni, MxDatePicker
		},
		data() {
			return {
				mescrollUp: {
					empty: {
						icon: "../../../../static/order/no-data.png", //图标,默认null,支持网络图
						tip: "暂无相关数据~" //提示
					}
				},
				/* 消费记录~ */
				storeId: '',
				storeName: '',
				pageNumber: 1,		//查询页码
				pageSize: 10,		//每页显示数量
				payStatus: '',
				payWay: '',			//支付方式
				startTime: '1970-01-01',	//开始时间
				endTime: '2019-06-14',		//结束时间
				recordsList: [],
				/* ~消费记录 */
				mescroll: null,
				isMescroll: false,	//onShow刷新指示
				yenSymbol: '\u00A5',	//金钱符号
				isSearchInputFocus: false,
				isShowSearch: false,
				isShowMenu: false,
				searchOrderId: '',
				codeResult: '',
				addMenuList: [
					{
						img: '../../../../static/order/icon_saoma.png',
						text: '查询订单',
						do: 'scanCode',
					},{
						img: '../../../../static/order/icon_print_bg.png',
						text: '打印流水',
						do: 'print',
					},
				],
				bindedEquipment: '',	//已绑定打印机
				nowBuletoothIdObj: '',	//当前已绑定打印机参数
				orderNumber:'',
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
						name:'会员储值卡',
						value:3
					},
					{
						name:'H5',
						value:4
					},
					{
						name:'导入',
						value:5
					},
				],
				isMerchant: true
			}
		},
		filters:{
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
			},
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
			orderStatusFilters(val) {
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
					default:
						console.log("异常状态值："+val);
				}
			},
			payTimeFilters(val) {
				return val.split(' ')[1];
			},
			payWayFilters(val) {
				switch(parseInt(val)){
					case 1:		//微信支付
						return '../../../../static/order/icon_wechat_list.png';
						break;
					case 2:		//支付宝支付
						return '../../../../static/order/icon_zhifubao_list.png';
						break;
					case 3:		//银行卡支付
						return '../../../../static/order/icon_unionpay_list.png';
						break;
					case 99:	//未知支付
						return '../../../../static/order/icon_receive_money.png';
						break;
					default:
						console.log("异常支付码："+val)
				}
			},
		},
		watch:{
			recordsList: {
				handler(val, oldval){
					
				},
				deep:true
			},
			searchOrderId(val,oldVal){
				this.orderNumber = this.searchOrderId
				this.recordsList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			}
		},
		onLoad() {
			let date = new Date();
			let y = date.getFullYear();
			let MM = date.getMonth() + 1;
			MM = MM < 10 ? ('0' + MM) : MM;
			let d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			let today =  y + '-' + MM + '-' + d;
			this.endTime = today;
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
				this.recordsList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			}else{
				this.isMescroll = true
			}
			/* 门店选择 */
			// let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
			// console.log(44,nowStoreDetail)
			// if(nowStoreDetail.status === true){
			// 	nowStoreDetail.status = false;
			// 	uni.setStorageSync('nowStoreDetail', nowStoreDetail)
			// }else{
				// this.storeId = nowStoreDetail.storeId;
				// this.storeName = nowStoreDetail.storeName;
				// console.log(55,this.storeId)
				// TODO 第一次加载，加载全部数据
				// this.storeId = ''
			// }
			
			// 获取商店名称
			if(uni.getStorageSync('userType') == 1){
				this.isMerchant = true
			} else{
				this.isMerchant = false	
			}
			let storeDetail = uni.getStorageSync("nowStoreDetail")
			if(storeDetail != '' && storeDetail != null && storeDetail != undefined && storeDetail){
				this.storeName = storeDetail.storeName
				this.storeId = storeDetail.storeId
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
			/* 返回上一页面 */
			goBack() {
				uni.navigateBack()
			},
			/* 跳转选择门店页面 */
			jumpStoreSelect() {
				uni.navigateTo({
					url: '/packageA/pages/home/storeSelect/index/index'
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
			jumpRecordDetails (id) {
				uni.navigateTo({
					url: '../recordDetail/recordDetail?id='+ id
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
				this.getMemberRecords( mescroll.num, mescroll.size, (res) => {
					let nowList = res.content;
					// console.log("mescroll.num=" + mescroll.num + ", mescroll.size=" + mescroll.size + ", length=" + nowList.length);
					// mescroll.endSuccess(number);
			
					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					mescroll.endBySize(nowList.length, res.totalElements); //必传参数(当前页的数据个数, 总数据量)
					//设置列表数据
					if(mescroll.num == 1) this.recordsList = []; //如果是第一页需手动制空列表
					this.recordsList=this.recordsList.concat(nowList); //追加新数据
				}, (err) => {
					// console.log('error！！');
					// console.log("错误测试点",err)
					console.log(err);
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			/* 获取列表 */
			getMemberRecords(pageNumber, pageSize, successCallback, errorCallback) {
				// console.log("测试点0")
				let storeId = '';
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				getMemberRecord( pageNumber, pageSize, storeId, this.payStatus, this.payWay, this.startTime, this.endTime, this.orderNumber).then((res) => {
					// console.log(res);
					// console.log(res.obj);
					// this.storeList = res.obj;
					// console.log("测试点0.5")
					//联网成功的回调
					successCallback && successCallback(res.obj);
				}).catch(err => {
					//联网失败的回调
					errorCallback && errorCallback(err);
					// console.log('error！！');
					// console.log(err);
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
					this.startTime = e.value[0].replace(/\//g,'-');
					this.endTime = e.value[1].replace(/\//g,'-');
					//刷新页面
					this.recordsList = []// 在这里手动置空列表,可显示加载中的请求进度
					this.mescroll.resetUpScroll()// 刷新列表数据
			    }
				this.isCover = false
			},
			/* ~日期picker */
			/* 筛选-更改状态 */
			changeStatus(value){
				this.payStatus = value;
				//刷新页面
				this.recordsList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			},
			/* 筛选-更改方式 */
			changeScreenWay(value){
				this.payWay = value;
				//刷新页面
				this.recordsList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			}
		}
	}
</script>

<style>
	.relative{
		position: relative;
	}
	.margin-left-right-20{
		margin: 0 20upx;
	}
	.text-llg{
		font-size: 36upx;
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
		height: 120upx;
		background-color: #FFF;
	}
	.lf-nav-mat{
		width: 750upx;
		height: 40upx;
		background-color: #EFEFEF;
	}
	.lf-nav-content{
		width: 750upx;
		height: 80upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-img-mat{
		width: 80upx;
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
		height: 80upx;
		border: 1upx solid #F1F1F3;
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
		height: 200upx;
	}
	.lf-time-show{
		width: 750upx;
		height: 80upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20upx;
		background-color: #EEEEEE;
	}
	.lf-orderList{
		widows: 750upx;
		height: 120upx;
		padding: 0 20upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1upx solid #EFEFEF;
	}
	.lf-orderList-right{
		width: 700upx;
		height: 120upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-orderList-right image{
		width: 80upx;
		height: 80upx;
		margin: 0 20upx;
	}
	.lf-right-text{
		width: 550upx;
		height: 70upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.lf-right-text > view{
		width: 550upx;
		height: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
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
	.lf-img-search{
		width: 40upx;
		height: 40upx;
	}
	.margin-right-40{
		margin-right: 40upx;
	}
</style>
