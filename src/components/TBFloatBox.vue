<template>
  <Teleport to="body">
    <div :class="{'tb-float-box':true, 'act': animation, 'quit': animation && isQuit }" :style="style">
      <slot></slot>
    </div>
  </Teleport>
</template>

<script setup>
import { Teleport, defineProps, computed, onBeforeUnmount, ref } from "vue";

const props = defineProps({
  top_pos: {
    type: String,
    default: () => "0",
  },
  left_pos: {
    type: String,
    default: () => "0",
  },
  style: {
    type: Object,
    default: () => (null),
  },
  animation:{
    type: Boolean,
    default: ()=> false,
  }
});

const isQuit = ref(false)

onBeforeUnmount(()=>{
  isQuit.value = true
})

const style = computed(()=>{ 
  return props.style !== null? props.style :{
  top: props.top_pos + "px",
  left: props.left_pos + "px",
}});

// console.log(style)
</script>

<style scoped>
.tb-float-box {
  position: absolute;
  z-index: 999;
  background-color: white;
  /* border: 1px solid #ccc; */
  z-index: 1000;
  border-radius: 4px;
  box-shadow: 0 0 50px -10px rgb(204, 204, 204);
}

.act{
  animation: enter 0.2s forwards;
}

@keyframes enter{
  from {
    transform: scaleY(0.5) translate(0, -50%);
  }
  to {
    transform: scale(1);
  }
}

.quit{
  animation: leave 0.2s forwards;
}

@keyframes leave {
  from {
    transform: scale(1);
  }
  to {
    transform: scaleY(0.5) translate(0, -50%);
  }
}
</style>