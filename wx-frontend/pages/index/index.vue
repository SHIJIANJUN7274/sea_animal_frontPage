<template>
  <view>
    <!-- 轮播图 Swiper -->
    <swiper 
      :indicator-dots="true" 
      :autoplay="true" 
      :interval="3000" 
      :duration="1000"
    >
      <!-- 遍历图片数组 pictures 渲染轮播项 -->
      <swiper-item v-for="(item, index) in pictures" :key="index">
        <image :src="item.url" mode="" class="pic" @click="toNavelList"></image>
      </swiper-item>
    </swiper>

    <!-- 图片 + 标题模块 A -->
    <view class="pic2">
      <image :src="imgurl" mode="" class="a1" @click="toNavelList"></image>
      <view class="a2">{{ titlea }}</view>
    </view>

    <!-- 横向滚动教师列表 -->
    <scroll-view scroll-x="true" class="b1">
      <view v-for="(item, index) in teachers" :key="index" class="b2">
        <image :src="item.url" mode="" class="b3" @click="toNavelList"></image>
        <view class="b4">老师：{{ item.name }}</view>
        <view class="b4">数量：{{ item.count }}</view>
      </view>
    </scroll-view>

    <!-- 图片 + 标题模块 B -->
    <view class="pic2">
      <image :src="imgurl" mode="" class="a1" @click="toNavelList"></image>
      <view class="a2">{{ titleb }}</view>
    </view>

    <!-- 活动信息列表 -->
    <view class="d1" v-for="(item, index) in activities" :key="index">
      <image :src="item.url" mode="" class="d2" @click="toNavelList"></image>
      <view>
        <view class="d3">{{ item.place }}</view>
        <view class="d4">{{ item.content }}</view>
      </view>
      <view>
        <view class="d5">{{ item.time }}</view>
        <view class="d6">{{ item.number }}</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      // 轮播图数据源
      pictures: [
        { id: '0', url: '../../static/huayuanimgs/1.jpg' },
        { id: '1', url: '../../static/huayuanimgs/2.jpg' },
        { id: '2', url: '../../static/huayuanimgs/3.jpg' }
      ],

      // 图片地址与标题
      imgurl: "../../static/huayuanimgs/1.jpg",
      titlea: "官厅画师",

      // 教师列表
      teachers: [
        { name: '张老师', url: '../../static/huayuanimgs/teacher1.jpg', count: "120" },
        { name: '李老师', url: '../../static/huayuanimgs/teacher2.jpg', count: "200" },
        { name: '赵老师', url: '../../static/huayuanimgs/teacher3.jpg', count: "120" },
        { name: '赵老师2', url: '../../static/huayuanimgs/teacher4.jpg', count: "120" },
        { name: '赵老师3', url: '../../static/huayuanimgs/teacher5.jpg', count: "120" },
        { name: '赵老师4', url: '../../static/huayuanimgs/teacher6.jpg', count: "120" }
      ],

      titleb: "画院活动",

      // 活动信息
      activities: [
        {
          url: '../../static/huayuanimgs/1.jpg',
          place: '北京康庄',
          content: '河北张家口官厅画展在康庄长城硅谷举行。',
          time: '9:00',
          number: '4'
        },
        {
          url: '../../static/huayuanimgs/1.jpg',
          place: '北京延庆',
          content: '河北张家口官厅画展在延庆软件园举行。',
          time: '10:00',
          number: '5'
        },
        {
          url: '../../static/huayuanimgs/1.jpg',
          place: '北京昌平',
          content: '河北张家口官厅画展在昌平软件园举行。',
          time: '12:00',
          number: '6'
        }
      ]
    };
  },

  onLoad() {
    // 页面加载时可执行初始化逻辑
  },

  methods: {
    toNavelList() {
      uni.navigateTo({
        url: "/pages/novellist/novellist",
        success: res => {},
        fail: () => {},
        complete: () => {}
      });
    }
  }
};
</script>
<style>
@import url("index.css");
/* 可以在此添加自定义样式 */
</style>