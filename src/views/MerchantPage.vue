<script setup>
import { useRoute } from 'vue-router';

// 导入子组件
import HeaderSection from "@/components/MerchantPage_components/HeaderSection.vue";
import RecommendedDishes from "@/components/MerchantPage_components/RecommendedDishes.vue";
import DishDetails from "@/components/MerchantPage_components/DishDetails.vue";
import ReviewSection from "@/components/MerchantPage_components/ReviewSection.vue";
import MenuSection from "@/components/MerchantPage_components/MenuSection.vue";
import Header from "@/components/Header.vue";
import Header_logined from "@/components/Header_logined.vue";

// 使用 useRoute 获取路由参数
const route = useRoute();

// 获取传递的 business 对象
const business = route.query.business ? JSON.parse(route.query.business) : null;
const user = route.query.user ? JSON.parse(route.query.user) : null;
const test=()=>{
  console.log(11111111)
  console.log(business);
  console.log(user);
}
test()
</script>

<template>
  <div class="merchant-page">
    <Header_logined :user="user"/>
    <HeaderSection :business="business":user="user"/>
    <RecommendedDishes :business="business"/>
    <DishDetails :business="business"/>
    <ReviewSection :business="business" :user="user"/>
    <MenuSection :business="business"/>
  </div>
</template>



<style scoped>
.merchant-page {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  padding: 20px;
}
</style>