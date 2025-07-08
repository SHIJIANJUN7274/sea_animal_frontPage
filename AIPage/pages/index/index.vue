<template>
	<view class="container">
		<view class="chat-box">
			<scroll-view scroll-y class="messages" :style="'height:' + height + 'px'">
				<view v-for="(message, index) in messages" :key="index" class="message" :class="message.type">
					<text :class="message.isAi ? 'ai-message' : 'user-message'">{{ message.text }}</text>
				</view>
			</scroll-view>
		</view>
		<view class="input-box">
			<!-- 按下回车键时触发 sendMessage 方法 -->
			<!-- 获取数据 方式1：v-model="userMessage"   userMessage="你是谁"变量存储用户输入的信息（问的问题  输入的提示词）
			方式2：event.target.value 方式3：name=username"" -->
			<input v-model="userMessage" placeholder="请输入你的问题" class="input" @keydown.enter="sendMessage" />
			<button @click="sendMessage" class="send-button">发送</button>
		</view>
		<navigator url="/pages/index2/index2">跳转到index2页面</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				height: 400,
				messages: [],//两个角色  消息展示列表 展示到页面上
				userMessage: ""
			}
		},
		onLoad() {

		},
		methods: {
			sendMessage() {
				if(this.userMessage.trim() ===""){
					uni.showToast({
						icon:'none',
						title: '请输入你的问题，不为空'
					});
					return;
				}
				//发请求之前
				// 把用户提问的问题添加到消息列表中 即messages: []  要展示到页面上
				this.messages.push({text:`用户提问:${this.userMessage}`,type:'user',isAI:false})
				// 赋值
				const message = this.userMessage;
				// 清空输入框中的消息
				this.userMessage = ""
				// 发起网络请求
				uni.request({
					url: 'http://localhost:8080/ai/chat',
					method: 'GET',
					data: {
						message:message
					},
					success: res => {
						if(res.data.code === 200){
							this.messages.push({text:`ai响应:${res.data.data}`,type:'ai',isAI:true})
						}else{
							this.messages.push({text:"网络错误，请稍后再试",type:'ai',isAI:true})
						}
					},
					fail: () => {
						this.messages.push({text:"网络错误，请稍后再试",type:'ai',isAI:true})
					},
					complete: () => {}
				});
				

			}
		}
	}
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