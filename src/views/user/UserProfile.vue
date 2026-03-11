<template>
  <div>
    <component :is="InnerProfile" />
  </div>
</template>

<script setup>
import InnerProfile from '@/views/UserProfile.vue';
</script>

