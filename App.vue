<script>
	export default {
		globalData: {
			client: null,
		},
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			console.log('App Show')
			//#ifdef APP-PLUS
			//设置屏幕常亮
			plus.device.setWakelock(true)
			uni.setKeepScreenOn({
			    keepScreenOn: true
			})
			plus.android.requestPermissions(['android.permission.WAKE_LOCK'], function(e){  
				if(e.deniedAlways.length>0){    //权限被永久拒绝  
					// 弹出提示框解释为何需要权限，引导用户打开设置页面开启  
					console.log('权限被永久拒绝'+e.deniedAlways.toString());  
				}  
				if(e.deniedPresent.length>0){   //权限被临时拒绝  
					// 弹出提示框解释为何需要权限，可再次调用plus.android.requestPermissions申请权限  
					console.log('权限被临时拒绝'+e.deniedPresent.toString());  
				}  
				if(e.granted.length>0){ //权限被允许  
					console.log('权限被允许'+e.granted.toString());  
				}  
			}, function(e){  
					 console.log('Request Permissions error:'+JSON.stringify(e));  
			});
			var g_wakelock = null;
			var main = plus.android.runtimeMainActivity();  
			var Context = plus.android.importClass("android.content.Context");  
			var PowerManager = plus.android.importClass("android.os.PowerManager");  
			var pm = main.getSystemService(Context.POWER_SERVICE);  
			g_wakelock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ANY_NAME");
			g_wakelock.acquire();
			//#endif
			uni.setStorageSync('isAppShow', true)
		},
		onHide: function () {
			console.log('App Hide')
			uni.setStorageSync('isAppShow', false)
		}
	}
</script>

<style>
	/*每个页面公共css */
    @import "./common/colorui/main.css";
    @import "./common/colorui/icon.css";
	@import url("./static/assets/iconfont/iconfont.css");
	/* 2.8.11 */
	/* @import "./static/assets/iconfont/iconfont.css" */
    /* @import "./common/uni.css"; */
	/* 
	 * 羊肉串居中法
	 *	 使用情况：用于图文处于一排出现的上下不对齐情况
	 *	 使用方法：同级创建一view，设置高度并挂载.prod；给要居中的对象挂载.meat
	 *	 扩展：middle可更换成top/bottom而设为上对齐/下对齐
	 */
	.prod{
		display: inline-block;
		vertical-align: middle;
	}
	.meat{
		display: inline-block;
		vertical-align: middle;
	}
</style>
<!-- 2.8.11 -->
<style lang="scss">
	@import "./static/assets/css/index.scss";
</style>