<template>
	<view class="match-width">
		
		<view class="bar"></view>
		
		<vma-item
			title="添加云打印机（支持飞鹅打印机）"
			:show-border-bottom="true"
			:index="0"
			@onItemClick="onItemClick">
			<view class="tips-box align-left">
				<view
					v-if="dataList.length"
					class="match-parent align-right">
					已添加<text class='text ml-4 mr-4'>{{dataList.length}}</text>台
				</view>
				<view
					v-else
					class="match-parent">
				</view>
			</view>
		</vma-item>
		
		<vma-item
			title="后台或后厨打印机设置"
			:show-border-bottom="true"
			:index="1"
			@onItemClick="onItemClick">
			<view>
				{{dataList[tmpCurPrefixIndex] ? dataList[tmpCurPrefixIndex]['equipmentName'] : ''}}
			</view>
		</vma-item>
		
		<vma-item
			title="前台打印机设置"
			:show-border-bottom="false"
			:index="2"
			@onItemClick="onItemClick">
			<view>
				{{dataList[tmpCurPostfixIndex] ? dataList[tmpCurPostfixIndex]['equipmentName'] : ''}}
			</view>
		</vma-item>
		
		<!-- <vma-item
			title="本地打印机设置"
			:show-border-bottom="true"
			:index="3"
			:isShow="isLocalShow"
			@onItemClick="onItemClick">
		</vma-item> -->
		
		<!-- 后厨/后台 -->
		<vma-action-sheet
			ref="actionSheetOne"
			@onModalConfirm="onModalConfirm('one')">
			<scroll-view
				class="scroll-view "
				:scroll-x="false"
				:scroll-y="true">
				<view
					v-for="(item, index) in dataList"
					:key="index"
					:class="['sheet-box plr-40 align-hor-bet', index === (dataList.length - 1) ? 'active' : '']"
					@click="onActionSheetItemClick('prefix', index)">
					<view :class="['name', curPrefixIndex === index ? 'active' : '']">
						{{item['equipmentName'] || ''}}
					</view>
					<view :class="['icon align-right', curPrefixIndex === index ? 'active' : '']">
						<view 
							class="iconfont icon-gou"
							v-if="curPrefixIndex === index">
						</view>
					</view>
				</view>
			</scroll-view>
		</vma-action-sheet>
		
		<!-- 客户 -->
		<vma-action-sheet
			ref="actionSheetTwo"
			@onModalConfirm="onModalConfirm('two')">
			<scroll-view
				class="scroll-view "
				:scroll-x="false"
				:scroll-y="true">
				<view
					v-for="(item, index) in dataList"
					:key="index"
					:class="['sheet-box plr-40 align-hor-bet', index === (dataList.length - 1) ? 'active' : '']"
					@click="onActionSheetItemClick('postfix', index)">
					<view :class="['name', curPostfixIndex === index ? 'active' : '']">
						{{item['equipmentName'] || ''}}
					</view>
					<view :class="['icon align-right', curPostfixIndex === index ? 'active' : '']">
						<view 
							class="iconfont icon-gou"
							v-if="curPostfixIndex === index">
						</view>
					</view>
				</view>
			</scroll-view>
		</vma-action-sheet>
		
		<!-- <view
			class="match-width bg-info mt-50 align-center" 
			style="height: 100upx;color: #FFF;"
			@click="onDebug">
			调试按钮
		</view>
		
		<view
			class="match-width bg-info mt-50 align-center" 
			style="height: 100upx;color: #FFF;"
			@click="onClear">
			清除缓存
		</view> -->
		
	</view>
</template>

