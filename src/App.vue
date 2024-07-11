<template>
  <DargHeader />
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import DargHeader from "./components/DargHeader.vue";
</script>

<style>
</style>