<template>
	<view class="match-width">
		
		<view class="bar"></view>
		
		<view class="match-width box plr-30 bg-white">
			<view
				v-for="(item, index) in dataList"
				:key="index"
				:class="['item-box align-left']">
				<view class="match-left-space align-left">
					{{item['equipmentName']}}
				</view>
				<view 
					class="btn-box align-center ml-50"
					@click="onBtnClick('edit', item)">
					编辑
				</view>
				<view 
					class="btn-box align-center ml-20 active"
					@click="onBtnClick('unbind', item)">
					解绑
				</view>
			</view>
		</view>
		
		<view class="match-width align-center">
			<view class="btn-btn-box">
				<vma-button
					content="新增"
					@onBtnClick="onBtnClick('add')"
				/>
			</view>
		</view>
		
		<vma-modal
			ref="dialog"
			:isTopJustify="true"
			@onModalConfirm="onModalConfirm">
			<view class="tips-box">
				是否确认解绑？
			</view>
		</vma-modal>
	</view>
</template>

<script>
	import VmaButton from "@/components/vma-button/index.vue"
	import VmaModal from "@/components/vma-modal/index.vue"
	import { showToast, showLoading } from '../../../../common/wxapi.js'
	import { getPrinterList, unbindPrinter } from '../../../../api/vueAPI.js'
	
	export default {
		components: {
			'vma-button': VmaButton,
			'vma-modal': VmaModal
		},
		
		data() {
			return {
				dataList: [],
				item: null
			}
		},
		
		onShow() {
			this.getPrinterList()
			uni.removeStorageSync('printer')
		},
		
		onBackPress(e) {
			// if (e.from === 'backButton' || e.from === 'backbutton') {
			// 	this.$refs['dialog'].onModalOpen(false)
			// 	return true
			// }
		},
		
		methods: {
			// 按钮点击
			onBtnClick(type, item) {
				this.item = null
				if (type === 'add') {
					// 新增
					uni.navigateTo({
						url: '/pages/user/newPrinter/addPrinter/index'
					})
				} else if (type === 'edit') {
					// 编辑
					uni.setStorageSync('printer', item)
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/user/newPrinter/addPrinter/index'
						})
					}, 400)
				} else if (type === 'unbind') {
					// 解绑
					this.item = item
					this.$refs['dialog'].onModalOpen()
				}
			},
			// 确认
			onModalConfirm() {
				// console.log('xxx')
				this.unbindPrinter()
			},
			// 获取设备列表
			getPrinterList() {
				let storeId = '';
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
				}
				showLoading(true)
				getPrinterList(storeId).then(res => {
					showLoading(false)
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
					showLoading(false)
					showToast('获取打印机列表失败，请检查网络')
				})
			},
			// 解绑打印机
			unbindPrinter(item) {
				if (!this.item) {
					return
				}
				let yunEquipmentId = this.item['id'] || ''
				showLoading(true)
				unbindPrinter(yunEquipmentId).then(res => {
					showLoading(false)
					if (res) {
						showToast('解绑成功', 1000, () => {
							let storeId = ''
							let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
							if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
								storeId = nowStoreDetail.storeId
							}
							if (!storeId) {
								console.log('程序异常，非法访问')
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
							if (prefixPrinterArr && prefixPrinterArr.length && prefixPrinterArr[0][key]) {
								let targetId = prefixPrinterArr[0][key]['id']
								if (targetId === yunEquipmentId) {
									// 解绑的打印机为勾选的打印机
									prefixPrinterArr[0][key] = null
									uni.setStorageSync('prefixPrinter', prefixPrinterArr)
								}
							}
							if (postfixPrinterArr && postfixPrinterArr.length && postfixPrinterArr[0][key]) {
								let targetId = postfixPrinterArr[0][key]['id']
								if (targetId === yunEquipmentId) {
									// 解绑的打印机为勾选的打印机
									postfixPrinterArr[0][key] = null
									uni.setStorageSync('postfixPrinter', postfixPrinterArr)
								}
							}
							this.getPrinterList()
						})
					}
				}).catch(err => {
					showLoading(false)
					showToast('解绑失败，请检查网络')
				})
			}
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
	
	.item-box {
		width: 100%;
		height: 140upx;
		color: #333333;
		font-size: 30upx;
		font-weight: 500;
		box-sizing: border-box;
		background-color: #FFF;
		border-bottom: 1upx solid #F0F0F0;
		line-height: 1.6;
		
		.input {
			text-align: right;
			font-size: 30upx;
			
			&.placeholder {
				color: #999;
			}
		}
		
		&.active {
			border-bottom: 1upx solid transparent;
		}
	}
	
	.btn-btn-box {
		width: 640upx;
		height: 88upx;
		margin-top: 100upx;
	}
	
	.btn-box {
		width: 120upx;
		height: 60upx;
		border-radius: 10upx;
		border: 1upx solid #4BA8FF;
		background-color: #FFF;
		color: #4BA8FF;
		font-size: 30upx;
		font-weight: 500;
		letter-spacing: 4upx;
		
		&.active {
			color: #FFF;
			background-color: #4BA8FF;
		}
		
		&:active {
			opacity: 0.8;
		}
	}
	
	.tips-box {
		width: 100%;
		color: #999;
		font-size: 30upx;
		font-weight: 500;
		text-align: center;
	}
</style>
