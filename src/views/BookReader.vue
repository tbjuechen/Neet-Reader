<template>
  <div class="container">
    <transition name="left-bar">
      <div class="left-contianer bordered" v-if="displayLeftBar">
        <div id="catalog" v-if="displayCatalog">
          <p class="catalog-title">目录</p>
          <TBDivider/>
          <div class="chapter-list">
            <div v-for="item,index in navigation" :key="index" class="chapter-item" @click="()=>{junpTo(item.href)}" @click.stop>
              <p :class="{'chapter-title':true, 'current-chapter': index === currentSection}">{{ item.label }}</p>
              <p class="chapter-process">{{ navigationProcess[index] }}</p>
            </div>
          </div>
        </div>

        <div id="note" v-if="displayNote">
          <p class="catalog-title">重点与笔记</p>
          <TBDivider style="width: 300px;"/>
          
        </div>
      </div>
    </transition>
    <div class="reader-warper">
      <div class="turn-page" id="prev" @click="prevPage"/>
      <div id="read"></div>
      <div class="turn-page" id="next" @click="nextPage"/>
      <transition name="time">
        <TimeBar class="time" v-if="!displaySetting"/>
      </transition>
      <transition name="downArrow">
        <div id="show-setting-box" v-if="!displaySetting" @click="changeDisplay">
          <DownArrow/>
        </div>
      </transition>
      <transition name="bottom-bar">
        <div class="bottom-bar" v-if="!displaySetting">
          <div class="message-box">
            <p class="current-title" v-if="navigation"> {{ navigation[currentSection].label}}</p>
            <p class="current-process" v-if="process">{{ process }}</p>
          </div>
          <MiniProgressBar id="mini-progress" :process="process"/>
        </div>
      </transition>
    </div>
  </div>
  <Teleport to="body">
    <transition name="setting-panel">
      <div id="head-setting-panel" class="bordered" v-if="displaySetting">
        <p class="logo"> Neet&nbsp;Reader</p>
        <div class="side-buttom-box" @click="handleClikeCatalog">
          <CatalogIcon class="side-icon"/>
          <div class="float"><span>目录</span></div>
        </div>
        <div class="side-buttom-box" @click="handleClickNote">
          <RecordIcon class="side-icon"/>   
          <div class="float"><span>笔记</span></div>
        </div>
      </div>
    </transition>
  </Teleport>

  <Teleport to="body">
    <transition name="bottom-process">
      <div id="bottom-process-panel" class="bordered" v-if="displaySetting">
        <div class="chapter-control-box">
          <PrevIcon class="chapter-icon"/>
          <TBInput v-model="currentSection" class="chapter-input"/>
          <p> /&nbsp;{{ navigation.length }}</p>
          <NextIcon class="chapter-icon"/>
        </div>
      </div>
    </transition>
  </Teleport>

  
</template>

<script setup>
import Epub from "epubjs";
import { onMounted, ref, watch } from "vue";
import TBDivider from "@/components/TBDivider.vue";
import TBFloatBox from "@/components/TBFloatBox.vue";
import CatalogIcon from "@/assets/catalog.svg"
import RecordIcon from "@/assets/record.svg"
import TimeBar from "@/components/TimeBar.vue"
import DownArrow from "@/assets/downArrow-2.svg"
import MiniProgressBar from "@/components/MiniProgressBar.vue"
import NextIcon from "@/assets/next.svg"
import PrevIcon from "@/assets/prev.svg"
import TBInput from "@/components/TBInput.vue";

const exampleBoolURL = '/example/13.[武田绫乃].吹响吧！上低音号：仰望你展翅飞翔的背影.epub'
const book = Epub(exampleBoolURL)
console.log(book)
const fontSize = ref(16)
var rendition

// 目录/笔记 控制
const displayLeftBar = ref(true)
const displayCatalog = ref(true)
const displayNote = ref(false)


// 目录进度控制
const navigation = ref()
const navigationProcess = ref([])
const process = ref('0.00%')
const currentSection = ref(0)

// 格式化 process
const formatProcess = (process) =>{
  return (process * 100).toFixed(2) + '%'
}



book.ready.then(()=>{
  // 加载目录
  navigation.value = book.navigation.toc
  
  // 分页
  book.locations.generate(
    750 * ((window.innerWidth - 460) / 375 * (fontSize/16))
  ).then((location)=>{
    console.log(location)
    navigation.value.forEach((item)=>{
      navigationProcess.value.push(
        formatProcess(book.locations.percentageFromCfi(book.spine.get(item.href).cfiFromRange(0)))
      )
    })
    console.log(navigationProcess.value)
  })
})


// 跳转到指定目录
const junpTo = (herf)=>{
  rendition.display(herf).then(()=>{
    process.value = formatProcess(rendition.currentLocation().start.percentage)
  })
}

// 翻页
const prevPage = (e) => {
  rendition.prev().then(()=>{process.value = formatProcess(rendition.currentLocation().start.percentage)});
  e.stopPropagation();
}

