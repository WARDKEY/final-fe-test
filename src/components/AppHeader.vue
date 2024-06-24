<!-- src/components/AppHeader.vue -->
<template>
  <q-header elevated class="app-header">
    <q-toolbar class="app-toolbar">
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="$emit('toggle-sidebar')"
        class="menu-button"
      />
      <q-toolbar-title class="app-title">KnowGet</q-toolbar-title>
      <div class="title">{{ title }}</div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'KnowGet',
  },
});
</script>

<style scoped>
.app-header {
  height: 80px;
  background-color: #e9f5fe;
  align-items: center;
  justify-content: center;
}

.app-toolbar {
  height: 100%;
  display: flex;
  align-items: center;
}

.menu-button {
  margin-right: 20px;
  color: black;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.title {
  font-size: 1.2rem;
  color: #666;
  margin-left: auto;
}
</style>
