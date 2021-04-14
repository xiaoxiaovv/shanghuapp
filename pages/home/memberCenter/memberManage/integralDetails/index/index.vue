<template>
	<view @click="closeCover">
		<view class="lf-nav">
			<view class="lf-cover" v-if="isCover"></view>
			<!-- 筛选栏 -->
			<view class="lf-screen shadow">
				<view class="lf-cover" v-if="isCover"></view>
				<view class="view" @click.stop="onShowDatePicker('range')">
					<text>时间</text><text class="icon-unfold"></text>
				</view>
				<view class="lf-line1"></view>
				<view class="view" @click.stop="screenWay">
					<text>类型</text><text class="icon-unfold"></text>
					<view class="lf-popup" v-if="isShowPopupScreenWay">
						<view class="block" v-for="block in popupScreenWayList" @click="changeScreenWay(block.value)">
							<text class="text-sm">{{block.name}}</text>
						</view>
					</view>
				</view>
				<view class="lf-line2"></view>
				<view v-if="isMerchant" class="view" @click.stop="jumpStoreSelect">
					<text>{{storeName? storeName:'全部门店'}}</text><text class="icon-unfold"></text>
				</view>
				<view v-else class="view">
					<text>{{storeName? storeName:'全部门店'}}</text></text>
				</view>
			</view>
		</view>
		<view class="lf-mat"></view>
		<!-- 订单详情 -->
		<mescroll-uni @down="downCallback" @up="upCallback" :up="mescrollUp" @init="mescrollInit">
			<view v-for="integral in integralList" :key="integral.id">
				<view class="lf-orderList" @click="jumpIntegralDetails(integral.id)">
					<view class="lf-orderList-right">
						<image src="../../../../../../static/home/icon_king.png"></image>
						<view class="lf-right-text">
							<view>
								<text class="text-lg">{{integral.phone}}</text>
								<text>{{integral.tradeScores}}</text>
							</view>
							<view>
								<text class="text-sm text-grey">{{integral.transactionType}}</text>
								<text class="text-grey"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<!-- 日期picker插件 -->
		<mx-date-picker :show="showPicker" :type="type" :value="showPickerdata" :show-tips="true" :begin-text="'开始'" :end-text="'结束'" :show-seconds="true"  color="#4BA8FF" @confirm="onSelected" @cancel="onSelected" />
	</view>
</template>

