<script>
	export default {
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			console.log('App Show')
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
