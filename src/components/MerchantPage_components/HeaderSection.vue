<script setup>
import {defineProps, onMounted, ref} from 'vue';

// 定义传入的 props
const props = defineProps({
  business: {
    type: Object,
    required: false,
  },
});

console.log(props.business);
const name = ref(props.business ? props.business.name : '默认商家名称');
//const name =business.name ;
const rating = ref(0);
//const reviews = ref(29961);
const openingHours = ref(props.business ? props.business.openingHours : '默认商家名称');
const location = ref(props.business ? props.business.location : '默认商家名称');
const phone = ref(props.business ? props.business.contact : '默认商家名称');

const test=()=>{
  console.log(2222222)
  console.log(props.business);
  console.log(333333)
}
test()
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
// 创建一个响应式变量 `reviews`
const reviews = ref(0);

// 函数：生成 10000 到 50000 之间的随机数
const getRandomReviews = () => {
  return Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000;
};
const getRandomReviews1 = () => {
  return (Math.random() * (5 - 3) + 3).toFixed(1);
};

// 在组件挂载时更新一次 reviews
onMounted(() => {
  rating.value=getRandomReviews1();
  reviews.value = getRandomReviews(); // 仅在页面加载时生成一次随机数
});
</script>

<template>
  <div class="header">
    <div class="info-text">
      <h1>{{ name }}</h1>
      <div class="rating">
        <span>{{ rating }} ★</span>
        <span>{{ reviews }} reviews</span>
      </div>
      <div class="info">
        <p>营业时间：{{ openingHours }}</p>
        <p>地址：{{ location }}</p>
      </div>
      <div class="phone">
        <p>联系电话：{{ phone }}</p>
      </div>
    </div>
    <div class="info-image">
      <img v-if="business.coverImage" :src="business.coverImage" alt="商家图片"/>
    </div>
  </div>
</template>


<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items:  center;
  padding: 20px;
  background-color: #f8f8f8;
}

.info-text {
  flex: 1;
}

.info-image img {
  width: 270px;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}
</style>
