<template>
  <div class="user-info-card">
    <img :src="avatar" alt="avatar" class="avatar"/>
    <div class="meta">
      <h4>{{ name }}</h4>
      <p>{{ desc }}</p>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({ avatar: String, name: String, desc: String });
</script>
<style scoped>
.user-info-card { display:flex; gap:12px; align-items:center; }
.avatar { width:48px; height:48px; border-radius:50%; }
</style>

