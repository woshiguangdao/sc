<script setup>

</script>

<template>
  <div class="menu-section">
    <h2>菜单</h2>
    <div class="menu-items">
      <div v-for="item in menuItems" :key="item.id" class="menu-item">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const menuItems = ref([
      { id: 1, name: '菜品1', description: '描述1' },
      { id: 2, name: '菜品2', description: '描述2' },
    ]);

    return {
      menuItems,
    };
  },
};
</script>

<style scoped>
.menu-section {
  padding: 20px;
}
.menu-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.menu-item h3 {
  margin: 0;
}
</style>