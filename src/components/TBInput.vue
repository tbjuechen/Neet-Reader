<template>
  <input 
    class="tb-input"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>


const props = defineProps({
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      required: true
    }
  })
</script>

<style scoped>
.tb-input{
  border: rgb(223,223,223) 1px solid;
  border-radius: 2px;
  padding: 4px 10px;
  transition: border 0.3s,box-shadow 0.3s;
}

.tb-input:hover{
  border: rgb(64,169,255) 1px solid;
}

.tb-input:focus{
  box-shadow: 0 0 0 2px rgb(209,233,255);
  border: rgb(64,169,255) 1px solid;
}

.tb-input:focus-visible{
  outline: 0px;
}
</style>
