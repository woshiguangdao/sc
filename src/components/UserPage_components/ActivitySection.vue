<script setup>

</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">最近动态</div>
      <div class="more-link">更多最近动态</div>
    </div>
    <div class="card-body">
      <div class="activity-item" v-for="(item, i) in activities" :key="i">
        <div class="activity-title">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ item.title }}</span>
        </div>
        <div class="activity-detail">{{ item.location }}</div>
        <div class="activity-time">{{ item.time }} · {{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const activities = ref([
      {
        title: '在苏雀·淮扬小馆签到',
        location: '长安中路与小秦东路交叉口东北角赛格国际购物中心七楼',
        time: '2024-09-16 12:39',
        description: '2024年打卡的第1个西安的地点'
      }
    ]);

    return {
      activities
    };
  }
};
</script>

<style scoped>
.card {
  background: white;
  margin: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

.activity-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s ease; /* 添加平滑过渡效果 */
}

/* 鼠标悬停时的浮动效果 */
.activity-item:hover {
  transform: translateY(-5px); /* 向上浮动 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* 增加阴影 */
  background-color: #fafafa; /* 更改背景颜色 */
}

.activity-title {
  font-weight: bold;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.activity-title i {
  color: #3498db;
  margin-right: 8px;
}

.activity-detail {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.activity-time {
  font-size: 12px;
  color: #999;
}
</style>
