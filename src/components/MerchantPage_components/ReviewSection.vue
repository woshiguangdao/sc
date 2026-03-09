<script setup>
import {defineProps, onMounted, ref,reactive} from 'vue';
import {getBusReview} from "@/api/api";
import axios from "axios";

const props = defineProps({
  business: {
    type: Object,
    required: false,
  },
  user: {
    type: Object,
    required: false,
  },
});
console.log("RewUser",props.user)
// 创建一个 ref 来存储评论数据
const reviews = ref([]);


// 获取评论的函数
const getReview = () => {
  const query = { busId: props.business.businessId };
  console.log("props.business.businessId ", props.business.businessId);

  // 直接使用 axios 获取评论
  axios.get('/api/reviews/getByBusId', {
    params: query, // 使用 query 参数传递 businessId
  })
      .then((res) => {
        if (res.data.code === 0) {
          //console.log("获取的评论数据: ", res.data);
          reviews.value = res.data.data; // 将评论数据存储到 `reviews`
          console.log("获取的评论数据: ", reviews);
          loadUsernamesForReviews();
        } else {
          console.error('服务返回异常: ', res.data.message);
        }
      })
      .catch((error) => {
        console.error("获取评论失败: ", error); // 错误处理
      });
};


// 根据 reviewId 获取用户名并更新评论数据
const loadUsernamesForReviews = async () => {
  // 使用 Promise.all 等待所有异步请求完成
  const promises = reviews.value.map((review) => {
    return getUserById(review.userId);
  });

  // 等待所有请求完成
  await Promise.all(promises);
  console.log("所有用户信息已加载完成");
};


// 根据 id 获取用户信息的函数
const getUserById = async (userId) => {
  try {
    // 使用模板字符串正确插入 id
    const response = await axios.get(`/api/users/${userId}`); // 确保 URL 中的 id 正确传递
    if (response.data.status) {
      // 找到对应的用户信息
      const user = response.data.data;
      // 查找所有匹配的评论
      const userReviews = reviews.value.filter(r => r.userId === userId); // 使用 filter 获取所有匹配的评论
      if (userReviews.length > 0) {
        // 遍历所有匹配的评论并更新用户名
        userReviews.forEach(review => {
          review.username = user.username; // 更新用户名
          review.img=user.avater;
          console.log("更新用户名", review.reviewId, userId, review.username);
        });
      }
    } else {
      console.error('获取用户信息失败', response.data.message);
    }
  } catch (error) {
    console.error('请求出错：', error);
  }
};


// 组件挂载时调用 getReview 函数
onMounted(() => {
  getReview(); // 获取评论
});


const fmtDate = (dateString) => {
  const date = new Date(dateString); // 转换为 Date 对象
  const month = date.getMonth() + 1; // 获取月份（注意，月份是从0开始的，所以需要加1）
  const day = date.getDate(); // 获取日期
  return `${month}月${day}日`; // 格式化为 "5月15日"
};

const pic=ref({avatar: 'src/assets/MerchantPage/userHaedPic.png'})
// 控制弹窗显示与隐藏的变量


//发表评论部分
const dialogFormVisible = ref(false)

const form = reactive({
  user_id:props.user.userId,
  bus_id:props.business.businessId,
  review:'',
  rating:'',
  img:'img.jpg'
})

const submitReview = async () => {  // 确保这个函数是 async
  // 关闭对话框
  dialogFormVisible.value = false;

  // 构建请求数据
  const reviewData = {
    userId: form.user_id,
    businessId: form.bus_id,
    rating: form.rating,
    content: form.review,
    anonymous: false,  // 可以根据需求设置匿名评论
    images: form.img // 图片
  };

  try {
    // 发送 POST 请求到后端接口
    const response = await axios.post('/api/reviews/addReview', reviewData);
    window.location.reload();
    if (response.data.success) {
      console.log("评论提交成功！");
      window.location.reload();
      // 执行一些成功后的操作，比如清空表单
    } else {
      console.error("评论提交失败：", response.data.message);
    }
  } catch (error) {
    console.error("提交评论时出错:", error);
    if (error.response) {
      // 如果是后端返回的错误
      console.error("后端错误：", error.response.data);
    } else if (error.request) {
      // 如果请求发送了，但没有收到响应
      console.error("请求错误：", error.request);
    } else {
      // 其他错误
      console.error("其他错误：", error.message);
    }
  }

  console.log("评论数据集合", form);
};


