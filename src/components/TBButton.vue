<template>
  <button class="tb-button">
    <slot></slot>
  </button>
</template>

<script setup>

</script>

<style scoped>
.tb-button{
    background-color: white;
    border: var(--bd-line-color) 1px solid;
    /* padding: 8px 16px; */
    color: var(--bd-line-color);
    border-radius: 4px;
    cursor: pointer;
    transition: color 0.5s, border 0.5s;
    height: 100%;
    width: 100%;
    user-select: none;
}

.tb-button:hover{
    color: var(--bd-color-hover);
    border: var(--bd-color-hover) 1px solid;
}
</style>