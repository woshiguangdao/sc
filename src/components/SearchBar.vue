<script setup>
import {ref} from "vue";
import {pageBusinesses} from "@/api/api";
import router from "@/router";
const key=ref('')
const results=ref([])
const total=ref(10)

const props = defineProps({
  user: {
    type: Object,
    required: false,
  },
});

const getData = () => {
  const query = { key: key.value };

  pageBusinesses(query).then(res => {
    //console.log("搜索结果:", res.data);
    results.value = res.data;
    console.log("搜索结果:", results);
    total.value=res.data.total;

    // 使用query参数传递数据
    router.push({
      path: '/SearchResultsPage',
      query: {
        businesses: JSON.stringify(results.value),
        user: JSON.stringify(props.user)
      }
    });
  })
}

</script>

<template>
  <div class="search-bar">
    <input type="text"  v-model="key" placeholder="搜索商家或商品..." />
    <button @click="getData">搜索</button>
  </div>
<!--  <tr v-for="business in results" :key="business.businessId">-->
<!--    <td>{{business.name}}</td>-->
<!--  </tr>-->
</template>

<style scoped>
.search-bar {
  display: flex;
  max-width: 600px;
  margin: 20px auto;
}
input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
}
button {
  padding: 10px 20px;
  border: none;
  background: #ffb400;
  color: white;
  border-radius: 0 4px 4px 0;
}
</style>