<script setup>
import { ref } from 'vue';
import { getCurUser, updateUser } from "@/api/api";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const user = ref({
  name: '小明',
  location: '东莞',
  followers: 0,
  following: 0,
  likes: 0,
})

const activities = ref([
  {
    type: 'checkin',
    title: '在苏雀·淮扬小馆签到',
    location: '长安中路与小秦东路交叉口东北角赛格国际购物中心七楼',
    time: '2024-09-16 12:39',
    description: '2024年打卡的第1个西安的地点'
  }
])

const reviews = ref([
  {
    shop: '比格比萨自助(西安钟楼开元店) (消费)',
    content: '评价：还记得这家店吗？写评价记录生活、分享体验',
    time: '2024-07-21 20:35',
    anonymous: false
  },
  {
    shop: '烹小鲜椰子鸡 (西安合生汇店) 立即报名',
    content: '不错，环境不错，口味清淡，食材新鲜',
    time: '2024-07-21 20:35',
    anonymous: true
  }
])

</script>

<template>
  <div class="container">
<!--    header-->
    <div class="header">
      <div class="user-info">
        <div class="username">{{ user.name }}</div>
        <button class="edit-btn">编辑资料</button>
      </div>

      <div class="location">
        <i class="fas fa-map-marker-alt"></i>
        <span>{{ user.location }}</span>
      </div>
      <div class="nav-tabs">
        <div class="nav-item active">首页</div>
        <div class="nav-item">评价</div>
        <div class="nav-item">收藏</div>
        <div class="nav-item">签到</div>
        <div class="nav-item">图片</div>
      </div>
    </div>

    <div class="stats">
      <div class="stat-item">
        <div class="stat-value">{{ user.following }}</div>
        <div class="stat-label">关注</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ user.followers }}</div>
        <div class="stat-label">粉丝</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ user.likes }}</div>
        <div class="stat-label">获赞</div>
      </div>
    </div>
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

    <div class="card">
      <div class="card-header">
        <div class="card-title">评价</div>
        <div class="more-link">全部评价 ></div>
      </div>
      <div class="card-body">
        <div class="review-item" v-for="(review, i) in reviews" :key="i">
          <div class="review-shop">{{ review.shop }}</div>
          <div class="review-content">{{ review.content }}</div>
          <div class="review-footer">
            <div class="review-time">
              {{ review.time }}<span v-if="review.anonymous" style="color:#3498db; margin-left:10px;">匿名评价</span>
            </div>
            <div class="review-actions">
              <span><i class="far fa-thumbs-up"></i> 赞</span>
              <span><i class="far fa-comment"></i> 回应</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">图片</div>
      </div>
      <div class="images-section">
        <div class="image-placeholder">
          <i class="fas fa-camera"></i>
          <div class="image-text">无论是最影粉，还是验毒派，还原现场分享给更多人是最大美德</div>
          <div style="font-size:14px; color:#666; margin-top:10px;">有图有真相！</div>
        </div>
      </div>
    </div>

    <div class="checkin-card">
      <div class="checkin-header">
        <div class="checkin-title">签到</div>
        <button class="checkin-btn">签到</button>
      </div>
      <div class="checkin-location">2024年9月16日在 苏雀·淮扬小馆</div>
      <div class="checkin-location">长安中路与小秦东路交叉口东北角赛格国际购物中心七楼</div>
      <div class="checkin-stats">2024年打卡的第1个西安的地点</div>
    </div>

    <div class="post-section">
      <div class="post-title">帖子</div>
      <div class="post-desc">社区就是资深dpers的大本营，谈美食、聊游记、扯八卦、抢圈品~快去社区发个处女帖</div>
      <button class="post-btn">发帖子</button>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

body {
  background-color: #f5f7fa;
  color: #333;
  padding-bottom: 60px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

/* 头部区域 */
.header {
  background: linear-gradient(135deg, #3498db, #8e44ad);
  color: white;
  padding: 20px 15px;
  position: relative;
  border-radius: 0 0 15px 15px;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.username {
  font-size: 22px;
  font-weight: bold;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.location {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 20px;
}

.location i {
  margin-right: 5px;
  font-size: 12px;
}

/* 导航栏 */
.nav-tabs {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  color: #3498db
}

.nav-item.active {
  color: #3498db;
  font-weight: bold;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  width: 60%;
  height: 3px;
  background: #3498db;
  border-radius: 3px;
}

/* 统计信息 */
.stats {
  display: flex;
  justify-content: space-around;
  background: white;
  padding: 15px;
  margin: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #3498db;
}

.stat-label {
  font-size: 13px;
  color: #777;
  margin-top: 5px;
}


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

/* 动态项 */
.activity-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.activity-item:last-child {
  border-bottom: none;
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

/* 评价项 */
.review-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
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

/* 图片区域 */
.images-section {
  padding: 15px;
  text-align: center;
}

.image-placeholder {
  background: #f0f8ff;
  border: 2px dashed #3498db;
  border-radius: 12px;
  padding: 30px 20px;
  margin: 15px 0;
}

.image-placeholder i {
  font-size: 36px;
  color: #3498db;
  margin-bottom: 10px;
}

.image-text {
  color: #3498db;
  font-weight: bold;
  font-size: 16px;
  margin-top: 5px;
}

/* 签到区域 */
.checkin-card {
  background: linear-gradient(to right, #ffecd2, #fcb69f);
  border-radius: 12px;
  padding: 15px;
  margin: 15px;
  color: #8b4513;
}

.checkin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.checkin-title {
  font-weight: bold;
  font-size: 16px;
}

.checkin-btn {
  background: #ff7e5f;
  color: white;
  border: none;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

.checkin-location {
  font-size: 14px;
  margin-bottom: 5px;
}

.checkin-stats {
  font-size: 13px;
  color: #a05a2c;
}

/* 发帖区域 */
.post-section {
  background: linear-gradient(to right, #e0f7fa, #b2ebf2);
  border-radius: 12px;
  padding: 20px;
  margin: 15px;
  text-align: center;
  color: #006064;
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.post-desc {
  font-size: 14px;
  margin-bottom: 15px;
}

.post-btn {
  background: #00bcd4;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.post-btn:hover {
  background: #0097a7;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式调整 */
@media (max-width: 600px) {
  .nav-item {
    font-size: 13px;
    padding: 10px 0;
  }

  .card {
    margin: 10px;
  }
}
</style>
