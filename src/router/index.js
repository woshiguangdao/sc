import {createRouter, createWebHistory} from "vue-router";
import Login from "@/views/Login.vue";
import Layout from "@/views/Layout.vue";
import UserRegister from "@/views/UserRegister.vue";
import BusinessRegister from "@/views/BusinessRegister.vue";
import UserList from "@/views/user/UserList.vue";
import BusinessList from "@/views/user/BusinessList.vue";
import UserData from "@/views/user/UserData.vue";
import Home from "@/views/Home.vue";
import UserPage from "@/views/UserPage.vue";
import MerchantPage from "@/views/MerchantPage.vue";
import UserProfile from "@/views/UserProfile.vue";
import Home_logined from "@/views/Home_logined.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import SearchResultsPage from "@/views/SearchResultsPage.vue";
import UserProfile_Favorite from "@/views/UserProfile_Favorite.vue";
import TestPage from "@/views/TestPage.vue";


// 定义路由关系
const routes = [
  {path: '/login', component: Login},  // 一级路由
  {
    path: '/',
    redirect: '/login',  // 重定向
    component: Layout,
    // 子路由
    // 子路由
    children: [
      {path: '/user/list', component: UserList},
      {path: '/user/count',component: BusinessList},
      {path: '/user/data',component: UserData},
    ]
  },

  {path: '/Home', name: 'Home', component: Home},
  {path: '/UserRegister', name: 'UserRegister', component: UserRegister},
  {path: '/BusinessRegister', name: 'BusinessRegister', component: BusinessRegister},
  {path: '/Home_logined', name: 'Home_logined', component: Home_logined},
  {path: '/UserPage', name: 'UserPage', component: UserPage},
  {path: '/MerchantPage', name: 'MerchantPage', component: MerchantPage},
  {path: '/UserProfile', name: 'UserProfile', component: UserProfile},
  {path: '/RegisterPage', name: 'RegisterPage', component: RegisterPage},
  {path: '/SearchResultsPage', name: 'SearchResultsPage', component: SearchResultsPage},
  {path: '/UserProfile_Favorite',name: 'UserProfile_Favorite',component: UserProfile_Favorite},
  {path: '/TestPage', name: 'TestPage', component: TestPage},


]

// 创建路由器
const router = createRouter({
  history: createWebHistory(), // 路由模式
  routes: routes
})

//导出暴露
export default router
