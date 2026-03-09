<script setup>

</script>

<template>
  <div class="register-container">
    <div class="header">
      <div class="register-title">注册</div>
      <div class="register-subtitle">请填写以下信息进行注册</div>
    </div>

    <div class="register-form">
      <div class="form-item">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="user.username" placeholder="请输入用户名" />
      </div>

      <div class="form-item">
        <label for="email">邮箱</label>
        <input type="email" id="email" v-model="user.email" placeholder="请输入邮箱" />
      </div>

      <div class="form-item">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="user.password" placeholder="请输入密码" />
      </div>

      <div class="form-item">
        <label for="confirmPassword">确认密码</label>
        <input type="password" id="confirmPassword" v-model="user.confirmPassword" placeholder="请确认密码" />
      </div>

      <div class="form-item">
        <label>性别</label>
        <div class="gender-selection">
          <label>
            <input type="radio" v-model="user.gender" value="male" /> 男
          </label>
          <label>
            <input type="radio" v-model="user.gender" value="female" /> 女
          </label>
        </div>
      </div>

      <div class="form-item">
        <button @click="submitForm" class="submit-btn">提交注册</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const user = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'male',
    });

    const submitForm = () => {
      if (user.value.password !== user.value.confirmPassword) {
        alert('密码和确认密码不匹配');
      } else {
        alert('注册成功！');
      }
    };

    return {
      user,
      submitForm,
    };
  },
};
</script>

<style scoped>
.register-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.register-title {
  font-size: 24px;
  font-weight: bold;
}

.register-subtitle {
  font-size: 16px;
  color: #888;
}

.register-form {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  font-size: 14px;
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-item input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.form-item input:focus {
  border-color: #3498db;
}

.gender-selection {
  display: flex;
  gap: 20px;
  font-size: 14px;
}

.submit-btn {
  background: #3498db;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  width: 100%;
}

.submit-btn:hover {
  background: #2980b9;
}
</style>
