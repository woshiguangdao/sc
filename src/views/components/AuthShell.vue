<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  badge: {
    type: String,
    default: 'DianDian Life'
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  cardWidth: {
    type: String,
    default: '460px'
  },
  errorShake: {
    type: Boolean,
    default: false
  }
})

const pageRef = ref(null)
const particleCanvasRef = ref(null)

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const cardStyle = computed(() => ({
  width: `min(92vw, ${props.cardWidth})`
}))

let particleCtx = null
let particles = []
let particleAnimationId = 0
let resizeObserver = null

const mouse = {
  x: -9999,
  y: -9999,
  active: false
}

onMounted(() => {
  initScene()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(particleAnimationId)
  window.removeEventListener('resize', resizeParticleCanvas)

  if (pageRef.value) {
    pageRef.value.removeEventListener('pointermove', onPointerMove)
    pageRef.value.removeEventListener('pointerleave', onPointerLeave)
  }

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

function initScene() {
  resizeParticleCanvas()

  window.addEventListener('resize', resizeParticleCanvas)

  if (pageRef.value) {
    pageRef.value.addEventListener('pointermove', onPointerMove)
    pageRef.value.addEventListener('pointerleave', onPointerLeave)

    resizeObserver = new ResizeObserver(() => {
      resizeParticleCanvas()
    })
    resizeObserver.observe(pageRef.value)
  }

  if (!prefersReducedMotion) {
    particleAnimationId = requestAnimationFrame(renderScene)
  } else {
    renderScene(0)
  }
}

function getParticleCount(width) {
  if (width < 480) return 24
  if (width < 768) return 34
  return 46
}

function createParticles(width, height) {
  const count = getParticleCount(width)
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: -(0.25 + Math.random() * 0.5),
    size: 1.6 + Math.random() * 3.4,
    alpha: 0.28 + Math.random() * 0.38,
    hue: 10 + Math.random() * 16
  }))
}

