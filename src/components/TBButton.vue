<template>
  <button class="tb-button" :style="style">
    <slot></slot>
  </button>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  full: {
    type: Boolean,
    default: () => false,
  },
});

const style = ref({
  "--b-bg-c": props.full ? "var(--bd-line-color)" : "white",
  "--b-bd-c": "var(--bd-line-color)",
  "--b-wd-c": props.full ? "white" : "var(--bd-line-color)",
  "--b-bg-c-hover": props.full ? "rgb(64,169,255)" : "white",
  "--b-bd-c-hover": "rgb(68,164,254)",
  "--b-wd-c-hover": props.full ? "white" : "rgb(68,164,254)",
});
</script>

<style scoped>
.tb-button {
  background-color: var(--b-bg-c);
  border: var(--b-bd-c) 1px solid;
  /* padding: 8px 16px; */
  color: var(--b-wd-c);
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.5s, border 0.5s, background-color 0.5s;
  height: 100%;
  width: 100%;
  user-select: none;
}

.tb-button:hover {
  color: var(--b-wd-c-hover);
  border: var(--b-bd-c-hover) 1px solid;
  background-color: var(--b-bg-c-hover);
}
</style>