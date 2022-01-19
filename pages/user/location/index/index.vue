<template>
	<view>
		<view class='content-box align-default'>
			<view class="lo-box" v-if="!shopAddress">正在定位中....</view>
			<view class="lo-box" v-if="shopAddress">您当前定位地址为：<text style="font-weight: bold;">{{shopAddress}}</text></view>
			<view class="lf-change-btn">
				<view class="btn" @click="changePassword">
					<text class="text-lg">提交定位位置</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getGaoDeKey, updateLocation } from '../../../../api/vueAPI.js'
	//#ifndef MP-WEIXIN
	import AMapLoader from '@amap/amap-jsapi-loader';
	//#endif
	export default {				
		data() {
			return {
				gdWebKey: "",
				geolocation: null,
				geocoder: null,
				shopAddress: '',
				lng: '',
				lat: ''
			}
		},
		onLoad() {
			this.getGaoDeKey()
		},
		onShow() {
			
		},
		methods: {
			getGaoDeKey () {
				const params = {
					companyId: uni.getStorageSync('customerCount').serviceId
				}
				uni.showLoading({
					mask:true
				})
				getGaoDeKey(params).then(res => {
				  this.gdWebKey = res.obj.gdWebSideKey;
				  this.initMap();
				}).catch(err => {
					uni.hideLoading()
				})
			},
			initMap(){
				//#ifndef MP-WEIXIN
				AMapLoader.load({
					"key":this.gdWebKey,
					"version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
					"plugins": ['AMap.Geocoder', 'AMap.Geolocation'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
					"AMapUI": {             // 是否加载 AMapUI，缺省不加载
					  "version": '1.1',   // AMapUI 缺省 1.1
					  "plugins":[],       // 需要加载的 AMapUI ui插件
					},
					"Loca":{                // 是否加载 Loca， 缺省不加载
					  "version": '1.3.2'  // Loca 版本，缺省 1.3.2
					},
				}).then((AMap)=>{
					this.geocoder = new AMap.Geocoder({
					  city: "", //城市，默认：“全国”
					});
					this.geolocation = new AMap.Geolocation({
					  enableHighAccuracy: true, // 是否使用高精度定位，默认:true
					  timeout: 20000, // 超过10秒后停止定位，默认：5s
					})
					this.getPosition()
				}).catch(e=>{
					uni.hideLoading()
					console.log(e);
				})
				//#endif
			},
			getPosition() {
				this.geolocation.getCurrentPosition((status, result) => {
				  if (status == 'complete') {
				    console.log('获取坐标================',result.position.lng+','+result.position.lat)
					this.lng = result.position.lng
					this.lat = result.position.lat
				    this.geocoder.getAddress([result.position.lng, result.position.lat], (status, result)=> {
				      if (status === 'complete'&&result.regeocode) {
						  uni.hideLoading()
				        let address = result.regeocode.formattedAddress;
				        this.shopAddress = address
				
				        console.log('经纬度转地址==================',address)
				        // alert('经纬度转地址'+address)
				      }else{
						uni.hideLoading()
				        uni.showToast({
				        	title:'转地址失败'
				        })
				      }
				    });
				  } else {
					uni.hideLoading()
					uni.showToast({
						title:result.message
					})
				  }
				})
			},
			changePassword() {
				const params = {
					id: uni.getStorageSync('merchantId'),
					longitude: this.lng,
					latitude: this.lat,
					locationAddress: this.shopAddress
				}
				updateLocation(params).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title:res.msg,
							icon: 'success'
						})
					} else {
						uni.showToast({
							title:res.msg,
							icon: 'none'
						})
					}
				})
			},
		}
	}

</script>

<style lang='scss'>
.lf-change-btn{
	width: 750upx;
	height: 120upx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 100upx;
}
.lf-change-btn .btn{
	width: 690upx;
	height: 80upx;
	border-radius: 40upx;
	color: #FFF;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #4BA8FF;
}
.lo-box{
	padding: 60upx 40upx;
	font-size: 30upx;
}
</style>