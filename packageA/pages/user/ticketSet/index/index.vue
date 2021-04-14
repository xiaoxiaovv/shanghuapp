<template>
	<view class='container-box pt-30 align-default'>
		<view class='content-box bg-warn'>
			<view class='item-box align-hor-bet'>
				<view>电子发票</view>
				<switch 
					:checked="isRadioEnable" 
					color="#4BA8FF"
					@change="onRadioChange"
				/>
			</view>
			<block v-if="isRadioEnable">
				<view class='item-box align-hor-bet'>
					<view>纳税人识别号</view>
					<block v-if="isTaxShow">
						{{ticketInfo.taxpayerIdentificationNum}}
					</block>
					<block v-else>
						<!-- v-model="ticketInfo.taxpayerIdentificationNum" -->
						<!-- <input 
							:value="ticketInfo.taxpayerIdentificationNum" 
							type='text'
							placeholder="请输入纳税人识别号"
							placeholder-class="placeholder"
							@blur="onIdentificationNumBlur"
							@confirm="onIdentificationNumBlur"
							@input="onInput('taxpayerIdentificationNum', $event)"
						/> -->
						<view 
							class='match-left-space input align-right' 
							@click="onInputOpen('taxpayerIdentificationNum')">
							{{ticketInfo.taxpayerIdentificationNum ? ticketInfo.taxpayerIdentificationNum : '请输入纳税人识别号'}}
						</view>
					</block>
				</view>
				<view 
					class='item-box align-hor-bet'
					@click="onOrderAccountChange(true, 'open')">
					<view>订单金额</view>
					<view class='align-left'>
						<view class='mr-20'>
							{{ticketInfo.lowerLimit | dealWithMoney}}~{{ticketInfo.upperLimit | dealWithMoney}}元
						</view>
						<image
							src='../../../../../static/tabBar/icon_the_arrow.png'
						/>
					</view>
				</view>
				<view class='item-box align-hor-bet'>
					<view>开票名称</view>
					<!-- v-model="ticketInfo.name" -->
					<!-- <input 
						:value="ticketInfo.name" 
						type='text'
						placeholder="请输入开票名称"
						placeholder-class="placeholder"
						@blur="onNameBlur"
						@confirm="onNameBlur"
						@input="onInput('name', $event)"
					/> -->
					<view 
						class='match-left-space input align-right' 
						@click="onInputOpen('name')">
						{{ticketInfo.name ? ticketInfo.name : '请输入开票名称'}}
					</view>
				</view>
				<view class='item-box align-hor-bet'>
					<view>开票类型</view>	
					<block v-if="ticketInfo.id">
						<view>
							{{ticketInfo.goodsName}}
						</view>
					</block>
					<block v-else>
						<view 
							class='match-left-space align-right'
							@click='onTicketName'>
							<view class='andy mr-20'>
								{{ticketInfo.goodsName || ''}}
							</view>
							<image
								src='../../../../../static/tabBar/icon_the_arrow.png'
							/>	
						</view>
					</block>
				</view>
				<view class='item-box align-hor-bet'>
					<view>开票人</view>
					<!-- v-model="ticketInfo.issuer" -->
					<!-- <input 
						:value="ticketInfo.issuer" 
						type='text'
						placeholder="请输入开票人名字"
						placeholder-class="placeholder"
						@blur="onIssuerBlur"
						@confirm="onIssuerBlur"
						@input="onInput('issuer', $event)"
					/> -->
					<view 
						class='match-left-space input align-right' 
						@click="onInputOpen('issuer')">
						{{ticketInfo.issuer ? ticketInfo.issuer : '请输入开票人名字'}}
					</view>
				</view>
				<view class='item-box align-hor-bet'>
					<view>税率</view>
					<block v-if="!ticketInfo.id">
						<picker
							class='align-right box ptb-20'
							:range="rateArr"
							:value="curRate"
							@change='onPickerChange'>
							<view class='ggcontent align-right'>
								<view class='align-right'>
									<view class='mr-20'>
										{{rateArr[curRate]}}
									</view>
									<image
										src='../../../../../static/tabBar/icon_the_arrow.png'
									/>
								</view>
							</view>
						</picker>
					</block>
					<block v-else>
						<view>{{ticketInfo.vatRate + '%'}}</view>
					</block>
				</view>
				<view 
					class='btn-box align-center'
					v-if="isBtnShow">
					<view 
						class='create-btn box align-center mr-30'
						@click="onBtnClick('confirm')">
						创建
					</view>
					<view 
						class='create-btn box align-center active'
						@click="onBtnClick('cancel')">
						取消
					</view>
				</view>
			</block>
		</view>
		
		<view 
			class='container-box__cover box align-default bg-warn'
			v-if="isPickerShow">
			<view 
				class='match-left-space'
				@click='onCoverClose'>
			</view>
			<view 
				class='picker-box align-bottom'
				v-if="isPickerShow">
				<view class='menu align-hor-bet plr-40 box'>
					<view 
						@click="onOrderAccountChange(false, 'cancel')">
						取消
					</view>
					<view 
						class='active'
						@click="onOrderAccountChange(false, 'confirm')">
						确定
					</view>
				</view>
				<view class='panel plr-50 box align-default pt-10'>
					<view class='input align-center mt-50'>
						<input 
							type="text" 
							:value="tmpStartMoney"
							placeholder-class="placeholder"
							@input="onInput('start', $event)"
							@focus="onFocus('start', $event)"
							@blur="onBlur('start', $event)"
							@confirm="onBlur('start', $event)"
						/>
						<view class='mlr-30'>~</view>
						<input 
							type="text" 
							:value="tmpEndMoney" 
							placeholder-class="placeholder"
							@input="onInput('end', $event)"
							@focus="onFocus('end', $event)"
							@blur="onBlur('end', $event)"
							@confirm="onBlur('end', $event)"
						/>
						<view class='ml-30'>元</view>
					</view>
					<view class='tips mt-40'>
						提示：可设置最低消费10元，才可开具电子发票，如不设置则无金额限制，最高金额非必填
					</view>
				</view>
			</view>
		</view>
		
		<!-- 模态框 -->
		
		<neil-modal 
			:show="modalShow" 
			@close="closeModal" 
			:title="title" 
			auto-close="false" 
			@confirm="bindBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 30upx; font-size: 28upx;">
				<!-- @blur="onIdentificationNumBlur"
				@confirm="onIdentificationNumBlur" -->
				<!-- :value="ticketInfo.taxpayerIdentificationNum" -->
				<input
					v-if="inputType === 'taxpayerIdentificationNum'"
					type='text'
					:value="tmpTaxpayerIdentificationNum"
					placeholder="请输入纳税人识别号"
					placeholder-class="placeholder"
					@input="onInput('taxpayerIdentificationNum', $event)"
				/>
				<!-- :value="ticketInfo.name" -->
				<!-- @blur="onNameBlur"
				@confirm="onNameBlur" -->
				<input 
					v-if="inputType === 'name'"
					type='text'
					:value="tmpName"
					placeholder="请输入开票名称"
					placeholder-class="placeholder"
					@input="onInput('name', $event)"
				/>
				<!-- :value="ticketInfo.issuer" -->
				<!-- @blur="onIssuerBlur"
				@confirm="onIssuerBlur" -->
				<input 
					v-if="inputType === 'issuer'"
					:value="tmpIssuer"
					type='text'
					placeholder="请输入开票人名字"
					placeholder-class="placeholder"
					@input="onInput('issuer', $event)"
				/>
			</view>
		</neil-modal>
		
		<!-- 对话框 -->
		
		<neil-modal
			:show="modalShowMsg"
			title="提示"
			auto-close="false"
			@close="closeModalMsg"
			@confirm="btnConfirmMsg">
			<view
				class='align-center'
				style="min-height: 90upx;padding: 32upx 30upx; font-size: 28upx; text-align: center; line-height: 1.6;">
				{{content}}
			</view>
		</neil-modal>
	</view>
