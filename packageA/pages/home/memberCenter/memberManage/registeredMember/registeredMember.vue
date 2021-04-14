<template>
	<view>
		<view class="margin-top margin-bottom">
			<uni-list>
				<view class="cu-form-group" @click="showModal('name')">
					<view class="title">姓名</view>
					<view>
						<text class="text-grey">{{name? name : "请输入会员姓名"}}</text>
						<text class="icon-right text-grey"></text>
					</view>
				</view>
				<view class="cu-form-group" @click="showSexOnePicker">
					<view class="title">性别</view>
					<view>
						<text class="text-grey">{{ sex === 1? '男': sex === 2? '女' : '请选择会员性别'}}</text>
						<text class="icon-right text-grey"></text>
					</view>
				</view>
				<view class="cu-form-group" @click="showModal('phone')">
					<view class="title">手机号</view>
					<view>
						<text class="text-grey">{{phone? phone:'请输入会员手机号'}}</text>
						<text class="icon-right text-grey"></text>
					</view>
				</view>
				<!-- <view class="cu-form-group">
					<view class="title">验证码</view>
					<input type="text" v-model="code">
					<view class="shadow lf-btn-getCode" v-if="isCode" @click="getPhoneVerificationCode"><text>获取验证码</text></view>
					<view class="shadow lf-btn-getCode" v-else><text>{{codeTime}}s后可重新发送</text></view>
				</view> -->
			</uni-list>
		</view>
		<view class="cu-form-group">
			<view class="title">生日</view>
			<picker class="text-grey" mode="date" :value="date" start="1900-01-01" end="" @change="DateChange">
				<view class="picker">
					{{date ? date : '请选择生日'}}
				</view>
			</picker>
		</view>
		<view class="padding align-left">
			<!-- <view class="meat mr-20 icon-sm">
				<image @click="changeAgreementOfConsent" class="icon-sm" v-if="isAgreementOfConsent" src="/static/login/icon_check_click.png"></image>
				<image @click="changeAgreementOfConsent" class="icon-sm" v-else src="/static/login/icon_check_noclick.png"></image>
			</view>
			<view class="meat align-left" >我同意<view class="text-blue ml-20" @click="jumpMemberAgreement">《会员协议服务》</view></view> -->
			<view 
				class="checkbox align-left"
				@click="changeAgreementOfConsent">
				<view class="checkbox__inner align-center">
					<view 
						class="iconfont icon-gou" 
						v-if="isAgreementOfConsent">
					</view>
				</view>
				<view class="align-left">
					<view class="ml-20">
						我同意
					</view>
					<view
						class="text-blue ml-10"
						@click="jumpMemberAgreement">
					   《会员协议服务》
					</view>
				</view>
			</view>
		</view>
		<!-- picker-性别 -->
		<wzp-picker ref="wzpPickerSex" :mode="modeSex" :pickerList="pickerListSex" :defaultIndex="defaultIndexSex"  @onConfirm="onConfirmSex"></wzp-picker>
		<!-- 模态框 -->
		<neil-modal :show="modalShow" @close="closeModal" :title="modalType | modalTitleFilters" auto-close="false" @confirm="bindBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<input class="lf-modal-input" type="text" cursor-spacing="50" v-model="modalInput" maxlength="16" v-if="modalType === 'name'">
				<input class="lf-modal-input" type="number" v-model="modalInput" maxlength="11" v-if="modalType === 'phone'">
			</view>
		</neil-modal>
	</view>
</template>

