<template>
	<view class='container-box'>
		<view class='content-box'>
			<view class='header-box align-left'>按名称查询</view>
			<view class='search-box align-hor-bet plr-40'>
				<view class='match-left-space align-left box pr-30'>
					<!-- @blur="onSearchBlur" -->
					<input
						type="text"
						placeholder="请输入类目名称"
						placeholder-class="placeholder"
						v-model="likeName"
						@confirm='onSearch'
					/>
				</view>
				<view 
					class='image align-right'
					@click="onSearch">
					<image
						src='../../../../static/tabBar/dzfq-search.png'
					/>
				</view>
			</view>
			<view class='header-box align-left'>按类目选择</view>
			<view 
				class='panel-box'
				v-if="tmpDataList && tmpDataList.length">
				<view
					v-for="(item, index) in tmpDataList"
					:key="index"
					class='panel-box__item align-hor-bet'
					@click="onSearchItemClick(item)">
					<view class='item'>
						{{item.name}}
					</view>
					<image
						v-if="item.summaryItem"
						src='../../../../static/tabBar/icon_the_arrow.png'
					/>
				</view>
			</view>
			<view 
				class='panel-box'
				v-else>
				<view
					v-for="(item, index) in dataList"
					:key="index"
					class='panel-box__item align-hor-bet'
					@click="onItemClick(item)">
					<view class='item'>
						{{item.name}}
					</view>
					<image
						v-if="item.summaryItem"
						src='../../../../static/tabBar/icon_the_arrow.png'
					/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getClassifyData } from '../../../../api/vueAPI.js'
	
	export default {
		data() {
			return {
				likeName: '',
				dataList: [],
				isLast: false,
				level: 0,
				selectArr: [],
				type: 'query',
				tmpDataList: []
			}
		},
		methods: {
			// 按名称搜索
			onSearch() {
				this.onSearchBlur()
				if (this.likeName === '') {
					this.showToast('请输入内容')
				} else if (/^\s+$/.test(this.likeName)) {
					this.showToast('请输入内容')
					this.likeName = ''
				} else {
					uni.showLoading()
					getClassifyData(this.likeName).then(res => {
						if (res) {
							let result = res.obj
							this.tmpDataList = result
							if (result && result.length) {
								// let pages = getCurrentPages()
								// let curPage = pages[pages.length - 1]
								// let prevPage = pages[pages.length - 2]
								// let item = result[0]
								// if (curPage && prevPage) {
								// 	// TODO 
								// 	// prevPage.ticketInfo.taxExemptionType = result
								// 	// this.showToast('数据已经到底~')
								// 	this.selectArr = [
								// 		item
								// 	]
								// 	prevPage.selectArr = this.selectArr
								// 	this.level = -1
								// 	uni.navigateBack({
								// 		delta: 1
								// 	})
								// }
							} else {
								this.showToast('查询无结果，请输入最后的类目名称再重新搜索')
								this.tmpDataList = []
							}
						}
						uni.hideLoading()
					}).catch(err => {
						// nothing to do 
						uni.hideLoading()
					})
				}
				// console.log(this.selectArr)
			},
			// 消息提示
			showToast(title) {
				uni.showToast({
					title,
					icon: 'none'
				})
			},
			// item项点击
			onItemClick(item) {
				if (item) {
					if (item.summaryItem) {
						this.getClassifyData(item)	
					} else {
						// this.showToast('数据已经到底~')
						this.selectArr = [
							...this.selectArr,
							item
						]
						let pages = getCurrentPages()
						// console.log('pages', pages)
						let curPage = pages[pages.length - 1]
						let prevPage = pages[pages.length - 2]
						// console.log(prevPage)
						if (curPage && prevPage) {
							prevPage.selectArr = this.selectArr
							prevPage.$vm.selectArr = this.selectArr
						}
						this.level = -1
						uni.navigateBack({
							delta: 1
						})
					}
				}
			},
			// 按搜索的类目点击
			onSearchItemClick(item) {
				let pages = getCurrentPages()
				let curPage = pages[pages.length - 1]
				let prevPage = pages[pages.length - 2]
				if (curPage && prevPage) {
					this.selectArr = [
						item
					]
					prevPage.selectArr = this.selectArr
					prevPage.$vm.selectArr = this.selectArr
					this.level = -1
					uni.navigateBack({
						delta: 1
					})
				}
			},
			// 搜索失焦
			onSearchBlur() {
				this.likeName = this.likeName.trim()
				if (!this.likeName) {
					this.tmpDataList = []
				}
			},
			// 获取列表项数据
			getClassifyData(item) {
				let parentCode = ''
				if (item) {
					this.selectArr = [
						...this.selectArr,
						item
					]
					parentCode = item.goodsCode
				}
				uni.showLoading()
				getClassifyData('', '', parentCode, this.level).then(res => {
					if (res) {
						this.level++
						this.dataList = res.obj	
					}
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				})
			}
		},
		onLoad() {
			this.getClassifyData()
		},
		// 返回按钮监听
		onBackPress() {
			if (this.level > 1) {
				let level = this.level - 2
				let node = this.selectArr[this.selectArr.length - 1]
				let parentCode = node.parentCode
				this.selectArr = this.selectArr.slice(0, -1)
				this.level = this.level - 1
				getClassifyData('', '', parentCode, level).then(res => {
					if (res) {
						this.dataList = res.obj
					}
				})
				return true
			}
		}
	}
</script>

<style lang='scss'>
	body {
		width: 100%;
		height: 100%;
	}
	
	uni-page-body {
		width: 100%;
		height: 100%;
	}
	
	.container-box {
		width: 100%;
		height: 100%;
		background-color: #F8F9FD;
		/* position: relative; */
		box-sizing: border-box;
		
		.content-box {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			/* background-color: #FFF; */
			/* position: relative; */
			
			.search-box {
				width: 100%;	
				height: 120upx;
				background-color: #FFF;
				box-sizing: border-box;
				font-size: 32upx;
				font-weight: 500;
				
				image {
					width: 37upx;
					height: 37upx;
				}
				
				.image {
					height: 100%;
					width: 100upx;
				}
				
				input, .input {
					width: 100%;
					color: #333;
					text-align: left;
				}
				
				.placeholder {
					color: #CCC;
				}
			}
			
			.header-box {
				width: 100%;
				height: 100upx;
				box-sizing: border-box;
				padding: 0 30upx;
				color: #999;
				font-size: 30upx;
				font-family: 500;
			}
			
			.panel-box {
				width: 100%;
				flex: 1;
				box-sizing: border-box;
				
				&__item {
					width: 100%;
					height: 120upx;
					border-bottom: 1upx solid #F0F0F0;
					background-color: #FFF;
					padding: 0 40upx;
					font-size: 32upx;
					color: #333;
					font-weight: 500;
					box-sizing: border-box;
					
					image {
						width: 11upx;
						height: 20upx;
					}
					
					.item {
						width: 600upx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}
	}
			
</style>
