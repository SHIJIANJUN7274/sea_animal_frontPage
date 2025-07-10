<template>
	<view class="container">
		<!-- 聊天消息区域 -->
		<scroll-view class="chat-box" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true">
			<block v-for="(item, index) in messages" :key="index">
				<!-- 用户消息 -->
				<view class="msg_user" v-if="item.role === 'user'">
					<view class="msg-bubble right">
						{{ item.content }}
					</view>
				</view>

				
				<view class="msg_assistant" v-else>
					<view class="msg-bubble left">
						<text>{{ item.content }}</text>
						<view class="loading" v-if="item.loading">
							<text class="dot">.</text>
							<text class="dot">.</text>
							<text class="dot">.</text>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>

		<!-- 输入区域 -->
		<view class="input-box">
			<input class="input" v-model="inputText" placeholder="请输入您的问题" :disabled="isLoading" @confirm="sendMessage"
				confirm-type="send" />
			<button class="send-btn" :class="{ disabled: isLoading }" @click="sendMessage">
				{{ isLoading ? '发送中...' : '发送' }}
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messages: [], // 聊天记录
				inputText: '', // 输入内容
				isLoading: false, // 加载状态
				scrollTop: 0, // 滚动位置
			}
		},
		methods: {
			// 发送消息
			async sendMessage() {
				if (!this.inputText.trim() || this.isLoading) return

				const userMessage = this.inputText
				this.inputText = ''

				// 添加用户消息
				this.addMessage({
					role: 'user',
					content: userMessage
				})

				// 添加AI消息占位
				const aiMessage = this.addMessage({
					role: 'assistant',
					content: '',
					loading: true
				})

				this.isLoading = true
					
				uni.request({
					url: 'http://159.75.174.133:8080/ai/ask', // 请求地址（必须）
					method: 'POST', // 请求方法，默认 GET
					data: this.messages,
					success: (res) => {	
						const lastMsg = this.messages[this.messages.length-1]
						lastMsg.content = res.data.data
						lastMsg.loading = false
					},
					fail: (err) => {
					  uni.showToast({
						  title:"网络错误"
					  })
					},
					complete: () => {
						this.isLoading = false
						this.forceUpdateScroll()
					}
				});
					
			},

			// 添加消息
			addMessage(message) {
				this.messages.push({
					...message,
				})
				this.forceUpdateScroll()
				return this.messages[this.messages.length - 1]
			},

			// 强制更新视图并滚动到底部
			forceUpdateScroll() {
				this.$forceUpdate()
				this.$nextTick(() => {
					this.scrollToBottom()
				})
			},

			// 滚动到底部
			scrollToBottom() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.chat-box').boundingClientRect()
				query.selectAll('.msg-bubble').boundingClientRect()
				query.exec(res => {
					if (res[1] && res[1].length > 0) {
						this.scrollTop = res[1][res[1].length - 1].bottom + 50
					}
				})
			},

			// 显示提示
			showToast(title) {
				uni.showToast({
					title,
					icon: 'none'
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		height: 85vh;
		display: flex;
		flex-direction: column;
		background: #f5f5f5;
	}
	.msg_assistant {
		width: 100%;
		display: flex;
	}
	
	.msg_user {
		width: 100%;
		display: flex;
		flex-direction: row-reverse;
	}

	.chat-box {
		flex: 1;
		width: 100%;
		padding: 20rpx;
		overflow: auto;
		 box-sizing: border-box; 
	}

	.msg-bubble {
		max-width: 70%;
		padding: 20rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		line-height: 1.5;

		&.left {
			background: #fff;
			border: 1rpx solid #eee;
		}

		&.right {
			flex-direction: row-reverse;
			background: #4CAF50;
			color: white;
		}
	}

	.input-box {
		display: flex;
		padding: 20rpx;
		background: #fff;
		border-top: 1rpx solid #eee;

		.input {
			flex: 1;
			padding: 15rpx;
			border: 1rpx solid #ddd;
			border-radius: 8rpx;
			margin-right: 20rpx;
		}

		.send-btn {
			background: #4CAF50;
			color: white;
			padding: 0 30rpx;

			&.disabled {
				background: #ccc;
			}
		}
	}

	.loading .dot {
		animation: blink 1.4s infinite;

		&:nth-child(2) {
			animation-delay: 0.2s;
		}

		&:nth-child(3) {
			animation-delay: 0.4s;
		}
	}

	@keyframes blink {

		0%,
		100% {
			opacity: 0.2
		}

		50% {
			opacity: 1
		}
	}
</style>