<script>
	import VmaItem from '@/components/vma-item/index.vue'
	import VmaActionSheet from '@/components/vma-action-sheet/index.vue'
	import { showToast, showLoading, showModal } from '../../../../common/wxapi.js'
	import { getPrinterList } from '../../../../api/vueAPI.js'
	
	export default {
		components: {
			'vma-item': VmaItem,
			'vma-action-sheet': VmaActionSheet
		},
		
		data() {
			return {
				dataList: [],
				curPrefixIndex: 0,
				tmpCurPrefixIndex: -1,
				curPostfixIndex: 0,
				tmpCurPostfixIndex: -1,
				isLocalShow: false
			}
		},
		
		onLoad() {
		},
		
		onShow() {
			// 获取打印列表
			this.getPrinterList()
			// 反解析缓存
			setTimeout(() => {
				this.resolvePrinter()
			}, 400)
			// 删除
			uni.removeStorageSync('printer')
		},
		
		onBackPress(e) {
			if (e.from === 'backButton' || e.from === 'backbutton') {
				if (this.$refs['actionSheetOne'].getModalStatus()) {
					this.$refs['actionSheetOne'].onModalOpen(false)
					return true
				}
				if (this.$refs['actionSheetTwo'].getModalStatus()) {
					this.$refs['actionSheetTwo'].onModalOpen(false)
					return true
				}
			}
		},
		
		methods: {
			// 列表项点击
			onItemClick(type) {
				if (type == 0) {
					let storeId = ''
					let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
					if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
						storeId = nowStoreDetail.storeId
					}
					if (!storeId) {
						showToast('请先返回首页选择门店')
						return
					}
					// 添加打印机
					if (this.dataList.length) {
						uni.navigateTo({
							url: '/pages/user/newPrinter/printerList/index'
						})
					} else {
						uni.navigateTo({
							url: '/pages/user/newPrinter/addPrinter/index'
						})
					}
				} else if (type == 1) {
					// 商户联打印
					if (!this.dataList.length) {
						showToast('请先添加打印机', 2000)
						return
					}
					this.$refs['actionSheetOne'].onModalOpen()
					this.curPrefixIndex = this.tmpCurPrefixIndex
				} else if (type == 2) {
					// 客户联打印
					if (!this.dataList.length) {
						showToast('请先添加打印机', 2000)
						return
					}
					this.$refs['actionSheetTwo'].onModalOpen()
					this.curPostfixIndex = this.tmpCurPostfixIndex
				} else if (type == 3) {
					// 本地打印机
				}
			},
			// action sheet
			onActionSheetItemClick(type, index) {
				if (type === 'prefix') {
					if (this.curPrefixIndex !== index) {
						this.curPrefixIndex = index
					} else {
						this.curPrefixIndex = -1
					}
				} else if (type === 'postfix') {
					if (this.curPostfixIndex !== index) {
						this.curPostfixIndex = index
					} else {
						this.curPostfixIndex = -1
					}
				}
			},
			// 模态框 确定
			onModalConfirm(type) {
				let storeId = ''
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				if (!storeId) {
					showToast('请先返回首页选择门店')
					return
				}
				// console.log(this.curPrefixIndex, ' ~ ', this.curPostfixIndex)
				let userId = uni.getStorageSync('userId') || ''
				let key = 'key_' + storeId + '_' + userId
				let value = null
				if (type === 'one') {
					this.tmpCurPrefixIndex = this.curPrefixIndex
					if (this.tmpCurPrefixIndex !== -1) {
						value = this.dataList[this.tmpCurPrefixIndex]
					}
				} else if (type === 'two') {
					this.tmpCurPostfixIndex = this.curPostfixIndex
					if (this.tmpCurPostfixIndex !== -1) {
						value = this.dataList[this.tmpCurPostfixIndex]
					}
				}
				let obj = {}
				obj[key] = value
				let dataList = null
				if (type === 'one') {
					dataList = uni.getStorageSync('prefixPrinter') || []
				} else if (type === 'two') {
					dataList = uni.getStorageSync('postfixPrinter') || []
				}
				let flag = false
				for(let i of dataList) {
					if (i[key] !== undefined) {
						flag = true
						break
					}
				}
				if (flag) {
					// 替换
					dataList = dataList.map((item, index) => {
						if (item[key] !== undefined) {
							item = obj
						}
						return item
					})
				} else {
					// 添加
					dataList = [
						...dataList,
						obj
					]
				}
				if (type === 'one') {
					uni.setStorageSync('prefixPrinter', dataList)
					console.log('prefixPrinter', dataList)
				} else if (type === 'two') {
					uni.setStorageSync('postfixPrinter', dataList)
					console.log('postfixPrinter', dataList)
				}
				
			},
			// 解析打印机缓存
			resolvePrinter() {
				let storeId = ''
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				if (!storeId) {
					return
				}
				let userId = uni.getStorageSync('userId') || ''
				let key = 'key_' + storeId + '_' + userId
				let prefixPrinterArr = uni.getStorageSync('prefixPrinter') || []
				let postfixPrinterArr = uni.getStorageSync('postfixPrinter') || []
				prefixPrinterArr = prefixPrinterArr.filter((item, index) => {
					return item[key] !== undefined
				})
				postfixPrinterArr = postfixPrinterArr.filter((item, index) => {
					return item[key] !== undefined
				})
				this.tmpCurPrefixIndex = -1
				if (prefixPrinterArr && prefixPrinterArr.length) {
					let obj = prefixPrinterArr[0]
					if (obj[key] !== null) {
						let id = obj[key]['id']
						for (let i = 0; i < this.dataList.length; i++) {
							if (this.dataList[i]['id'] === id) {
								this.tmpCurPrefixIndex = i
								break
							}
						}
					}
				}
				if (this.tmpCurPrefixIndex === -1) {
					prefixPrinterArr = prefixPrinterArr.map((item, index) => {
						if (item[key] !== undefined) {
							item[key] = null
						}
						return item
					})
					uni.setStorageSync('prefixPrinterArr', prefixPrinterArr)
				}
				this.tmpCurPostfixIndex = -1
				if (postfixPrinterArr && postfixPrinterArr.length) {
					let obj = postfixPrinterArr[0]
					if (obj[key] !== null) {
						let id = obj[key]['id']
						for (let i = 0; i < this.dataList.length; i++) {
							if (this.dataList[i]['id'] === id) {
								this.tmpCurPostfixIndex = i
								break
							}
						}
					}
				}
				if (this.tmpCurPostfixIndex === -1) {
					postfixPrinterArr = postfixPrinterArr.map((item, index) => {
						if (item[key] !== undefined) {
							item[key] = null
						}
						return item
					})
					uni.setStorageSync('postfixPrinterArr', postfixPrinterArr)
				}
				
			},
			// 获取设备列表
			getPrinterList() {
				let storeId = ''
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				showLoading(true)
				getPrinterList(storeId).then(res => {
					showLoading(false)
					// console.log('获取打印机列表成功', res)
					if (res && res.obj) {
						this.dataList = res.obj
						this.dataList = this.dataList.map((item, index) => {
							let arr = JSON.parse(`${item['equipmentConfig']}`)
							item['equipmentConfig'] = {
								key: arr['key'] || '',
								sn: arr['sn'] || ''
							}
							return item
						})
					}
				}).catch(err => {
					// console.log(JSON.stringify(err))
					showLoading(false)
					// let msg = err && err.msg ? err.msg : '获取打印机列表失败，请检查网络'
					// showToast(msg)
				})
			},
			// 调试
			onDebug() {
				let usb1 = uni.getStorageSync('prefixPrinter')
				let usb2 = uni.getStorageSync('postfixPrinter')
				let usb3 = uni.getStorageSync('prefixPrinterUsb')
				let usb4 = uni.getStorageSync('postfixPrinterUsb')
				showModal(JSON.stringify({
					prefixPrinter: usb1,
					postfixPrinter: usb2,
					prefixPrinterUsb: usb3,
					postfixPrinterUsb: usb4
				}))
			},
			// 清除缓存
			onClear() {
				uni.removeStorageSync('prefixPrinter')
				uni.removeStorageSync('postfixPrinter')
				uni.removeStorageSync('prefixPrinterUsb')
				uni.removeStorageSync('postfixPrinterUsb')
				// showModal(JSON.stringify(window))
			},
		}
	}
</script>

<style lang="scss">
	uni-page-body {
		width: 100%;
		height: 100%;
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
	
	.bar {
		width: 100%;
		height: 20upx;
		background-color: #F8F9FD;
	}
	
	.tips-box {
		width: 180upx;
		height: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		box-sizing: border-box;
		
		.text {
			color: #4BA8FF;
		}
	}
	
	.sheet-box {
		width: 100%;
		height: 140upx;
		border-bottom: 1upx solid #F0F0F0;
		background-color: #FFF;
		color: #333333;
		font-size: 32upx;
		font-weight: 500;
		letter-spacing: 2upx;
		
		&.active {
			border-bottom: 1upx solid transparent;
		}
		
		.icon {
			width: 100upx;
			height: 100%;
			font-size: 32upx;
			
			&.active {
				color: #4BA8FF;
			}
		}
		
		.name {
			width: 400upx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			
			&.active {
				color: #4BA8FF;
			}
		}
	}
	
	.scroll-view {
		width: 100%;
		max-height: 420upx;
	}
</style>
