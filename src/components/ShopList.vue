<script setup>

</script>

<template>
  <div class="news-list">
    <div class="news-card" v-for="(item, i) in newsList" :key="i">
      <img :src="item.img" alt="新闻封面" class="cover" />
      <div class="content">
        <h3 class="title">{{ item.title }}</h3>
        <p class="desc">{{ item.desc }}</p>
        <p class="date">{{ item.date }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const newsList = [
  {
    title: '瑞幸夏日限定：冰萃咖啡系列全新上市',
    desc: '尝试全新「椰青冰萃」和「西柚气泡美式」，第二杯半价活动进行中！',
    date: '2025-07-01',
    img: 'src/assets/Home/ruixin.jpg' //瑞幸
  },
  {
    title: '喜茶「多肉葡萄」回归！搭配芝士奶盖更过瘾',
    desc: '经典人气款限时返场，购买大杯赠送限定贴纸一套。',
    date: '2025-06-26',
    img: 'src/assets/Home/xicha.png' //喜茶
  },
  {
    title: '好利来半熟芝士新口味：蜜桃乌龙茶风味',
    desc: '入口即化的绵密口感，搭配清甜桃香，现在购买享满减优惠。',
    date: '2025-06-20',
    img: 'src/assets/Home/haolilai.webp' //好利来
  },
  {
    title: '电影《热烈》热映中！励志街舞故事引发观众共鸣',
    desc: '上映首周票房破5亿，豆瓣评分8.7，年度热血佳作不容错过。',
    date: '2025-06-10',
    img: 'src/assets/Home/reilie.jpg' //电影热烈
  },
  {
    title: '山姆会员店必买清单：这些网红零食回购率超高',
    desc: '麻薯面包、榴莲千层、牛肉卷...会员日还有额外折扣！',
    date: '2025-06-05',
    img: 'src/assets/Home/shanmu.jpeg' //山姆会员商店
  },
  {
    title: '西藏旅游攻略：布达拉宫最佳拍摄机位推荐',
    desc: '避开人潮，清晨7点的日光殿和药王山观景台最出片。',
    date: '2025-06-05',
    img: 'src/assets/Home/budala.jpg' //布达拉宫
  },
  {
    title: '和平饭店下午茶体验：在老上海风情中品味经典',
    desc: '爵士乐伴餐，外滩江景尽收眼底，需提前一周预约。',
    date: '2025-06-05',
    img: 'src/assets/Home/hepingfandian.jpg' //和平饭店
  },
  {
    title: '瑞铂酒店推出「城市staycation」套餐，含双人SPA',
    desc: '周末微度假新选择，高空无边泳池+米其林推荐餐厅。',
    date: '2025-06-05',
    img: 'src/assets/Home/jiudian.jpg' //瑞铂酒店
  }
]
</script>

<style scoped>
.news-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 32px;
  background-color: #f8f9fa;
}

.news-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #222;
}

.desc {
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
}

.date {
  font-size: 12px;
  color: #999;
  margin-top: auto;
}
</style>
