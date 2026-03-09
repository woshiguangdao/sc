<script setup>

import Header from "@/components/Header.vue";
import SearchResultsComponent from "@/components/SearchResultsPage/SearchResultsComponent.vue";
import Header_logined from "@/components/Header_logined.vue";

import {useRoute} from "vue-router";
const route = useRoute();
const user = route.query.user ? JSON.parse(route.query.user) : null;

console.log(12345)
console.log(user);



</script>

<template>
  <Header_logined :user="user"/>
  <SearchResultsComponent :user="user"/>
</template>

<style scoped>

</style>