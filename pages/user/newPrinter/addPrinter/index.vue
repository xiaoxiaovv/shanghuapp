<template>
	<view class="match-width">
		
		<view class="bar"></view>
		
		<view class="match-width box plr-30 bg-white">
			<view class="item-box align-hor-bet">
				<view>
					打印机名称
				</view>
				<input
					class="input small"
					:value="name"
					placeholder="请输入名称"
					placeholder-class="placeholder"
					@confirm="onChange('name', $event)"
					@change="onChange('name', $event)"
					@input="onInput('name', $event)"
				/>
			</view>
		</view>
		
		<block v-if="isModify">
			<vma-item
				title="打印机品牌"
				:isArrowShow="false">
				<view>
					{{producerList[curProducerIndex] ? producerList[curProducerIndex]['name'] : ''}}
				</view>
			</vma-item>
		</block>
		<block v-else>
			<vma-item
				title="打印机品牌"
				:index="0"
				@onItemClick="onItemClick">
				<view>
					{{producerList[curProducerIndex] ? producerList[curProducerIndex]['name'] : ''}}
				</view>
			</vma-item>
		</block>
		
		<!-- <block v-if="isModify"> -->
			<!-- <vma-item
				title="所属门店"
				:isArrowShow="false">
				<view>
					{{storeName}}
				</view>
			</vma-item> -->
		<!-- </block>
		<block v-else> -->
			<vma-item
				title="所属门店"
				:index="1"
				:isArrowShow="isMerchant"
				@onItemClick="onItemClick">
				<view>
					{{storeName}}
				</view>
			</vma-item>
		<!-- </block> -->
		
		<!-- <block v-if="isModify"> -->
			<!-- <view class="match-width box plr-30 bg-white">
				<view class="item-box align-hor-bet">
					<view>
						扫码绑定配置
					</view>
					<view
						class="iconfont icon-richscan_icon mr-6">
					</view>
				</view>
			</view> -->
		<!-- </block>
		<block v-else> -->
			<view class="match-width box plr-30 bg-white">
				<view
					class="item-box align-hor-bet"
					@click="onScanCode">
					<view>
						扫码绑定配置
					</view>
					<view 
						class="iconfont icon-richscan_icon mr-6">
					</view>
				</view>
			</view>
		<!-- </block> -->
		
		<view
			v-if="isConfig"
			class="config-box match-width box plr-30">
			<view class="item match-width align-hor-bet box">
				<view>编号</view>
				<view class="active">
					{{sn}}
				</view>
			</view>
			<view class="item match-width align-hor-bet box">
				<view>秘钥</view>
				<view class="active">
					{{key}}
				</view>
			</view>
		</view>
		
		<!-- <view class="item-box plr-30 align-hor-bet">
			<view>
				打印机型号
			</view>
			<input
				class="input"
				:value="model"
				placeholder="请输入秘钥"
				placeholder-class="placeholder"
				@confirm="onChange('model', $event)"
				@change="onChange('model', $event)"
				@input="onInput('model', $event)"
			/>
		</view> -->
		
		<!-- <view class="item-box plr-30 align-hor-bet">
			<view>
				打印机编号
			</view>
			<input
				class="input"
				:value="sn"
				placeholder="请输入秘钥"
				placeholder-class="placeholder"
				@confirm="onChange('sn', $event)"
				@change="onChange('sn', $event)"
				@input="onInput('sn', $event)"
			/>
		</view> -->
		
		<!-- <view class="item-box plr-30 align-hor-bet">
			<view>
				打印机秘钥
			</view>
			<input
				class="input"
				:value="key"
				placeholder="请输入秘钥"
				placeholder-class="placeholder"
				@confirm="onChange('key', $event)"
				@change="onChange('key', $event)"
				@input="onInput('key', $event)"
			/>
		</view> -->
		
		<view class="match-width box plr-30 bg-white">
			<view class="item-box align-hor-bet">
				<view>
					打印机备注
				</view>
				<input
					class="input"
					:value="remark"
					placeholder="请输入"
					placeholder-class="placeholder"
					@confirm="onChange('remark', $event)"
					@change="onChange('remark', $event)"
					@input="onInput('remark', $event)"
				/>
			</view>
		</view>
		
		<view class="match-width align-center">
			<view class="btn-btn-box">
				<vma-button
					content="保存"
					@onBtnClick="onBtnClick"
				/>
			</view>
		</view>
		
		<vma-modal
			ref="dialog"
			:isTopJustify="true"
			@onModalConfirm="onModalConfirm('save')">
			<view class="tips-box">
				是否确认保存？
			</view>
		</vma-modal>
		
		<vma-modal
			ref="dialogTwo"
			:isTopJustify="true"
			@onModalConfirm="onModalConfirm('quit')">
			<view class="tips-box">
				是否放弃保存？
			</view>
		</vma-modal>
		
		<vma-modal
			ref="dialogThree"
			:isTopJustify="true"
			@onModalConfirm="onModalConfirm('debug')"
			@onModalCancel="onModalCancel('debug')">
			<view class="tips-box">
				是否需要先行连接测试？
			</view>
		</vma-modal>
		
		<vma-action-sheet
			ref="producer"
			@onModalConfirm="onModalConfirm('actionSheet', 'producer')">
			<scroll-view
				class="scroll-view "
				:scroll-x="false"
				:scroll-y="true">
				<view
					v-for="(item, index) in producerList"
					:key="index"
					:class="['sheet-box plr-40 align-hor-bet', index === (producerList.length - 1) ? 'active' : '']"
					@click="onActionSheetItemClick('producer', index)">
					<view :class="['name', curProducerIndex === index ? 'active' : '']">
						{{item['name'] || ''}}
					</view>
					<view :class="['icon align-right', curProducerIndex === index ? 'active' : '']">
						<view class="iconfont icon-gou"></view>
					</view>
				</view>
			</scroll-view>
		</vma-action-sheet>
		
	</view>
