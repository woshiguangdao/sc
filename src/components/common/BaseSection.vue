<template>
  <section class="base-section">
    <header v-if="$slots.header"><slot name="header"/></header>
    <div class="content"><slot/></div>
  </section>
</template>
<script setup>
</script>
<style scoped>
.base-section { background:#fff; padding:16px; border-radius:6px; }
</style>

