<template>
  <div class="font-sans bg-meituan-gray">
    <!-- 导航栏 -->
    <header class="bg-meituan-black fixed top-0 left-0 right-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="bg-meituan-yellow text-meituan-black font-bold text-xl px-3 py-1 rounded mr-4">
              美团
            </div>
            
            <!-- 导航链接 -->
            <nav class="hidden md:flex space-x-1">
              <a href="#" class="nav-item font-medium">美食</a>
              <a href="#" class="nav-item">酒店</a>
              <a href="#" class="nav-item">旅游</a>
              <a href="#" class="nav-item">外卖</a>
              <a href="#" class="nav-item">KTV</a>
              <a href="#" class="nav-item">电影</a>
              <a href="#" class="nav-item">丽人</a>
              <a href="#" class="nav-item">周边游</a>
            </nav>
          </div>
          
          <!-- 用户操作 -->
          <div class="flex items-center space-x-4">
            <a href="#" class="text-white hover:text-meituan-yellow transition-colors duration-200">
              <i class="fa fa-user-o mr-1"></i>登录
            </a>
            <a href="#" class="text-white hover:text-meituan-yellow transition-colors duration-200">
              <i class="fa fa-shopping-cart mr-1"></i>购物车
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- 移动端菜单按钮 -->
    <div class="fixed top-16 left-0 right-0 bg-white shadow-md z-40 md:hidden hidden">
      <div class="container mx-auto px-4 py-2">
        <div class="flex flex-wrap justify-between">
          <a href="#" class="px-3 py-2 text-meituan-black hover:bg-meituan-gray rounded-md">美食</a>
          <a href="#" class="px-3 py-2 text-meituan-black hover:bg-meituan-gray rounded-md">酒店</a>
          <a href="#" class="px-3 py-2 text-meituan-black hover:bg-meituan-gray rounded-md">旅游</a>
          <a href="#" class="px-3 py-2 text-meituan-black hover:bg-meituan-gray rounded-md">外卖</a>
          <a href="#" class="px-3 py-2 text-meituan-black hover:bg-meituan-gray rounded-md">KTV</a>
          <a href="#" class="px-3 py-2 text-meituan-black hover:bg-meituan-gray rounded-md">电影</a>
          <a href="#" class="px-3 py-2 text-meituan-black hover:bg-meituan-gray rounded-md">丽人</a>
          <a href="#" class="px-3 py-2 text-meituan-black hover:bg-meituan-gray rounded-md">周边游</a>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <main class="container mx-auto px-4 pt-24 pb-16">
      <!-- 搜索框 -->
      <div class="max-w-2xl mx-auto mb-8">
        <div class="relative">
          <input type="text" placeholder="搜索美食、酒店等" 
                 class="w-full h-12 px-4 pr-12 rounded-full border-2 border-meituan-yellow focus:outline-none focus:ring-2 focus:ring-meituan-yellow/50 transition-all duration-200">
          <button class="absolute right-0 top-0 h-full px-6 bg-meituan-yellow text-meituan-black rounded-r-full hover:bg-meituan-yellow/90 transition-colors duration-200">
            <i class="fa fa-search"></i>
          </button>
        </div>
      </div>
      
      <!-- 分类列表 -->
      <section class="bg-white rounded-xl p-4 mb-8 shadow-sm">
        <h2 class="text-xl font-bold mb-4 text-meituan-black">快速分类</h2>
        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          <div class="category-card" v-for="category in categories" :key="category.id">
            <div class="category-icon">
              <i :class="category.icon" class="text-2xl text-meituan-black"></i>
            </div>
            <span class="text-sm font-medium">{{ category.name }}</span>
          </div>
        </div>
      </section>
      
      <!-- 广告轮播图 -->
      <section class="mb-8">
        <div class="relative rounded-xl overflow-hidden h-40 md:h-64 bg-meituan-yellow/20">
          <img :src="bannerImg" alt="美团促销活动" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div class="px-8 text-white max-w-md">
              <h3 class="text-2xl font-bold mb-2">限时特惠</h3>
              <p class="mb-4">美食低至5折，酒店满减100元</p>
              <button class="bg-meituan-yellow text-meituan-black px-6 py-2 rounded-full font-medium hover:bg-white transition-colors duration-200">
                立即抢购
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 热门推荐 -->
      <section class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-meituan-black">热门推荐</h2>
          <a href="#" class="text-meituan-yellow hover:text-meituan-yellow/80 transition-colors duration-200">
            查看更多 <i class="fa fa-angle-right ml-1"></i>
          </a>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <!-- 商品卡片 -->
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
      </section>
      
      <!-- 附近商家 -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-meituan-black">附近商家</h2>
          <div class="flex space-x-2">
            <button class="text-sm bg-white px-3 py-1 rounded-full border border-gray-200 hover:border-meituan-yellow transition-colors duration-200">
              全部
            </button>
            <button class="text-sm bg-white px-3 py-1 rounded-full border border-gray-200 hover:border-meituan-yellow transition-colors duration-200">
              美食
            </button>
            <button class="text-sm bg-white px-3 py-1 rounded-full border border-gray-200 hover:border-meituan-yellow transition-colors duration-200">
              酒店
            </button>
          </div>
        </div>
        
        <div class="space-y-3">
          <!-- 附近商家列表项 -->
          <NearbyMerchant v-for="merchant in nearbyMerchants" :key="merchant.id" :merchant="merchant" />
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="bg-meituan-black text-gray-400 py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-white font-medium mb-4">关于我们</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-meituan-yellow transition-colors duration-200">公司介绍</a></li>
              <li><a href="#" class="hover:text-meituan-yellow transition-colors duration-200">加入我们</a></li>
              <li><a href="#" class="hover:text-meituan-yellow transition-colors duration-200">联系我们</a></li>
              <li><a href="#" class="hover:text-meituan-yellow transition-colors duration-200">商户入驻</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-medium mb-4">帮助中心</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-meituan-yellow transition-colors duration-200">常见问题</a></li>
              <li><a href="#" class="hover:text-meituan-yellow transition-colors duration-200">用户协议</a></li>
              <li><a href="#" class="hover:text-meituan-yellow transition-colors duration-200">隐私政策</a></li>
              <li><a href="#" class="hover:text-meituan-yellow transition-colors duration-200">客服中心</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-medium mb-4">手机客户端</h3>
            <div class="bg-white p-2 inline-block rounded">
              <img src="https://picsum.photos/100/100?random=8" alt="美团APP下载" class="w-20 h-20">
            </div>
          </div>
          <div>
            <h3 class="text-white font-medium mb-4">关注我们</h3>
            <div class="flex space-x-4 mb-4">
              <a href="#" class="text-gray-400 hover:text-meituan-yellow transition-colors duration-200">
                <i class="fa fa-weibo text-xl"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-meituan-yellow transition-colors duration-200">
                <i class="fa fa-wechat text-xl"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-meituan-yellow transition-colors duration-200">
                <i class="fa fa-instagram text-xl"></i>
              </a>
            </div>
            <p class="text-sm">客服电话：400-660-5335</p>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-4 text-center text-xs">
          <p>© 2025 美团网 版权所有</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductCard from './components/ProductCard.vue';
