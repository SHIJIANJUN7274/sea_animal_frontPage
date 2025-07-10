<template>
	<view>
		<button type="primary" @click="chooseAndvideoplayer()">选择视频</button>
		<video id="myVideo" class="player" :src="videoPath"  :danmu-list="danmuList" danmu-btn enable-danmu controls></video>
		<br/>
		<input placeholder="请输入弹幕" v-model="danmuContent" />
		<button @click="sendDanmu()">
			<text>发送弹幕</text>	
		</button>
		<button @click="goVideoPage()">
			<text>跳转到短视频</text>
		</button>
		
	</view>
</template>

<script>
    export default {
        data() {
            return {
                videoPath: "../../static/videoplayer/video1.mp4", 
                danmuList: [{
                        text: '第 1s 出现的弹幕',
                        color: '#ff0000',
                        time: 1
                    },
                    {
                        text: '好好看',
                        color: '#ff1',
                        time: 3
                    },
                    {
                        text: '我追她',
                        color: '#ff9966',
                        time: 5
                    }
                ],
                danmuContent: "" //danmuValue="好好看" 
            }
        },

        onReady(res) {
            // 拿到了视频的上下文对象
            this.videoContext = uni.createVideoContext("myVideo")
        },
        methods: {
            chooseAndvideoplayer() {

                uni.chooseVideo({
                    sourceType: ['album', 'camera'],
                    compressed: true,

                    success: (res) => {

                        console.log(res);
                        this.videoPath = res.tempFilePath
                    }
                })
            },
            // 要发送弹幕内容显示到视频里面   首先要先拿到视频区域  即：视频上下文对象
            // 调用方法 来做出响应   发送弹幕内容到视频里面
            sendDanmu() {
                this.videoContext.sendDanmu({
                    text: this.danmuContent, //text: "好好看" 
                    color: this.getRandomColor()
                })
                // 清空数据  重置数据
                this.danmuContent = ""
            },
            // 获取随机色
            getRandomColor: function() {
                const rgb = []
                for (let i = 0; i < 3; ++i) {
                    let color = Math.floor(Math.random() * 256).toString(16)
                    color = color.length == 1 ? '0' + color : color
                    rgb.push(color)
                }
                return '#' + rgb.join('')
            },
            // 点击跳转到刷短视频页面 
            goVideoPage(){
                uni.navigateTo({
                    url:"/pages/videoplayer2/videoplayer2"
                })
            }
        }
    }
</script>	

<style>
	
.player {
	width: 100%;
}

</style>
