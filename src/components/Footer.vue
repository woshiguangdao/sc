<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- 左边 LOGO 区域 -->
      <div class="footer-section logo">
        <img class="logo-icon" src="@/assets/Home/logo.png" alt="点点生活Logo" />
        <h2>点点生活</h2>
      </div>

      <!-- 各栏目 -->
      <div class="footer-section" v-for="(section, i) in sections" :key="i">
        <h4>{{ section.title }}</h4>
        <ul>
          <li v-for="(item, j) in section.items" :key="j">
            <a :href="item.link" target="_blank">{{ item.label }}</a>
          </li>
        </ul>
      </div>

      <!-- 下载区域 -->
      <div class="footer-section">
        <h4>下载和关注</h4>
        <ul>
          <li v-for="(app, i) in apps" :key="i">
            <img :src="app.icon" class="icon" />
            {{ app.label }}
          </li>
        </ul>
      </div>
    </div>
  </footer>
  <!-- 底部版权和合规信息 -->
  <div class="footer-bottom">
    <p>
      举报电话：400-123-4567，举报邮箱：report@yourdomain.com<br />
      本平台支持对不良信息、未成年人保护、虚假宣传、侵权内容等进行投诉举报
    </p>
    <p>
      ©2025 点点生活 版权所有 | 粤ICP备12345678号 | 粤公网安备 44030502000001号 |
      <a href="#">隐私政策</a> | <a href="#">使用协议</a>
    </p>
    <p>
      网络交易服务资质：互联网药品信息服务资格证（粤）-经营-2025-001 | 网络平台交易第三方合规编号：（粤）平台备字〔2025〕第0001号
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sections: [
        {
          title: '了解更多',
          items: [
            { label: '新闻中心', link: '#' },
            { label: '媒体资源', link: '#' },
            { label: '供应商', link: '#' },
          ],
        },
        {
          title: '加入我们',
          items: [
            { label: '社会招聘', link: '#' },
            { label: '校园招聘', link: '#' },
            { label: '工作兼职', link: '#' },
          ],
        },
        {
          title: '联系我们',
          items: [
            { label: '服务热线', link: '#' },
            { label: '廉正举报', link: '#' },
            { label: '知识产权', link: '#' },
          ],
        },
      ],
      apps: [
        {
          label: '点点生活App',
          icon: 'src/assets/Home/footer/app.png',
        },
        {
          label: '点点生活外卖App',
          icon: 'src/assets/Home/footer/waimai.png',
        },
        {
          label: '点点生活微博',
          icon: 'src/assets/Home/footer/shejiaotubiao-06.png',
        },
        {
          label: '点点生活微信公众号',
          icon: 'src/assets/Home/footer/weixingongzhonghao.png',
        },
        {
          label: '点点生活微信视频号',
          icon: 'src/assets/Home/footer/weixinshipinhao.png',
        },
      ],
    }
  },
}
</script>

<style scoped>
.footer {
  background-color: #f7f7f7;
  padding: 40px 60px;
  color: #333;
  font-size: 14px;
}
.footer-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.footer-section {
  margin: 10px;
  min-width: 150px;
}
.logo {
  display: flex;
  align-items: center;
}
.logo-icon {
  width: 48px;
  height: 48px;
  margin-right: 10px;
}
.footer-section h4 {
  margin-bottom: 10px;
  font-weight: bold;
}
.footer-section ul {
  list-style: none;
  padding: 0;
}
.footer-section li {
  margin-bottom: 6px;
}
.footer-section a {
  color: #666;
  text-decoration: none;
}
.footer-section a:hover {
  color: #000;
  text-decoration: underline;
}
.icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 6px;
}
.footer-bottom {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #999;
  line-height: 1.6;
  text-align: center; /* ✅ 文字居中 */
}

.footer-bottom p {
  margin: 6px 0;
}

.footer-bottom a {
  color: #999;
  text-decoration: none;
  margin: 0 6px;
}

.footer-bottom a:hover {
  text-decoration: underline;
  color: #666;
}


</style>
