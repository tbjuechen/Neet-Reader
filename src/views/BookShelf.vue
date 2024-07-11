<template>
  <div class="shelf-container">
    <div class="title-bar">
        <b id="shelf-name">{{ data.name }}</b>
        <p id="book-cnt">({{ data.size }})</p>
    </div>
    <div id="filter-box">
        <TBInput id="book-filter" style="box-sizing:border-box; width: 100%;" placeholder="输入书名，进行筛选" v-model="select_text" :select_mode="select_mode"/>
        <p id="sort">排序<DownArrowIcon style="width: 12px; transform: translate(8px,3px); fill:rgb(198,198,198)"/></p>
    </div>
    <div class="book-grid-box">
        <BookCard book_id="-1" v-for="item,key in check_list" :key="key" v-model="check_list[key]" :select_mode="select_mode"></BookCard>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import TBInput from '@/components/TBInput.vue';
import DownArrowIcon from '@/assets/downArrow.svg'
import BookCard from '@/components/BookCard.vue'

// 从后端获取
const data = ref({
    name:'分类',
    size:16
})

// for test
const check_list = ref([false,false,false, false, false, false, false])

// const print = () => {
//     console.log(check_list.value)
//     setTimeout(print, 10000)
// }

// print()

const select_mode = computed(() => {
    return check_list.value.some((item) => item === true)
})

const select_text = ref('')


</script>

<style scoped>
.shelf-container{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 0;
    padding:0;
    padding-top: 30px;
    gap:16px;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
}

.shelf-container > *{
    padding:0 24px;
    width: 100%;
    box-sizing: border-box;
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

.book-grid-box{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(154px, 1fr));
    gap: 12px;
    justify-content: center;
    width: 100%;
    padding-top: 24px;
    padding-left: 54px;
    padding-right: 30px;
    box-sizing: border-box;
    overflow: auto;
}

</style>