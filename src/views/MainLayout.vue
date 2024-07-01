<template>
  <div id="root-container">
    <SideBar/>
    <div id="left-sidebar"></div>
    <div id="main-container">
        bcd<br/>
        <!-- <TBFloatBox top_pos='50' left_pos='50'/> -->
    </div>
  </div>
</template>

<script setup>
    import SideBar from '@/components/SideBar.vue';
    import TBFloatBox from '@/components/TBFloatBox.vue';
</script>

<style scoped>
#root-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

#left-sidebar {
  width: 200px;
  height: 100%;
  background-color: var(--bg-color);
}

#main-container {
  flex: 1;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
}
</style>