</template>

<script>
	import { 
		switchTicketState, 
		getSwitchState, 
		getTicketSetting, 
		updateTicketSetting, 
		createTicketSetting 
	} from '../../../../../api/vueAPI.js'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	
	export default {
		components: {neilModal, uniPopup},
		
		data() {
			return {
				isRadioEnable: false,
				cardNum: '',
				ticketName: '',
				startMoney: 0,
				endMoney: 0,
				tmpStartMoney: '',
				tmpEndMoney: '',
				isPickerShow: false,
				rateArr: ['0%', '3%'],
				curRate: 0,
				ticketInfo: {},
				selectArr: [],
				ticketType: '',
				isTaxShow: false,
				isFirst: false,
				isBtnShow: false,
				modalShow: false,
				inputType: '',
				tmpTaxpayerIdentificationNum: '',
				modalShowMsg: false,
				content: '',
				returnType: '',
				tmpName: '',
				tmpIssuer: '',
				title: ''
			}
		},
		methods: {
			// 电子发票开关设置
			onRadioChange(e) {
				let isRadioEnable = e.detail.value
				this.isRadioEnable = isRadioEnable
				// TODO
				switchTicketState(this.isRadioEnable).then(res => {
					uni.hideLoading()
					let msg = '电子发票' + (this.isRadioEnable ? '启动' : '关闭')
					this.showToast(msg)
				}).catch(err => {
					uni.hideLoading()
				})
				if (this.isRadioEnable) {
					this.getTicketSetting()
				}
			},
			// 订单金额控制开关
			onOrderAccountChange(isShow, type) {
				this.isPickerShow = isShow
				if (type === 'confirm') {
					if (!this.onTest('start', this.tmpStartMoney) || !this.onTest('end', this.tmpEndMoney)) {
						return
					}
					if (!this.tmpStartMoney) {
						this.ticketInfo.lowerLimit = -1
					} else {
						this.ticketInfo.lowerLimit = +this.tmpStartMoney * 100
					}
					if (!this.tmpEndMoney) {
						this.ticketInfo.upperLimit = -1
					} else {
						this.ticketInfo.upperLimit  = +this.tmpEndMoney * 100
					}
					if (this.isFirst) {
						// this.createTicketSetting()
					} else {
						this.updateTicketSetting()
					}
				} else if (type === 'open') {
					if (this.ticketInfo.lowerLimit !== -1 && this.ticketInfo.lowerLimit !== undefined) {
						this.tmpStartMoney = ((this.ticketInfo.lowerLimit / 100) + '') || ''
					} else {
						this.tmpStartMoney = ''
					}
					if (this.ticketInfo.upperLimit !== -1 && this.ticketInfo.upperLimit !== undefined) {
						this.tmpEndMoney = ((this.ticketInfo.upperLimit / 100) + '') || ''
					} else {
						this.tmpEndMoney = ''
					}
				}
			},
			// 遮罩层隐藏
			onCoverClose() {
				this.onOrderAccountChange(false)
			},
			// 输入金额
			onInput(type, e) {
				let value = e.detail.value
				if (type === 'start') {
					this.tmpStartMoney = value
				} else if (type === 'end') {
					this.tmpEndMoney = value
				} else if (type === 'taxpayerIdentificationNum') {
					// this.ticketInfo.taxpayerIdentificationNum = value
					this.tmpTaxpayerIdentificationNum = value
				} else if (type === 'name') {
					// this.ticketInfo.name = value
					this.tmpName = value
				} else if (type === 'issuer') {
					// this.ticketInfo.issuer = value
					this.tmpIssuer = value
				}
			},
			// input聚焦
			onFocus(type, e) {
				// nothing to do
			},
			// input失焦
			onBlur(type, e) {
				let value = e.detail.value
				if (value === false || value === null || value === undefined || isNaN(Number(value)) || /^\.$/.test(value) || /^\.\d+$/.test(value) || /^\d+\.$/.test(value)) {				
					this.showToast('请输入正确的金额')
					if (type === 'start') {
						this.tmpStartMoney = ''
					} else if (type === 'end') {
						this.tmpEndMoney = ''
					}
					this.onOrderAccountChange(false, 'cancel')
					return
				}
				if (/^\d+\.\d$/.test(value)) {
					value += '0'
				} else if (/^\d+\.\d{2}\d+$/.test(value)) {
					value = Number(value)
					value = value.toFixed(2)
				}
				if (type === 'start') {
					if (value !== '') {
						value = +value
						if (value < 10) {
							this.tmpStartMoney = 10 + ''
						} else {
							this.tmpStartMoney = value + ''
						}
					}
				} else if (type === 'end') {
					this.tmpEndMoney = value
					if (this.tmpEndMoney && +this.tmpStartMoney >= +this.tmpEndMoney) {
						this.showToast('最高消费金额需大于最低消费金额')
						this.tmpEndMoney = ''
						this.onOrderAccountChange(false, 'cancel')
					}
				}
				if (this.tmpEndMoney && this.tmpStartMoney === '') {
					this.showToast('请先输入最低消费金额')
					this.tmpEndMoney = ''
					this.onOrderAccountChange(false, 'cancel')
				}
			},
			// 验证
			onTest (type, value) {
				if (value === false || value === null || value === undefined || isNaN(Number(value)) || /^\.$/.test(value) || /^\.\d+$/.test(value) || /^\d+\.$/.test(value)) {				
					this.showToast('请输入正确的金额')
					if (type === 'start') {
						this.tmpStartMoney = ''
					} else if (type === 'end') {
						this.tmpEndMoney = ''
					}
					this.onOrderAccountChange(false, 'cancel')
					return false
				}
				if (/^\d+\.\d$/.test(value)) {
					value += '0'
				} else if (/^\d+\.\d{2}\d+$/.test(value)) {
					value = Number(value)
					value = value.toFixed(2)
				}
				if (type === 'start') {
					if (value !== '') {
						value = +value
						if (value < 10) {
							this.tmpStartMoney = 10 + ''
						} else {
							this.tmpStartMoney = value + ''
						}
					}
				} else if (type === 'end') {
					this.tmpEndMoney = value
					if (this.tmpEndMoney && +this.tmpStartMoney >= +this.tmpEndMoney) {
						this.showToast('最高消费金额需大于最低消费金额')
						this.tmpEndMoney = ''
						this.onOrderAccountChange(false, 'cancel')
						return false
					}
				}
				if (this.tmpEndMoney && this.tmpStartMoney === '') {
					this.showToast('请先输入最低消费金额')
					this.tmpEndMoney = ''
					this.onOrderAccountChange(false, 'cancel')
					return false
				}
				return true
			},
			// picker改变事件
			onPickerChange(e) {
				let value = e.detail.value
				if (e && e.detail) {
					this.curRate = value
					this.ticketInfo.vatRate = this.rateArr[this.curRate].split('%')[0]
				}
			},
			// 设置开票名称
			onTicketName() {
				uni.navigateTo({
					url: '../query/index'
				})
			},
			// 消息提示
			showToast(title) {
				uni.showToast({
					title,
					icon: 'none'
				})
			},
			// 获取设置
			getTicketSetting() {
				getTicketSetting().then(res => {
					// console.log('getTicketSetting', res)
					
					// TODO
					// res.obj = null
					
					if (res && res.obj) {
						this.ticketInfo = res.obj
						this.ticketInfo['tmpName'] = this.ticketInfo['name']
						this.ticketInfo['tmpIssuer'] = this.ticketInfo['issuer']
						this.isTaxShow = true
						this.isFirst = false
						this.isBtnShow = false
					} else {
						this.ticketInfo = {}
						this.ticketInfo['tmpName'] = ''
						this.ticketInfo['tmpIssuer'] = ''
						this.isTaxShow = false
						this.isFirst = true
						this.isBtnShow = true
					}
				}).catch(err => {
					// console.log('err', err)
					// this.ticketInfo = {}
					// this.ticketInfo['tmpName'] = ''
					// this.isTaxShow = false
					// this.isFirst = true
					// this.isBtnShow = true
				})
			},
			// 处理rate
			dealWithRate() {
				if (this.selectArr.length) {
					let rateArr = [0, 3]
					this.selectArr.map((item) => {
						let rate = +item.vatRate.split('%')[0]
						if (rateArr.indexOf(rate) === -1) {
							rateArr.push(rate)
						}
					})
					rateArr = rateArr.sort((x, y) => (x - y))
					rateArr = rateArr.map((item) => {
						return item + '%'
					})
					this.rateArr = rateArr
					// 处理发票类型
					this.ticketInfo.goodsName = this.selectArr[this.selectArr.length - 1].name || ''
					this.ticketInfo.goodsCode = this.selectArr[this.selectArr.length - 1].goodsCode || ''
					this.curRate = 0
				}
			},
			// 查询开关状态res
			getSwitchState() {
				getSwitchState().then((res) => {
					if (res) {
						this.isRadioEnable = res.obj || false
						if (this.isRadioEnable) {
							this.getTicketSetting()
						}
					} else {
						console.log('getSwitchState error')
					}
				}).catch(err => {
					// this.showToast(err.msg)
				})
			},
			// 更新设置
			updateTicketSetting() {
				let { id, name, vatRate, lowerLimit, upperLimit, issuer } = this.ticketInfo
				if (id) {
					uni.showLoading()
					updateTicketSetting(id, name, vatRate, lowerLimit, upperLimit, issuer).then(res => {
						uni.hideLoading()
						this.showToast('设置成功')
					}).catch(err => {
						uni.hideLoading()
					})
				}
			},
			// 名称改变
			onNameBlur() {
				// let value = e.detail.value
				let value = this.tmpName
				if (!/^\s+$/.test(value) && value) {
					this.ticketInfo.name = value.trim()
					// this.ticketInfo.tmpName = this.ticketInfo.name
					this.tmpName = this.ticketInfo.name
					if (this.isFirst) {
						// this.createTicketSetting()
					} else {
						this.updateTicketSetting()
					}
				} else {
					this.showToast('开票名称不能为空')
					// this.ticketInfo.name = this.ticketInfo.tmpName
					// if (this.isFirst) {
					// 	this.ticketInfo.name = ''
					// }
					this.tmpName = ''
				}
			},
			// 开票人
			onIssuerBlur() {
				// let value = e.detail.value
				let value = this.tmpIssuer
				if (!/^\s+$/.test(value) && value) {
					this.ticketInfo.issuer = value.trim()
					// this.ticketInfo.tmpIssuer = this.ticketInfo.issuer
					this.tmpIssuer = this.ticketInfo.issuer
					if (this.isFirst) {
						// this.createTicketSetting()
					} else {
						this.updateTicketSetting()
					}
				} else {
					this.showToast('开票人名字不能为空')
					// this.ticketInfo.issuer = this.ticketInfo.tmpIssuer
					// if (this.isFirst) {
					// 	this.ticketInfo.issuer = ''
					// }
					this.tmpIssuer = ''
				}
			},
			// 纳税人识别号blur
			onIdentificationNumBlur() {
				// let value = e.detail.value
				let value = this.tmpTaxpayerIdentificationNum
				if (value) {
					value = value.trim()
					if (this.checkTaxId(value)) {
						// this.ticketInfo.taxpayerIdentificationNum = value
						// console.log(this.ticketInfo)
						// this.createTicketSetting()
						this.ticketInfo.taxpayerIdentificationNum = value
					} else {
						this.showToast('请输入正确的纳税人识别号')
						// this.ticketInfo.taxpayerIdentificationNum = ''
					}
				} else {
					this.showToast('纳税人识别号不能为空')
					this.isTaxShow = false
					// this.ticketInfo.taxpayerIdentificationNum = ''
				}
			},
			// 正则验证纳税人识别号
			checkTaxId(taxId) {
				let regArr = [
					/^[\da-z]{10,15}$/i, 
					/^\d{6}[\da-z]{10,12}$/i, 
					/^[a-z]\d{6}[\da-z]{9,11}$/i, 
					/^[a-z]{2}\d{6}[\da-z]{8,10}$/i, 
					/^\d{14}[\dx][\da-z]{4,5}$/i, 
					/^\d{17}[\dx][\da-z]{1,2}$/i, 
					/^[a-z]\d{14}[\dx][\da-z]{3,4}$/i, 
					/^[a-z]\d{17}[\dx][\da-z]{0,1}$/i, 
					/^[\d]{6}[\da-z]{13,14}$/i
				]
				let j = regArr.length
				for (let i = 0; i < j; i++) {
					if (regArr[i].test(taxId)) {
						return true
					}
				}
				//纳税人识别号格式错误
				return false
			},
			// 创建开票设置
			createTicketSetting() {
				
				let { taxpayerIdentificationNum, lowerLimit, upperLimit, name, goodsCode, vatRate, issuer } = this.ticketInfo
				this.modalShowMsg = true
				this.content = '是否现在创建?'
				this.returnType = ''
				// uni.showModal({
				// 	title: '提示',
				// 	content: '是否现在创建？',
				// 	showCancel: true,
				// 	success: (res) => {
				// 		if (res.cancel) {
				// 			return
				// 		}
				// 		if (!taxpayerIdentificationNum) {
				// 			this.showToast('请输入纳税人识别号')
				// 			return
				// 		}
				// 		if (!name) {
				// 			this.showToast('请输入开票名称')
				// 			return
				// 		}
				// 		if (!goodsCode) {
				// 			this.showToast('请选择开票类型')
				// 			return
				// 		}
				// 		if (!issuer) {
				// 			this.showToast('请输入开票人名字')
				// 			return
				// 		}
				// 		if (taxpayerIdentificationNum && name && goodsCode && issuer) {
				// 			lowerLimit = lowerLimit === undefined ? -1 : lowerLimit
				// 			upperLimit = upperLimit === undefined ? -1 : upperLimit
				// 			vatRate = vatRate === undefined ? this.rateArr[this.curRate].split('%')[0] : vatRate
				// 			createTicketSetting(taxpayerIdentificationNum, lowerLimit, upperLimit, name, goodsCode, vatRate, issuer).then(res => {
				// 				this.showToast('创建成功')
				// 				this.getTicketSetting()
				// 			}).catch(err => {
				// 				// this.ticketInfo.taxpayerIdentificationNum = ''
				// 			})
				// 		}
				// 	}
				// })
			},
			// 按钮点击
			onBtnClick(type) {
				if (type === 'confirm') {
					this.createTicketSetting()
				} else if (type === 'cancel') {
					uni.navigateBack({
						delta: 1
					})
				}
			},
			// 模态框
			onInputOpen(type) {
				this.modalShow = true
				this.inputType = type
				if (type === 'taxpayerIdentificationNum') {
					this.tmpTaxpayerIdentificationNum = this.ticketInfo.taxpayerIdentificationNum || ''
					this.title = '纳税人识别号设置'
				} else if (type === 'name') {
					this.tmpName = this.ticketInfo.name || ''
					this.title = '开票名称设置'
				} else if (type === 'issuer') {
					this.tmpIssuer = this.ticketInfo.issuer || ''
					this.title = '开票人设置'
				}
			},
			// 关闭模态框
			closeModal () {
				this.modalShow = false
				uni.hideKeyboard()
			},
			// 模态框确定按钮
			bindBtn (type) {
				if (type === 'confirm') {
					if (this.inputType === 'taxpayerIdentificationNum') {
						this.onIdentificationNumBlur()
					} else if (this.inputType === 'name') {
						this.onNameBlur()
					} else if (this.inputType === 'issuer') {
						this.onIssuerBlur()
					}
				}
				uni.hideKeyboard()
				this.modalShow = true
				setTimeout(() => {
					this.modalShow = false
				}, 10)
			},
			// 关闭对话框
			closeModalMsg() {
				this.modalShowMsg = false
				// this.returnType = ''
			},
			// 确定
			btnConfirmMsg() {
				// console.log(this.returnType)
				if (this.returnType === 'back') {
					this.isFirst = false
					this.isRadioEnable = false
					uni.navigateBack({
						delta: 1
					})
					switchTicketState(this.isRadioEnable)
				} else {
					let { taxpayerIdentificationNum, lowerLimit, upperLimit, name, goodsCode, vatRate, issuer } = this.ticketInfo
					if (!taxpayerIdentificationNum) {
						this.showToast('请输入纳税人识别号')
						return
					}
					if (!name) {
						this.showToast('请输入开票名称')
						return
					}
					if (!goodsCode) {
						this.showToast('请选择开票类型')
						return
					}
					if (!issuer) {
						this.showToast('请输入开票人名字')
						return
					}
					if (taxpayerIdentificationNum && name && goodsCode && issuer) {
						lowerLimit = lowerLimit === undefined ? -1 : lowerLimit
						upperLimit = upperLimit === undefined ? -1 : upperLimit
						vatRate = vatRate === undefined ? this.rateArr[this.curRate].split('%')[0] : vatRate
						uni.showLoading()
						createTicketSetting(taxpayerIdentificationNum, lowerLimit, upperLimit, name, goodsCode, vatRate, issuer).then(res => {
							this.showToast('创建成功')
							this.getTicketSetting()
							uni.hideLoading()
						}).catch(err => {
							// this.ticketInfo.taxpayerIdentificationNum = ''
							uni.hideLoading()
						})
					}
				}
			}
		},
		filters: {
			// 处理分和元
			dealWithMoney(money) {
				if (money === -1 || money === undefined) {
					return '∞'
				}
				if (money <= 0) {
					return 0
				}
				money /= 100
				return money
			}
		},
		onLoad() {
			// 查询开关状态
			this.getSwitchState()
		},
		onShow() {
			// 处理税率
			this.dealWithRate()
			// 
		},
		onBackPress() {
			if (this.isFirst && this.isRadioEnable) {
				this.content='电子发票尚未设置成功，是否放弃设置？'
				this.modalShowMsg = true
				this.returnType = 'back'
				// uni.showModal({
				// 	title: '提示',
				// 	content: '电子发票尚未设置成功，是否放弃设置？',
				// 	showCancel: true,
				// 	success: (res) => {
				// 		if (res.confirm) {
				// 			this.isFirst = false
				// 			this.isRadioEnable = false
				// 			uni.navigateBack({
				// 				delta: 1
				// 			})
				// 			switchTicketState(this.isRadioEnable)
				// 		}
				// 	}
				// })
				return true
			}
		}
	}
