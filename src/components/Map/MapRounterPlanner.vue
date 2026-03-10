<template>
  <div class="map-page-wrapper">
    <!-- 控制面板 -->
    <div class="control-panel">
      <h3>🚗 驾车路线规划</h3>

      <div class="info-block">
        <div class="info-row">
          <span class="label">🟢 起点:</span>
          <span class="value">{{ startName }}</span>
        </div>
        <div class="info-row">
          <span class="label">🏁 终点:</span>
          <span class="value">{{ endName }}</span>
        </div>
      </div>

      <div v-if="routeReady" class="result-block">
        <hr class="divider"/>
        <div class="info-row highlight">
          <span>📏 距离:</span>
          <span>{{ distance }}</span>
        </div>
        <div class="info-row highlight">
          <span>⏱️ 预计:</span>
          <span>{{ duration }}</span>
        </div>
        <button class="action-btn" @click="resetView">🔄 重置视图</button>
      </div>

      <div class="status-message">{{ statusMsg }}</div>
    </div>

    <!-- 地图容器 -->
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

// ================= 配置区域 =================
const BAIDU_AK = "Vu30ocglvd9jnAXI9PfSDoCXChFTlcmC";
// ===========================================

const mapContainer = ref(null);
const startName = ref("定位中...");
const endName = ref("北京西站 (示例)");
const distance = ref("--");
const duration = ref("--");
const routeReady = ref(false);
const statusMsg = ref("正在初始化地图...");

let mapInstance = null;
let drivingRoute = null;
let currentLocation = null;
let isMapReady = false;

// ⚠️ 修复：只存储坐标数据，不在此处创建 Point 对象
const DEFAULT_END_LNG = 116.32109;
const DEFAULT_END_LAT = 39.89634;
const defaultEndName = "北京西站";

// 1. 动态加载脚本
const loadBaiduScript = () => {
  return new Promise((resolve, reject) => {
    if (window.BMapGL && window.BMapGL.Map) {
      console.log('✅ 百度地图 SDK 已存在');
      resolve();
      return;
    }

    const existingScript = document.querySelector(`script[src*="api.map.baidu.com"]`);
    if (existingScript) {
      console.log('⏳ 等待脚本加载完成...');
      const checkInterval = setInterval(() => {
        if (window.BMapGL && window.BMapGL.Map) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.BMapGL) reject(new Error("脚本加载超时"));
      }, 15000);
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://api.map.baidu.com/api?type=webgl&v=1.0&ak=${BAIDU_AK}&callback=initMapCallback`;

    window.initMapCallback = () => {
      console.log('✅ 百度地图 SDK 回调触发');
      resolve();
    };

    script.onload = () => {
      if (window.BMapGL && window.BMapGL.Map) resolve();
    };

    script.onerror = () => {
      reject(new Error("百度地图脚本加载失败"));
    };

    document.head.appendChild(script);
  });
};