const nextPage = (e) => {
  rendition.next().then(()=>{process.value = formatProcess(rendition.currentLocation().start.percentage)});
  e.stopPropagation();
}

// 设置栏隐藏
const displaySetting = ref(true)
const changeDisplay = () => {
  displaySetting.value = !displaySetting.value
}
// // 绑定到window
// window.addEventListener('click', changeDisplay)


// 处理鼠标点击
var mouseDownTime
var mouseUpTime
var mouseDownPos
var mouseUpPos

const handleClick = () => {
  const move = Math.abs(mouseDownPos.x - mouseUpPos.x) + Math.abs(mouseDownPos.y - mouseUpPos.y)
  const deltaTime = mouseUpTime - mouseDownTime
  if (move < 100 & deltaTime < 200){
    changeDisplay();
  }
}

// 将书本挂载到 read 上
const initRendition = (leftBar=true) => {
  rendition = book.renderTo("read",{
    width: (window.innerWidth- (leftBar?470:170)).toString() + "px",
    // width: "500px",
    height: (window.innerHeight-90).toString() + "px",
  })
  rendition.spread('auto', 640)
  rendition.display().then(()=>{
    process.value = formatProcess(rendition.currentLocation().start.percentage)
  })

  rendition.on('mousedown',(event) =>{
    mouseDownTime = new Date().getTime()
    mouseDownPos = {
      x:event.clientX,
      y:event.clientY
    }
  })

  rendition.on('mouseup',(event) =>{
    mouseUpTime = new Date().getTime()
    mouseUpPos = {
      x:event.clientX,
      y:event.clientY
    }
    handleClick()
  })
}

initRendition(displayLeftBar.value);


// 我也不知道为啥挂载完时并没有 currentLaocation 官方文档就是屎
// const getProcess = () => {
//   try{
//     process.value = formatProcess(rendition.currentLocation().start.percentage)
//   }catch(e){
//     setTimeout(() => {
//       getProcess()
//     }, 100);
//   }
// }
// getProcess()

// 窗口变化时重新挂载阅读器
onMounted(()=>{
  window.onresize = ()=>{
    // 可能需要防抖
    rendition.destroy()
    initRendition(displayLeftBar.value);
  }
})

const handleClikeCatalog = () => {
  if (displayLeftBar.value) {
    if (displayCatalog.value){
      displayLeftBar.value = false
    } else {
      displayCatalog.value = true
      displayNote.value = false
    }
  } else {
    displayLeftBar.value = true
    displayCatalog.value = true
    displayNote.value = false
  }
}

const handleClickNote = () => {
  if (displayLeftBar.value) {
    if (displayNote.value){
      displayLeftBar.value = false
    } else {
      displayCatalog.value = false
      displayNote.value = true
    }
  } else {
    displayLeftBar.value = true
    displayCatalog.value = false
    displayNote.value = true
  }
}

watch(displayLeftBar,async (newValue, oldValue)=>{
  rendition.destroy();
  initRendition(newValue);
})

watch(process, async (newValue)=>{
  const findSection = () => {
    // console.log(newValue)
    const lessThan = (arg1, arg2)=>{
      return Number(arg1.slice(0,arg1.length - 1)) < Number(arg2.slice(0,arg2.length - 1))
    }
    // 封面
    if (lessThan(newValue,navigationProcess.value[0])){
      currentSection.value = 0
      return
    }

    // 找到属于哪一章
    for (var i = 1;i < navigationProcess.value.length; i++){
      if (lessThan(newValue, navigationProcess.value[i])){
        currentSection.value = i-1
        return
      }
    }

    // 最后一章
    currentSection.value = navigationProcess.value.length - 1
  }
  findSection();
  console.log(currentSection.value)
})



</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

#catalog{
  background: rgb(248,248,250);
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 300px;
}

#read{
  flex-grow: 1;
  padding-top: 60px;
  padding-bottom: 20px;
  user-select: none;
  box-sizing: border-box;
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
  padding-right: 12px;
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

.chapter-process{
  font-size: 12px;
  text-align: right;
  color: rgb(153,153,165);
  flex-grow: 1;
}

.chapter-list{
  margin-top:16px;
}

#head-setting-panel{
  width: 100vw;
  height: 42px;
  position:absolute;
  top: 0;
  left: 0;
  background: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  gap:12px
}

.turn-page{
 height: 100vh;
 width: 80px; 
 position: relative;
 cursor: pointer;
}

.turn-page::after{
  position: absolute;
  bottom: 300px;
  left: 20px;
  font-size: 40px;
  font-weight: 800;
  transform: scale(1, 2);
  color: rgb(197,197,197);
  opacity: 0;
  transition: all 0.6s;
}

.turn-page:hover::after{
  opacity: 1;
}

#prev::after{
  content:"<";
}

#next::after{
  content:">";
}

.setting-panel-enter-active,
.setting-panel-leave-active {
  transition: all 0.3s;
}

