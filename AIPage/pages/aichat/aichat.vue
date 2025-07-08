<template>
	 <view class="container">
		   <view class="chat-box">
			     <scroll-view scroll-y class="messages" :style="'height:' + height + 'px'">
				       <view v-for="(message, index) in messages" :key="index" class="message" :class="message.type">
					         <text :class="message.isAi ? 'ai-message' : 'user-message'">{{
message.text }}</text>
					       </view>
				     </scroll-view>
			   </view>
		   <view class="input-box">
			     <!-- 按下回车键时触发 sendMessage 方法 -->
			     <input v-model="userMessage" placeholder="请输入你的问题" class="input" @keydown.enter="sendMessage" />
			     <button @click="sendMessage" class="send-button">发送</button>
			   </view>
		 </view></template>
<script>
	export default {
		data() {
			return {
				userMessage: '',
				messages: [],
				height: 500 // 固定的高度，可以根据需要调整
			};
		},
		methods: {
			// 发送消息给后端
			sendMessage() {
				if (this.userMessage.trim() === '') {
					uni.showToast({
						title: '请输入消息',
						icon: 'none'
					});
					return;
				}
				// 将用户的消息添加到消息列表
				this.messages.push({
					text: `用户提问: ${this.userMessage}`,
					type: 'user',
					isAi: false
				});
				// 清空输入框
				const message = this.userMessage;
				this.userMessage = '';
				// 调用后端接口获取 DeepSeek 的回答
				uni.request({
					url: 'http://localhost:8080/ai/chat',
					method: 'GET',
					data: {
						message: message
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.messages.push({
								text: `AI: ${res.data.data}`,
								type: 'ai',
								isAi: true
							});
						} else {
							this.messages.push({
								text: 'AI: 我没有理解您的问题',
								type: 'ai',
								isAi: true
							});
						}
					},
					fail: () => {
						this.messages.push({
							text: 'AI: 网络错误，请稍后再试',
							type: 'ai',
							isAi: true
						});
					}
				});
			}
		}
	};
</script>
<style scoped>
	.container {
		padding: 2px;
	}

	.chat-box {
		margin-bottom: 30px;
	}

	.messages {
		background-color: #f1f1f1;
		padding: 5px;
		border-radius: 10px;
	}

	.message {
		margin-bottom: 20px;
	}

	.user-message {
		background-color: #e0f7fa;
		/* 用户消息的背景色 */
		border-radius: 8px;
	}

	.ai-message {
		background-color: #f1f8e9;
		/* AI 消息的背景色 */
		border-radius: 8px;
		font-weight: bold;
		/* 加粗AI的回答 */
	}

	.input-box {
		display: flex;
		justify-content: space-between;
	}

	.input {
		flex: 1;
		padding: 10px;
		border-radius: 8px;
		border: 1px solid #ccc;
	}

	.send-button {
		margin-left: 10px;
		background-color: #007aff;
		color: white;
		height: auto;
		border-radius: 8px;
	}
</style>