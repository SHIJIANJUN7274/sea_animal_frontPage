<template>
  <div class="snapshot-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>电子书快照统计</span>
          <el-button type="primary" @click="handleGenSnapshot">生成今日快照</el-button>
        </div>
      </template>
      
      <!-- 统计图表 -->
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="30天趋势图" name="trend">
          <div ref="trendChartRef" class="chart-container"></div>
        </el-tab-pane>
        <el-tab-pane label="电子书排行榜" name="rank">
          <div ref="rankChartRef" class="chart-container"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <!-- 快照数据表格 -->
    <el-card class="box-card mt-20">
      <template #header>
        <div class="card-header">
          <span>电子书排行榜</span>
        </div>
      </template>
      
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="电子书名称" />
        <el-table-column prop="viewCount" label="阅读数" sortable />
        <el-table-column prop="voteCount" label="点赞数" sortable />
        <el-table-column prop="viewIncrease" label="阅读增长" sortable />
        <el-table-column prop="voteIncrease" label="点赞增长" sortable />
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { genSnapshot, getStatistic, getStatistic30 } from '@/api/ebookSnapshot';
import { ElMessage } from 'element-plus';
import { defineComponent, nextTick, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'EbookSnapshot',
  setup() {
    // 数据定义
    const loading = ref(false)
    const activeTab = ref('trend')
    const trendChartRef = ref<HTMLElement | null>(null)
    const rankChartRef = ref<HTMLElement | null>(null)
    const trendChart = ref<any | null>(null)
    const rankChart = ref<any | null>(null)
    const tableData = ref<any[]>([])
    
    // 生成今日快照
    const handleGenSnapshot = async () => {
      try {
        loading.value = true
        console.log('开始生成快照...')
        const res = await genSnapshot()
        console.log('生成快照响应:', res)
        if (res && res.success) {
          ElMessage.success('快照生成成功')
          // 重新加载数据
          loadData()
        } else {
          ElMessage.error(res?.message || '快照生成失败')
        }
      } catch (error) {
        console.error('生成快照失败', error)
        ElMessage.error('生成快照失败: ' + (error instanceof Error ? error.message : String(error)))
      } finally {
        loading.value = false
      }
    }
    
    // 加载统计数据
    const loadData = async () => {
      try {
        loading.value = true
        console.log('开始加载数据...')
        await Promise.all([loadTrendData(), loadRankData()])
      } catch (error) {
        console.error('加载数据失败', error)
        ElMessage.error('加载数据失败: ' + (error instanceof Error ? error.message : String(error)))
      } finally {
        loading.value = false
      }
    }
    
    // 加载趋势图数据
    const loadTrendData = async () => {
      try {
        console.log('加载趋势图数据...')
        const res = await getStatistic()
        console.log('趋势图数据响应:', res)
        
        if (res && res.success && res.data) {
          const statisticData = res.data
          
          // 准备图表数据
          const xAxis = statisticData.map((item: any) => item.date)
          const viewCountData = statisticData.map((item: any) => item.viewCount)
          const voteCountData = statisticData.map((item: any) => item.voteCount)
          const viewIncreaseData = statisticData.map((item: any) => item.viewIncrease)
          const voteIncreaseData = statisticData.map((item: any) => item.voteIncrease)
          
          // 初始化图表
          nextTick(() => {
            if (trendChartRef.value) {
              if (!trendChart.value) {
                // @ts-ignore
                trendChart.value = window.echarts.init(trendChartRef.value)
              }
              
              const option = {
                title: {
                  text: '电子书阅读趋势'
                },
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data: ['总阅读量', '总点赞量', '阅读增长', '点赞增长']
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: xAxis
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    name: '总阅读量',
                    type: 'line',
                    data: viewCountData
                  },
                  {
                    name: '总点赞量',
                    type: 'line',
                    data: voteCountData
                  },
                  {
                    name: '阅读增长',
                    type: 'line',
                    data: viewIncreaseData
                  },
                  {
                    name: '点赞增长',
                    type: 'line',
                    data: voteIncreaseData
                  }
                ]
              }
              
              trendChart.value.setOption(option)
            }
          })
        } else {
          console.error('趋势图数据格式不正确:', res)
          // 如果没有数据，显示空图表
          nextTick(() => {
            if (trendChartRef.value) {
              if (!trendChart.value) {
                // @ts-ignore
                trendChart.value = window.echarts.init(trendChartRef.value)
              }
              
              const option = {
                title: {
                  text: '电子书阅读趋势',
                  subtext: '暂无数据'
                },
                xAxis: {
                  type: 'category',
                  data: []
                },
                yAxis: {
                  type: 'value'
                },
                series: []
              }
              
              trendChart.value.setOption(option)
            }
          })
        }
      } catch (error) {
        console.error('加载趋势图数据失败', error)
        ElMessage.error('加载趋势图数据失败')
      }
    }
    
    // 加载排行榜数据
    const loadRankData = async () => {
      try {
        console.log('加载排行榜数据...')
        const res = await getStatistic30()
        console.log('排行榜数据响应:', res)
        
        if (res && res.success && res.data) {
          const rankData = res.data
          tableData.value = rankData
          
          // 准备图表数据
          const names = rankData.map((item: any) => item.name)
          const viewCounts = rankData.map((item: any) => item.viewCount)
          const voteCounts = rankData.map((item: any) => item.voteCount)
          
          // 初始化图表
          nextTick(() => {
            if (rankChartRef.value) {
              if (!rankChart.value) {
                // @ts-ignore
                rankChart.value = window.echarts.init(rankChartRef.value)
              }
              
              const option = {
                title: {
                  text: '电子书阅读排行'
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  }
                },
                legend: {
                  data: ['阅读量', '点赞量']
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'value'
                },
                yAxis: {
                  type: 'category',
                  data: names
                },
                series: [
                  {
                    name: '阅读量',
                    type: 'bar',
                    data: viewCounts
                  },
                  {
                    name: '点赞量',
                    type: 'bar',
                    data: voteCounts
                  }
                ]
              }
              
              rankChart.value.setOption(option)
            }
          })
        } else {
          console.error('排行榜数据格式不正确:', res)
          // 如果没有数据，显示空表格和图表
          tableData.value = []
          nextTick(() => {
            if (rankChartRef.value) {
              if (!rankChart.value) {
                // @ts-ignore
                rankChart.value = window.echarts.init(rankChartRef.value)
              }
              
              const option = {
                title: {
                  text: '电子书阅读排行',
                  subtext: '暂无数据'
                },
                xAxis: {
                  type: 'value'
                },
                yAxis: {
                  type: 'category',
                  data: []
                },
                series: []
              }
              
              rankChart.value.setOption(option)
            }
          })
        }
      } catch (error) {
        console.error('加载排行榜数据失败', error)
        ElMessage.error('加载排行榜数据失败')
        // 显示空表格
        tableData.value = []
      }
    }
    
    // 处理Tab切换
    const handleTabClick = () => {
      nextTick(() => {
        if (activeTab.value === 'trend' && trendChart.value) {
          trendChart.value.resize()
        } else if (activeTab.value === 'rank' && rankChart.value) {
          rankChart.value.resize()
        }
      })
    }
    
    // 窗口大小变化时重新调整图表大小
    const handleResize = () => {
      if (trendChart.value) {
        trendChart.value.resize()
      }
      if (rankChart.value) {
        rankChart.value.resize()
      }
    }
    
    // 组件挂载后初始化
    onMounted(() => {
      console.log('组件挂载，开始加载数据...')
      loadData()
      window.addEventListener('resize', handleResize)
    })
    
    return {
      loading,
      activeTab,
      trendChartRef,
      rankChartRef,
      tableData,
      handleGenSnapshot,
      handleTabClick
    }
  }
})
</script>

<style scoped>
.snapshot-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.mt-20 {
  margin-top: 20px;
}
</style> 