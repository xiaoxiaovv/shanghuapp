<template>
	<view>
		<!-- <uni-list>
			<uni-list-item v-for="(menu,key) in menuList"
			:title="menu.name" 
			:note="menu.remarks"
			:thumb="menu.image"
			@click="menuJump(menu.url)">
			</uni-list-item>
		</uni-list> -->
		<!-- <view class="lf-list">
			<view>
				<text>绑定设备</text>
				<text>{{QRcodeDetails.status ? QRcodeDetails.status:'未绑定'}}</text>
			</view>
		</view> -->
		<view v-for="(menu, key) in menuList">
			<!-- 菜单列表 -->
			<view class="lf-storeList" :class="[{'border-bottom-line': key !== menuList.length},{'border-top-line': key === 0}]" @click="menuJump(menu.url)">
				<view class="flex justify-start align-center">
					<image class="margin-right-20" :src="menu.image"></image>
					<view class="flex flex-direction justify-between height-100">
						<text class="text-lg">{{menu.name}}</text>
						<text class="text-grey text-sm">{{menu.remarks}}</text>
					</view>
				</view>
				<text class="text-llg icon-right text-grey"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import { uniList, uniListItem } from '@dcloudio/uni-ui'
	export default {
		components: { uniList, uniListItem },
		data() {
			return {
				menuList: [
					{
						image: '../../../../static/home/icon_member_manager.png',
						name: '会员管理',
						remarks: '增/删/改/查会员信息',
						url: '/packageA/pages/home/memberCenter/memberManage/index/index'
					},
					{
						image: '../../../../static/home/icon_integral_rule.png',
						name: '积分商城',
						remarks: '会员积分兑换商品/服务',
						url: '/packageA/pages/home/memberCenter/SHOP/index/index'
					},
					{
						image: '../../../../static/home/icon_member_analysis.png',
						name: '会员分析',
						remarks: '会员量/活跃积分',
						url: '/packageA/pages/home/memberCenter/memberAnalysis/memberAnalysis'
					},
					{
						image: '../../../../static/home/icon_member_consumption.png',
						name: '会员消费记录',
						remarks: '统计会员消费的交易流水',
						url: '/packageA/pages/home/memberCenter/membershipConsumptionRecords/membershipConsumptionRecords'
					},
				]
			};
		},
		methods:{
			/* 菜单跳转 */
			menuJump(url) {
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style>
	.text-llg{
		font-size: 36upx;
	}
	.lf-list{
		width: 750upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		align-items: center;
		background-color: #FFF;
	}
	.lf-list view{
		width: 720upx;
		height: 80upx;
		padding: 0 30upx 0 5upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-bottom-line{
		border-bottom: 1upx solid #D9D9D9;
	}
	.lf-storeList{
		width: 750upx;
		height: 120upx;
		background-color: #FFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30upx;
	}
	.lf-storeList image{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
	}
	.margin-right-20{
		margin-right: 20upx;
	}
	.height-100{
		height: 80upx;
	}
	.border-bottom-line{
		border-bottom: 1upx solid #bdbdc6;
	}
	.border-top-line{
		border-top: 1upx solid #bdbdc6;
	}
</style>
