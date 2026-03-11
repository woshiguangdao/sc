<template>
  <div class="auth-layout">
    <div class="box"><slot/></div>
  </div>
</template>
<script setup>
</script>
<style scoped>
.auth-layout { display:flex; align-items:center; justify-content:center; height:100vh; }
.box { width:400px; }
</style>

