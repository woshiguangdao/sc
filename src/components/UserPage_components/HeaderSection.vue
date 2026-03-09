<script setup>
import {ref} from "vue";
import axios from "axios";
import router from "@/router";
import {Plus} from "@element-plus/icons-vue";
const props = defineProps({
  user: {
    type: Object,
    required: false,
  },
});
console.log(33333)
console.log(props.user)
console.log(4444)
const user = ref({
  name: props.user.username,
  location:props.user.location,
  followers:props.user.followers,
  following: props.user.following,
  likes: props.user.likes,
  registerDate: props.user.registerDate})

const fmtDate = (dateString) => {
  const date = new Date(dateString); // 转换为 Date 对象
  const year=date.getFullYear();
  const month = date.getMonth() + 1; // 获取月份（注意，月份是从0开始的，所以需要加1）
  const day = date.getDate(); // 获取日期
  return `${year}年${month}月${day}日`; // 格式化为 "5月15日"
};
// 创建一个 ref 来存储评论数据
const reviews = ref([]);




const toFavorite=()=>{
  router.push({
    path:'/UserProfile_Favorite',
    query: {
      user: JSON.stringify(props.user), // 将 user 对象转换成字符串传递
    },
  })
}
const toUserProfile=()=>{
  router.push({
    path:'/UserProfile'
  })
}
const toHome=()=>{
  router.push({
    path:'/Home_logined',
    query: {
      user: JSON.stringify(props.user), // 将 user 对象转换成字符串传递
    },
  })
}
const toLogin=()=>{
  router.push({
    path:'/login',
  })
}
</script>


<template>
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
      <div class="nav-item active" @click="toUserProfile">首页</div>
      <!--      <div class="nav-item">评价</div>-->
      <div class="nav-item" @click="toFavorite">收藏</div>
      <div class="nav-item">签到</div>
      <div class="nav-item" @click="toLogin">登出</div>
      <div class="nav-item" @click="toHome">主页</div>
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

</template>



<style scoped>
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

/* 注册时间 */
.register-time {
  text-align: center;
  color: #888;
  font-size: 13px;
  margin: 10px 0 20px;
}
</style>
