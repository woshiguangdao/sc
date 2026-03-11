<template>
  <div class="prompt-suggestions">
    <button v-for="(p, i) in prompts" :key="i" @click="$emit('select', p)">{{ p }}</button>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({ prompts: { type: Array, default: () => ['Hello', 'Help me'] } });
</script>
<style scoped>
.prompt-suggestions button { margin:4px; padding:6px 10px; }
</style>

