<script setup>
</script>

<template>
  <div class="dish-details">
    <h2>菜品详情</h2>
    <div class="details">
      <div v-for="dish in dishDetails" :key="dish.id" class="dish-card">
        <img :src="dish.img" alt="dish.name" />
        <div class="info">
          <h3>{{ dish.name }}</h3>
          <p>{{ dish.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const dishDetails = ref([
      {
        id: 1,
        name: '亚麻籽粉蓝莓松饼',
        img: 'src/assets/MerchantPage/pic3.jpg',
        description: '这道菜非常受欢迎，味道浓郁。',
      },
      {
        id: 2,
        name: '绿豆糕',
        img: 'src/assets/MerchantPage/pic7.jpg',
        description: '这道菜口感丰富，非常适合聚会。',
      },
      {
        id: 3,
        name: '戚风蛋糕',
        img: 'src/assets/MerchantPage/pic5.jpeg',
        description: '这道菜口感丰富，非常适合聚会。',
      },
      {
        id: 4,
        name: '坚果榴莲慕斯',
        img: 'src/assets/MerchantPage/pic8.jpg',
        description: '这道菜口感丰富，非常适合聚会。',
      },
    ]);

    return {
      dishDetails,
    };
  },
};
</script>

<style scoped>
.dish-details {
  padding: 20px;
}

.details {
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  gap: 20px;
}

.dish-card {
  text-align: center;
  position: relative;
  border-radius: 15px; /* 添加圆角 */
  overflow: hidden; /* 防止图片溢出 */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease; /* 添加平滑过渡 */
  background-color: #fff; /* 背景色 */
}

.dish-card:hover {
  transform: translateY(-10px); /* 上浮效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 增加阴影效果 */
}

.dish-card img {
  width: 100%; /* 确保图片填充整个容器 */
  height: 250px;
  object-fit: cover; /* 保持图片的比例 */
  border-radius: 15px; /* 圆角图片 */
}

.dish-card .info {
  padding: 10px;
}

.dish-card h3 {
  margin: 10px 0;
  font-size: 1.2rem;
}

.dish-card p {
  font-size: 1rem;
  color: #777;
}
</style>