<script>
	import {getIntegralList} from '@/api/vueAPI.js'
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
						icon: "../../../../../../static/order/no-data.png", //图标,默认null,支持网络图
						tip: "暂无相关数据~" //提示
					}
				},
				/* 消费记录~ */
				pageNumber: 1,		//查询页码
				pageSize: 10,		//每页显示数量
				infoType: '',			//明细类型
				startTime: '1970-01-01',	//开始时间
				endTime: '2019-06-14',		//结束时间
				integralList: [],
				storeId:'',
				storeName:'',
				memberNum: '',
				/* ~消费记录 */
				mescroll: null,
				isMescroll: false,	//onShow刷新指示
				yenSymbol: '\u00A5',	//金钱符号
				isSearchInputFocus: false,
				isShowSearch: false,
				isShowMenu: false,
				codeResult: '',
				orderNumber:'',
				isScreenTime: '',	//筛选-日期
				/* 日期picker~ */
				showPicker: false,
                date: '2019/01/01',
                time: '15:00:12',
                datetime: '2019/01/01 15:00:12',
                range: ['2019/01/01','2019/01/06'],
                rangetime: ['2019/01/08 14:00','2019/01/16 13:59'],
                type: 'range',
                showPickerdata: '',
				/* ~日期picker */
				isCover: false,
				isShowPopupScreenWay: false,
				popupScreenWayList: [
					{
						name:'全部',
						value:''
					},
					{
						name:'积分商品兑换',
						value:1
					},
					{
						name:'充值赠送积分',
						value:2
					},
					{
						name:'消费',
						value:3
					},
					{
						name:'退款',
						value:4
					},
					{
						name:'开卡赠送',
						value:6
					},
				],
				isMerchant:true,
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
			createTimeFilters(val){
				return val? val.split(' ')[1]:''
			}
		},
		watch:{
			integralList: {
				handler(val, oldval){
					
				},
				deep:true
			}
		},
		onReady() {
			// if(uni.getStorageSync('userType') == 1){
			// 	this.isMerchant = true
			// }else{
			// 	this.isMerchant = false
				let storeDetail = uni.getStorageSync("nowStoreDetail")
				if(storeDetail != '' && storeDetail != null && storeDetail != undefined && storeDetail){
					this.storeName = storeDetail.storeName
				}
			// }
		},
		onLoad(obj) {
			this.memberNum = obj.memberNum
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
				this.startTime = '';
				this.endTime = '';
				this.infoType = '';
				if(this.showPicker === true){
					this.showPicker = false;
				}
				this.integralList = []// 在这里手动置空列表,可显示加载中的请求进度
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
			/* 跳转门店 */
			jumpStoreSelect() {
				uni.navigateTo({
					url: '/packageA/pages/home/storeSelect/index/index'
				})
			},
			/* 跳转积分详情 */
			jumpIntegralDetails(id) {
				uni.navigateTo({
					url: '../integralDetail/integralDetail?id='+ id
				})
			},
			/* 关闭相关菜单 */
			closeCover() {
				// console.log("关闭相关菜单")
				if(this.isShowPopupScreenWay === true){
					this.isShowPopupScreenWay = false;
				}
				if(this.isCover === true){
					this.isCover = false;
				}
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
				this.getIntegralList( mescroll.num, mescroll.size, (res) => {
					let nowList = res.content;
					// console.log("mescroll.num=" + mescroll.num + ", mescroll.size=" + mescroll.size + ", length=" + nowList.length);
					// mescroll.endSuccess(number);
			
					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
					mescroll.endBySize(nowList.length, res.totalElements); //必传参数(当前页的数据个数, 总数据量)
					//设置列表数据
					if(mescroll.num == 1) this.integralList = []; //如果是第一页需手动制空列表
					this.integralList=this.integralList.concat(nowList); //追加新数据
				}, (err) => {
					// console.log('error！！');
					// console.log("错误测试点",err)
					console.log(err);
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			/* 获取列表 */
			getIntegralList(pageNumber, pageSize, successCallback, errorCallback) {
				// console.log("测试点0")
				let storeId = '';
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail');
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				getIntegralList( pageNumber, pageSize, this.startTime, this.endTime, storeId, this.infoType, this.memberNum).then((res) => {
					// console.log(res);
					// console.log(res.obj);
					// this.storeList = res.obj;
					// console.log("测试点0.5")
					//联网成功的回调
					successCallback && successCallback(res.obj);
				}).catch(err => {
					// console.log('error！！');
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
					this.startTime = e.value[0].replace(/\//g,'-');
					this.endTime = e.value[1].replace(/\//g,'-');
					//刷新页面
					this.integralList = []// 在这里手动置空列表,可显示加载中的请求进度
					this.mescroll.resetUpScroll()// 刷新列表数据
			    }
				this.isCover = false
			},
			/* ~日期picker */
			/* 筛选-更改状态 */
			changeStatus(value){
				this.payStatus = value;
				//刷新页面
				this.integralList = []// 在这里手动置空列表,可显示加载中的请求进度
				this.mescroll.resetUpScroll()// 刷新列表数据
			},
			/* 筛选-更改方式 */
			changeScreenWay(value){
				this.infoType = value;
				//刷新页面
				this.integralList = []// 在这里手动置空列表,可显示加载中的请求进度
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
		background-color: #FFF;
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
		height: 100upx;
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
	.lf-img-search{
		width: 40upx;
		height: 40upx;
	}
	.margin-right-40{
		margin-right: 40upx;
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
</style>
