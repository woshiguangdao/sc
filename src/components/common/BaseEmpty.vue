<template>
  <div class="base-empty">
    <p>{{ message }}</p>
    <slot name="action" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({ message: { type: String, default: 'No data' } });
</script>

<style scoped>
.base-empty { text-align: center; color: #999; padding: 24px; }
</style>