function resizeParticleCanvas() {
  const canvas = particleCanvasRef.value
  const wrap = pageRef.value
  if (!canvas || !wrap) return

  const rect = wrap.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`

  particleCtx = canvas.getContext('2d')
  particleCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

  createParticles(rect.width, rect.height)
}

function drawGrid(time) {
  const canvas = particleCanvasRef.value
  if (!particleCtx || !canvas) return

  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const offset = prefersReducedMotion ? 0 : (time * 0.02) % 32

  particleCtx.save()
  particleCtx.translate(width / 2, height / 2 + 100)
  particleCtx.transform(1, 0, 0, 0.5, 0, 0)
  particleCtx.rotate((-62 * Math.PI) / 180)
  particleCtx.translate(-width / 2, -height / 2)

  particleCtx.lineWidth = 1
  particleCtx.strokeStyle = 'rgba(255, 183, 160, 0.16)'

  for (let x = -width; x < width * 2; x += 32) {
    particleCtx.beginPath()
    particleCtx.moveTo(x + offset, -height)
    particleCtx.lineTo(x + offset, height * 2)
    particleCtx.stroke()
  }

  for (let y = -height; y < height * 2; y += 32) {
    particleCtx.beginPath()
    particleCtx.moveTo(-width, y + offset)
    particleCtx.lineTo(width * 2, y + offset)
    particleCtx.stroke()
  }

  particleCtx.restore()
}

function drawParticles() {
  const canvas = particleCanvasRef.value
  if (!particleCtx || !canvas) return

  const width = canvas.clientWidth
  const height = canvas.clientHeight

  for (const p of particles) {
    const dx = mouse.x - p.x
    const dy = mouse.y - p.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (!prefersReducedMotion && mouse.active && dist < 120) {
      const force = (120 - dist) / 120
      const angle = Math.atan2(dy, dx)
      p.x -= Math.cos(angle) * force * 1.4
      p.y -= Math.sin(angle) * force * 1.4
    }

    p.x += p.vx
    p.y += p.vy

    if (p.y < -20) {
      p.y = height + 20
      p.x = Math.random() * width
    }

    if (p.x < -20) p.x = width + 20
    if (p.x > width + 20) p.x = -20

    const glow = particleCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8)
    glow.addColorStop(0, `hsla(${p.hue}, 100%, 76%, ${p.alpha})`)
    glow.addColorStop(1, `hsla(${p.hue}, 100%, 72%, 0)`)

    particleCtx.beginPath()
    particleCtx.fillStyle = glow
    particleCtx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2)
    particleCtx.fill()

    particleCtx.beginPath()
    particleCtx.fillStyle = `hsla(${p.hue}, 100%, 76%, ${Math.min(p.alpha + 0.24, 0.86)})`
    particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    particleCtx.fill()
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i]
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 120) {
        const opacity = (1 - dist / 120) * 0.16
        particleCtx.beginPath()
        particleCtx.strokeStyle = `rgba(255, 170, 145, ${Math.min(opacity * 1.15, 0.24)})`
        particleCtx.lineWidth = 1
        particleCtx.moveTo(a.x, a.y)
        particleCtx.lineTo(b.x, b.y)
        particleCtx.stroke()
      }
    }
  }
}

function renderScene(time = 0) {
  const canvas = particleCanvasRef.value
  if (!particleCtx || !canvas) return

  const width = canvas.clientWidth
  const height = canvas.clientHeight

  particleCtx.clearRect(0, 0, width, height)
  drawGrid(time)
  drawParticles()

  if (!prefersReducedMotion) {
    particleAnimationId = requestAnimationFrame(renderScene)
  }
}

function onPointerMove(e) {
  const rect = pageRef.value?.getBoundingClientRect()
  if (!rect) return
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
  mouse.active = true
}

function onPointerLeave() {
  mouse.active = false
  mouse.x = -9999
  mouse.y = -9999
}
</script>

<template>
  <div ref="pageRef" class="auth-page">
    <canvas ref="particleCanvasRef" class="particle-canvas"></canvas>

    <div class="scene-grid-overlay"></div>
    <div class="scene-aurora scene-aurora--one"></div>
    <div class="scene-aurora scene-aurora--two"></div>
    <div class="scene-scanlines"></div>
    <div class="scene-breath"></div>
    <div class="scene-vignette"></div>

    <div class="auth-center">
      <section class="glass-card" :class="{ 'is-error': errorShake }" :style="cardStyle">
        <div class="glass-card-border"></div>

        <div class="glass-card-inner">
          <div v-if="badge" class="auth-badge">{{ badge }}</div>
          <h1 class="auth-title">{{ title }}</h1>
          <p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p>

          <slot></slot>
          <slot name="footer"></slot>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
:global(html),
:global(body),
:global(#app) {
  min-height: 100%;
  margin: 0;
}

.auth-page {
  --text-main: #5a433b;
  --text-sub: rgba(91, 70, 61, 0.7);
  --field-text: #5d463d;
  --field-placeholder: rgba(113, 88, 79, 0.52);

  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 18%, rgba(255, 221, 206, 0.95), transparent 22%),
    radial-gradient(circle at 82% 24%, rgba(255, 206, 186, 0.7), transparent 20%),
    radial-gradient(circle at 52% 84%, rgba(255, 236, 220, 0.95), transparent 26%),
    linear-gradient(135deg, #fffdfa 0%, #fff7f1 45%, #fff1e8 100%);
}

.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  will-change: transform, opacity;
}

.scene-grid-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(rgba(255, 218, 202, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 218, 202, 0.05) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0.5), transparent 78%);
  opacity: 0.45;
}

.scene-aurora {
  position: absolute;
  border-radius: 999px;
  filter: blur(68px);
  opacity: 0.62;
  z-index: 1;
  will-change: transform;
  animation: floatBlob 11s ease-in-out infinite;
}

.scene-aurora--one {
  width: 360px;
  height: 360px;
  left: 6%;
  top: 10%;
  background: radial-gradient(circle, rgba(255, 210, 188, 0.72), transparent 64%);
}

.scene-aurora--two {
  width: 320px;
  height: 320px;
  right: 8%;
  bottom: 12%;
  background: radial-gradient(circle, rgba(255, 188, 168, 0.56), transparent 64%);
  animation-delay: -3s;
}

.scene-scanlines {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.14) 0px,
      rgba(255, 255, 255, 0.14) 1px,
      rgba(255, 236, 228, 0.06) 2px,
      transparent 4px,
      transparent 8px
    );
  mix-blend-mode: soft-light;
  opacity: 0.28;
}

.scene-scanlines::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -20%;
  height: 120px;
  background: linear-gradient(
    to bottom,
    rgba(255, 214, 196, 0),
    rgba(255, 214, 196, 0.18),
    rgba(255, 214, 196, 0)
  );
  animation: scanMove 6s linear infinite;
}

.scene-breath {
  position: absolute;
  inset: -8%;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(circle at 28% 28%, rgba(255, 222, 208, 0.36), transparent 22%),
    radial-gradient(circle at 72% 32%, rgba(255, 210, 190, 0.26), transparent 20%),
    radial-gradient(circle at 58% 72%, rgba(255, 228, 210, 0.24), transparent 24%);
  filter: blur(16px);
  animation: breathGlow 7s ease-in-out infinite;
}

.scene-vignette {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(circle at center, transparent 52%, rgba(180, 120, 95, 0.08) 100%);
}

.auth-center {
  position: relative;
  z-index: 3;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 24px;
}

.glass-card {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.78),
    rgba(255, 250, 246, 0.66)
  );
  border: 1px solid rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow:
    0 18px 42px rgba(240, 186, 158, 0.18),
    0 40px 90px rgba(255, 220, 198, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
  transform-style: preserve-3d;
  will-change: transform;
  animation: cardEnter 0.85s cubic-bezier(0.215, 0.61, 0.355, 1) both;
}

.glass-card-border {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 0 20px rgba(255, 225, 208, 0.15);
}

.glass-card-inner {
  position: relative;
  z-index: 1;
  padding: 34px 28px 28px;
}

.auth-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  margin-bottom: 14px;
  border-radius: 999px;
  color: #bc715c;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: rgba(255, 226, 214, 0.8);
  border: 1px solid rgba(255, 208, 191, 0.92);
}

.auth-title {
  margin: 0;
  font-size: 30px;
  line-height: 1.2;
  font-weight: 700;
  color: var(--text-main);
  text-shadow: 0 2px 10px rgba(255, 220, 200, 0.34);
}

.auth-subtitle {
  margin: 10px 0 24px;
  color: var(--text-sub);
  font-size: 14px;
}

:deep(.auth-form) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(.auth-form-item) {
  width: 100%;
}

:deep(.auth-label) {
  display: block;
  margin-bottom: 8px;
  color: rgba(91, 70, 61, 0.88);
  font-size: 13px;
  font-weight: 600;
}

:deep(.form-grid) {
  display: grid;
  gap: 16px;
}

:deep(.form-grid--double) {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

:deep(.form-span-2) {
  grid-column: span 2;
}

:deep(.neon-field) {
  position: relative;
  overflow: hidden;
  padding: 1px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 246, 240, 0.82)
  );
  transition: transform 0.24s ease, box-shadow 0.24s ease, background 0.24s ease;
  isolation: isolate;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 4px 14px rgba(255, 214, 196, 0.08);
}

:deep(.neon-field::before) {
  content: '';
  position: absolute;
  inset: -1px;
  z-index: 0;
  border-radius: inherit;
  background: conic-gradient(
    from 0deg,
    rgba(255, 186, 160, 0),
    rgba(255, 186, 160, 0.72),
    rgba(255, 147, 167, 0.48),
    rgba(255, 186, 160, 0)
  );
  opacity: 0;
  transition: opacity 0.25s ease;
  filter: blur(10px);
  pointer-events: none;
}

:deep(.neon-field:focus-within) {
  transform: translateY(-1px) scale(1.01);
  box-shadow:
    0 0 0 1px rgba(255, 191, 168, 0.42),
    0 12px 24px rgba(255, 203, 182, 0.22);
}

:deep(.neon-field:focus-within::before) {
  opacity: 1;
}

:deep(.field-inner) {
  position: relative;
  z-index: 2;
  border-radius: 16px;
}

:deep(.native-input),
:deep(.native-textarea) {
  position: relative;
  z-index: 2;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--field-text);
  font-size: 14px;
  font-weight: 500;
  box-sizing: border-box;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

:deep(.native-input) {
  height: 52px;
  padding: 0 16px;
}

:deep(.native-textarea) {
  min-height: 116px;
  padding: 14px 16px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
}

:deep(.native-input::placeholder),
:deep(.native-textarea::placeholder) {
  color: var(--field-placeholder);
}

:deep(.neon-field:focus-within .native-input),
:deep(.neon-field:focus-within .native-textarea) {
  background: rgba(255, 255, 255, 0.98);
  color: #4f3d36;
  box-shadow: inset 0 0 0 1px rgba(255, 196, 170, 0.18);
}

:deep(.native-input:-webkit-autofill),
:deep(.native-input:-webkit-autofill:hover),
:deep(.native-input:-webkit-autofill:focus),
:deep(.native-input:-webkit-autofill:active) {
  -webkit-text-fill-color: #5d463d !important;
  box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.92) inset !important;
  transition: background-color 9999s ease-in-out 0s;
  border-radius: 16px;
}

:deep(.password-wrap) {
  position: relative;
}

:deep(.native-input--password) {
  padding-right: 72px;
}

:deep(.toggle-btn) {
  position: absolute;
  right: 14px;
  top: 50%;
  z-index: 4;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #c37b68;
  cursor: pointer;
  padding: 0 4px;
  font-weight: 600;
}

:deep(.captcha-row) {
  display: grid;
  grid-template-columns: 1fr 108px;
  gap: 12px;
  align-items: center;
}

:deep(.captcha-canvas) {
  width: 108px;
  height: 52px;
  border-radius: 14px;
  cursor: pointer;
  background: linear-gradient(135deg, #ffd9b8, #ffcfa8);
  border: 1px solid rgba(230, 163, 122, 0.45);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 8px 20px rgba(255, 182, 145, 0.22);
}

:deep(.upload-panel) {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 84px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px dashed rgba(226, 154, 115, 0.4);
}

:deep(.upload-entry) {
  display: inline-flex;
}

:deep(.upload-entry .el-upload) {
  display: inline-flex;
}

:deep(.upload-preview),
:deep(.upload-placeholder) {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(255, 240, 231, 0.95), rgba(255, 228, 211, 0.9));
  border: 1px solid rgba(255, 191, 168, 0.5);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
  cursor: pointer;
}

:deep(.upload-preview img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.upload-icon) {
  font-size: 24px;
  color: #d4876d;
}

:deep(.upload-copy) {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: rgba(91, 70, 61, 0.72);
  font-size: 13px;
}

:deep(.upload-copy strong) {
  color: rgba(91, 70, 61, 0.9);
  font-size: 14px;
}

:deep(.auth-btn) {
  position: relative;
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  background: transparent;
  transform: translate3d(0, 0, 0);
  box-shadow:
    0 14px 28px rgba(255, 168, 140, 0.26),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
}

:deep(.auth-btn:disabled) {
  opacity: 0.78;
  cursor: not-allowed;
}

:deep(.auth-btn-bg) {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    #ffb89a 0%,
    #ffa68f 24%,
    #ff8fa3 52%,
    #ffb89a 76%,
    #ffc7a8 100%
  );
  background-size: 200% 100%;
  animation: flowGradient 3.8s linear infinite;
}

:deep(.auth-btn-bg::after) {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 20%,
    rgba(255, 255, 255, 0.35) 50%,
    transparent 80%
  );
  transform: translateX(-120%);
  animation: shineMove 2.8s ease-in-out infinite;
}

:deep(.auth-btn-text) {
  position: relative;
  z-index: 2;
}

:deep(.auth-footer) {
  margin-top: 18px;
  text-align: center;
  color: rgba(91, 70, 61, 0.68);
}

:deep(.auth-footer--compact) {
  margin-top: 8px;
}

:deep(.auth-link) {
  margin-left: 4px;
  color: #d9826a;
  text-decoration: none;
  font-weight: 600;
}

:deep(.auth-link:hover) {
  color: #f09a86;
}

.is-error {
  animation: shakeX 0.48s ease;
}

.is-error :deep(.neon-field) {
  box-shadow:
    0 0 0 1px rgba(255, 106, 106, 0.28),
    0 10px 22px rgba(255, 140, 140, 0.16);
}

@keyframes cardEnter {
  0% {
    opacity: 0;
    transform: translateY(24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes flowGradient {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

@keyframes shineMove {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(130%);
  }
}

@keyframes shakeX {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-5px);
  }
  40% {
    transform: translateX(5px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}

@keyframes floatBlob {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(0, -18px, 0) scale(1.05);
  }
}

@keyframes scanMove {
  0% {
    transform: translateY(-20%);
  }
  100% {
    transform: translateY(120vh);
  }
}

@keyframes breathGlow {
  0%,
  100% {
    transform: scale(1) translate3d(0, 0, 0);
    opacity: 0.72;
  }
  50% {
    transform: scale(1.04) translate3d(0, -8px, 0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  :deep(.form-grid--double) {
    grid-template-columns: 1fr;
  }

  :deep(.form-span-2) {
    grid-column: auto;
  }
}

@media (max-width: 640px) {
  .glass-card-inner {
    padding: 26px 18px 20px;
  }

  .auth-title {
    font-size: 24px;
  }

  :deep(.captcha-row) {
    grid-template-columns: 1fr;
  }

  :deep(.captcha-canvas) {
    width: 100%;
  }

  :deep(.upload-panel) {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scene-aurora,
  .scene-scanlines::after,
  .scene-breath,
  .glass-card,
  :deep(.auth-btn-bg),
  :deep(.auth-btn-bg::after),
  .is-error {
    animation: none;
  }

  :deep(.neon-field),
  :deep(.auth-btn),
  .glass-card {
    transition: none !important;
  }
}
</style>