import NearbyMerchant from './components/NearbyMerchant.vue';

// 分类数据
const categories = ref([
  { id: 1, name: '火锅', icon: 'fa fa-fire' },
  { id: 2, name: '烧烤', icon: 'fa fa-cutlery' },
  { id: 3, name: '快餐', icon: 'fa fa-coffee' },
  { id: 4, name: '甜品', icon: 'fa fa-lemon-o' },
  { id: 5, name: '酒吧', icon: 'fa fa-glass' },
  { id: 6, name: '酒店', icon: 'fa fa-home' },
  { id: 7, name: '旅游', icon: 'fa fa-plane' },
  { id: 8, name: '更多', icon: 'fa fa-ellipsis-h' }
]);

// 商品数据
const products = ref([
  {
    id: 1,
    name: '蜀大侠火锅',
    image: 'https://picsum.photos/400/300?random=1',
    rating: 4.5,
    price: 128,
    originalPrice: 256,
    tags: ['限时特惠']
  },
  {
    id: 2,
    name: '串意十足烧烤',
    image: 'https://picsum.photos/400/300?random=2',
    rating: 4.0,
    price: 158,
    originalPrice: 320,
    tags: ['新店特惠']
  },
  {
    id: 3,
    name: '金拱门汉堡',
    image: 'https://picsum.photos/400/300?random=3',
    rating: 4.9,
    price: 29.9,
    originalPrice: 59,
    tags: ['人气爆款']
  },
  {
    id: 4,
    name: '甜心蛋糕',
    image: 'https://picsum.photos/400/300?random=4',
    rating: 4.7,
    price: 68,
    originalPrice: 128,
    tags: ['新品上市']
  }
]);

// 附近商家数据
const nearbyMerchants = ref([
  {
    id: 1,
    name: '老街烧烤',
    image: 'https://picsum.photos/100/100?random=5',
    distance: '2.3km',
    rating: 4.0,
    pricePerPerson: 78,
    tags: ['满减优惠', '新客立减']
  },
  {
    id: 2,
    name: '海底捞火锅',
    image: 'https://picsum.photos/100/100?random=6',
    distance: '1.8km',
    rating: 4.5,
    pricePerPerson: 128,
    tags: ['限时折扣', '赠品']
  },
  {
    id: 3,
    name: '星巴克咖啡',
    image: 'https://picsum.photos/100/100?random=7',
    distance: '0.5km',
    rating: 4.9,
    pricePerPerson: 35,
    tags: ['新品上市']
  }
]);

// 轮播图
const bannerImg = ref('https://picsum.photos/800/400');

// 导航栏滚动效果
onMounted(() => {
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 10) {
      header.classList.add('shadow-md');
    } else {
      header.classList.remove('shadow-md');
    }
  });
});
</script>

<style scoped>
/* 自定义样式 */
.nav-item {
  @apply px-4 py-3 text-white hover:text-meituan-yellow transition-colors duration-200;
}
.category-card {
  @apply flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer;
}
.category-icon {
  @apply w-14 h-14 flex items-center justify-center bg-meituan-yellow rounded-full mb-2;
}
</style>    