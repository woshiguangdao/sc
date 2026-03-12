<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { BusRegister } from '@/api/api'
import AuthShell from './components/AuthShell.vue'

const router = useRouter()

const name = ref('')
const description = ref('')
const location = ref('')
const businessType = ref('')
const contact = ref('')
const openingHours = ref('')
const coverImage = ref('')
const imageUrl = ref('')
const yanma = ref('')
const yantext = ref('')
const errorShake = ref(false)
const captchaCanvasRef = ref(null)

const show_num = []

onMounted(() => {
  draw()
})

const register = () => {
  const business = {
    name: name.value,
    description: description.value,
    location: location.value,
    businessType: businessType.value,
    contact: contact.value,
    openingHours: openingHours.value,
    coverImage: coverImage.value
  }

  if (
    !business.name ||
    !business.description ||
    !business.location ||
    !business.businessType ||
    !business.contact ||
    !business.openingHours ||
    !business.coverImage
  ) {
    ElMessage({
      message: '任何一项都不能为空',
      type: 'warning'
    })
    triggerErrorShake()
    return
  }

  if (yantext.value === yanma.value) {
    BusRegister(business).then((res) => {
      if (!res.data) {
        ElMessage({
          message: '该商家名已被使用',
          type: 'warning'
        })
        triggerErrorShake()
      } else {
        ElMessage({
          message: '商户注册成功',
          type: 'success'
        })
        router.push({ path: '/Login' })
      }
    })
  } else {
    ElMessage({
      message: '验证失败',
      type: 'warning'
    })
    triggerErrorShake()
    draw()
    yantext.value = ''
  }
}

const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  coverImage.value = response.data.url
}

function triggerErrorShake() {
  errorShake.value = false
  requestAnimationFrame(() => {
    errorShake.value = true
    setTimeout(() => {
      errorShake.value = false
    }, 520)
  })
}

function draw() {
  const canvas = captchaCanvasRef.value
  if (!canvas) return

  const canvasWidth = canvas.clientWidth
  const canvasHeight = canvas.clientHeight
  const context = canvas.getContext('2d')

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  const sCode = '1,2,3,4,5,6,7,8,9,0'
  const aCode = sCode.split(',')
  const aLength = aCode.length

  context.clearRect(0, 0, canvasWidth, canvasHeight)

  const bg = context.createLinearGradient(0, 0, canvasWidth, canvasHeight)
  bg.addColorStop(0, '#ffd8b8')
  bg.addColorStop(1, '#ffcca1')
  context.fillStyle = bg
  context.fillRect(0, 0, canvasWidth, canvasHeight)

  for (let i = 0; i <= 3; i++) {
    const j = Math.floor(Math.random() * aLength)
    const deg = (Math.random() * 30 * Math.PI) / 180
    const txt = aCode[j]
    show_num[i] = txt

    const x = 12 + i * 22
    const y = 24 + Math.random() * 8

    context.font = 'bold 22px Arial'
    context.translate(x, y)
    context.rotate(deg)
    context.fillStyle = randomColor()
    context.fillText(txt, 0, 0)
    context.rotate(-deg)
    context.translate(-x, -y)
  }

  for (let i = 0; i <= 5; i++) {
    context.strokeStyle = 'rgba(135, 92, 62, 0.55)'
    context.beginPath()
    context.moveTo(Math.random() * canvasWidth, Math.random() * canvasHeight)
    context.lineTo(Math.random() * canvasWidth, Math.random() * canvasHeight)
    context.closePath()
    context.stroke()
  }

  for (let i = 0; i <= 30; i++) {
    context.strokeStyle = randomColor()
    context.beginPath()
    const x = Math.random() * canvasWidth
    const y = Math.random() * canvasHeight
    context.arc(x, y, 1, 0, 2 * Math.PI)
    context.closePath()
    context.stroke()
  }

  yanma.value = show_num.join('')
}

function randomColor() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r},${g},${b})`
}
</script>

<template>
  <AuthShell
    title="点点生活商户注册"
    subtitle="完善商户资料后即可提交入驻，封面上传与验证码逻辑保持原有流程"
    card-width="620px"
    :error-shake="errorShake"
  >
    <form class="auth-form" @submit.prevent="register">
      <div class="form-grid form-grid--double">
        <div class="auth-form-item">
          <label class="auth-label">商户名称</label>
          <div class="neon-field">
            <div class="field-inner">
              <input
                v-model="name"
                class="native-input"
                type="text"
                placeholder="请输入商户名"
              />
            </div>
          </div>
        </div>

        <div class="auth-form-item">
          <label class="auth-label">商户类型</label>
          <div class="neon-field">
            <div class="field-inner">
              <input
                v-model="businessType"
                class="native-input"
                type="text"
                placeholder="请输入商户类型"
              />
            </div>
          </div>
        </div>

        <div class="auth-form-item form-span-2">
          <label class="auth-label">商户描述</label>
          <div class="neon-field">
            <div class="field-inner">
              <textarea
                v-model="description"
                class="native-textarea"
                placeholder="请输入商户描述"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="auth-form-item form-span-2">
          <label class="auth-label">店铺位置</label>
          <div class="neon-field">
            <div class="field-inner">
              <input
                v-model="location"
                class="native-input"
                type="text"
                placeholder="请输入店铺位置"
              />
            </div>
          </div>
        </div>

        <div class="auth-form-item">
          <label class="auth-label">联系电话</label>
          <div class="neon-field">
            <div class="field-inner">
              <input
                v-model="contact"
                class="native-input"
                type="text"
                placeholder="请输入联系电话"
              />
            </div>
          </div>
        </div>

        <div class="auth-form-item">
          <label class="auth-label">营业时间</label>
          <div class="neon-field">
            <div class="field-inner">
              <input
                v-model="openingHours"
                class="native-input"
                type="text"
                placeholder="请输入营业时间"
              />
            </div>
          </div>
        </div>

        <div class="auth-form-item form-span-2">
          <label class="auth-label">封面图片</label>
          <div class="upload-panel">
            <el-upload
              class="upload-entry"
              action="/api/file/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
            >
              <div v-if="imageUrl" class="upload-preview">
                <img :src="imageUrl" alt="商户封面预览" />
              </div>
              <div v-else class="upload-placeholder">
                <el-icon class="upload-icon"><Plus /></el-icon>
              </div>
            </el-upload>

            <div class="upload-copy">
              <strong>上传商户封面</strong>
              <span>点击左侧区域上传，成功后会自动写入封面地址</span>
            </div>
          </div>
        </div>

        <div class="auth-form-item form-span-2">
          <label class="auth-label">验证码</label>
          <div class="captcha-row">
            <div class="neon-field">
              <div class="field-inner">
                <input
                  v-model="yantext"
                  class="native-input"
                  type="text"
                  placeholder="请输入验证码"
                />
              </div>
            </div>

            <canvas
              ref="captchaCanvasRef"
              class="captcha-canvas"
              @click="draw"
            ></canvas>
          </div>
        </div>

        <div class="auth-form-item form-span-2">
          <button type="submit" class="auth-btn">
            <span class="auth-btn-bg"></span>
            <span class="auth-btn-text">提交注册</span>
          </button>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="auth-footer">
        <span>已有账号，请</span>
        <router-link :to="{ path: '/Login' }" class="auth-link">登录</router-link>
      </div>
      <div class="auth-footer auth-footer--compact">
        <span>返回普通账号注册？</span>
        <router-link :to="{ path: '/UserRegister' }" class="auth-link">用户注册</router-link>
      </div>
    </template>
  </AuthShell>
</template>
