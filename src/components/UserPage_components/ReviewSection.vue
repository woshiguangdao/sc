<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
import axios from "axios";

const props = defineProps({
  user: {
    type: Object,
    required: false,
    default: () => ({}), // 设置默认值为空对象，防止 undefined 报错
  },
});

const reviews = ref([]);
const isLoading = ref(false);

// 获取评论的函数
const getReview = async () => {
  try {
    const res = await axios.get(`/api/reviews/getByUserId?userId=${props.user?.userId}`);
    console.log('📦 后端完整原始响应:', res.data); // 看这里
    console.log('📦 第一条数据的 keys:', Object.keys(res.data.data[0])); // 关键：看字段名到底是什么

    if (res.data.code === 0) {
      reviews.value = res.data.data;

      // 调试：打印第一条数据的 userId
      if (reviews.value.length > 0) {
        console.log('🔍 第一条数据的 userId 值:', reviews.value[0].userId);
        console.log('🔍 第一条数据的 user_id 值:', reviews.value[0]['user_id']); // 尝试下划线
      }

      await loadUsernamesForReviews();
    }
  } catch (error) {
    console.error('加载评论失败', error);
  }
};

const loadBusnamesForReviews = async () => {
  console.log("🔄 开始加载商户名称...");

  const promises = reviews.value.map(async (review) => {
    // 【关键修复 3】校验 businessId
    if (!review.businessId) {
      console.warn("⚠️ 评论缺少 businessId，跳过加载商户名", review);
      review.businessName = "未知商户"; // 给个默认值
      return;
    }
    return getBusById(review);
  });

  await Promise.all(promises);
  console.log("✅ 所有商户名称已加载完成");
};

// 根据 id 获取商户信息的函数
const getBusById = async (review) => {
  try {
    const businessId = review.businessId;
    // 确保 URL 拼接正确
    const response = await axios.get(`/api/businesses/${businessId}`);

    // 适配不同的后端响应结构 (status 或 code)
    const responseData = response.data;
    const isSuccess = responseData.status === true || responseData.code === 0;

    if (isSuccess) {
      const business = responseData.data;
      if (business && business.name) {
        // 直接修改当前 review 对象，Vue 的响应式系统会自动更新视图
        review.businessName = business.name;
        // console.log(`🏪 已加载商户 [${businessId}]:`, business.name);
      } else {
        review.businessName = "商户信息缺失";
      }
    } else {
      console.warn(`⚠️ 获取商户 ${businessId} 失败:`, responseData.message);
      review.businessName = "加载失败";
    }
  } catch (error) {
    console.error(`💥 请求商户 ${review.businessId} 出错:`, error);
    review.businessName = "网络错误";
  }
};

// 监听 props.user 的变化，如果 user 是异步获取的，变化后重新加载
watch(() => props.user, (newUser) => {
  if (newUser && newUser.userId) {
    console.log("👀 检测到 user 变化，重新加载评论");
    getReview();
  }
}, { deep: true });

onMounted(() => {
  // 组件挂载时尝试加载
  // 如果此时 props.user 还没值，watch 会在稍后触发
  if (props.user && props.user.userId) {
    getReview();
  } else {
    console.log("⏳ 等待 user 数据就绪...");
  }
});

const fmtDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // 如果日期无效，原样返回

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">评价</div>
      <div class="more-link">全部评价 ></div>
    </div>
    <div class="card-body">
      <div class="review-item" v-for="(review, i) in reviews" :key="i">
        <div class="review-shop">{{ review.businessName }}</div>
        <div class="review-content">{{ review.content }}</div>
        <div class="review-footer">
          <div class="review-time">
            {{ fmtDate(review.commentTime )}}<span v-if="review.anonymous" style="color:#3498db; margin-left:10px;">匿名评价</span>
          </div>
          <div class="review-actions">
            <span><i class="far fa-thumbs-up"></i> 赞</span>
            <span><i class="far fa-comment"></i> 回应</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 内容卡片 */
.card {
  background: white;
  margin: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}

.more-link {
  color: #3498db;
  font-size: 13px;
}

.card-body {
  padding: 15px;
}

.review-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s ease; /* 添加平滑过渡效果 */
}

/* 鼠标悬停时的浮动效果 */
.review-item:hover {
  transform: translateY(-5px); /* 向上浮动 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* 增加阴影 */
  background-color: #fafafa; /* 更改背景颜色 */
}

.review-shop {
  font-weight: bold;
  margin-bottom: 5px;
}

.review-content {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  margin: 8px 0;
  font-size: 14px;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.review-actions span {
  margin-left: 15px;
  cursor: pointer;
}
</style>
