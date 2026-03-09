<script setup>
import {defineProps,onMounted, ref} from "vue";
import axios from "axios";
import router from "@/router";
const props = defineProps({
  user: {
    type: Object,
    required: false,
  },
});

console.log(66666)
console.log(props.user)
console.log(props.user.username)
console.log(77777)

const user1 = ref({
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

const favors = ref([]);

const getFavors=()=>{
  const query={userId : props.user.userId}
  axios.get('/api/favorites/getByUserId',{
    params:query
  })
      .then((res)=>{
        if (res.data.code === 0) {
          //console.log("获取的评论数据: ", res.data);
          favors.value = res.data.data; // 将评论数据存储到 `reviews`
          console.log("获取的收藏数据: ", favors);
          loadBusForFavor();
        } else {
          console.error('服务返回异常: ', res.data.message);
        }
      })
      .catch((error) => {
        console.error("获取评论失败: ", error); // 错误处理
      });
}

const loadBusForFavor = async () => {
  // 使用 Promise.all 等待所有异步请求完成
  const promises = favors.value.map((favors) => {
    return getBusById(favors.businessId);
  });
  // 等待所有请求完成
  await Promise.all(promises);
  console.log("所有用户信息已加载完成");
};

// 根据 id 获取商户信息的函数
const getBusById = async (businessId) => {
  try {
    // 使用模板字符串正确插入 id
    const response = await axios.get(`/api/businesses/${businessId}`); // 确保 URL 中的 id 正确传递
    if (response.data.status) {
      // 找到对应的评论并更新用户名
      const business = response.data.data;
      const favor = favors.value.find(r => r.businessId === businessId); // 查找对应的评论
      if (favor) {
        favor.businessName =business.name; // 更新用户名
        favor.businessLocation=business.location;
        favor.businessType=business.businessType;
        favor.businessTime=business.openingHours;
        favor.businessContact=business.contact;

        console.log("对应商家名字",favor.businessName)
      }
    } else {
      console.error('获取用户信息失败', response.data.message);
    }
  } catch (error) {
    console.error('请求出错：', error);
  }
};

onMounted(()=>{
  getFavors()
})

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
    path:'/UserProfile',
    query: {
      user: JSON.stringify(props.user), // 将 user 对象转换成字符串传递
    },
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
const deleteFavorite = async (favoriteId) => {
  try {
    const response = await axios.get('/api/favorites/deleteById', {
      params: {
        id: favoriteId
      }
    });

    if (response.data && response.data.data === true) {
      window.location.reload();
      await ElMessage.success("取消收藏成功");
      // 可选：更新前端收藏状态
    } else {
      ElMessage.warning("取消收藏失败");
    }
  } catch (error) {
    console.error("删除收藏出错：", error);
    ElMessage.error("服务器错误，取消收藏失败");
  }
};

</script>


<template>
  <div class="header">
    <div class="user-info">
      <div class="username">{{ user1.name }}</div>
      <button class="edit-btn">编辑资料</button>
    </div>
    <div class="location">
      <i class="fas fa-map-marker-alt"></i>
      <span>{{ user1.location }}</span>
    </div>
    <div class="nav-tabs">
      <div class="nav-item" @click="toUserProfile">首页</div>
      <!--      <div class="nav-item">评价</div>-->
      <div class="nav-item active" @click="toFavorite">收藏</div>
      <div class="nav-item">签到</div>
      <div class="nav-item" @click="toLogin">登出</div>
      <div class="nav-item" @click="toHome">主页</div>
    </div>
  </div>

  <div class="stats">
    <div class="stat-item">
      <div class="stat-value">{{ user1.following }}</div>
      <div class="stat-label">关注</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">{{ user1.followers }}</div>
      <div class="stat-label">粉丝</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">{{ user1.likes }}</div>
      <div class="stat-label">获赞</div>
    </div>
  </div>

  <!-- 收藏商家列表 -->
  <div class="favorites-list">
    <h3>收藏的商家</h3>
    <div class="favorites-grid">
      <div v-for="(favor, index) in favors" :key="index" class="favorite-card">
        <div class="business-info">
          <h4>{{ favor.businessName }}</h4>
          <p class="location">{{ favor.businessLocation }}</p>
          <p class="type">{{ favor.businessType }}</p>
          <p class="time">营业时间: {{ favor.businessTime }}</p>
        </div>
        <button class="contact-btn" @click="deleteFavorite(favor.favoriteId)">删除收藏</button>
      </div>
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

/* 收藏商家列表 */
.favorites-list {
  margin-top: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.favorites-list h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.favorite-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.favorite-card:hover {
  transform: translateY(-5px);
}

.business-info h4 {
  font-size: 16px;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 10px;
}

.business-info p {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.business-info .location {
  font-style: italic;
}

.contact-btn {
  background-color: #3498db;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.contact-btn:hover {
  background-color: #2980b9;
}
</style>
