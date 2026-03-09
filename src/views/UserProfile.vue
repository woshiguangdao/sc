<script setup>


import HeaderSection from "@/components/UserPage_components/HeaderSection.vue";
import ActivitySection from "@/components/UserPage_components/ActivitySection.vue";
import ReviewSection from "@/components/UserPage_components/ReviewSection.vue";
import PostSection from "@/components/UserPage_components/PostSection.vue";

import { useRoute } from 'vue-router';

const route = useRoute();

// 从路由查询参数中获取 user 数据
const user = route.query.user ? JSON.parse(route.query.user) : null;

console.log(user); // 在这里查看传递的 user 对象

</script>

<template>
  <div class="user-profile">
    <HeaderSection :user="user"/>
    <ActivitySection :user="user"/>
    <ReviewSection :user="user"/>
    <PostSection :user="user"/>
  </div>
</template>



<style scoped>
.user-profile {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}
</style>
