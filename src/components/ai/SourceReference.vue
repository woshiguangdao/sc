<template>
  <div class="source-reference" v-if="sources && sources.length">
    <h5>Sources</h5>
    <ul>
      <li v-for="(s,idx) in sources" :key="idx"><a :href="s.url" target="_blank">{{ s.title }}</a></li>
    </ul>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({ sources: { type: Array, default: () => [] } });
</script>
<style scoped>
.source-reference { font-size:13px; color:#666 }
</style>

