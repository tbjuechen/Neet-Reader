<template>
  <div class="book-card-box">
    <p v-if="data.last_visit" class="book-last-visit">{{ data.last_visit }}</p>
    <div v-else id="new-create">
        <div class="dot" style="margin-right: 8px;"/>
        <p class="book-last-visit">新添加</p>
    </div>
    <div class="cover-box">
        <img :src="data.cover" class="book-cover">
        <input type="checkbox" class="book-slecet"/>
    </div>
  </div>
</template>

<script setup>

import {ref} from 'vue'
import TBCheckBox from './TBCheckBox.vue';

const props = defineProps({
    book_id:{
        type: String,
        required: true
    }
})

// for frontend dev
const data = ref({
    last_visit: null, // xx天前 xx小时前 null=新添加
    cover: '/example/cover.jpg',
    title:'13.[武田绫乃].吹响吧！上低音号：仰望你展翅飞翔的背影'
})

</script>

<style scoped>

.book-card-box{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap:10px;
}

.book-cover{
    width: 150px;
    height: 200px;
}

.book-last-visit{
    margin:0;
    font-size: 11px;
    user-select: none;
    color:rgb(158,158,158);
    display: inline-block;
}

.dot{
    display: inline-block;
    background: rgb(255,101,37);
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.cover-box{
    position: relative;
    border:white solid 2px;
    box-shadow: 0 0 4px 0 rgba(154,154,154,0.8);
    transition: border 0.6s;
    cursor: pointer;
}

.cover-box:hover{
    border:rgb(24,144,255) solid 2px;
}

.book-slecet{
    position: absolute;
    top:8px;
    right: 8px;
    width: 16px;
    height: 16px;
    border: rgb(217,217,217) 1px solid;
    margin: 0;
    border-radius:2px;
    appearance:none;
    box-sizing:content-box;
    background: white;
    transition: border 0.6s, background-color 0.2s ;
}

.book-slecet:hover{
    border: rgb(24,144,255) 1px solid;
}

.book-slecet:checked{
    background: rgb(24,144,255);
}

.book-slecet:checked::before{
  content: "✔";
  text-align: center;
  color: #fff;
  width: 16px;
  height: 16px;
  transform: translate(0,-1.5px);
  display: block;
  animation: check 0.2s forwards;
}

@keyframes check{
    0%{
        transform: translate(0,-1.5px) scale(0);
    }
    75%{
        transform: translate(0,-1.5px) scale(1.2);
    }
    100%{
        transform: translate(0,-1.5px) scale(1);
    }
}

.book-slecet:checked::after{
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    transform: translate(-8px,-16px);
    animation: wave 0.3s forwards;
    box-sizing:content-box;
    border-radius: 2px;
}

@keyframes wave {
    0%{
        transform: translate(-0.5px,-16.5px) scale(1);
        border: rgba(24,144,255,1) 1px solid;
    }
    100%{
        transform: translate(-0.5px,-16.5px) scale(1.5);
        border: rgba(24,144,255,0) 1px solid;
    }
    
}


</style>