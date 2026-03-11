<template>
  <div class="chat-panel">
    <slot name="messages" />
    <div class="input"><slot name="input"/></div>
  </div>
</template>
<script setup>
</script>
<style scoped>
.chat-panel { display:flex; flex-direction:column; height:100%; }
.input { margin-top:auto }
</style>

