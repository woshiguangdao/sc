<template>
  <div class="login-page">
    <h2>Login</h2>
    <form @submit.prevent="onSubmit">
      <input v-model="username" placeholder="username" />
      <input v-model="password" type="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const username = ref('');
const password = ref('');
const onSubmit = () => { console.log('login', username.value); }
</script>
<style scoped>
.login-page { max-width:400px; margin:40px auto }
</style>