</template>

<script>
	import VmaButton from "@/components/vma-button/index.vue"
	import VmaModal from "@/components/vma-modal/index.vue"
	import VamItem from "@/components/vma-item/index.vue"
	import VmaActionSheet from '@/components/vma-action-sheet/index.vue'
	import { showToast, showLoading, getCurrentTime } from '../../../../common/wxapi.js'
	import { addPrinter, useCloudSound, printX, getStoreDetails } from '../../../../api/vueAPI.js'
	
	export default {
		components: {
			'vma-button': VmaButton,
			'vma-modal': VmaModal,
			'vma-item': VamItem,
			'vma-action-sheet': VmaActionSheet
		},
		
		data() {
			return {
				name: '',
				sn: '',
				key: '',
				producer: '',
				model: '',
				remark: '',
				isEdit: false,
				producerList: [
					{
						name: '飞鹅'
					}
				],
				curProducerIndex: 0,
				tmpCurProducerIndex: 0,
				storeName: '',
				storeId: '',
				isMerchant: false,
				isConfig: false,
				isModify: false,
				id: ''
			}
		},
		
		onLoad() {
			this.isEdit = true
			// 编辑
			let item = uni.getStorageSync('printer')
			console.log('item', item)
			if (item) {
				this.isModify = true
				this.name = item['equipmentName'] || ''
				this.producer = item['equipmentProvider'] || ''
				this.storeId = item['equipmentOwner'] || ''
				this.storeName = ''
				this.isConfig = true
				// TODO
				let config = item['equipmentConfig'] || {}
				this.sn = config['sn'] || ''
				this.key = config['key'] || ''
				this.remark = item['equipmentRemark'] || ''
				this.id = item['id']
				// 获取门店名称
				this.getStoreDetails(this.storeId)
				// 修改导航栏标题
				this.setNavigationBarTitle()
			} else {
				this.isModify = false
				this.isConfig = false
			}
		},
		
		onShow() {
			this.getStoreInfo()
			// !this.isModify && this.getStoreInfo()
		},
		
		onNavigationBarButtonTap() {
			// nothing to do
		},
		
		onBackPress(e) {
			if (e.from === 'backButton' || e.from === 'backbutton') {
				// todo
				if (this.isEdit) {
					this.$refs['dialogTwo'].onModalOpen()
					return true
				}
			}
		},
		
		methods: {
			// 保存
			onBtnClick() {
				// console.log('xx', this.name, this.isConfig, this.storeId, this.producerList[this.tmpCurProducerIndex])
				// 校验
				if (!this.name) {
					showToast('打印机名称不能为空')
					return
				}
				if (!this.producerList[this.tmpCurProducerIndex]) {
					showToast('打印机厂家不能为空')
					return
				}
				if (!this.storeId) {
					showToast('门店不能为空')
					return
				}
				if (!this.isConfig) {
					
					showToast('请扫码绑定配置')
					return
				}
				this.$refs['dialog'].onModalOpen()
			},
			// 相机唤起
			onScanCode() {
				uni.scanCode({
					onlyFromCamera: true,
					success: (res) => {
						// console.log(res)
						this.isConfig = false
						if (res["scanType"] === "QR_CODE") {
							let result = res.result || ''
							if (result.indexOf(':') !== -1) {
								let arr = result.split(':')
								if (arr.length === 2) {
									this.sn = arr[0]
									this.key = arr[1]
									this.isConfig = true
								} else {
									showToast('请提供有效的二维码')
								}
							} else {
								showToast('请提供有效的二维码')
							}
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			// change
			onChange(type, e) {
				if (type === 'name') {
					this.name = this.name.trim()
				} else if (type === 'sn') {
					this.sn = this.sn.trim()
				} else if (type === 'key') {
					this.key = this.key.trim()
				} else if (type === 'producer') {
					this.producer = this.producer.trim()
				} else if (type === 'model') {
					this.model = this.model.trim()
				} else if (type === 'remark') {
					this.remark = this.remark.trim()
				}
			},
			// input
			onInput(type, e) {
				let value = e.detail.value
				if (type === 'name') {
					this.name = value
				} else if (type === 'sn') {
					this.sn = value
				} else if (type === 'key') {
					this.key = value
				} else if (type === 'producer') {
					this.producer = value
				} else if (type === 'model') {
					this.model = value
				} else if (type === 'remark') {
					this.remark = value
				}
			},
			// 确认
			onModalConfirm(action, type) {
				// console.log('action', action)
				if (action === 'save') {
					if (this.isModify) {
						this.addPrinter().then(res => {
							if (res) {
								this.isEdit = false
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									})
								}, 1000)
							}
						})
					} else {
						this.$refs['dialog'].onModalOpen(false)
						setTimeout(() => {
							this.$refs['dialogThree'].onModalOpen()
						}, 200)
					}
				} else if (action === 'quit') {
					this.isEdit = false
					uni.navigateBack({
						delta: 1
					})
				} else if (action === 'actionSheet') {
					if (type === 'producer') {
						// 厂家选择
						this.tmpCurProducerIndex = this.curProducerIndex
					}
				} else if (action === 'debug') {
					// 连接测试
					// console.log('uuuuuu')
					// return
					this.addPrinter().then(res => {
						// console.log('add', res)
						if (res) {
							let equipmentId = res.obj
							let time = getCurrentTime()
							this.printX(equipmentId, {
								"门店": this.storeName,
								"时间": time
							}, '打印机连接成功').then(res => {
								this.isEdit = false
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									})
								}, 1000)
							})
						}
					})
				}
			},
			// 取消
			onModalCancel(action) {
				// console.log('action', action)
				if (action === 'save') {
					// nothing to do
				} else if (action === 'quit') {
					// nothing to do
				} else if (action === 'actionSheet') {
					// nothing to do
				} else if (action === 'debug') {
					// 连接测试
					this.$refs['dialogThree'].onModalOpen(false)
					this.addPrinter().then(res => {
						if (res) {
							this.isEdit = false
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 1000)
						}
					})
				}
			},
			// item项点击
			onItemClick(index) {
				console.log(index, typeof index)
				if (index === 0) {
					// 厂家选择
					this.$refs['producer'].onModalOpen()
					this.curProducerIndex = this.tmpCurProducerIndex
				} else if (index === 1) {
					if (!this.isMerchant) {
						return
					}
					// 所属门店
					uni.navigateTo({
						url: '/pages/home/storeSelect/index/index'
					})
				}
			},
			// action sheet item select
			onActionSheetItemClick(type, index) {
				if (type === 'producer') {
					this.curProducerIndex = index
				}
			},
			// 获取门店信息
			getStoreInfo() {
				if(uni.getStorageSync('userType') == 1){
					this.isMerchant = true
				} else{
					this.isMerchant = false	
				} 
				console.log('getStoreInfo', this.isMerchant)
				let storeId = ''
				let storeName = ''
				let nowStoreDetail = uni.getStorageSync('nowStoreDetail')
				if(nowStoreDetail != null && nowStoreDetail != '' && nowStoreDetail){
					storeId = nowStoreDetail.storeId
					storeName = nowStoreDetail.storeName
				}
				this.storeId = storeId
				this.storeName = storeName
				// console.log(this.isMerchant, this.storeId, this.storeName)
			},
			// 添加打印机
			addPrinter() {
				let equipmentName = this.name
				let name = this.producerList[this.tmpCurProducerIndex] ? this.producerList[this.tmpCurProducerIndex]['name'] : ''
				let equipmentProvider = name
				let equipmentOwner = this.storeId
				let equipmentConfig = {
					key: this.key,
					sn: this.sn
				}
				let equipmentRemark = this.remark
				let id = this.id
				// console.log('测试1', equipmentName, name, equipmentProvider, equipmentOwner, equipmentConfig, equipmentRemark)
				return new Promise((resolve, reject) => {
					showLoading(true)
					addPrinter(equipmentName, equipmentProvider, equipmentOwner, equipmentConfig, equipmentRemark, id).then(res => {
						showLoading(false)
						if (res) {
							if (this.isModify) {
								showToast('修改成功')
							} else {
								showToast('添加成功')
							}
							// console.log('addPrinter', res)
							resolve && resolve(res)
						}
					}).catch(err => {
						console.log(JSON.stringify(err))
						showLoading(false)
						if (this.isModify) {
							showToast('修改失败，请检查网络')
						} else {
							showToast('该设备已被绑定，请切换设备')
						}
						reject && reject()
					})
				})
			},
			// 连接打印机
			useCloudSound() {
				let key = this.key
				let sn = this.sn
				let storeId = this.storeId
				let printName = this.name
				// console.log('测试2', key, sn, storeId, printName)
				return new Promise((resolve, reject) => {
					showLoading(true)
					useCloudSound(key, sn, storeId, printName).then(res => {
						// console.log(res)
						showLoading(false)
						resolve && resolve(res)
					}).catch(err => {
						showLoading(false)
						showToast('连接云打印机失败，请检查网络')
						reject && reject()
					})
				})
			},
			// 打印
			printX(yunEquipmentId, bottomContent, title) {
				return new Promise((resolve, reject) => {
					showLoading(true)
					printX(yunEquipmentId, bottomContent, title).then(res => {
						// console.log('printX', res)
						showLoading(false)
						if (res) {
							showToast('打印成功')
							resolve && resolve()
						}
					}).catch(err => {
						console.log('printY', JSON.stringify(err))
						showLoading(false)
						showToast('打印失败')
						reject && reject()
					})
				})
			},
			// 修改导航栏标题
			setNavigationBarTitle() {
				uni.setNavigationBarTitle({
					title: '修改打印机'
				})
			},
			// 获取门店
			getStoreDetails(storeId) {
				// console.log('storeId', storeId)
				getStoreDetails(storeId).then(res => {
					if (res && res['obj'] && res['obj']['name']) {
						// console.log(res)
						this.storeName = res['obj']['name']
					} else {
						showToast('获取门店信息有误，请检查接口')
					}
				}).catch(err => {
					showToast('获取门店信息失败，请检查网络')
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
	
	.uni-page-body {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	
	body{
		background-color: #FFF;
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
		height: 120upx;
		color: #333333;
		font-size: 30upx;
		font-weight: 500;
		box-sizing: border-box;
		background-color: #FFF;
		border-bottom: 1upx solid #F0F0F0;
		
		.input {
			// width: 100%;
			height: 80upx;
			text-align: right;
			font-size: 28upx;
			// border: 1upx solid #F0F0F0;
			// border-radius: 10upx;
			box-sizing: border-box;
			// padding: 0 20upx;
			
			&.placeholder {
				color: #999;
			}
			
			&.small {
				// width: 400upx;
				// text-align: right;
				// border: 1upx solid transparent;
				// padding: 0;
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
	
	.scroll-view {
		width: 100%;
		max-height: 420upx;
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
	
	.config-box {
		width: 100%;
		background-color: #FFF;
		opacity: 0.8;
		
		.item {
			height: 100upx;
			border-bottom: 1upx solid #F0F0F0;
			box-sizing: border-box;
			padding: 0 40upx;
			
			.active {
				color: #999;
			}
		}
	}
</style>
