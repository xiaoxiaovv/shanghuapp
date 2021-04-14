<template>
	<view ref="deposit" class='match-width'>
		
		<!-- <view class="fixed-box">
			
			<view class='nav_box align-hor-bet plr-10'>
				<view 
					class='nav_box__back align-center'
					@click="onNavBack">
					<view class='icon iconfont icon-Back align-center'></view>
				</view>
				<view class="input-view box align-left">
					<view class='icon iconfont icon-sousuo mb-6'></view>
					<input 
						confirm-type="search" 
						class="input" 
						type="text" 
						placeholder="输入搜索关键词" 
						@confirm="confirm"
						placeholder-class="placeholder"
						@input="onNavInputChanged"
					/>
				</view>
				<view 
					class='align-center'
					style='font-size: 28upx;'
					@click='onNavTap'>
					<view class='pr-20'></view>
				</view>
				<view class='nav_box__title align-center'>
					押金管理
				</view>
			</view>
		</view> -->
		<!-- <view>押金管理</view> -->
		
		<!-- 记录列表 -->
		<view class='record match-width box plr-40'>
			<mescroll-uni
				:down="downOption" 
				@down="downCallback" 
				:up="upOption" 
				@up="upCallback" 
				@init="mescrollInit">
				<view
					v-for="(item, index) in dataList"
					:key="index"
					:class="['deposit-item align-ver-bet pt-40 pb-10 box mtb-30', dataList && (index != dataList.length - 1) ? 'border' : '']">
					<view class="deposit-item__top align-hor-bet box pb-20">
						<view class="deposit-item__top__left match-left-space box align-default">
							<view class="title match-width align-hor-bet">
								<view>
									{{item['id'] || ''}}
								</view>
								<view 
									class="remark"
									@click="onCoverBoxClick(item)">
									{{item['remark'] || '备注'}}
								</view>
							</view>
							<view class="match-width align-hor-bet mt-20">
								<view>
									{{item['updateTime'] || ''}}
								</view>
								<view>
									{{item['status'] | depositStatusFilter}}
								</view>
							</view>
						</view>
						<!-- <view 
							class="deposit-item__top__right align-center ml-40"
							@click="onStatusChange(index)">
							<block v-if="!item['expandStatus']">
								<image
									class="img"
									src="/static/home/arrow_up.png"
									mode="scaleToFill"
								/>
							</block>
							<block v-else>
								<image
									class="img"
									src="/static/home/arrow_down.png"
									mode="scaleToFill"
								/>
							</block>
						</view> -->
					</view>
					<view
						v-if="item['expandStatus']"
						class="deposit-item__bottom box align-hor-bet ptb-20">
						<view class="match-left-space align-ver-left">
							<view>
								冻结金额：{{item['money'] | dealWithMoney}}
							</view>
							<view class="mt-20">
								支付金额：{{getSubValue(item['money'], item['leftMoney']) | dealWithMoney}}
							</view>
							<view
								v-if="item['status'] == 4"
								class="mt-20">
								订单编号：{{item['orderNumber'] || ''}}
							</view>
						</view>
						<view 
							class="deposit-item__bottom__btn align-center"
							v-if="item['status'] == 2"
							@click="onCoverBoxClickRefund(item)">
							退押金
						</view>
						<view 
							class="deposit-item__bottom__btn align-center active"
							v-else>
							退押金
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
		
		<!-- 筛选 -->
		<view 
			v-if='isFilterShow'
			class='drawer-box align-left'
			@touchmove.stop.prevent="()=>{}">
			<view 
				class='drawer-box__left'
				@click="onConfirm('close')">
			</view>
			<view :class="['drawer-box__right', isMove ? 'action' : '']">
				
				<!-- <view style='height: 80upx;' class='match-width'></view> -->
				
				<view class='item'>
					<view class='title match-width'>
						时间
					</view>
					<view class='content align-left'>
						<view 
							class='block mb-20 mr-10'
							@click="onTimePickerShow('start')">
							<view v-if='!startTime'>
								开始时间
							</view>
							<view 
								v-else
								class='has'>
								{{startTime}}
							</view>
						</view>
						<view class='bar'></view>
						<view 
							class='block mb-20'
							@click="onTimePickerShow('end')">
							<view v-if='!endTime'>
								结束时间
							</view>
							<view 
								v-else
								class='has'>
								{{endTime}}
							</view>
						</view>
					</view>
				</view>
				<view class='item'>
					<view class='title match-width'>
						授权单号
					</view>
					<view class='content'>
						<view class='block match'>
							<input
								class='match-parent box plr-20'
								type="number"
								placeholder="请输入授权单号"
								:value="depositId"
								@input="onInputChange"
							/>
							<!-- <view 
								v-if='!depositId'
								class='match-width'>
							</view>
							<view 
								v-else
								class='has'>
								{{depositId}}
							</view> -->
						</view>
					</view>
				</view>
				<view class='item'>
					<view class='title match-width'>
						状态
					</view>
					<view class='content match-width align-left'>
						<view
							v-for="(item, index) in statusArr"
							:key="index"
							:class="['mb-20', index === curStatus ? 'active' : '', index % 2 === 0 ? 'mr-10': '']"
							@click="onDepositStatusChange(index, $event)">
							<view class='block'>
								<image
									v-if="index === curStatus"
									class="match-parent"
									src="/static/home/drawer_ck.png"
									mode="scaleToFill"
								/>
								<view class='fly align-center'>
									{{item.title}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class='btn align-left'>
					<view 
						class='btn__inner align-center'
						@click="initFilter">
						重置
					</view>
					<view 
						class='btn__inner align-center active'
						@click="onConfirm('confirm')">
						确定
					</view>
				</view>
			</view>
		</view>
		
		<!-- 日期时间 -->
		<mx-date-picker 
			:show="showPicker" 
			:type="type" 
			:value="value" 
			:show-tips="true" 
			:show-seconds="true"
			 :format='format'
			 :color='color'
			@confirm="onSelected" 
			@cancel="onSelected" 
		/>
		
		<!-- nav隐藏 -->
		<view 
			v-if="isFilterShow"
			class='nav-hide-box align-left'>
			<!-- <view 
				class='nav-hide-box__left'
				@click="onConfirm('close')">
			</view>
			<view class='nav-hide-box__right'></view> -->
		</view>
		
		<!-- 备注 -->
		<vma-modal
			ref="textarea"
			@onModalConfirm="onModalConfirm"
			:is-allow-cover-click-hide="false">
			<view class="textarea-box pd-20 align-ver-bet">
				<textarea
					placeholder="请输入备注内容"
					maxlength="20"
					:value="textarea"
					@input="onTextareaChange"
				/>
				<view class="tips">
					{{textarea.length}} / 20
				</view>
			</view>
		</vma-modal>
		
		<!-- 退押金 -->
		<vma-modal
			ref="refund"
			@onModalConfirm="onModalConfirmRefund"
			:is-allow-cover-click-hide="false">
			<view class="refund-box pd-20 align-ver-bet">
				<view class="match-width align-center">
					<view class="title match-left-space">
						押金金额：
					</view>
					<view class="match-left-space ml-50">
						{{tmpItem['money']}}元
					</view>
				</view>
				<view class="match-width align-center mt-20">
					<view class="title match-left-space">
						消费：
					</view>
					<view class="match-left-space align-left ml-50">
						<input
							class="money-box"
							type="number"
							:value="tmpMoney"
							@input="onMoneyInput"
						/>
						<!-- @change="onMoneyCost"
						@confirm="onMoneyCost" -->
						<view class="ml-10">元</view>
					</view>
				</view>
				<view class="match-width align-center mt-20">
					<view class="title match-left-space">
						退押金：
					</view>
					<view class="match-left-space ml-50">
						<block v-if="tmpLeftMoney !== ''">
							{{tmpLeftMoney}}元
						</block>
					</view>
				</view>
			</view>
		</vma-modal>
		
		
		<!-- 退押金 -->
		<vma-modal
			ref="dialog"
			:is-allow-cover-click-hide="false"
			:isTopJustify="true"
			:isShowCancel="false"
			@onModalConfirm="onModalConfirmDialog">
			<view>
				操作成功
			</view>
		</vma-modal>
		
		<!-- 切换门店 -->
		<vma-modal
			ref="switchDialog"
			:index="1"
			:isTopJustify="true"
			@onModalConfirm="onModalConfirm"
			@onModalCancel="onModalCancel">
			<view class="text-center box match-width plr-50" style="font-size: 32upx;">
				当前系统选择的门店和退押金详情上的门店不匹配，是否切换门店？
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
				没有检测到打印机，将无法打印，是否前往打印机设置添加打印机？
			</view>
		</vma-modal>
		
	</view>
</template>

<script>
	import MescrollUni from "mescroll-uni/mescroll-uni.vue"
	import { getDepositList, refundDeposit, updateDeposit } from '../../../../api/vueAPI.js'
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue"
	import VmaModal from "@/components/vma-modal/index.vue"
	import { getRealMoney, showToast } from "../../../../common/wxapi.js"
	import { getRefundDetailAndPrint } from '../../../../api/depositApi.js'
	import { isPrinterExist } from '../../../../api/printApi.js'
	import { getSubValue } from '../../../../common/wxapi.js'
	
	export default {
		components: {
			MescrollUni, MxDatePicker, 'vma-modal': VmaModal
		},
		
		data() {
			return {
				// 列表数据
				dataList: [],
				// 下拉刷新的常用配置
				downOption: { 
					// use: true, // 是否启用下拉刷新; 默认true
					// auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				},
				// 上拉加载的常用配置
				upOption: {
					// use: true, // 是否启用上拉加载; 默认true
					// auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					// page: {
					// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					// 	size: 10 // 每页数据的数量,默认10
					// },
					// noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无押金记录',
						icon: "/static/order/no-data.png", //图标,默认null,支持网络图
					}
				},
				mescroll: null,
				startTime: '',
				endTime: '',
				tmpStartTime: '',
				tmpEndTime: '',
				depositId: '',
				status: '',
				isFilterShow: false,
				statusArr: [
					{
						value: 1,
						title: '冻结中'
					},
					{
						value: 2,
						title: '冻结成功'
					},
					{
						value: 3,
						title: '冻结失败'
					},
					{
						value: 4,
						title: '已解冻'
					}
				],
				curStatus: -1,
				showPicker: false,
				type: 'datetime',
				value: '',
				color: '#4BA8FF',
				format: 'yyyy-mm-dd hh:ii:ss',
				selectType: '',
				isMove: false,
				isCoverShow: false,
				textarea: '',
				isCoverShowX: false,
				tmpMoney: '',
				tmpLeftMoney: '',
				tmpItem: {},
				isEdit: false,
				msg: ''
			}
		},
		
		// 右上角按钮点击
		onNavigationBarButtonTap() {
			this.isFilterShow = true
			// this.isMove = true
			// this.initFilter()
			if (this.$refs['textarea'].getModalStatus()) {
				this.$refs['textarea'].onModalOpen(false)
			}
			if (this.$refs['refund'].getModalStatus()) {
				this.$refs['refund'].onModalOpen(false)
			}
		},
		
		// 返回 
		onBackPress(e) {
			if (e.from === 'backButton' || e.from === 'backbutton') {
				if (this.isFilterShow) {
					this.isFilterShow = false
					return true
				}
			}
			if (this.$refs['textarea'].getModalStatus()) {
				this.$refs['textarea'].onModalOpen(false)
				return true
			}
			if (this.$refs['refund'].getModalStatus()) {
				this.$refs['refund'].onModalOpen(false)
				return true
			}
			// if (this.$refs['dialog'].getModalStatus()) {
			// 	this.$refs['dialog'].onModalOpen(false)
			// 	return true
			// }
		},
		
		// 注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			this.mescroll && this.mescroll.onPageScroll(e)
		},
		
		methods: {
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			/*下拉刷新的回调, 有三种处理方式: */
			downCallback(mescroll){
				mescroll.resetUpScroll() // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			upCallback(mescroll) {
				// console.log('mescroll', mescroll)
				// 此时mescroll会携带page的参数:
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				this.showLoading(true)
				getDepositList(this.startTime, this.endTime, this.status, this.depositId, pageNum, pageSize).then(res => {
					this.showLoading(false)
					// console.log('押金列表', res)
					if (res.code === 200 && res.obj && res.obj.content) {
						// 接口返回的当前页数据列表 (数组)
						let curPageData = res.obj.content
						// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
						let totalPage = res.obj.totalPages
						//设置列表数据
						if(mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
						this.dataList = this.dataList.concat(curPageData); //追加新数据
						// 新增展开状态
						this.dataList = this.dataList.map((item, index) => {
							item['expandStatus'] = true
							return item
						})
						// console.log(this.dataList)
						// 成功隐藏下拉加载状态
						// //方法一(推荐): 后台接口有返回列表的总页数 totalPage
						mescroll.endByPage(curPageData.length, totalPage); 
					}
				}).catch(err => {
					this.showLoading(false)
					this.showToast('获取押金列表失败，请检查网络')
					mescroll.endErr()
				})
			},
			// 显隐loading
			showLoading(flag) {
				let methodName = (flag ? 'show' : 'hide') + 'Loading'
				uni[methodName]()
			},
			// 提示
			showToast(title) {
				title && uni.showToast({
					title,
					icon: 'none'
				})
			},
			// 获取当前时间
			getCurrentTime() {
				let date = new Date()
				let yyyymmdd = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
				this.startTime = yyyymmdd + ' 00:00:00'
				this.endTime = yyyymmdd + ' 23:59:59'
				this.tmpStartTime = this.startTime
				this.tmpEndTime = this.endTime
			},
			// 获取押金数据列表
			getDepositList(pageNumber, pageSize) {
				// nothing to do 
			},
			// 押金状态改变
			onDepositStatusChange(index, e) {
				this.curStatus = +index
				this.status = this.curStatus + 1
			},
			// 时间选择器
			onTimePickerShow(type) {
				this.showPicker = true
				this.selectType = type
				if (type === 'start') {
					this.value = this.startTime || ''
				} else if (type === 'end') {
					this.value = this.endTime || ''
				}
			},
			// 日期选择
			onSelected(e) {
				this.showPicker = false
				if (e) {
					if (this.selectType === 'start') {
						if (this.endTime === '') {
							this.startTime = e.value
						} else {
							let tmpValue = e.value
							let startTime = this.getTimestamp(tmpValue)
							let tmpEndTime = this.endTime
							let endTime = this.getTimestamp(tmpEndTime)
							if (startTime < endTime) {
								this.startTime = tmpValue
							} else {
								this.showToast('开始时间不能晚于结束时间')
							}
						}
					} else if (this.selectType === 'end') {
						if (this.satrtTime === '') {
							this.endTime = e.value
						} else {
							let tmpValue = e.value
							let tmpStartTime = this.startTime
							let startTime = this.getTimestamp(tmpStartTime)
							let endTime = this.getTimestamp(tmpValue)
							if (startTime < endTime) {
								this.endTime = tmpValue
							} else {
								this.showToast('结束时间不能早于开始时间')
							}
						}
					}
				}
			},
			// 时间比较
			getTimestamp (stringDate) {
				if (stringDate) {
					// 部分真机只支持使用yyyy/mm/dd hh:mm:ss的格式
					let tmpStringDate = stringDate.replace(/\-/g, '/')
					let date = new Date(tmpStringDate)
					let time = date.getTime()
					return time
				}
				return 0
			},
			// 重置
			initFilter() {
				this.curStatus = -1
				this.depositId = ''
				this.startTime = this.tmpStartTime
				this.endTime = this.tmpEndTime
				this.status = ''
			},
			// 输入框change
			onInputChange(e) {
				if (e && e.detail) {
					this.depositId = e.detail.value
				}
			},
			// 关闭筛选
			onConfirm(type) {
				this.isFilterShow = false
				// this.isMove = false
				if (type === 'confirm') {
					// console.log(this.startTime, this.endTime, this.depositId, this.status)
					if ((this.startTime && this.endTime) || (!this.startTime && !this.endTime)) {
						this.mescroll.resetUpScroll()	
					} else {
						if (!this.startTime) {
							this.showToast('开始时间不能为空')
						} else if (!this.endTime) {
							this.showToast('结束时间不能为空')
						}
						// this.startTime = ''
						// this.endTime = ''
						this.initFilter()
					}
				}
			},
			// 改变列表项状态
			onStatusChange(index) {
				// this.dataList = this.dataList.map((item, key) => {
				// 	if (+index === key) {
				// 		item['expandStatus'] = !item['expandStatus']
				// 	}
				// 	return item
				// })
			},
			// 遮罩层关闭
			onCoverBoxClick(item) {
				this.$refs['textarea'].onModalOpen()
				this.textarea = item['remark'] || ''
				this.tmpItem = item
			},
			// 退押金
			onCoverBoxClickRefund(item) {
				this.tmpItem = item
				let storeId = ''
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				if (item['storeId'] !== storeId) {
					this.$refs['switchDialog'].onModalOpen()
					return
				}
				if (!isPrinterExist()) {
					this.$refs['switchDialogPrinter'].onModalOpen()
					return
				}
				this.$refs['refund'].onModalOpen()
				this.tmpItem = item
				this.tmpLeftMoney = ''
				this.tmpMoney = ''
				this.isEdit = false
			},
			// textarea input事件
			onTextareaChange(e) {
				let str = e.detail.value
				this.textarea = str.slice(0, 20)
			},
			// 消费
			onMoneyCost(e) {
				if (this.tmpMoney === '') {
					this.tmpLeftMoney = ''
					return
				}
				if (/^\d+$/.test(this.tmpMoney) || /^\d+\.\d{1}$/.test(this.tmpMoney) || /^\d+\.\d{2}$/.test(this.tmpMoney)) {	
					this.tmpMoney = +this.tmpMoney + ''
					if (this.tmpMoney >= this.tmpItem['money']) {
						this.tmpMoney = this.tmpItem['money'] ? (this.tmpItem['money'] + '') : '0'
					}
					if (this.tmpMoney === '0') {
						this.tmpMoney = ''
					}
				} else {
					if (this.tmpMoney.split('.')[1].length > 2) {
						let arr = this.tmpMoney.split('.')
						this.tmpMoney = arr[0] + '.' + arr[1].slice(0, 2)
						if (this.tmpMoney >= this.tmpItem['money']) {
							this.tmpMoney = this.tmpItem['money'] ? (this.tmpItem['money'] + '') : '0'
						}
						this.tmpMoney = +this.tmpMoney + ''
						if (this.tmpMoney === '0') {
							this.tmpMoney = ''
						}
					} else {
						this.tmpMoney = ''	
					}
				}
				if (this.tmpMoney !== '' && this.tmpItem['money'] > 0) {
					this.tmpLeftMoney = +this.tmpItem['money'] - +this.tmpMoney
					this.tmpLeftMoney = +this.tmpLeftMoney.toFixed(2) + ''
				} else {
					this.tmpLeftMoney = ''
				}
			},
			// 备注模态框确定
			onModalConfirm(type) {
				if (type === 1) {
					uni.navigateTo({
						url: '/packageA/pages/home/storeSelect/index/index'
					})
					return
				} else if (type === 3) {
					// 添加打印机
					uni.navigateTo({
						url: '/packageA/pages/user/newPrinter/index/index'
					})
					return
				}
				this.updateDepositAndPrint()
			},
			// 模态框 取消
			onModalCancel(type) {
				if (type === 3) {
					// 添加打印机 取消
					setTimeout(() => {
						this.$refs['refund'].onModalOpen()
					}, 100)
				}
			},
			// 退押金并打印
			updateDepositAndPrint() {
				let textarea = this.textarea || ''
				let item = this.tmpItem || {}
				let id = item['id'] || ''
				// this.showLoading(true)
				// console.log('测试', textarea, id)
				updateDeposit(id, textarea).then(res => {
					// this.showLoading(false)
					this.mescroll.resetUpScroll()
				}).catch(err => {
					// this.showLoading(false)
					this.showToast('备注失败，请检查网络 ')
				})
			},
			// 金额输入
			onMoneyInput(e) {
				let value = e.detail.value
				this.tmpMoney = value
				if (!this.isEdit) {
					this.isEdit = true
				}
				let item = this.tmpItem
				if (this.tmpMoney >= 0 && this.tmpMoney <= item['money']) {
					
					if (this.tmpMoney != 0) {
						if (this.tmpMoney.split('.')) {
							if (this.tmpMoney.split('.')[1].length > 2) {
								// this.showToast('请输入正确的金额，输入的金额小数点最多2位')
								this.tmpLeftMoney = ''
								return
							}
						}
					}
					
					// this.tmpLeftMoney = +item['money'] - +this.tmpMoney + ''
					this.tmpLeftMoney = getSubValue(item['money'], +this.tmpMoney) + ''
					// console.log(item['money'], this.tmpMoney, this.tmpLeftMoney)
				} else {
					this.tmpLeftMoney = ''
				}
			},
			// 押金模态框确定
			onModalConfirmRefund() {
				if (this.isEdit) {
					this.isEdit = false
					let tmpMoney = this.tmpMoney
					let item = this.tmpItem
					let id = item['id'] || ''
					let tmpLeftMoney = this.tmpLeftMoney
					if (this.tmpMoney >= 0 && this.tmpMoney <= item['money']) {
						if (this.tmpMoney != 0) {
							if (this.tmpMoney.split('.')) {
								if (this.tmpMoney.split('.')[1].length > 2) {
									this.showToast('请输入正确的金额，输入的金额小数点最多2位', 3000)
									return
								}
							}	
						}						
						// 退押金成功
						this.showLoading(true)
						this.msg = ''
						refundDeposit(id, tmpMoney).then(res => {
							this.showLoading(false)
							this.msg = res.msg
							this.$refs['dialog'].onModalOpen()
							if (this.tmpMoney != 0) {
								// 打印
								getRefundDetailAndPrint(id)
							}
						}).catch(err => {
							this.showLoading(false)
							this.showToast('退押金失败，请检查网络')
						})
					} else {
						if (this.tmpMoney <= 0) {
							// this.showToast('官方要求最低消费金额不能小于0.01元', 3000)
							this.showToast('请输入正确的金额', 3000)
						} else if (this.tmpMoney > item['money']) {
							this.showToast('退押金失败，输入金额大于冻结金额', 3000)
						} else {
							this.showToast('请输入正确的金额', 3000)
						}
						return
					}

				}
			},
			// 显示弹框
			showModal(content, callback) {
				if (content) {
					uni.showModal({
						title: '提示',
						content,
						showCancel: true,
						success: (res) => {
							callback && callback(res)
						}
					})
				}
			},
			// 模态框 确定
			onModalConfirmDialog() {
				this.mescroll.resetUpScroll()
			},
			// 获取两个数值的差值
			getSubValue(a, b) {
				return getSubValue(a, b)
			}
		},
		
		filters: {
			// 押金状态过滤
			depositStatusFilter(value) {
				let val = ''
				if (value == 1) {
					val = '冻结中'
				} else if (value == 2) {
					val = '冻结成功'
				} else if (value == 3) {
					val = '冻结失败'
				} else if (value == 4) {
					val = '已解冻'
				}
				return val
			},
			// 金额处理
			dealWithMoney(val) {
				val += ''
				let arr = val.split('.')
				if (arr.length === 2) {
					if (arr[1].length === 1) {
						return val + '0'
					} else if (arr[1].length > 2) {
						return arr[0] + '.' + arr[1].slice(0, 2)
					}
					return val
				}
				return val + '.00'
			}
		}
	}
</script>

<style lang='scss'>
	$left: 15%;
	$right: 85%;
	
	uni-page-body {
		width: 100%;
		height: 100%;
		background-color: #F8F9FD;
	}
	
	.uni-page-body {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	
	body{
		background-color: #FFF;
	}
	
	.record {
		background-color: #F8F9FD;
	}
	
	.fixed-box {
		background-color: #FFF;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		match-width: 100%;
		z-index: 10;
	}
	
	.nav_box {
		width: 100%;
		height: 80upx;
		box-sizing: border-box;
		font-size: 36upx;
		color: #333;
		font-weight: bold;
		position: relative;
		margin-top: 70upx;
		
		&__back {
			width: 60upx;
			height: 60upx;
		}
		
		&__title {
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
		}
		
		.icon {
			width: 50upx;
			height: 50upx;
			font-size: 36upx !important;
			color: #333 !important;
		}
	}
	
	.drawer-box {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		
		&__left {
			width: $left;
			height: 100%;
		}
		
		&__right {
			width: $right;
			height: 100%;
			background-color: #FFF;
			position: relative;
			/* transform: translateX(0%);
			transition: transform 10s ease; */
			
			.btn {
				width: 100%;
				height: 98upx;
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				
				&__inner {
					width: 50%;
					height: 100%;
					background-color: #F6F6F6;
					color: #4BA8FF;
					font-size: 36upx;
					font-weight: 500;
					
					&.active {
						background-color: #4BA8FF;
						color: #FFF;
					}
					
					&:active {
						opacity: 0.8;
					}
				}
			}
			
			.item {
				width: 100%;
				color: #999999;
				font-size: 28upx;
				font-weight: 500;
				box-sizing: border-box;
				padding: 20upx 0 20upx 30upx;
				
				.title {
					color: #333333;
					padding: 30upx 0;
				}
				
				.content {
					
					.block {
						width: 280upx;
						height: 72upx;
						border-radius: 6upx;
						background-color: #F8F9FD;
						color: #999999;
						font-size: 28upx;
						font-weight: 500;
						display: flex;
						align-items: center;
						justify-content: center;
						border: 1upx solid #F8F9FD;
						position: relative;
						
						&.match {
							width: 570upx;
							box-sizing: border-box;
							
							input {
								color: #666;
								font-size: 28upx;
							}
						}
						
						.has {
							color: #666;
						}
						
						&:active {
							opacity: 0.8;
						}
						
						&.active {
							border: 1upx solid #4BA8FF;
							color: #4BA8FF;
						}
						
						.fly {
							width: 100%;
							height: 100%;
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							z-index: 1001;
						}
					}
					
					.bar {
						/* width: 10upx;
						height: 1upx;
						background-color: #F8F9FD; */
					}
				}
			}
		}
		
		.action {
			transform: translateX(0%);
			transition: transform 10s ease;
		}
	}
	
	.deposit-item {
		width: 100%;
		/* height: 300upx; */
		box-sizing: border-box;
		padding: 0 40upx;
		color: #999999;
		font-size: 28upx;
		font-weight: 500;
		background-color: #FFF;
		border-radius: 10upx;
		box-shadow: 2upx 2upx 10upx 0 rgba(0.5, 0.5, 0.5, 0.1);
		
		&.border {
			/* border-bottom: 1upx solid #F0F0F0; */
		}
		
		&__top {
			width: 100%;
			height: 120upx;
			font-size: 28upx;
			color: #999;
			
			&__left {
				/* width: 200upx; */
				
				.title {
					color: #333333;
					font-size: 28upx;
					
					.remark {
						width: 150upx;
						height: 40upx;
						color: #4BA8FF;
						font-size: 28upx;
						font-weight: 500;
						text-align: right;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						line-height: 40upx;
						
						&:active {
							opacity: 0.8;
						}
					}
				}
			}
			
			&__right {
				width: 50upx;
				height: 100%;
				
				.img {
					width: 26upx;
					height: 16upx;
					
					&:active {
						opacity: 0.8;
					}
				}
			}
		}
		
		&__bottom {
			width: 100%;
			font-size: 28upx;
			font-weight: 500;
			color: #333333;
			border-top: 1upx solid #F0F0F0;
			
			&__btn {
				width: 140upx;
				height: 60upx;
				border-radius: 10upx;
				background-color: #4BA8FF;
				color: #FFF;
				font-size: 28upx;
				font-weight: 500;
				
				&:active {
					opacity: 0.8;
				}
				
				&.active {
					background-color: #F8F9FD;
					color: #999;
					
					&:active {
						opacity: 1;
					}
				}
			}
		}
	}
	
	.nav-hide-box {
		width: 20%;
		height: 88upx;
		position: fixed;
		top: 0;
		right: 0;
		/* background-color: rgba(0, 0, 0, 0.5); */
		z-index: 100000;
		box-sizing: border-box;
		background-color: #FFF;
		
		&__left {
			width: $left;
			height: 100%;
		}
		
		&__right {
			width: $right;
			height: 100%;
			background-color: #FFF;
		}
	}

	.textarea-box {
		width: 500upx;
		height: 200upx;
		border: 1upx solid #F0F0F0;
		border-radius: 10upx;
		overflow: hidden;
		font-size: 32upx;
		font-weight: 500;
		
		textarea {
			width: 100%;
			height: 120upx;
			color: #666666;
		}
		
		.textarea {
			width: 100%;
			height: 120upx;
			color: #999999;
		}
		
		.tips {
			width: 100%;
			text-align: right;
			color: #999999;
			font-size: 26upx;
			font-weight: 500;
		}
	}
	
	.refund-box {
		width: 100%;
		color: #666666;
		font-size: 32upx;
		font-weight: 500;
		
		.title {
			text-align: right;
		}
	}
	
	.money-box {
		width: 80upx;
		height: 60upx;
		/* border-radius: 10upx; */
		border-bottom: 1upx solid #F0F0F0;
		box-sizing: border-box;
		/* padding: 0 20upx; */
		text-align: left;
	}
</style>
