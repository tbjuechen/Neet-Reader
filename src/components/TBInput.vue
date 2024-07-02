<template>
  <input class="tb-input"/>
</template>

<script setup>

</script>

<style scoped>
.tb-input{
  border: rgb(223,223,223) 1px solid;
  border-radius: 2px;
  padding: 4px 4px;
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
