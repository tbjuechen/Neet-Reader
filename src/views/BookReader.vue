<template>
  <div class="container">
    <div id="catalog">
      <p class="catalog-title">目录</p>
      <TBDivider/>
      <div class="chapter-list">
        <div v-for="item,index in navigation" :key="index" class="chapter-item" @click="()=>{junpTo(item.href)}">
          <p class="chapter-title">{{ item.label }}</p>
        </div>
      </div>
      <TBButton @click="prevPage">上一页</TBButton>
      <TBButton @click="nextPage">下一页</TBButton>
    </div> 
    <div id="read"></div>
  </div>
  <TBFloatBox class="head-setting-panel">

  </TBFloatBox>
</template>

<script setup>
import Epub from "epubjs";
import { onMounted, ref } from "vue";
import TBDivider from "@/components/TBDivider.vue";
import TBFloatBox from "@/components/TBFloatBox.vue";

// for dev
import TBButton from "@/components/TBButton.vue";

const exampleBoolURL = '/example/13.[武田绫乃].吹响吧！上低音号：仰望你展翅飞翔的背影.epub'
const book = Epub(exampleBoolURL)
console.log(book)
const fontSize = ref(16)

const remianHeight = window.innerHeight
const rendition = book.renderTo("read",{
  width: (remianHeight-300).toString() + "px",
  height: "100vh",
})
rendition.spread('auto')
rendition.display()
const navigation = ref()

book.ready.then(()=>{
  // 加载目录
  navigation.value = book.navigation.toc
  
  // 分页
  book.locations.generate(
    750 * ((window.innerWidth - 300) / 375 * (fontSize/16))
  ).then((location)=>{
    console.log(location)
  })
})

// 跳转到指定目录
const junpTo = (herf)=>{
  rendition.display(herf)
}

// 翻页
const prevPage = () => {
  rendition.prev()
}

const nextPage = () => {
  rendition.next()
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

#catalog{
  flex-grow: 0;
  min-width: 300px;
  height: 100vh;
  background: rgb(248,248,250);
  display: flex;
  flex-direction: column;
}

#read{
  flex-grow: 1;
}

.catalog-title{
  margin: 0;
  line-height: 40px;
  color: rgb(153,153,153);
  user-select: none;
  font-size: 14px;
}

.catalog-title,
.chapter-item{
  padding-left: 20px;
}

.chapter-item{
  height: 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: all 0.1s;
  cursor: pointer;
}

.chapter-item:hover{
  background: rgb(235,235,237);
}

.chapter-title{
  margin:0;
  white-space:nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80%;
  font-size: 14px;
  user-select: none;
  color: rgb(51,51,51);
}

.chapter-list{
  margin-top:16px;
}



</style>