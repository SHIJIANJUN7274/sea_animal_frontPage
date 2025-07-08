<template>
	<view class="classify">
		<view class="navBar">
			<view class="right" @click="toSearch">
				<input type="text" value="" placeholder="输入关键字" />
				<icon type="search" size="34rpx" color="#1296db"></icon>
			</view>
		</view>
		<view class="list" ref="list" :style="{height:listHight+'rpx'}">
			<scroll-view scroll-y="true" class="categoryList">
				<view class="categoryItem" :class="chooseCategory==item?'chooseStyle':''"
					v-for="(item,index) in category" :key="index" @click="toCategory(item)">
					{{item}}
				</view>
			</scroll-view>
			<scroll-view scroll-y="true" class="goodsList">
				<view class="goodsItem" v-for="(item,index) in goods" :key="index" @click="toDetail(item.goodsId)">
					<image class="image" :src="item.image" mode="widthFix"></image>
					<view class="goodsName">{{item.goodsName}}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				category: [],
				goods: [],
				chooseCategory: '',
				listHight: 0,
			}
		},
		onLoad() {
			this.getCategory();
		},
		methods: {
			//获取货物种类
			getCategory() {
				const token = uni.getStorageSync("data"); // 从本地缓存中获取token
				console.log("token为" + token);
				if (!token) {
					uni.showToast({
						icon: "none",
						title: "请先登录",
					});
					// 可以根据需求跳转到登录页面
					return;
				}
				uni.request({
					url: 'http://159.75.174.133:8080/goods/findCategoryList',
					method: 'GET',
					data: {},
					header: {
						// 'Authorization': 'Bearer ' + token
						'Authorization': token
					},
					// 获取商品类别的请求返回结果处理部分应该修改为
					// 这样修改后， this.category = res.data.data 即this.category就是商品类别的数组，
                    //然后再获取第一个商品类别的商品列表this.category[0]  就能获取到所有的商品分类。
					success: res => {
					    if(res.data.success || res.data.code === 200){
					        this.category = res.data.data;
					        this.getGoods(this.category[0]);
					        this.getListHeight();
					    } else {
					        console.log(res.data.message);
					    }
					},
					fail: () => {},
					complete: () => {}
				});
			},
			//获取货物
			getGoods(category) {
				const token = uni.getStorageSync("data"); // 从本地缓存中获取token
				console.log("token为" + token);
				if (!token) {
					uni.showToast({
						icon: "none",
						title: "请先登录",
					});
					// 可以根据需求跳转到登录页面
					return;
				}
				
				this.chooseCategory = category;
				uni.request({
					url: 'http://159.75.174.133:8080/goods/findByCategory',
					method: 'GET',
					data: {
						category: category,
					},
					header: {
						// 'Authorization': 'Bearer ' + token
						'Authorization': token
					},
					// 获取商品列表的请求返回结果处理部分也应该修改为，这样修改后，this.goods就是商品列表。
					success: res => {
					    if(res.data.success || res.data.code === 200){
					        this.goods = res.data.data;
					    } else {
					        console.log(res.data.message);
					    }
					},
					fail: () => {},
					complete: () => {}
				});
			},
			//前往详情页
			toDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + id,
				});
			},
			//前往类别
			toCategory(item) {
				this.getGoods(item);
			},
			toSearch() {
				uni.navigateTo({
					url: '/pages/search/search',
				});
			},
			//获取窗口界面高度
			getListHeight() {
				let wHeight = uni.getSystemInfoSync().windowHeight;
				let wBottom = uni.getSystemInfoSync().windowBottom;
				console.log(uni.getSystemInfoSync().screenHeight);
				console.log(wHeight, wBottom);
				this.listHight = (wHeight - wBottom) * 2;
				// #ifdef MP-WEIXIN
				this.listHight = (wHeight - 75) * 2;
				// #endif
				console.log(this.listHight);
			}

		}
	}
</script>

<style lang="scss">
	.navBar {
		display: flex;
		height: 100rpx;
		background-color: white;
		align-items: center;
		padding: 0 30rpx;
		/* #ifdef MP-WEIXIN */
		padding-top: 100rpx;

		/* #endif */
		.right {
			flex: 1;
			position: relative;
			width: 200rpx;
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

	.list {
		display: flex;

		.categoryList {
			flex: 1;

			.chooseStyle {
				color: #1296db;
				border-left: 6rpx solid #1296db;
			}

			.categoryItem {
				padding: 30rpx 0 30rpx 30rpx;
			}

		}

		.goodsList {
			flex: 3;

			.goodsItem {
				display: inline-block;
				margin: 15rpx;
				width: 250rpx;
				height: 380rpx;
				background-color: white;
				border-radius: 20rpx;
				text-align: center;
				overflow: hidden;
			}

			.image {
				width: 100%;
			}

			.goodsName {
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		}
	}
</style>