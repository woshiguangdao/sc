<template>
  <div :class="['chat-message', fromUser ? 'from-user' : 'from-ai']">
    <p>{{ message }}</p>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({ message: String, fromUser: { type: Boolean, default: false } });
</script>
<style scoped>
.chat-message { padding:8px 12px; border-radius:8px; margin:6px 0; }
.from-user { background:#e6f7ff; align-self:flex-end }
.from-ai { background:#f5f5f5; align-self:flex-start }
</style>

