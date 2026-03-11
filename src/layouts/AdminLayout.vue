<template>
  <div class="admin-layout">
    <aside class="sidebar">Sidebar</aside>
    <section class="content"><router-view/></section>
  </div>
</template>
<script setup>
</script>
<style scoped>
.admin-layout { display:flex; }
.sidebar { width:200px; background:#fff; padding:12px }
.content { flex:1; padding:20px }
</style>

