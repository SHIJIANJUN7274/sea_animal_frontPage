<template>
  <view class="content">
    <!-- 页面顶部标题 -->
    <view class="Top">首页</view>

    <!-- 轮播图区域 -->
    <view class="lunBoTu">
      <swiper 
        class="lunBoTu1" 
        indicator-dots 
        autoplay 
        interval="3000" 
        duration="1000"
      >
        <swiper-item v-for="(image, index) in lunBoTuImages" :key="index">
          <view class="swiper-item">
            <image :src="image" mode="" @click="toNavelList"></image>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 新书速递标题 -->
    <view>
      <image src="../../static/tuBiao/newbook.png" mode="" class="biaoTiPhoto1" @click="toNavelList"></image>
      <text class="biaoTi">新书速递</text>
    </view>

    <!-- 横向滚动书籍展示 -->
    <scroll-view class="box_x" scroll-x>
      <view class="demo1" v-for="(book, index) in newBooks" :key="index">
        <image :src="book.image" mode="" @click="toNavelList"></image>
      </view>
    </scroll-view>

    <!-- 人气爽文标题 -->
    <view>
      <image src="../../static/tuBiao/火爆.png" mode="" class="biaoTiPhoto2" @click="toNavelList"></image>
      <text class="biaoTi">人气爽文</text>
    </view>

    <!-- 纵向滚动书籍列表 -->
    <scroll-view class="box_y" scroll-y>
      <view class="demo2" v-for="(book, index) in popularBooks" :key="index">
        <image :src="book.image" mode=""></image>
        <view class="tiMu">{{ book.title }}</view>
        <view class="author">{{ book.author }}</view>
        <view class="characters">{{ book.description }}</view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      // 轮播图图片路径数组
      lunBoTuImages: [
        "../../static/bookFengMian/douLuoDaLu.png",
        "../../static/bookFengMian/wanGuDiXu.png",
        "../../static/bookFengMian/qiYuZou.png"
      ],

      // 新书推荐数据
      newBooks: [
        { image: "../../static/bookFengMian/shenMiFuSu.png" },
        { image: "../../static/bookFengMian/lunHuiLeYuan.png" },
        { image: "../../static/bookFengMian/lingJingXingZe.png" },
        { image: "../../static/bookFengMian/shenMiFuSu.png" },
        { image: "../../static/bookFengMian/lunHuiLeYuan.png" },
        { image: "../../static/bookFengMian/lingJingXingZe.png" }
      ],

      // 人气书籍数据
      popularBooks: [
        {
          image: "../../static/bookFengMian/yeDeMingMingSu.png",
          title: "夜的命名术",
          author: "会说话的肘子",
          description: "蓝与紫的霓虹中，浓密的钢铁苍穹下，数据洪流的前端，是科技革命之后的世界，也是现实与虚幻的分界。钢铁与身体，过去与未来。这里，表世界与里世界并存，面前的一切..."
        },
        {
          image: "../../static/bookFengMian/mingKeJie.png",
          title: "明克街13号",
          author: "纯洁滴小龙",
          description: "我喜欢坐在夜晚空无一人的大街上，听着“他们”的窃窃私语，享受着“他们”的喧嚣。"
        },
        {
          image: "../../static/bookFengMian/shengKongPiAn.png",
          title: "深空彼岸",
          author: "辰东",
          description: "浩瀚的宇宙中，一片星系的生灭，也不过是刹那的斑驳流光。仰望星空，总有种结局已注定的伤感，千百年后你我在哪里？家国，文明火光，地球，都不过是深空中的一粒尘埃..."
        },
        {
          image: "../../static/bookFengMian/fengYinWangZuo.png",
          title: "神印王座2皓月当空",
          author: "唐家三少",
          description: "实体书已经更新：龙生两子亦有不同，天才的哥哥与废柴的弟弟，明明是长得一模一样的双胞胎，却有着天壤之别，唯有他们那想要躺平的心却是一模一样。在他们出生的那一晚，皓月当空。"
        },
        {
          image: "../../static/bookFengMian/yuZuoZhiYeXuanSou.png",
          title: "宇宙职业选手",
          author: "我吃西红柿",
          description: "2036年，人类第一次登上了荧火星。2052年，第一届世界武道大赛举行，这也是全球最高格斗赛事，全球为之狂热。世界级顶尖选手“枪魔”许景明，于二十六岁那年..."
        },
        {
          image: "../../static/bookFengMian/tangRenDeCanZuo.png",
          title: "唐人的餐桌",
          author: "孑与2",
          description: "天下人，天下事，都不过是我大唐人餐桌上的一道道菜肴。虽然原始的食材便具有食物原始的风情，云初还是认为，最美味的食物还是需要经过分割，烹调，处置，最后端上桌..."
        }
      ]
    };
  },

  methods: {
    toNavelList() {
      uni.reLaunch({
        url: "/pages/novellist/novellist"
      });
    }
  }
};
</script>

<style>
.content {
  background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
}

/* 轮播图样式 */
.lunBoTu1 {
  height: 430rpx;
  padding: 7px;
}

.swiper-item {
  height: 390rpx;
  width: auto;
  border-radius: 30rpx;
  overflow: hidden;
}

swiper-item image {
  height: 100%;
  width: 100%;
}

/* 标题图标样式 */
.biaoTiPhoto1 {
  height: 100rpx;
  width: 100rpx;
  float: left;
}

.biaoTiPhoto2 {
  height: 70rpx;
  width: 70rpx;
  float: left;
  margin-top: 5px;
}

/* 页面顶部样式 */
.Top {
  height: 30px;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 10px;
  line-height: 30px;
  background: linear-gradient(#aaffff 0%, #ffaaff 100%);
}

/* 轮播图容器样式 */
.lunBoTu {
  border-radius: 30rpx;
  margin: 10px;
}

/* 横向滚动容器 */
.box_x {
  white-space: nowrap;
}

/* 横向书籍项 */
.demo1 {
  width: 300rpx;
  height: 300rpx;
  margin-left: 20rpx;
  display: inline-block;
  border-radius: 10%;
}

.demo1 image {
  height: 100%;
  width: 100%;
}

/* 纵向滚动容器 */
.box_y {
  height: 800rpx;
}

/* 纵向书籍项 */
.demo2 {
  height: 100px;
  width: 100%;
  margin-top: 20rpx;
  position: relative;
}

.demo2 image {
  height: 100px;
  width: 100px;
  float: left;
}

/* 作者信息样式 */
.author {
  height: 24px;
  width: 100px;
  position: absolute;
  right: 2px;
  text-align: right;
}

/* 描述信息样式 */
.characters {
  margin-left: 100px;
  height: 74px;
  width: 77.5%;
  position: absolute;
  left: 0px;
  top: 25px;
  font-size: 14px;
  overflow: hidden;
}

/* 标题文字样式 */
.biaoTi {
  height: 100rpx;
  line-height: 100rpx;
  font-size: 50rpx;
  font-family: "幼圆";
}

/* 书名样式 */
.tiMu {
  margin-left: 100px;
  height: 24px;
  width: 180px;
  position: absolute;
  left: 0px;
}
</style>
