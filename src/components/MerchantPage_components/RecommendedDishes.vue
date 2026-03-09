<script setup>
</script>

<template>
  <div class="recommended-dishes">
    <h2>推荐菜品</h2>
    <div class="dish-list">
      <div class="dish-item" v-for="dish in dishes" :key="dish.id">
        <img :src="dish.img" alt="dish.name" />
        <p>{{ dish.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const dishes = ref([
      { id: 1, name: '冬阴功', img: 'src/assets/MerchantPage/pic1.png' },
      { id: 2, name: '芒果糯米饭', img: 'src/assets/MerchantPage/pic2.png' },
      { id: 3, name: '香茅辣椒膏炒蟹', img: 'src/assets/MerchantPage/pic9.png' },
      { id: 4, name: '香芒糯米饭', img: 'src/assets/MerchantPage/pic10.png' },
      { id: 5, name: '特色炸虾饼', img: 'src/assets/MerchantPage/pic11.png' },
      { id: 6, name: '虾酱空心菜', img: 'src/assets/MerchantPage/pic12.png' },
    ]);

    return {
      dishes,
    };
  },
};
</script>

<style scoped>
.recommended-dishes {
  padding: 20px;
}

.dish-list {
  display: flex;
  gap: 15px;
}

.dish-item {
  text-align: center;
  position: relative;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
  border-radius: 15px; /* 添加圆角 */
  overflow: hidden; /* 防止图片溢出 */
  background-color: #fff; /* 可以给方框设置背景色 */
}

.dish-item:hover {
  transform: translateY(-10px); /* 上浮效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 增加阴影效果 */
}

.dish-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 15px; /* 图片圆角 */
}

.dish-item p {
  margin-top: 10px;
  font-size: 1rem;
}
</style>
