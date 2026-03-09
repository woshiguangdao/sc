<script setup>
import { ref } from 'vue'
import router from "@/router";

const activeDropdown = ref(null)

const showDropdown = (menu) => {
  activeDropdown.value = menu
}
const hideDropdown = () => {
  activeDropdown.value = null
}
const tologin = () => {
  router.push({
    path: '/login',
    query:{id: 1}
  })
}
const toHome=()=>{
  router.push({
    path: '/Home',
    query:{id: 1}
  })
}
</script>

<template>
  <header class="header">
    <div class="logo">点点生活</div>
    <nav>
      <span class="nav-item hoverable" @click="toHome">首页</span>

      <!-- 外卖下拉 -->
      <div class="nav-item dropdown" @mouseenter="showDropdown('takeout')" @mouseleave="hideDropdown">
        <span class="hoverable">外卖</span>
        <div class="dropdown-menu" v-if="activeDropdown === 'takeout'">
          <a href="#" class="dropdown-item">美团外卖</a>
          <a href="#" class="dropdown-item">团购套餐</a>
          <a href="#" class="dropdown-item">生鲜果蔬</a>
        </div>
      </div>

      <!-- 酒店下拉 -->
      <div class="nav-item dropdown" @mouseenter="showDropdown('hotel')" @mouseleave="hideDropdown">
        <span class="hoverable">酒店</span>
        <div class="dropdown-menu" v-if="activeDropdown === 'hotel'">
          <a href="#" class="dropdown-item">快捷酒店</a>
          <a href="#" class="dropdown-item">高星级酒店</a>
          <a href="#" class="dropdown-item">海外住宿</a>
        </div>
      </div>

      <span class="nav-item hoverable">民宿</span>
      <span class="nav-item hoverable" @click="tologin">用户登录/注册</span>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #ffc300;
  color: #333;
  position: relative;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

nav {
  display: flex;
  align-items: center;
  position: relative;
}

.nav-item {
  margin-left: 24px;
  position: relative;
  cursor: pointer;
}

.hoverable:hover {
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  padding: 6px 10px;
}

/* 下拉菜单区域必须在 nav-item 内部 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  min-width: 160px;
  z-index: 100;
}

.dropdown-item {
  display: block;
  padding: 10px 16px;
  font-size: 18px;
  color: #333;
  text-decoration: none;
}

.dropdown-item:hover {
  background-color: #f2f2f2;
  color: #000;
}
</style>
