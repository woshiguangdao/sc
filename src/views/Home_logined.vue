<script setup>

import Banner from "@/components/Banner.vue";
import SearchBar from "@/components/SearchBar.vue";
import CategoryIcons from "@/components/CategoryIcons.vue";
import ShopList from "@/components/ShopList.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Header_logined from "@/components/Header_logined.vue";
import {useRoute} from "vue-router";
import Home_logined from "@/views/Home_logined.vue";
const route = useRoute();

// 获取传递的 business 对象
const user = route.query.user ? JSON.parse(route.query.user) : null;

  console.log(12345)
  console.log(user);


</script>

<template>
  <div>
    <Header_logined :user="user"/>
    <Banner />
    <SearchBar :user="user"/>
    <CategoryIcons />
    <ShopList />
    <Footer />
  </div>
</template>

<style scoped>

</style>