.setting-panel-enter-from,
.setting-panel-leave-to {
  transform: translate(0,-40px);
}

.bordered{
  border: rgb(228,228,228) solid 1px;
  box-sizing: border-box;
}

.logo{
  margin: 0;
  user-select: none;
  font-weight: bold;
  font-size: 14px;
  color: rgb(66,165,245);
  margin-right: 24px;
}

.left-contianer{
  flex-grow: 0;
  min-width: 300px;
  height: 100vh;
}

#note{
  display: flex;
  flex-direction: column;
}

.side-icon{
  fill: rgb(112,112,112);
  height: 16px;
  width: 16px;
  cursor: pointer;
  position: relative;
}

.side-icon:hover{
  fill: rgb(16,16,16)
}

.float{
  position: absolute;
  width: 48px;
  height: 32px;
  background: rgba(24,24,24,0.8);
  top: 40px;
  left: -16px;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  color:rgb(251,251,251);
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s;
}

.float span{
  font-size: 14px;
}

.float::after{
  content: '';
  height: 6px;
  width: 6px;
  /* border-left: rgba(24,24,24,0.8) solid 3px;
  border-top: rgba(24,24,24,0.8) solid 3px; */
  background: linear-gradient(45deg, rgba(24,24,24,0.8), rgba(24,24,24,0.8) 50%, transparent 50%, transparent 100%);
  position: absolute;
  top:-2.5px;
  transform: rotate(135deg);
}

.side-buttom-box{
  position: relative;
  width: 16px;
  height: 16px;
}

.side-buttom-box:hover .float{
  opacity: 1;
  transform: scale(1);
}

.left-bar-enter-active,
.left-bar-leave-active {
  transition: all 0.4s;
}

.left-bar-enter-from,
.left-bar-leave-to {
  transform: translate(-300px, 0);
}

.reader-warper{
  flex:1;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  position: relative;
}

.time{
  position: absolute;
  left: 10px;
  height: 40px;
}

.time :deep(span){
  color: rgb(157,157,157);
  font-size: 12px;
  line-height: 40px;
  font-weight: 500;
  text-align: center;
}

.time-enter-active,
.time-leave-active {
  transition: all 0.4s;
}

.time-enter-from,
.time-leave-to {
  transform: translate(0, -40px);
}

#show-setting-box{
  position: absolute;
  right: 20px;
  width: 40px;
  height: 40px;
  top: 0px;
  border: rgb(255,255,255) solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.4s;
}

#show-setting-box:hover{
  cursor: pointer;
  border: rgb(228,228,228) solid 1px;
  box-shadow: 0 2px 4px rgba(108,108,108,0.1);
}

#show-setting-box :deep(svg){
  fill: rgb(206,206,206);
}

#show-setting-box:hover :deep(svg){
  fill: rgb(102,102,102);
}

.downArrow-enter-active,
.downArrow-leave-active {
  transition: all 0.4s;
}

.downArrow-enter-from,
.downArrow-leave-to {
  transform: translate(0, -40px);
}

.bottom-bar{
  position:absolute;
  left: 0;
  bottom: 0;
  height: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.message-box{
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
}

#mini-progress{
  width: 100%;
}

.current-chapter{
  color: rgb(69,162,239);
}

.current-title{
  margin: 0;
  font-size: 12px;
  padding-top: 12px;
  padding-left: 12px;
  color: rgb(172,172,172);
  flex-grow: 1;
  user-select: none;
}

.current-process{
  margin: 0;
  font-size: 12px;
  padding-top: 12px;
  color: rgb(172,172,172);
  width: 50px;
  text-align: right;
  user-select: none;
  margin-right: 12px;
}


.bottom-process-enter-active,
.bottom-process-leave-active,
.bottom-bar-enter-active,
.bottom-bar-leave-active {
  transition: all 0.4s;
}

.bottom-process-enter-from,
.bottom-process-leave-to,
.bottom-bar-enter-from,
.bottom-bar-leave-to {
  transform: translate(0, 40px);
}

#bottom-process-panel{
  width: 100vw;
  height: 42px;
  position:absolute;
  bottom: 0;
  left: 0;
  background: white;
  padding-left: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.chapter-control-box{
  display: flex;
  flex-direction: row;
  align-items: center;
}

.chapter-input{
  width: 24px;
  margin-left: 12px;
  margin-right: 8px;
  height: 20px;
  font-size: 12px;
  text-align: center;
  box-sizing: border-box;
  padding: 0;
  /* line-height: 20px;
  vertical-align: middle; */
  font-size: 12px;
  padding-top: 2px;
  /* transform: translate(0,1.5px); */
}

.chapter-control-box p{
  margin: 0;
  font-size: 12px;
  margin-right: 12px;
  user-select: none;
  line-height: 12px;
}

.chapter-input,
.chapter-control-box p{
  color: rgb(102,102,102);
}

.chapter-icon{
  fill: rgb(102,102,102);
}
</style>