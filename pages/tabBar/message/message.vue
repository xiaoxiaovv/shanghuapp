<template>
	<view style="background-color: #f1f1f1;height:100%;padding: 12px 0;">
		<view v-for="(item, i) in noticeList" :key="i">
			<uni-card
			    :title="item.title" 
			    mode="basic" 
			    :is-shadow="true" 
			    :thumbnail="noticeUrl" 
			    :extra="item.createTime"
			>
				<mp-html :content="item.content" />
			</uni-card>
		</view>
	</view>
</template>

<script>
	import { getNoticeList } from '../../../api/vueAPI.js'
	import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'
	export default {
		data() {
			return {
				noticeUrl: require('../../../static/user/icon_message_bg.png'),
				noticeList: [],
			};
		},
		components: {
		 mpHtml
		},
		onShow() {
			this.getNoticeList()
		},
		methods: {
			getNoticeList() {
				const params = {
					type: 5,
					createType: 4,
					pageNumber: 1,
					pageSize: 10,
				}
				getNoticeList(params).then(res => {
					console.log(res)
					if (res.code === 200) {
						this.noticeList = res.obj.content
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	uni-page-body {
		width: 100%;
		height: 100%;
	}
</style>
