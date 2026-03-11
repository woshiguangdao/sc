<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { userLogin } from "@/api/api";

const value = ref(true);
const router = useRouter();
const username = ref("");
const password = ref("");
const yanma = ref("");
const showPassword = ref(false);
// 绑定验证码
const yantext = ref("");
const result = ref();
// 验证码图形生成
var show_num = [];
onMounted(() => {
  draw();
});

// 切换显示状态的方法
const togglePassword = () => {
  event.preventDefault();
  showPassword.value = !showPassword.value;
};

const login = () => {
  const myuser = {
    username: username.value,
    password: password.value,
  };
  userLogin(myuser).then((res) => {
    // 这里的res是封装之后的结果 表示后端返回的json数据
    if (!res.data) {
      // 用户名密码错误
      ElMessage({
        message: "用户名密码错误",
        type: "warning",
      });
    } else {
      console.log(yanma.value);
      console.info(yantext.value);
      if (yantext.value === yanma.value) {
        if (username.value === "user1") {
          ElMessage({
            message: "管理员登录成功",
            type: "success",
          });
          router.push({ path: "/User/List" });
        } else {
          ElMessage({
            message: "登录成功",
            type: "success",
          });
          result.value = res.data;
          router.push({
            path: "/Home_logined",
            query: {
              user: JSON.stringify(result.value),
            },
          });
          console.log(res.data);
        }
      } else {
        ElMessage({
          message: "验证码错误",
          type: "warning",
        });
        draw();
        yantext.value = "";
      }
    }
  });
};
function draw() {
  // jquery获取canvas对象无法获取，原生js可以解决
  var canvas_width = document.getElementById("canvas").clientWidth;
  var canvas_height = document.getElementById("canvas").clientHeight;
  var canvas = document.getElementById("canvas"); // 获取到canvas的对象，画布
  var context = canvas.getContext("2d"); // 画笔
  // 画布范围
  canvas.width = canvas_width;
  canvas.height = canvas_height;
  // 字符串
  var sCode = "1,2,3,4,5,6,7,8,9,0";
  var aCode = sCode.split(",");
  var aLength = aCode.length; // 获取到数组的长度
  for (var i = 0; i <= 3; i++) {
    // 向下取整
    var j = Math.floor(Math.random() * aLength); // 获取到随机的索引值
    var deg = (Math.random() * 30 * Math.PI) / 180; // 产生0~30之间的随机弧度
    var txt = aCode[j]; // 得到随机的一个字符
    show_num[i] = txt;
    var x = 10 + i * 20; // 文字在canvas上的x坐标
    var y = 20 + Math.random() * 8; // 文字在canvas上的y坐标
    // 字体样式大小
    context.font = "23px 微软雅黑";
    // 书写位置位移
    context.translate(x, y);
    // 旋转
    context.rotate(deg);
    // 填充的样式
    context.fillStyle = randomColor();
    // 填充的字符位置
    context.fillText(txt, 0, 0);
    // 重置书写位置(上面的xy与循环中的i有关)
    context.rotate(-deg);
    context.translate(-x, -y);
  }
  // 干扰项
  for (var i = 0; i <= 5; i++) {
    // 验证码上显示线条
    context.strokeStyle = "#000000";
    // 路线开始
    context.beginPath();
    // 起点
    context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
    // 终点
    context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
    // 关闭路线
    context.closePath();
    // 绘制
    context.stroke();
  }
  for (var i = 0; i <= 30; i++) {
    // 验证码上显示小点
    context.strokeStyle = randomColor();
    context.beginPath();
    var x = Math.random() * canvas_width;
    var y = Math.random() * canvas_height;
    // 圆心x,y,半径,起始,终点
    context.arc(x, y, 1, 0, 2 * Math.PI);
    //	            context.moveTo(x, y);
    //	            context.lineTo(x + 1, y + 1);
    context.closePath();
    context.stroke();
  }
  // 得到随机的颜色值
  function randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }
  yanma.value = show_num.join("");
  return show_num;
}
</script>

<template>
  <div class="login-page">
    <div class="login-shell">
      <div class="login-card">
        <section class="login-hero">
          <div class="brand">
            <img src="@/assets/login_title.png" alt="点点生活" />
          </div>
          <h1>点点生活，点到心坎里</h1>
          <p>本地美食、休闲娱乐、生活服务，一站式发现好店与优惠。</p>
          <div class="hero-tags">
            <span>暖心美食</span>
            <span>同城精选</span>
            <span>随时好评</span>
          </div>
          <div class="hero-card">
            <div class="hero-row">
              <strong>今日推荐</strong>
              <span>热辣新店 · 正在排队</span>
            </div>
            <div class="hero-row">
              <strong>附近优惠</strong>
              <span>团购 8 折起 · 立减券</span>
            </div>
          </div>
        </section>

        <section class="login-main">
          <div class="login-title">
            <h2>欢迎登录</h2>
            <p>登录后即可解锁专属推荐与优惠。</p>
          </div>
          <form class="login-form">
            <label class="input-field">
              <span>账号</span>
              <input
                type="text"
                v-model="username"
                clearable
                placeholder="请输入账号"
              />
            </label>
            <label class="input-field">
              <span>密码</span>
              <div class="password-row">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="请输入密码"
                />
                <button class="toggleBtn" @click="togglePassword">
                  {{ showPassword ? '隐藏' : '显示' }}
                </button>
              </div>
            </label>
            <label class="input-field captcha-field">
              <span>验证码</span>
              <div class="captcha-row">
                <input type="text" v-model="yantext" placeholder="输入验证码" />
                <canvas id="canvas" class="canvascs" @click="draw()"></canvas>
              </div>
            </label>
            <div class="action-row">
              <el-button type="primary" class="primary-btn" @click="login">
                登录
              </el-button>
            </div>
          </form>
          <div class="login-footer">
            <span>还没有账号？</span>
            <router-link :to="{ path: '/UserRegister' }">立即注册</router-link>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --warm-50: #fff6ec;
  --warm-100: #ffe5cf;
  --warm-200: #ffd1a3;
  --warm-300: #ffb876;
  --warm-400: #ff9b4a;
  --warm-500: #ff7a1a;
  --warm-600: #f06400;
  --warm-700: #cc5200;
  --warm-800: #a14100;
  --ink-900: #2b1c10;
  --ink-700: #523628;
  --ink-500: #7a5a49;
}

