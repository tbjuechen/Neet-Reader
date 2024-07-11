<template>
  <Teleport to="body">
    <div class="tb-float-box" :style="style">
      <slot></slot>
    </div>
  </Teleport>
</template>

<script setup>
import { Teleport, defineProps } from "vue";

const props = defineProps({
  top_pos: {
    type: String,
    default: () => "0",
  },
  left_pos: {
    type: String,
    default: () => "0",
  },
});

const style = {
  top: props.top_pos + "px",
  left: props.left_pos + "px",
};

// console.log(style)
</script>

<style scoped>
.tb-float-box {
  position: fixed;
  z-index: 999;
  background-color: white;
  /* border: 1px solid #ccc; */
  z-index: 1000;
  border-radius: 4px;
  box-shadow: 0 0 50px -10px rgb(204, 204, 204);
}
</style>