<template>
	<view class="page">
		<view class="header">
			<view class="user">
				<image :src="userInfo.userImg || '/static/center/avatar.png'"></image>
				<text v-if="userInfo.username">{{userInfo.username}}</text>
				<text v-else class="login-text" @click="goToLogin">去登录</text>
			</view>
			<view class="info">
				<view class="item">
					<text>12</text>
					<text>使用天数</text>
				</view>
				<view class="item">
					<text>43</text>
					<text>记账笔数</text>
				</view>
			</view>
		</view>

		<view class="menu">
			<view class="item" v-for="v in menus" :key="v.id" @click="handleMenuClick(v)">
				<image :src="v.icon"></image>
				<view>{{v.name}}</view>
				<image class="arrow" v-if="v.arrow" src="/static/center/right.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				menus: [
					{id: 1, name: '账本管理', icon: '/static/center/book.png', arrow: true},
					{id: 2, name: '联系客服', icon: '/static/center/comment.png', arrow: true},
					{id: 3, name: '分享应用', icon: '/static/center/share.png', arrow: false},
					{id: 4, name: '添加桌面', icon: '/static/center/appstore-add.png', arrow: false},
					{id: 5, name: '退出登录', icon: '/static/center/poweroff.png', arrow: false, requireLogin: true},
				]
			}
		},
		onLoad() {
			this.checkToken();
			this.getUserInfo();
		},
		methods: {
			// 跳转到登录页面
			goToLogin() {
				uni.navigateTo({
					url: '/pages/login/login' // 根据你的实际登录页面路径修改
				});
			},
			
			// 获取用户信息
			getUserInfo() {
				const token = uni.getStorageSync('data');
				if (!token) {
					return;
				}
				
				uni.request({
					url: 'http://localhost:8080/wxUser/findUserInfo',
					method: 'GET',
					header: {
						'Authorization': token
					},
					success: (res) => {
						if (res.data.code === 200 ) {
							this.userInfo = res.data.data;
						} else {
							uni.showToast({
								title: '获取用户信息失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						console.error(err);
						uni.showToast({
							title: '请求失败',
							icon: 'none'
						});
					}
				});
			},
			
			// 检查token状态
			checkToken() {
				const token = uni.getStorageSync('data');
				if (!token) return;
				
				uni.request({
					url: 'http://localhost:8080/wxUser/checkTokenStatus',
					method: 'GET',
					header: {
						'Authorization': token
					},
					success: (res) => {
						if (!(res.data.code === 200 )) {
							uni.showToast({
								title: '登录已过期，请重新登录',
								icon: 'none'
							});
							uni.removeStorageSync('data');
							this.userInfo = {};
						}
					},
					fail: (err) => {
						console.error(err);
					}
				});
			},
			
			// 处理菜单点击
			handleMenuClick(item) {
				const token = uni.getStorageSync('data');
				
				// 需要登录但未登录的菜单项
				if (item.requireLogin && !token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					this.goToLogin();
					return;
				}
				
				if (item.id === 5) { // 退出登录
					this.logout();
				}
				// 其他菜单项的处理...
			},
			
			// 退出登录
			logout() {
				uni.removeStorageSync('data');
				this.userInfo = {};
				uni.showToast({
					title: '已退出登录',
					icon: 'none'
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "./me.scss";
	
	.login-text {
		color: #007AFF;
		text-decoration: underline;
	}
</style>