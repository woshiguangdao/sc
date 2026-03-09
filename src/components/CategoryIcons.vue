<template>
  <div class="categories">
    <div class="item" v-for="(item, i) in categories" :key="i">
      <img :src="item.icon" class="icon" alt="图标" />
      <div class="text">{{ item.text }}</div>
    </div>
  </div>
</template>

<script setup>
const categories = [
  { icon: 'src/assets/Home/meishi.png', text: '美食' },
  { icon: 'src/assets/Home/lvyou.png', text: '旅游' },
  { icon: 'src/assets/Home/kafei.png', text: '咖啡' },
  { icon: 'src/assets/Home/gouwu.png', text: '购物' },
  { icon: 'src/assets/Home/meirong.png', text: '美容' },
  { icon: 'src/assets/Home/jiankang.png', text: '健康' },
  { icon: 'src/assets/Home/_waimai.png', text: '外卖' },
  { icon: 'src/assets/Home/KTV.png', text: 'KTV' },
  { icon: 'src/assets/Home/jianshen.png', text: '健身' },
  { icon: 'src/assets/Home/dianying.png', text: '电影' }
]
</script>

<style scoped>
.categories {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 每行 5 个 */
  grid-template-rows: repeat(2, auto);   /* 2 行 */
  gap: 20px;
  padding: 20px;
  background: #f5f5f5;
}
.item {
  text-align: center;
  background: white;
  border-radius: 12px;
  padding: 16px 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}
.item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.icon {
  width: 36px;
  height: 36px;
  margin-bottom: 8px;
}
.text {
  font-size: 14px;
  color: #333;
}
</style>