//收藏部分
const isFavorited=ref('');

const submitFavorite = async () => {
  // 构建请求数据
  const favoriteData = {
    userId: form.user_id,
    businessId: form.bus_id,
    createdAt: new Date().toISOString()  // 当前时间作为收藏时间
  };

  try {
    // 发送 POST 请求到后端接口
    const response = await axios.post('/api/favorites/addFavor', favoriteData);

    if (response.data.success) {
      console.log("收藏成功！");
      // 可选：更新收藏按钮状态、提示用户等
    } else {
      console.error("收藏失败：", response.data.message);
    }
  } catch (error) {
    console.error("提交收藏时出错:", error);
    if (error.response) {
      console.error("后端错误：", error.response.data);
    } else if (error.request) {
      console.error("请求错误：", error.request);
    } else {
      console.error("其他错误：", error.message);
    }
  }

  console.log("提交的收藏数据", favoriteData);
};



const checkIfFavorited = async () => {
  console.log("是否收藏",isFavorited.value)
  try {
    const response = await axios.get('/api/favorites/checkFavor', {
      params: {
        userId: form.user_id,
        businessId: form.bus_id
      }
    });
    if (response.data.status === true && response.data.data === true) {
      isFavorited.value = true;
      console.log("是否收藏",isFavorited.value)
    }
  } catch (error) {
    console.error("查询收藏状态失败：", error);
  }
};


const handleFavoriteClick = async () => {
  await checkIfFavorited();  // 检查是否已收藏

  if (isFavorited.value === true) {
    alert("您已经收藏过该商家！");
  } else {
    await submitFavorite();  // 执行收藏操作
    isFavorited.value = true; // 收藏后标记为已收藏
    alert("收藏成功！")
  }
};
onMounted(()=>{
  checkIfFavorited();
})

const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])

const imageUrl = ref('')

const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  selectUser.value.avater = response.data.url
}
</script>

<template>
  <div  class="review-section">
    <h2>用户评论</h2>
    <div class="reviews" >
      <div class="review" v-for="review in reviews" :key="review.reviewId">
        <div class="review-header">
          <img v-if="review.img" :src="review.img" alt="评论者头像" class="review-avatar" />
          <div class="reviewer-info">
            <p class="username">{{review.username}}</p>
            <p class="review-date">{{ fmtDate(review.commentTime) }}</p>
          </div>
        </div>
        <div class="review-content">
          <p><strong>{{ review.rating }} ★</strong></p>
          <p>{{ review.content }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加评论按钮 -->
  <el-button type="primary" @click="dialogFormVisible = true">发表评论</el-button>
  <el-button type="primary" @click="handleFavoriteClick">收藏商家</el-button>

  <el-dialog v-model="dialogFormVisible" title="发表评论" width="500">
    <el-form :model="form">
      <el-form-item label="评论内容" :label-width="formLabelWidth">
        <el-input v-model="form.review" autocomplete="off" />
      </el-form-item>
<!--      评分 rating -->
      <div class="demo-rate-block">
        <span class="demonstration">你对此商家的评分:</span>
        <el-rate v-model="form.rating" :colors="colors" />
      </div>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReview">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>


</template>



<style scoped>
.review-section {
  padding: 20px;
}

.reviews {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.review {
  display: flex;
  gap: 15px;
  border-radius: 10px;
  padding: 15px;
  background-color: #f9f9f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease; /* 将过渡效果移到整个评论卡片 */
}

.review:hover {
  transform: translateY(-10px); /* 上浮效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 增加阴影效果 */
}

.review-header {
  display: flex;
  gap: 10px;
}

.review-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
}

.reviewer-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.username {
  font-weight: bold;
  font-size: 1.0rem;
}

.review-date {
  color: #888;
  font-size: 0.9rem;
}

.review-content {
  margin-top: 10px;
}

.review-content p {
  margin: 5px 0;
}

</style>