</script>

<style lang='scss'>
	uni-page-body {
		width: 100%;
		height: 100%;
	}
	
	.container-box {
		width: 100%;
		height: 100%;
		background-color: #F8F9FD;
		position: relative;
		box-sizing: border-box;
		top: 0;	
		left: 0;
		right: 0;
		
		.content-box {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			flex: 1;
			background-color: #FFF;
			position: relative;
			
			.item-box {
				width: 100%;
				height: 120upx;
				color: #333;
				font-size: 32upx;
				font-weight: 500;
				box-sizing: border-box;
				border-bottom: 1upx solid #F0F0F0;
				padding: 0 40upx;
				
				input {
					width: 400upx;
					color: #333;
					text-align: right;
				}
				
				.input {
					color: #333;
					font-size: 32upx;
					font-weight: 500;
				}
				
				.placeholder {
					color: #CCC;
				}
				
				image, .image {
					width: 11upx;
					height: 20upx;
				}
				
				picker {
					width: 400upx;
					
					.ggcontent {
						width: 400upx;
					}
				}
				
				.andy {
					width: 500upx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					text-align: right;
				}
			}
			
			.btn-box  {
				width: 100%;
				padding-top: 100upx;
				
				.create-btn {
					width: 320upx;
					height: 80upx;
					box-sizing: border-box;
					background-color: #4BA8FF;
					border-radius: 50upx;
					border: 1upx solid #4BA8FF;
					color: #FFF;
					font-size: 32upx;
					font-weight: 500;
					
					&.active {
						background-color: #FFF;
						color: #4BA8FF;
					}
					
					&:active {
						opacity: 0.8;
					}
				}
			}
		}
		
		&__cover {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 10000;
			
			.picker-box {
				width: 100%;
				height: 420upx;
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				
				.menu {
					width: 100%;
					height: 99upx;
					background-color: #F6F6F6;
					color: #999999;
					font-size: 36upx;
					font-weight: 500;
					
					.active {
						color: #007AFF;
					}
				}
				
				.panel {
					width: 100%;
					height:100%;
					flex: 1;
					background-color: #FFF;
					color: #999999;
					font-size: 24upx;
					line-height: 1.8;
					font-weight: 500;
					text-align: left;
					
					input {
						width: 250upx;
						height: 88upx;
						border-radius: 12upx;
						border: 1upx solid #F0F0F0;
						color: #333;
						font-size: 36upx;
						font-weight: 500;
						text-align: center;
					}
					
					.placeholder {
						color: #999999;
					}
					
					.tips {
						/* color: #999999;
						font-size: 24upx;
						line-height: 1.8;
						font-weight: 500;
						text-align: left; */
					}
				}
			}
		}
	}
</style>
