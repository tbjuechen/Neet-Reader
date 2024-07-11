<template>
  <div class="tb-divider" :style="style[props.direction]"></div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  direction: {
    type: String,
    default: () => "horizontal",
  },
});

const style = {
  horizontal: {
    width: "100%",
    height: "1px",
  },
  vertical: {
    width: "1px",
    height: "100%",
  },
};
</script>

<style scoped>
.tb-divider {
  background-color: rgb(232, 232, 232);
}
</style>