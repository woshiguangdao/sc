<template>
  <div class="scanlines pointer-events-none absolute inset-0 z-10"></div>
</template>

<style scoped>
.scanlines {
  background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(0, 0, 0, 0.1) 50%
  );
  background-size: 100% 4px;
  opacity: 0.15;
  animation: scan 10s linear infinite;
}

@keyframes scan {
  from { background-position: 0 0; }
  to { background-position: 0 100%; }
}

.scanlines::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
      0deg,
      transparent 0%,
      rgba(96, 165, 250, 0.05) 50%,
      transparent 100%
  );
  top: -100%;
  animation: scanline-move 8s linear infinite;
}

@keyframes scanline-move {
  0% { top: -100%; }
  100% { top: 100%; }
}
</style>
