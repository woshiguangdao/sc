<template>
  <header class="base-page-header">
    <h2>{{ title }}</h2>
    <slot name="extra" />
  </header>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({ title: { type: String, default: '' } });
</script>

<style scoped>
.base-page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
</style>

