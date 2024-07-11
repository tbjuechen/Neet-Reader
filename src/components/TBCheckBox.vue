<template>
  <input
    type="checkbox"
    class="tb-check-box"
    :style="{ '--box-color': props.color }"
    :value="value"
    :checked="modelValue === value"
    @change="$emit('update:modelValue', value)"
  />
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  modelValue: {
    type: [String, Number],
    required: true,
  },
});
</script>

<style scoped>
.tb-check-box {
  appearance: none;
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  background: var(--box-color);
  cursor: pointer;
}

.tb-check-box:checked {
  box-shadow: 0 0 8px -2px var(--box-color);
}

.tb-check-box:checked:after {
  content: "✔";
  position: absolute;
  color: white;
  font-size: 14px;
  width: 20px;
  height: 20px;
  text-align: center;
}
</style>