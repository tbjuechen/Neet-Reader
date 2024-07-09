<template>
  <div :class="{'selected': props.isSelect, 'sidebar-item': true}" :ref="操了不让我用ref" @click="handleClickRoute">
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps({
  isSelect: {
    type: Boolean,
    default: () => false
  },
  操了不让我用ref: null,
  to:{
    type:  Object,
    required: false
  }
})

const handleClickRoute= () => {
  if (props.to){
    router.push(props.to)
  }
}

</script>

<style scoped>
.sidebar-item{
  width: 160px;
  height: 16px;
  padding: 5px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  margin: 4px 0;
  color: rgb(102,102,102);
  font-size: 14px;
}

.sidebar-item:hover{
  background-color: rgb(234,238,241);
  cursor: pointer;
}

.selected{
  background-color: rgb(219,237,250);
}

.selected:hover{
  background-color: rgb(219,237,250);;
}
</style>