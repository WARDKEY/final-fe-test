<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="lHh Lpr lFf">
    <AppHeader
      :title="pageTitle"
      :staticSidebar="isLargeScreen"
      @toggle-sidebar="toggleLeftDrawer"
    />
    <AppSidebar
      :model-value="leftDrawerOpen"
      :staticSidebar="isLargeScreen"
      @update:model-value="setLeftDrawerOpen"
      is-open/>
    <q-page-container>
      <router-view @route-changed="updatePageTitle"/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {useQuasar} from 'quasar';
import AppHeader from 'components/AppHeader.vue';
import AppSidebar from 'components/AppSidebar.vue';

defineOptions({
  name: 'MainLayout',
});

const $q = useQuasar();
const leftDrawerOpen = ref(false);
const pageTitle = ref('');

const isLargeScreen = ref(false);

function updatePageTitle(route) {
  pageTitle.value = route.meta.title || 'Default Title';
}

const route = useRoute();
watch(
  route,
  newRoute => {
    updatePageTitle(newRoute);
  },
  {immediate: true},
);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function setLeftDrawerOpen(value) {
  leftDrawerOpen.value = value;
}

watch(
  () => $q.screen.width,
  width => {
    isLargeScreen.value = width >= $q.screen.lg; // lg 이상일 때 고정
    if (isLargeScreen.value) {
      leftDrawerOpen.value = true; // 큰 화면일 때 사이드바 항상 열림
    }
  },
  {immediate: true},
);
</script>
