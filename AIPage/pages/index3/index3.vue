<template>
	<view class="container">
		<!-- 聊天消息区域 -->
		<scroll-view class="chat-box" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true">
			<block v-for="(item, index) in messages" :key="index">
				<!-- 用户消息 -->
				<view class="user-msg" v-if="item.role === 'user'">
					<view class="msg-bubble right">
						{{ item.content }}
					</view>
				</view>

				<!-- AI消息 -->
				<view class="ai-msg" v-else>
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
				controller: null, // 请求控制器（用于中断请求）
				chatId: null // 会话ID
			}
		},
		methods: {
			// 初始化会话
			initializeChat() {
				// 随机生成一个 chatId 或者从某处获取 chatId
				this.chatId = this.generateChatId(); 
			},

			// 生成会话ID
			generateChatId() {
				return 'chat-' + Math.random().toString(36).substr(2, 9); // 生成一个简单的随机ID
			},

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

				try {
					this.isLoading = true
					this.controller = new AbortController()

					// 确保 chatId 在请求中传递
					const response = await fetch(
						`http://localhost:8080/chatAi/chat3?prompt=${encodeURIComponent(userMessage)}&chatId=${this.chatId}`, {
							signal: this.controller.signal
						})

					const reader = response.body.getReader()
					const decoder = new TextDecoder('utf-8')

					// 流式读取
					while (true) {
						const { done, value } = await reader.read()
						if (done) break

						const chunk = decoder.decode(value)
						aiMessage.content += chunk
						aiMessage.loading = false
						this.forceUpdateScroll()
					}
				} catch (error) {
					if (error.name !== 'AbortError') {
						aiMessage.content = '请求失败，请重试'
						this.showToast('请求失败')
					}
				} finally {
					this.isLoading = false
					aiMessage.loading = false
					this.controller = null
				}
			},

			// 添加消息
			addMessage(message) {
				this.messages.push({
					...message,
					timestamp: Date.now()
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
		},

		// 在页面加载时初始化会话
		created() {
			this.initializeChat();
		}
	}
</script>


<style lang="scss">
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #f5f5f5;
	}

	.chat-box {
		flex: 1;
		padding: 50rpx;
		overflow: auto;
	}

	.msg-bubble {
		max-width: 70%;
		padding: 10rpx;
		margin: 20rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		line-height: 1.5;

		&.left {
			background: #fff;
			float: left;
			border: 1rpx solid #eee;
		}

		&.right {
			background: #4CAF50;
			color: white;
			float: right;
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
			padding: 0 80rpx;

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