<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from "vue";
import { pageUsers, pageBusiness } from '@/api/api'

const users = ref([])
const business = ref([])
const total = ref(0)

const chartCity = ref(null)
const chartActive = ref(null)
const chartTime = ref(null)
const chartBType = ref(null)

// 发送请求获取用户数据
const getUsers = () => {
  const query = {
    pageNo: 1,
    pageSize: 500,
  }
  pageUsers(query).then(res => {
    users.value = res.data.records
    total.value = res.data.total
    updateChart()
    updateActiveChart()
  })
}
// 发送请求，获取商家数据
const getBusiness = () => {
  const query = {
    pageNo: 1,
    pageSize: 500,
  }
  pageBusiness(query).then(res => {
    business.value = res.data.records
    total.value = res.data.total
    updateHourlyLineChart()
    updateTypeChart()
  })
}
// 统计城市频次
const updateChart = () => {
  const cityCountMap = {}
  users.value.forEach(user => {
    const city = user.location
    if (city) {
      cityCountMap[city] = (cityCountMap[city] || 0) + 1
    }
  })
  const dataArray = Object.keys(cityCountMap).map(city => ({
    name: city,
    value: cityCountMap[city],
  }))
  if (chartCity.value) {
    chartCity.value.setOption({
      title: { text: '用户所在城市统计' },
      tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: dataArray.map(d => d.name)
      },
      series: [
        {
          name: '城市',
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data: dataArray,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
  }
}
// 统计followers/following/likes的多级条形图
const updateActiveChart = () => {
  if (!users.value || users.value.length === 0) return;

  const topUsers = users.value
      .map(user => {
        const followers = user.followers || 0;
        const following = user.following || 0;
        const likes = user.likes || 0;
        return {
          username: user.username,
          followers,
          following,
          likes,
          total: followers + following + likes
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0,7);

  const categories = topUsers.map(u => u.username);
  // 定义三个系列：followers（红）、following（蓝）、likes（橙）
  const series = [
    {
      name: '粉丝数',
      type: 'bar',
      stack: '总量',
      itemStyle: { color: 'red' },
      data: topUsers.map(u => u.followers),
    },
    {
      name: '点赞数',
      type: 'bar',
      stack: '总量',
      itemStyle: { color: 'blue' },
      data: topUsers.map(u => u.following),
    },
    {
      name: '关注数',
      type: 'bar',
      stack: '总量',
      itemStyle: { color: 'orange' },
      data: topUsers.map(u => u.likes),
    },
  ];

  if (chartActive.value) {
    chartActive.value.setOption({
      title: {
        text: '用户活跃度统计',
        subtext: '粉丝数、点赞数、关注数之和'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: { data: ['粉丝数', '点赞数', '关注数'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: categories },
      series: series,
    });
  }
}
// 统计开店时间段数据
const updateHourlyLineChart = () => {
  if (!business.value || business.value.length === 0) return;

  // 初始化24小时数组
  const hoursCount = Array(24).fill(0);

  // 解析时间范围，将每个小时范围内的小时自增
  business.value.forEach(item => {
    const hoursStr = item.openingHours || '';
    // 解析时间长度字符串：例 “每天09：00~21：00”、“全天开放”
    if (hoursStr.includes('全天')) {
      // 全天，所有小时都+1
      for (let i = 0; i < 24; i++) {
        hoursCount[i]++;
      }
    } else {
      // 提取时间段
      const match = hoursStr.match(/\d{1,2}:\d{2}/g);
      if (match && match.length >= 2) {
        const startHour = parseInt(match[0].split(':')[0], 10);
        const endHour = parseInt(match[1].split(':')[0], 10);
        // 将start到end小时（包头）都+1
        for (let h = startHour; h <= endHour; h++) {
          hoursCount[h]++;
        }
      }
    }
  });
  // 生成折线图的option
  const option = {
    title: {
      text: '每小时商家营业统计'
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '商家数',
        type: 'line',
        data: hoursCount
      }
    ]
  };

  // 设置图表
  if (chartTime.value) {
    chartTime.value.setOption(option);
  }
};
// 统计不同类别的商户数量的环形图
const updateTypeChart = () => {
  if (!business.value || business.value.length === 0) return;

  // 统计每种商户类别的数量
  const typeCounts = {};
  business.value.forEach(item => {
    const type = item.businessType ;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  // 数据格式转换为echarts需要的数组
  const seriesData = Object.keys(typeCounts).map(type => ({
    name: type,
    value: typeCounts[type]
  }));

  // 设置环形图（饼图）的配置
  const option = {
    title: {
      text: '商户类别分布',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      data: Object.keys(typeCounts)
    },
    series: [
      {
        name: '商户类别',
        type: 'pie',
        radius: ['40%', '70%'], // 内外半径，表示环形
        data: seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  // 设置图表
  if (chartBType.value) {
    chartBType.value.setOption(option);
  }
}
onMounted(() => {
  // 初始化城市统计饼图
  chartCity.value = echarts.init(document.getElementById('test1'))
  // 初始化活跃度多级条形图
  chartActive.value = echarts.init(document.getElementById('test2'))
  // 初始化时间线图
  chartTime.value = echarts.init(document.getElementById('test3'))
  // 获取数据，自动更新四个图表
  chartBType.value = echarts.init(document.getElementById('test4'))
  getUsers()
  getBusiness()
})
</script>

<template>
  <el-card>
    <h1>数据统计</h1>
  </el-card>
  <h1>用户统计</h1>
  <div style="display: flex; gap: 20px;">
    <div id="test1" style="width: 600px; height: 400px;"></div>
    <div id="test2" style="width: 600px; height: 400px;"></div>
  </div>
  <h1>商家统计</h1>
  <div style="display: flex; gap: 20px;">
    <div id="test3" style="width: 600px; height: 400px;"></div>
    <div id="test4" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<style scoped>

</style>