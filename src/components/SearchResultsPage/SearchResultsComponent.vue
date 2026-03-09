<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from "@/router";

// 定义响应式变量
const businesses = ref([]);
const isLoading = ref(true);
const error = ref(null);

// 获取当前路由
const route = useRoute();

// loadBusinesses 函数
const loadBusinesses = () => {
  if (route.query.businesses) {
    try {
      businesses.value = JSON.parse(route.query.businesses);
      isLoading.value = false;
    } catch (e) {
      console.error('数据解析失败:', e);
      error.value = '数据格式错误';
      isLoading.value = false;
    }
  } else {
    console.warn('未接收到商家数据');
    error.value = '未找到搜索结果';
    isLoading.value = false;
  }
};

// 使用 onMounted 生命周期钩子替代 created
onMounted(() => {
  loadBusinesses();
});

const user = route.query.user ? JSON.parse(route.query.user) : null;

const toDetail = (business) => {
  // 这里使用 query 将 business 对象作为字符串传递到详情页
  router.push({
    path: '/MerchantPage',  // 详情页面的路由名称
    query: {
      business: JSON.stringify(business) ,// 将 business 对象转化为 JSON 字符串传递
      user:JSON.stringify(user)
    }
  });
};
</script>

<template>
  <div class="container">
    <h2 class="title">商家搜索结果</h2>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <p>正在加载搜索结果...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p class="error">{{ error }}</p>
    </div>

    <!-- 结果展示 -->
    <div v-else-if="businesses.length > 0" class="results" >

      <div
          v-for="(business, index) in businesses"
          :key="index"
          class="business-card"
          @click="toDetail(business)"
      >
        <div class="business-content">
          <div class="business-info">
            <h3 class="business-name">{{ business.name }}</h3>
            <p class="description">{{ business.description }}</p>
            <p class="address"><strong>地址:</strong> {{ business.location }}</p>
            <p class="type"><strong>类型:</strong> {{ business.businessType || business['business-type'] }}</p>
          </div>
          <div class="business-image">
            <img v-if="business.coverImage" :src="business.coverImage" alt="商家图片"/>
          </div>
        </div>
      </div>

    </div>

    <!-- 无结果状态 -->
    <div v-else class="no-results">
      <p>没有找到符合条件的商家</p>
    </div>

  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
}

.loading-state, .error-state, .no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
}

.error {
  color: red;
  font-weight: bold;
}

.business-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.business-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.business-name {
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
  margin-bottom: 10px;
}

.description {
  font-size: 1rem;
  color: #777;
  margin-bottom: 10px;
}

.address, .type {
  font-size: 0.9rem;
  color: #555;
}

.no-results p {
  font-size: 1.2rem;
  color: #888;
  text-align: center;
}
.business-content {
  display: flex;
  justify-content: space-between;
  align-items:  center;
}

.business-info {
  flex: 1;
}

.business-image img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  margin-left: 20px;
}
</style>

