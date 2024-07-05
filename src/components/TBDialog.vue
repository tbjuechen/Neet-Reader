<template>
  <Teleport to="body">
    <div class="tb-dialog">
      
    </div>
    <div class="tb-dialog-mask"/>
  </Teleport>
</template>

<script setup>

const props = defineProps({
  message:{
    type:String,
    default:()=>'请输入信息'
  }
})


</script>

<style scoped>
.tb-dialog{
  position: absolute;
  width: 400px;
  height: 160px;
  animation: moveToCenter 0.8s cubic-bezier(0.5,0.2,0.5,1) forwards;
  background: white;
  overflow: hidden;
  transform: translate(-50%, -50%);
  z-index: 100;
  border-radius: 2px;
}

@keyframes moveToCenter {
  0% {
    transform: translate(-50%, -50%) scale(0);
    top: 0;
    left: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    top:40%;
    left: 50%;
  }
}

.tb-dialog-mask{
  position:absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.45);
  left: 0;
  top: 0;
  z-index: 50;
  /* opacity: 0.5; */
}
</style>