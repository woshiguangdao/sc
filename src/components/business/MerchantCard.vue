<template>
  <div class="merchant-card">
    <img :src="image" alt="cover" />
    <div class="body">
      <h4>{{ title }}</h4>
      <p>{{ subtitle }}</p>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({ image: String, title: String, subtitle: String });
</script>
<style scoped>
.merchant-card { display:flex; gap:10px; align-items:center; background:#fff; padding:12px; border-radius:6px }
.merchant-card img { width:64px; height:64px; object-fit:cover; border-radius:6px }
</style>