.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 16px;
  background: radial-gradient(circle at top left, #fff2e0, #fff8f0 35%, #fff),
    linear-gradient(120deg, #fff5ea, #fff);
  position: relative;
  overflow: hidden;
  font-family: "Poppins", "Noto Sans SC", "PingFang SC", "Microsoft YaHei",
    sans-serif;
}

.login-page::before,
.login-page::after {
  content: "";
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 154, 72, 0.35), transparent 70%);
  filter: blur(2px);
  z-index: 0;
}

.login-page::before {
  top: -120px;
  right: 8%;
}

.login-page::after {
  bottom: -160px;
  left: 6%;
  background: radial-gradient(circle, rgba(255, 201, 120, 0.35), transparent 70%);
}

.login-shell {
  width: min(1100px, 100%);
  z-index: 1;
}

.login-card {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 32px;
  padding: 32px;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 30px 60px rgba(255, 122, 26, 0.18);
  border: 1px solid rgba(255, 209, 163, 0.6);
}

.login-hero {
  padding: 24px;
  border-radius: 22px;
  background: linear-gradient(160deg, #fff7ea 0%, #ffe9d1 100%);
  color: var(--ink-900);
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.login-hero::after {
  content: "";
  position: absolute;
  right: -40px;
  bottom: -60px;
  width: 240px;
  height: 240px;
  background: url("@/assets/login-background.jpg") center / cover no-repeat;
  opacity: 0.18;
  border-radius: 32px;
  transform: rotate(-6deg);
}

.brand img {
  height: 40px;
}

.login-hero h1 {
  font-size: 28px;
  margin: 0;
}

.login-hero p {
  margin: 0;
  color: var(--ink-700);
  line-height: 1.7;
}

.hero-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-tags span {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  font-size: 12px;
  color: var(--ink-700);
  border: 1px solid rgba(255, 184, 118, 0.6);
}

.hero-card {
  margin-top: auto;
  padding: 16px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 16px 24px rgba(255, 155, 74, 0.18);
  display: grid;
  gap: 12px;
}

.hero-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--ink-500);
}

.hero-row strong {
  color: var(--ink-900);
  font-weight: 600;
}

.login-main {
  padding: 12px 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-title h2 {
  margin: 0;
  font-size: 24px;
  color: var(--ink-900);
}

.login-title p {
  margin: 6px 0 0;
  color: var(--ink-500);
}

.login-form {
  display: grid;
  gap: 16px;
}

.input-field {
  display: grid;
  gap: 8px;
  color: var(--ink-700);
  font-size: 13px;
}

.input-field input {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #f2d3b2;
  padding: 0 14px;
  background: #fffdfb;
  font-size: 14px;
  color: var(--ink-900);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-field input:focus {
  outline: none;
  border-color: var(--warm-500);
  box-shadow: 0 0 0 3px rgba(255, 122, 26, 0.15);
}

.password-row {
  position: relative;
}

.password-row input {
  padding-right: 72px;
}

.toggleBtn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 184, 118, 0.6);
  background: #fff5ea;
  color: var(--warm-700);
  font-size: 12px;
  cursor: pointer;
}

.captcha-field .captcha-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.canvascs {
  width: 100px;
  height: 36px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #f2d3b2;
}

.action-row {
  margin-top: 8px;
}

.action-row :deep(.el-button.primary-btn) {
  width: 100%;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ff8a2b, #ff5f19);
  border: none;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 12px 20px rgba(255, 122, 26, 0.25);
}

.action-row :deep(.el-button.primary-btn:hover) {
  background: linear-gradient(135deg, #ff9b4a, #ff6e2f);
}

.login-footer {
  display: flex;
  gap: 6px;
  align-items: center;
  color: var(--ink-500);
  font-size: 13px;
}

.login-footer a {
  color: var(--warm-600);
  text-decoration: none;
  font-weight: 600;
}

.login-footer a:hover {
  color: var(--warm-700);
}

@media (max-width: 900px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .login-hero::after {
    opacity: 0.12;
  }
}
</style>
