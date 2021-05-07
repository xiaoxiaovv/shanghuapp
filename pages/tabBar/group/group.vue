<template>
	<view>
		<view class="user-info" >
			<view class="lf-member-bg">
				<image 
					class="match-parent" 
					src="../../../static/homev2/bg.png"
					mode="scaleToFill"/>
			</view>
			<view class="user-info__cover box align-default plr-30 ">
				<view class="lf-content-head box ">
					
							<text class="" @click="jumpToShare">分享</text>
					
				</view>
				<view class="lf-content-panel ptb-30 mt-20">
					<view>
						<view class="lf-panel-money   align-center mb-20">
							<view @click="jumpstorageDetails">
								<text class="text-gray">团队成员（人）</text>
								<text class="text-xxl mt-10">{{groupUsersInfo.countAll? groupUsersInfo.countAll:'0'}}</text>
							</view>
						</view>
						<view class="lf-panel-money flex  mb-20 ">
							<view @click="jumpstorageDetails">
								<text class="text-gray">直接下级</text>
								<text class="text-xxl mt-10">{{groupUsersInfo.countPush? groupUsersInfo.countPush:'0'}}</text>
							</view>
							<view @click="jumpstorageDetails">
								<text class="text-gray">间接下级</text>
								<text class="text-xxl mt-10">{{groupUsersInfo.balance? groupUsersInfo.balance:'0'}}</text>
							</view>
							<!-- <view @click="jumpintegralDetails">
								<text class="text-gray">直接推荐佣金（元）</text>
								<text class=" text-xxl mt-10">{{groupUsersInfo.scores? groupUsersInfo.scores:'0'}}</text>
							</view> -->
						</view>
						<!-- <view class="lf-panel-money flex lf-panel-money__bottom pb-10">
							<view @click="jumpstorageDetails">
								<text class="text-gray">间接下级</text>
								<text class="text-xxl mt-10">{{groupUsersInfo.balance? groupUsersInfo.balance:'0'}}</text>
							</view>
							
							<view @click="jumpintegralDetails">
								<text class="text-gray">间接推荐佣金（元）</text>
								<text class="text-xxl mt-10">{{groupUsersInfo.scores? groupUsersInfo.scores:'0'}}</text>
							</view>
						</view> -->
						<!-- 列表 -->
						
						
						
					</view>
				</view>
			</view>
			
		</view>
		<view class="match-width" style="height: 440upx;"></view>
		<mescroll-uni class="plr-40"  @down="downCallback" :up="mescrollUp" @up="upCallback"  @init="mescrollInit">
			<!-- <view class="" v-for="user in groupUsersInfo.userDetail" :key="user.id">
				1233333
			</view>
			<view class="match-width" v-for="user in groupUsersInfo.userDetail" :key="user.id">
				1233444
			</view>
			
			<view class="match-width" v-for="user in groupUsersInfo.userDetail" :key="user.id">
				1233555
			</view>
			<view class="match-width" v-for="user in groupUsersInfo.userDetail" :key="user.id">
				1233555666
			</view>
			<view class="match-width" v-for="user in groupUsersInfo.userDetail" :key="user.id">
				1233555666777
			</view>
			<view class="" v-for="user in groupUsersInfo.userDetail" :key="user.id">
				1233555666777888
			</view> -->
		<view v-for="user in groupUsersInfo.userDetail" :key="user.id" class="lf-orderList match-width align-left ptb-10 border-bottom-line" >
			<view class="match-left-space align-ver-left"> 			
				<view class="match-width align-hor-bet">
					<view>{{user.realName}}</view>
					<view class="ly-font-weight-500 ly-font-size-28">等级：{{user.levelName}}</view>
				</view>
				<view class="ly-font-color-9 ly-font-size-24 match-width mt-10 align-hor-bet">
					<view>{{user.pushType===1?'直推':'间推'}}</view>
					<view>{{user.mobile}}</view>
							
				</view>
			</view>
		</view>
		
		</mescroll-uni>
		<!-- 模态框 -->
		<neil-modal :show="modalShow" @close="closeModal" title="昵称修改" auto-close="false" @confirm="bindBtn('confirm')">
			<view style="min-height: 90upx;padding: 32upx 24upx;">
				<input class="lf-modal-input" type="text" v-model="modalInput" maxlength="16">
			</view>
		</neil-modal>
	</view>
