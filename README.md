## 航邦掌柜
### 2.8.11不能使用icon图标，例如对勾选择等，所以需要使用2.3.3

小程序项目配置： 分支 xiao_cheng_xu_xiao_lian_fu
微信上线发布后约需要半小时到一小时能搜索到
打包后，微信小程序：iconfont.js 内容清空  否则体验版和生产版本打开白屏 ！！！！！！！
必须删除hbuilder插件，代码里的引用也需要删除
packageA分包，包内的项目所有涉及到的文件夹例如/pages/home  /pages/user 都需要替换成/packageA/pages/home格式（外边的pages文件夹里的也需要替换）；packageA包里的../static静态资源目录，需要换成../../static目录，packageA里不需要static，packageA里边对于外边的资源引用也需要加../，跳出来访问目录，例如common；图片start文件夹需要删除，home和homes文件夹里的压缩图片已在E:\银通\app各个公司用户app\银通\支付宝小程序进行了备份，打包完直接替换掉（可能新加的图片这里没有），
pages.json配置 "subPackages": [{
		"root": "packageA",
		"pages": [{
			"path": "pages/home/memberCenter/index/index",
			"style": {
				"navigationBarTitleText": "会员",
				"app-plus": {
					"bounce": "none"
				}
			}
		}
logo尺寸  72 96 144 192
支付宝小程序：高度改为window  升级秘钥修改
体验版或者调试版，微信点击三个点，滑动至最右侧，点击调试，可看控制台信息
微信小程序和支付宝小程序：在商户app项目的xiaochengxu分支上打包；图片需要更换
管理台配置域名，配置完半小时到2小时内生效