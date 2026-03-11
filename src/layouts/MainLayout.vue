<template>
  <div class="main-layout">
    <header><slot name="header"/></header>
    <main><router-view/></main>
    <footer><slot name="footer"/></footer>
  </div>
</template>
<script setup>
</script>
<style scoped>
main { padding: 20px; }
</style>