</template>

<script>
	import MescrollUni from "mescroll-uni/mescroll-uni.vue";
	import { changeMember, baseURL, userFilesUpload, getImgThumbnail, getGroupUsersInfo } from '../../../api/vueAPI.js'
	import { uniList } from '@dcloudio/uni-ui'
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	
	export default {
	
		components: {uniList, neilModal, MescrollUni},
		data() {
			return {
				mescroll: null,
				mescrollUp: {
					empty: {
						icon: "../../../static/order/no-data.png", //图标,默认null,支持网络图
						tip: "暂无相关数据~" //提示
					}
				},
				id: '',
				nickname: '',
				groupUsersInfo: '',
				modalShow: false,	//模态框显示
				modalInput: '',		//模态框输入
				imgSrc: '',
				avatar: '',
				ispPhotoUpload: false	//onShow检查true时，上传图片
			}
		},
		onLoad(obj) {
			if(obj.id){
				this.id = obj.id;
				// this.groupUsersInfo();
			}
		},
		onShow() {
			mescroll.resetUpScroll()
		},
		methods: {
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调*/
			downCallback(mescroll){
				mescroll.resetUpScroll() // 重置列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			},
			upCallback(mescroll) {
				getGroupUsersInfo().then(res=>{
					this.groupUsersInfo = res.data
					mescroll.endBySize(res.data.userDetail.length, res.data.countAll)
				});
				
				
			},
			jumpToShare(){
				uni.navigateTo({
					url: '/pages/group/share'
				})
			},
			getGroupUsersInfo(){
				/* getGroupUsersInfo().then(res=>{
					this.groupUsersInfo = res.data
				}); */
			},
			
			
			/* 昵称模态框 */
			showNickNameModal() {
				this.modalShow = true;
			},
			/* 模态框点击事件 */
			bindBtn(type) {
				if(type === 'confirm'){
					if(this.modalInput.trim() === ''){
						uni.showToast({
							title:"不能为空",
							icon:"none"
						})
						return
					}
					this.nickname = this.modalInput
					// this.groupUsersInfo.nickname = this.modalInput
					this.changeMember();
				}
			},
			/* 模态框关闭触发事件 */
			closeModal(){
				this.modalShow = false;
			},
			/* 生日修改 */
			DateChange(e) {
				this.groupUsersInfo.birthday = e.detail.value;
				this.changeMember();
			},
			/* 头像修改 */
			/* 进行图片上传操作 */
			photoUpload() {
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success(res) {
						const src = res.tempFilePaths[0];
			
						uni.navigateTo({
							url: '../../../upload/upload?src=' + src
						})
					}
				});
			}
		},
		filters: {
		},
		onShow() {
			
			// console.log("onShow~")
			if(this.ispPhotoUpload){
				let that = this;
				/* 预览图显示 */
				this.imgSrc = this.avatar
				uni.showLoading()
				//图片上传服务器（flyio出错，换用uni接口）
				// console.log('上传的头像', this.imgSrc)
				// userFilesUpload(this.avatar).then(res => {
				// 	console.log('rersresres:::::', res)
				// })
				uni.uploadFile({
					url: baseURL +'/fms/upload/files_upload/file/user',
					filePath: that.avatar,
					name: 'files',
					// formData: { token: token},
					success: res => {
						// console.log('uploadImage success, res is:', res);
						/* 将图片id保存 */
						let head = JSON.parse(res.data).obj
						that.groupUsersInfo.head = baseURL + '/fms/upload/resource/thumbnail/' + head
						uni.hideLoading()
						that.changeMember()
					}, 
					fail: err => {
						console.log('uploadImage fail', err);
						uni.hideLoading();
						// uni.showModal({
						// 	content: err.errMsg,
						// 	showCancel: false
						// });
					},
					complete: () => {
						// console.log('complate');
					}
				});
				/* 关闭图片更新指示 */
				this.ispPhotoUpload = false
			}
			
		}
	}
