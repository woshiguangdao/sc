<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userRegister } from '@/api/api'
import AuthShell from './components/AuthShell.vue'

const router = useRouter()

const username = ref('')
const password = ref('')
const yanma = ref('')
const yantext = ref('')
const showPassword = ref(false)
const errorShake = ref(false)
const captchaCanvasRef = ref(null)

const show_num = []

onMounted(() => {
  draw()
})

const register = () => {
  const user = {
    username: username.value,
    password: password.value
  }

  if (!user.username || !user.password) {
    ElMessage({
      message: '用户名或密码不能为空',
      type: 'warning'
    })
    triggerErrorShake()
    return
  }

  if (yantext.value === yanma.value) {
    userRegister(user).then((res) => {
      if (!res.data) {
        ElMessage({
          message: '该用户名已被使用',
          type: 'warning'
        })
        triggerErrorShake()
      } else {
        ElMessage({
          message: '用户注册成功',
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

function togglePassword() {
  showPassword.value = !showPassword.value
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
    title="点点生活用户注册"
    subtitle="创建账号后即可继续浏览、收藏和使用点点生活服务"
    :error-shake="errorShake"
  >
    <form class="auth-form" @submit.prevent="register">
      <div class="auth-form-item">
        <label class="auth-label">账号</label>
        <div class="neon-field">
          <div class="field-inner">
            <input
              v-model="username"
              class="native-input"
              type="text"
              placeholder="请输入待注册的账号"
              autocomplete="username"
            />
          </div>
        </div>
      </div>

      <div class="auth-form-item">
        <label class="auth-label">密码</label>
        <div class="neon-field password-wrap">
          <div class="field-inner">
            <input
              v-model="password"
              class="native-input native-input--password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入对应的密码"
              autocomplete="new-password"
            />
          </div>
          <button class="toggle-btn" type="button" @click="togglePassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </button>
        </div>
      </div>

      <div class="auth-form-item">
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

      <div class="auth-form-item">
        <button type="submit" class="auth-btn">
          <span class="auth-btn-bg"></span>
          <span class="auth-btn-text">注册</span>
        </button>
      </div>
    </form>

    <template #footer>
      <div class="auth-footer">
        <span>已有账号，请</span>
        <router-link :to="{ path: '/Login' }" class="auth-link">登录</router-link>
      </div>
      <div class="auth-footer auth-footer--compact">
        <span>需要商户入驻？</span>
        <router-link :to="{ path: '/BusinessRegister' }" class="auth-link">商户注册</router-link>
      </div>
    </template>
  </AuthShell>
</template>
