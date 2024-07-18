<template>
  <div class="progress-bar-wrapper">
    <div class="process" :style="{width:process}"></div>
  </div>
</template>

<script setup>


const props = defineProps({
    process:{
        type:String,
        required:true
    }
})

</script>

<style scoped>
.progress-bar-wrapper{
  height: 4px;
  background: rgb(196,196,196);
  position: relative;
}

.process{
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgb(66,165,245);
  transition: all 0.2s ease;
}
</style>