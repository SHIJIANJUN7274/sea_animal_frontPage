<template>
	<view>
		<view class="navBar">
			<view class="center">
				<!-- 输入框绑定搜索关键字，确认搜索 -->
				<input type="text" v-model="searchKey" placeholder="输入关键字" @confirm="search" />
				<!-- 搜索图标 -->
				<icon type="search" size="34rpx" color="#1296db"></icon>
			</view>
			<!-- 搜索按钮 -->
			<view class="right" @click="search">搜索</view>
		</view>
		<view class="colorBg"></view>
		<view class="goodsList">
			<!-- 商品列表 -->
			<view class="item" v-for="(item, index) in goodsList" :key="index" @click="toDetail(item.goodsId)">
				<!-- 商品图片 -->
				<image :src="item.image" mode="widthFix"></image>
				<view class="goodsName-price">
					<!-- 商品名称 -->
					<view class="goodsName">{{item.goodsName}}</view>
					<!-- 商品价格 -->
					<view class="price">
						<text class="yuan">￥</text>
						<!-- 商品价格整数部分 -->
						<text>{{item.price.toFixed(2).split('.')[0]}}.</text>
						<!-- 商品价格小数部分 -->
						<text class="decimal">{{item.price.toFixed(2).split('.')[1]}}</text>
						<!-- 商品销量 -->
						<text class="sales">已售{{item.sales}}件</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 加载更多组件 -->
		<uni-load-more :status="status" :icon-size="16" :content-text="contentText"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchKey: '', // 搜索关键字
				currentPage: 1, // 当前页码
				pageSize: 6, // 每页数量
				totalPage: 0, // 总页数

				goodsList: [], // 商品列表数据

				status: 'noMore', // 加载更多状态
				contentText: { // 加载更多文本提示
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				}
			};
		},
		onReachBottom() {
			// 滚动到底部触发加载更多
			if (this.currentPage < this.totalPage) {
				this.currentPage++;
				this.getPageQueryByGoods();
			} else {
				this.status = 'noMore';
			}
		},
		methods: {
			toBack() {
				// 返回上一页
				uni.navigateBack({
					delta: 1
				});
			},
			toDetail(id) {
				// 跳转到详情页
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + id
				});
			},
			getPageQueryByGoods() {
				const token = uni.getStorageSync("data");
				if (!token) {
					uni.showToast({
						icon: "none",
						title: "请先登录"
					});
					return;
				}
				this.status = 'contentrefresh';
				uni.request({
					url: "http://localhost:8080/goods/getPageQueryByGoods",
					method: "GET",
					data: {
						searchKey: this.searchKey,
						currentPage: this.currentPage,
						pageSize: this.pageSize
					},
					header: {
						'Authorization': token
					},
					success: res => {
						uni.stopPullDownRefresh();
						// 控制台输出关键字查询的数据（用JSON.stringify格式化，便于查看内容）
						console.log("关键字查询的数据有", JSON.stringify(res.data.data.records, null, 2));
						// 控制台输出总页数
						console.log("totalPage总页数", res.data.data.pages);

						// 业务处理
						const records = res.data.data.records || [];
						if (this.currentPage === 1) {
							this.goodsList = [];
						}
						for (var i = 0; i < records.length; i++) {
							this.goodsList.push(records[i]);
						}
						this.totalPage = res.data.data.pages;
						this.status = this.currentPage < this.totalPage ? 'contentdown' : 'noMore';
					},
					fail: () => {
						uni.showToast({
							title: "网络错误",
							icon: "none"
						});
						this.status = 'noMore';
					}
				});

			},
			search() {
				// 搜索商品
				this.goodsList = []; // 清空商品列表
				this.currentPage = 1; // 重置当前页码为1
				this.status = 'contentdown'; // 设置加载更多状态为可下拉加载
				this.getPageQueryByGoods(); // 调用获取商品列表数据方法
			}
		}
	};
</script>

<style lang="scss">
	.navBar {
		display: flex;
		height: 100rpx;
		background-color: white;
		align-items: center;
		padding: 0 30rpx;
		/* #ifdef MP-WEIXIN */
		padding-top: 150rpx;
		/* #endif */

		.left {
			flex: 1;
		}

		.center {
			position: relative;
			flex: 5;
		}

		.right {
			flex: 1;
			padding-left: 20rpx;
			text-align: center;
		}

		input {
			padding: 10rpx 0rpx;
			padding-left: 60rpx;
			border: 1rpx solid #ccc;
			border-radius: 50rpx;
			font-size: 30rpx;
		}

		icon {
			position: absolute;
			left: 20rpx;
			top: 16rpx;
		}
	}

	.colorBg {
		display: block;
		height: 300rpx;
		margin-bottom: -300rpx;
		border-radius: 0 0 50rpx 50rpx;
		background: linear-gradient(to bottom, #1296db, #f7f7f7);
	}

	.goodsList {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		margin: 0 20rpx;

		.item {
			box-sizing: border-box;
			margin-top: 25rpx;
			width: 345rpx;
			height: 500rpx;
			border-radius: 20rpx;
			background-color: white;
			overflow: hidden;

		}

		image {
			width: 100%;
			border-radius: 20rpx 20rpx 0 0;
		}

		.goodsName-price {
			padding: 15rpx 20rpx;

			.goodsName {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}

			.price {
				padding: 20rpx 0;
				font-size: 38rpx;
				font-weight: 700;
				color: red;
			}

			.yuan,
			.decimal {
				font-size: 32rpx;
			}

			.sales {
				color: #646566;
				margin-left: 10rpx;
				font-weight: normal;
				font-size: 28rpx;
			}
		}
	}

	.btm {
		padding: 35rpx;
		text-align: center;
		color: #ccc;
	}
</style>