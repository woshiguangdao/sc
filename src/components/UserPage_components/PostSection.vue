<template>
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
</template>

<script>
export default {
  setup() {}
};
</script>

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