// 2. 等待 BMapGL 对象就绪
const waitForBMapGL = () => {
  return new Promise((resolve) => {
    const check = () => {
      if (window.BMapGL && window.BMapGL.Map) {
        resolve();
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });
};

// 3. 初始化地图
const initMap = async () => {
  if (isMapReady) return;

  try {
    statusMsg.value = "📥 正在加载地图资源...";

    await loadBaiduScript();
    await waitForBMapGL();
    await nextTick();

    if (!mapContainer.value) {
      console.warn("⏳ DOM 未就绪，稍后重试...");
      setTimeout(() => {
        if (mapContainer.value) initMap();
        else statusMsg.value = "❌ 页面渲染异常，请刷新";
      }, 500);
      return;
    }

    console.log('🚀 开始初始化地图实例...');

    // ✅ 安全：此时 BMapGL 一定存在
    mapInstance = new window.BMapGL.Map(mapContainer.value);
    mapInstance.enableScrollWheelZoom(true);
    mapInstance.centerAndZoom(
        new window.BMapGL.Point(105.403119, 38.028658),
        4
    );

    isMapReady = true;
    statusMsg.value = "🗺️ 地图加载完成，正在定位...";

    locateUser();

  } catch (error) {
    console.error(error);
    statusMsg.value = "❌ 初始化失败: " + error.message;
  }
};

// 4. 获取用户位置
const locateUser = () => {
  if (!isMapReady || !mapInstance) return;

  statusMsg.value = "📍 正在获取您的位置...";

  if (!navigator.geolocation) {
    useDefaultStart();
    return;
  }

  navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!position || !position.coords) {
          useDefaultStart();
          return;
        }

        const lng = position.coords.longitude;
        const lat = position.coords.latitude;

        if (typeof lng !== 'number' || typeof lat !== 'number') {
          useDefaultStart();
          return;
        }

        // ✅ 安全：在回调内部创建 Point
        currentLocation = new window.BMapGL.Point(lng, lat);
        startName.value = "我的当前位置";
        statusMsg.value = "✅ 定位成功，规划路线中...";

        planRoute(currentLocation, DEFAULT_END_LNG, DEFAULT_END_LAT, defaultEndName);
      },
      () => {
        useDefaultStart();
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
};

// 5. 使用默认起点
const useDefaultStart = () => {
  if (!isMapReady) return;

  // ✅ 安全：在函数内部创建 Point
  currentLocation = new window.BMapGL.Point(116.404, 39.915);
  startName.value = "天安门 (默认)";

  setTimeout(() => {
    planRoute(currentLocation, DEFAULT_END_LNG, DEFAULT_END_LAT, defaultEndName);
  }, 1000);
};

// 6. 规划路线 (接收经纬度数值，内部转换为 Point)
const planRoute = (startPt, endLng, endLat, endNameStr) => {
  if (!isMapReady || !mapInstance) {
    console.warn("⚠️ 地图未就绪，无法规划路线");
    return;
  }

  // 辅助函数：确保转换为 Point
  const ensurePoint = (val, name) => {
    if (val instanceof window.BMapGL.Point) return val;
    if (val && typeof val.lng === 'number' && typeof val.lat === 'number') {
      return new window.BMapGL.Point(val.lng, val.lat);
    }
    // 如果传入的是单独的 lng/lat 参数逻辑，这里处理
    return null;
  };

  // 处理起点
  let safeStart = ensurePoint(startPt, "Start");
  if (!safeStart) {
    console.error("❌ 起点格式错误", startPt);
    return;
  }

  // 处理终点 (本函数接收的是数字 lng/lat)
  let safeEnd = new window.BMapGL.Point(endLng, endLat);

  // 最终安全检查
  if (safeStart.lat === undefined || safeEnd.lat === undefined) {
    console.error("💥 致命错误：Point 对象缺少 lat 属性!");
    statusMsg.value = "❌ 内部数据错误";
    return;
  }

  console.log('🔍 准备搜索路线:', safeStart, safeEnd);

  if (drivingRoute) {
    drivingRoute.clear();
    drivingRoute = null;
  }

  try {
    drivingRoute = new window.BMapGL.DrivingRoute(mapInstance, {
      renderOptions: {
        map: mapInstance,
        autoViewport: true
      },
      onSearchComplete: (results) => {
        if (drivingRoute && drivingRoute.getStatus() === window.BMAP_STATUS_SUCCESS) {
          const plan = results.getPlan(0);
          distance.value = plan.getDistance(true);
          duration.value = plan.getDuration(true);
          endName.value = endNameStr;
          routeReady.value = true;
          statusMsg.value = "✅ 路线规划完成";
        } else {
          const status = drivingRoute ? drivingRoute.getStatus() : 'Unknown';
          statusMsg.value = `❌ 规划失败: 状态码 ${status}`;
        }
      }
    });

    drivingRoute.search(safeStart, safeEnd);

  } catch (e) {
    console.error('💥 search 方法抛出异常:', e);
    statusMsg.value = "❌ 规划引擎异常: " + e.message;
  }
};

const resetView = () => {
  if (currentLocation && mapInstance) {
    mapInstance.centerAndZoom(currentLocation, 11);
  }
};

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  isMapReady = false;
  if (drivingRoute) drivingRoute.clear();
  if (mapInstance) {
    mapInstance.clearOverlays();
    mapInstance = null;
  }
  window.initMapCallback = null;
});
</script>

<style scoped>
.map-page-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f2f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.map-container {
  width: 100%;
  height: 100%;
  display: block;
  z-index: 1;
}

.control-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
  width: 320px;
  max-height: 80vh;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
}

.control-panel h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
  display: inline-block;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}

.info-row .label { font-weight: 600; color: #666; }
.info-row .value { text-align: right; max-width: 60%; word-break: break-word; }
.info-row.highlight { color: #007bff; font-weight: bold; font-size: 15px; }

.divider { border: 0; border-top: 1px dashed #ddd; margin: 15px 0; }
.result-block { animation: fadeIn 0.4s ease-out; }

.action-btn {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
.action-btn:hover { background-color: #0056b3; }

.status-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  text-align: center;
  border-left: 4px solid #007bff;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .control-panel {
    top: auto; bottom: 0; left: 0; width: 100%;
    max-height: 40vh; border-radius: 12px 12px 0 0;
    box-sizing: border-box;
  }
}
</style>