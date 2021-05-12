<template>
	<view @click="closeCover">
		<view class="lf-nav">
			<view class="lf-nav-order">
				
				
				<!-- 导航栏-正常 -->
				<view class="lf-nav-content padding" v-if="isShowSearch === false">
					<!-- <image src="../../../static/order/icon_search_black.png" @click.stop="ShowSearch"></image> -->
					
					
				</view>
				<!-- 导航-搜索框 -->
				<!-- <view class="lf-nav-content padding" v-else>
					<view class="lf-search-bg">
						<image src="../../../static/order/icon_search.png"></image>
						<input type="number" v-model="searchOrderId" :focus="isSearchInputFocus"/>
					</view>
					<text @click="closeSearch">取消</text>
				</view> -->
			</view>
			<!-- 筛选栏 -->
			<!-- <view class="lf-screen shadow">
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
			</view> -->
		</view>
		<!-- <view class="lf-mat"></view> -->
		
		<!-- 顶部间隔 -->
		
		<view
			class="match-width" 
			style="height:116upx"
			>
		</view>
		
		<!-- 按时间搜索结果 时间段展示 -->
		<!-- <view
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
					
				</view>
				<view class="match-width align-left">
					<view class="match-left-space">商户实收：{{yenSymbol}} {{totalSummary['actPrice'] | dealWithMoney}}</view>
					<view class="match-left-space align-left">
						<view class="mr-36"></view>
						商户实退：{{yenSymbol}} {{totalSummary['refundPrice'] | dealWithMoney}}
					</view>
				</view>
			</view>
		</view> -->
		
		<!-- 订单详情 -->
		<mescroll-uni @down="downCallback" :up="mescrollUp" @up="upCallback" @init="mescrollInit">
			<view 
				class="match-width" >
					
				<view v-for="order in orderList" :key="order.id" class="lf-orderList match-width align-left ptb-10" @click="jumpOrderDetails(order)">
									
					<image :src="order | payWayImgFilters"/>		
					<view class="match-left-space align-ver-left"> 			
						<view class="match-width align-hor-bet">
							<view>{{yenSymbol}} {{(order.totalPrice)}}</view>
							<view class="ly-font-weight-500 ly-font-size-28">{{
								order.state === 0? "已下单未确认" : order.state === 1? "订单确认成功" : order.state === 9? "支付成功" : order.state === -1? "订单确认失败" :
								order.state === -9? "拒绝支付(支付失败)": "未知状态码"
							}}</view>
						</view>
						<view class="ly-font-color-9 ly-font-size-24 match-width mt-10">
							<text>{{
								order.createDate
							}}</text>
							
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
			
		
			
			
			/* 跳转订单详情（附订单号） */
			jumpOrderDetails (orderInfo) {
				let orderInfoJsonStr = JSON.stringify(orderInfo)
				uni.navigateTo({
					url: '/pages/order/orderDetails/orderDetails?orderInfoJsonStr='+ orderInfoJsonStr
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
					let nowList = res.list;
					// console.log(nowList);
					// this.orderList = [];
					let number = 0;		//本次数据数
					// console.log("测试点2");
					//设置列表数据
					if(mescroll.num == 1) {
						this.orderList = nowList; //如果是第一页需手动制空列表
					}else{
						this.orderList = this.orderList.concat(nowList)
					}
					console.log('orders==============',this.orderList)
					number = nowList.length;
					
					
					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					mescroll.endBySize(number, res.total); //必传参数(当前页的数据个数, 总数据量)
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
				let params = {};
				params.limit = pageSize;
				params.page = pageNumber;
				getOrderList( params).then((res) => {
					// console.log(res);
					// console.log(res.data);
					// this.orderList = res.data;
					// console.log("测试点0.5")
					//联网成功的回调
					successCallback && successCallback(res.data);
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
							this.totalSummary = res.data || {}
						}
					})
				} else {
					if (!this.orderList[time]['isRequestLocked']) {
						this.orderList[time]['isRequestLocked'] = true
						let ttt = time + ' 00:00:00'
						this.queryOrderSummarySingle(ttt).then(res => {
							if (res && res.code === 200) {
								let { actPrice, refundPrice, allPrice, orderCount } = res.data
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
