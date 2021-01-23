<<template>
	<view class="quick-pay">
		<view class="solid"></view>
		<view class=" align-center">
		<view class="quickPay-bb width match-width align-center text-xl  ly-font-color-6 padding-tb-xs quick-pay-fw">
			<!-- <text class="text-price">aaa</text> -->
			确认付款
		</view>
		
			<view class="quickPay-bb text-price width match-width align-center  text-xl  ly-font-color-6 padding-tb-xs quick-pay-fw">
				200
			</view>
		
			<view class="quickPay-bb  width match-width  text-lg   ly-font-color-6 padding-tb-xs quick-pay-fw">
				<text class="">付款方式</text>
				
				<view class="fr arrow">
					<image
						class='match-parent'
						src='../../../static/homev2/right.png'
						mode='scaleToFill'
					/>
				</view>
				<text class="fr margin-right-xs">兴业银行</text>
			</view>
		
		</view>
		
	</view>
</template>
<script></script>
<style lang="scss">
	.quickPay-bb{
		border-bottom:1upx solid #f1f1f3;
	}
	.quick-pay-fw{
		font-weight:500;
	}
	.width{
		width: 90%;
	}
	.pr{
		position: relative;
	}
	.arrow {
		width: 14upx;
		height: 25upx;
		margin-top: 7upx;
	}
</style>