<template>
	<view>
		<view class="navBar">
			<view class="left">海洋生物用户端</view>
			<view class="right" @click="toSearch">
				<input type="text" value="" placeholder="输入关键词" />
				<icon type="search" size="34rpx" color="#1296db"></icon>
			</view>
		</view>

		<!-- 3.渲染数据到页面上  -->
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in banners" :key="index">
				<image :src="item.imgurl" mode="widthFix"></image>
			</swiper-item>
		</swiper>

		<!-- 点击商品跳转到商品的详情页   @click="toDetail(item.goodsId)" -->
		<view class="goodsList">
			<view class="item" v-for="item in goodsList" :key="item.goodsId" @click="toDetail(item.goodsId)">
				<image :src="item.image" mode="widthFix"></image>
				<view class="goodsName-price">
					<view class="goodsName">{{ item.goodsName }}</view>
					<view class="price">
						<text class="yuan">¥</text>
						<text>{{ item.price.toFixed(2).split('.')[0] }}.</text>
						<text class="decimal">{{item.price.toFixed(2).split('.')[1] }}</text>
						<text class="sales">已售{{ item.sales }}件</text>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="pagination">
			<text @click="prevPage" :class="{ 'disabled': currentPage === 1 }">上一页</text>
			<text>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</text>
			<text @click="nextPage" :class="{ 'disabled': currentPage === totalPages }">下一页</text>
		</view> -->

		<uni-load-more :status="status" :icon-size="16" :content-text="contentText">
		</uni-load-more>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 2.保存后端服务器返回的 所有的轮播图的数据 
				banners: [],
				goodsList: [],
				currentPage: 1,
				totalPages: 1,
				pageSize: 6,

				status: "more",
				contentText: {
					contentdown: "上拉加载更多",
					contentrefresh: "正在加载",
					contentnomore: "没有更多数据",
				}



			}
		},
		onLoad() {
			this.getBanners();
		},
		created() {
			this.getPageByGoods();
		},
		// 下拉刷新 自动触发
		onPullDownRefresh() {
			console.log("开启下拉刷新");
			// 重置数据 // 重置（清空）一下原始数据，否则 的话数据 会叠加的
			this.goodsList = []
			// 指定默认显示第一页
			this.currentPage = 1
			// 重新获取数据 渲染数据 // 重新发出请求，获取 分页之后的 数据（不是所有的数
			// 据）， 渲染数据
			this.getPageByGoods();
		},
		// 下拉触底 自动触发
		onReachBottom() {
			console.log("下拉触底");
			// 根据从后端返回的总页数进行判断 // 根据后端查询返回的 totalPage进行判断
			if (this.currentPage >= this.totalPages) {
				uni.showToast({
					icon: "none",
					title: '没有下一页数据了'
				});
				this.status = "no-more"
			} else {
				console.log("有下一页数据");
				this.currentPage++; //每页+1
				this.getPageByGoods(); //重新获取商品的分页的数据
			}
		},

		methods: {
			getBanners() {
				const token = uni.getStorageSync("data");
				console.log("token为" + token);
				if (!token) {
					uni.showToast({
						icon: "none",
						title: "请先登录",
					});
					return;
				}
				uni.request({
					url: 'http://localhost:8080/banner/findbanner',
					method: 'GET',
					data: {},
					header: {
						// 'Authorization': 'Bearer ' + token
						'Authorization': token
					},
					success: res => {
						console.log(res.data.data);
						this.banners = res.data.data
					},
					fail: () => {
						uni.showToast({
							icon: "none",
							title: "获取Banner失败",
						});
					}
				});
			},

			toSearch() {
				uni.navigateTo({
					url: '/pages/search/search',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			getPageByGoods() {
				this.status = 'loading';
				const token = uni.getStorageSync("data");
				console.log("token" + token);
				if (!token) { //如果 token为空
					uni.showToast({
						icon: "none",
						title: '请先登录'
					});
					//或者 可以跳转到登录界面
					return;
				}

				uni.request({
					url: "http://localhost:8080/goods/getPageByGoods",
					method: "GET",
					data: {
						currentPage: this.currentPage,
						pageSize: this.pageSize
					},
					header: {
						'Authorization': token
					},
					success: (res) => {

						uni.stopPullDownRefresh();
						
				

						console.log("每页记录数为：", res.data.data.records.length);
						console.log("每页记录数为：", res.data.data.size);
						console.log("当前页数为：", res.data.data.current);
						console.log("总页数为：", res.data.data.pages);
						if (res.data.code === 200) {
							for (var i = 0; i < res.data.data.records.length; i++) {
								this.goodsList.push(res.data.data.records[i]);
							}
							// this.goodsList = res.data.data.records;
							this.currentPage = res.data.data.current;
							this.totalPages = res.data.data.pages;
							this.status = 'more';
						} else {
							uni.showToast({
								title: "获取商品列表失败",
								icon: "none"
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: "网络错误",
							icon: "none"
						});
					}
				});
			},
			prevPage() {
				if (this.currentPage > 1) {
					this.getPageByGoods(this.currentPage - 1);
				}
			},
			nextPage() {
				if (this.currentPage < this.totalPages) {
					this.getPageByGoods(this.currentPage + 1);
				}
			},
			toDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + id,
				});
			},
		}
	}
</script>


<style lang="scss">
	.navBar {
		height: 500rpx;
		background-color: white;
		padding: 0 30rpx;
		padding-top: 20rpx;
		/* #ifdef MP-WEIXIN */
		padding-top: 100rpx;
		/* #endif */
		overflow: hidden;
		background: linear-gradient(to bottom, #1296db, #f7f7f7);

		.left {
			flex: 1;
			color: white;
			font-size: 40rpx;
			font-weight: 700;
		}

		.right {
			position: relative;
			margin-top: 20rpx;
			flex: 2;
		}

		input {
			padding: 10rpx 0rpx;
			padding-left: 60rpx;
			border: 1rpx solid #ccc;
			border-radius: 50rpx;
			font-size: 30rpx;
			background-color: white;
		}

		icon {
			position: absolute;
			left: 20rpx;
			top: 16rpx;
		}
	}

	.swiper {
		height: 550rpx;
		margin: 0 20rpx;
		margin-top: -320rpx;
		border-radius: 50rpx;
		overflow: hidden;

		image {
			width: 100%;
		}
	}

	.goodsList {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		margin: 0 20rpx;
		margin-bottom: 20rpx;

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
				display: flex;
				align-items: baseline;
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
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}
	}
</style>