</script>

<style lang="scss">
	.lf-time-show {
		
		width: 100%;
		padding: 0 22upx;
		font-size: 32upx;
		color: #666;
		background-color: #F8F9FD;
		// background-color: rgba(100, 100, 100, 0.1);
		
		
	}
	.border-bottom-line{
		border-bottom: 1upx solid #F1F1F3;
	}
	.page-membership {
		width: 100%;
		height: 100%;
		// background-color: #F8F9FD;
		font-weight: 500;
		font-size: 24upx;
		color: #333333;
	}
	.user-info {
		width: 100%;
		height: 550upx;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		&__cover {
			width: 100%;
			position: absolute;
			top: 40upx;
				
			.mark {
				color: #4BA8FF;
			}
		}
	}
	.lf-member-bg{
		width: 100%;
		height: 366upx;
	}
	.lf-content-head{
		width: 100%;
		height: 80upx;
		font-size: 1rem;
		
		color: #fff;
		text-align: right;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.lf-head-img{
		width: 110upx;
		height: 110upx;
		// background-color: #ffbf7b;
		
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lf-head-img image{
		width: 110upx;
		height: 110upx;
		border-radius: 50%;
	}
	.lf-head-text{
		
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		color: #FFF;
		font-size: 24upx;
		
		.phone {
			font-size: 34upx;
		}
		
		image {
			width: 28upx !important;
			height: 28upx !important;
		}
	}
	.lf-head-text > view{
		width: 100%;
		height: 60upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-head-text image{
		width: 40upx;
		height: 40upx;
	}
	.lf-content-panel{
		// margin: 0 3%;
		width: 100%;
		// height: 400upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26upx;
		background: #FFF;
		box-shadow: 0 15upx 15upx 0 rgba(141, 141, 141, 0.2);
		border-radius: 12upx;
	}
	.lf-content-panel > view{
		// width: 86%;
		// height: 120upx;
		// display: flex;
		// flex-wrap: wrap;
	}
	.lf-panel-money{
		width: 100%;
		height: 60%;
		padding-left: 6%;
		padding-right: 6%;
		// border-bottom: 1upx solid #E6E6E6;
		position: relative;
		text {
			color: #666;
		};
		&__bottom{
			border-bottom: 1upx solid #E6E6E6;
		}
	}
	.lf-panel-money view{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		text-align: center;
		width: 260upx;
		height: 90upx;
	}
	/* .lf-panel-money .line1{
		width: 1upx;
		height: 60upx;
		background-color: #E6E6E6;
		position: absolute;
		top: calc(50%-30upx);
		left: 33.3%;
	}
	.lf-panel-money .line2{
		width: 1upx;
		height: 60upx;
		background-color: #E6E6E6;
		position: absolute;
		top: calc(50%-30upx);
		left: 66.6%;
	} */
	.lf-panel-recharge{
		width: 100%;
		height: 40%;
		display: flex;
		justify-content: space-between;
		font-size: 32upx !important;
	}
	.lf-panel-recharge image{
		width: 60upx;
		height: 60upx;
	}
	.lf-content-information{
		width: 100%;
		font-size: 28upx;
		color: #333;
		
		.cu-form-group {
			// border-bottom: 1upx solid #DDD;
			background-color: #FFF;
		}
		
		.icon-right {
			color: #999;
			font-size: 28upx !important;
		}
	}
	.lf-modal-input{
		border: 1upx solid #DDDDDD;
		border-radius: 10upx;
		padding: 0 20upx;
	}
	.cu-form-group uni-picker::after {
		font-size: 28upx;
	}
</style>
