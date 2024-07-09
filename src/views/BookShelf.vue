<template>
  <div class="shelf-container">
    <div class="title-bar">
        <b id="shelf-name">{{ data.name }}</b>
        <p id="book-cnt">({{ data.size }})</p>
    </div>
    <div id="filter-box">
        <TBInput id="book-filter" style="box-sizing:border-box; width: 100%;" placeholder="输入书名，进行筛选"/>
        <p id="sort">排序<DownArrowIcon style="width: 12px; transform: translate(8px,3px); fill:rgb(198,198,198)"/></p>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import TBInput from '@/components/TBInput.vue';
import DownArrowIcon from '@/assets/downArrow.svg'

// 从后端获取
const data = ref({
    name:'分类',
    size:16
})


</script>

<style scoped>
.shelf-container{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 0 24px;
    margin-right: 24px;
    margin-top: 30px;
    gap:8px;
}

p{
    margin:0;
}

/* .title-bar{

} */

#shelf-name{
    font-size:22px;
    display: inline;
    color: rgb(102,102,102);
    user-select: none;
}

#book-cnt{
    font-size:14px;
    display: inline;
    margin-left: 10px;
    color:rgb(153,153,166);
    user-select: none;
}

#book-filter{
    flex-grow:1;
    width: 100%;
}

#filter-box{
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 16px;
    justify-content: center;
    align-items: center;
}

#sort{
    flex:56px;
    font-size: 12px;
    color: rgb(102,102,102);
    user-select: none;
    cursor: pointer;
}

</style>