<script>
	import {getMemberPhoneCode, addMember} from '../../../../../../api/vueAPI.js'
	import { uniList, uniListItem } from '@dcloudio/uni-ui'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import wzpPicker from "@/components/wzp-picker/wzpPicker.vue";
	export default {
		components: {uniList, uniListItem, neilModal, wzpPicker},
		data() {
			return {
				date: '',		//生日当前日期
				isAgreementOfConsent: false,
				name: '',
				sex: '',
				phone: '',
				code: '',
				modalType: 'name',	//当前模态框类型
				modalShow: false,	//模态框显示
				modalInput: '',		//模态框输入
				modalTitle: '',		//模态框标题
				/* picker~ */
				pickerValue: "",
				mode: '',
				pickerList: [],
				defaultIndex: [],
				pickerValueSex: "",
				modeSex: '',
				pickerListSex: [],
				defaultIndexSex: [],
				/* ~picker */
				isCode: true,
				codeTime: 0,
			}
		},
		onNavigationBarButtonTap (obj) {
			// console.log("点击导航栏btn")
			if(this.isAgreementOfConsent === false){
				uni.showToast({
					title:"请同意《会员协议服务》",
					icon:'none'
				})
				return
			}
			// if(this.name.trim() === '' || this.sex === '' || this.phone === '' || this.date === ''|| this.code === '' ){
				if(this.name.trim() === '' || this.sex === '' || this.phone === '' || this.date === ''){
				uni.showToast({
					title:"有未填的信息",
					icon:'none'
				})
				return
			}
			// addMember( this.phone, this.name.trim(), this.date, this.sex, this.code).then(res => {
			addMember( this.phone, this.name.trim(), this.date, this.sex).then(res => {
				// console.log(res)
				uni.showToast({
					title:res.msg,
					icon:'success',
					complete() {
						uni.navigateBack()
					}
				})
			}).catch(err => {
				// console.log(err)
			})
		},
		filters:{
			modalTitleFilters(val) {
				switch(val) {
					case 'name':
						return "会员姓名"
					case 'phone':
						return "会员手机号码"
					default:
						return "暂无"
				}
			}
		},
		methods: {
			DateChange(e) {
				this.date = e.detail.value
			},
			/* 记住密码点击事件 */
			changeAgreementOfConsent () {
				/* 更改图标显示 */
				if(this.isAgreementOfConsent){
					this.isAgreementOfConsent = false;
				}else{
					this.isAgreementOfConsent = true;
				}
			},
			/* 跳转会员协议页面 */
			jumpMemberAgreement() {
				uni.navigateTo({
					url: '/packageA/pages/home/memberCenter/memberManage/memberServiceAgreement/memberServiceAgreement'
				})
			},
			/* 获得手机验证码 */
			getPhoneVerificationCode() {
				// console.log("获得手机验证码")
				uni.showLoading()
				if(this.phone.trim() === ''){
					uni.hideLoading()
					uni.showToast({
						title:"未输入手机号",
						icon:'none'
					})
					return
				}
				getMemberPhoneCode(this.phone.trim()).then(res => {
					// console.log(res)
					/* 发送成功，进入60秒计时才可重新发送 */
					this.codeTime = 60;
					this.isCode = false;
					let clock = setInterval(() => {
						this.codeTime--;
						if(this.codeTime < 0){
							clearInterval(clock)
							this.isCode = true;
						}
					},1000)
					uni.hideLoading()
					uni.showToast({
						title:res.msg,
						icon: 'none'
					})
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
				})
			},
			/* 打开模态框类型 */
			showModal(type) {
				this.modalType = type;
				if(this.modalType === ''){
					return
				}
				switch(this.modalType){
					case 'name':
						this.modalInput = this.name
						break
					case 'phone':
						this.modalInput = this.phone
						break
				}
				this.modalShow = true;
			},
			/* 模态框点击事件 */
			bindBtn(type) {
				if(type === 'confirm'){
					switch(this.modalType){
						case 'name':
							this.name = this.modalInput
							break
						case 'phone':
							let res = /^1(3|4|5|6|7|8|9)\d{9}$/.test(this.modalInput)
							if (res === false) {
								uni.showToast({
									title: '请输入正确的11位移动手机号码',
									icon: 'none'
								})
							} else {
								this.phone = this.modalInput
							}
							break
					}
				}
			},
			/* 模态框关闭触发事件 */
			closeModal(){
				this.modalShow = false;
			},
			/* 显示性别picker */
			showSexOnePicker() {
				this.modeSex = 'one';
					this.pickerListSex = this.pickerListSex = [{
							label: "男"
						},
						{
							label: "女"
						}
					];
				this.defaultIndexSex = [0];
				this.$refs.wzpPickerSex.showPicker();
			},
			onConfirmSex(e) {
				if (this.modeSex == "one") {
					this.pickerValueSex = this.pickerListSex[e[0]].label;
					switch(this.pickerValueSex){
						case '男':
							this.sex = 1
							break
						case '女':
							this.sex = 2
							break
					}
					// console.log(this.sex)
				}
			},
		},
		onBackPress() {
			if (this.$refs.wzpPicker.pickerShow) {
				this.$refs.wzpPicker.closePicker();
				return true;
			}
		},
	}
</script>

<style lang="scss">
	body{
		background-color: #F1F1F3;
	}
	.lf-btn-getCode{
		width: 250upx;
		height: 60upx;
		border-radius: 30upx;
		border: 1upx solid #4BA8FF;
		color: #4BA8FF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
	.icon-sm{
		width: 30upx;
		height: 30upx;
	}
	.margin-right-20{
		margin-right: 20upx;
	}
	.lf-modal-input{
		border: 1upx solid #DDDDDD;
		border-radius: 10upx;
		padding: 0 20upx;
	}
	.neil-modal__container{
		top: 40% !important;
	}
	.text-blue {
		color: #4BA8FF;
	}
	.checkbox {
		
		&__inner {
			width: 40upx;
			height: 40upx;
			box-sizing: border-box;
			border-radius: 8upx;
			border: 1upx solid #ddd;
			color: #4BA8FF;
		}
	}
</style>
