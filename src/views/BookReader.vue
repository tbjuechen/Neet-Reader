<template>
  <div class="container" :style="{'background': backgroundColor}">
    <transition name="left-bar">
      <div class="left-contianer bordered" v-if="displayLeftBar">
        <div id="catalog" v-if="displayCatalog">
          <p class="catalog-title">目录</p>
          <TBDivider/>
          <div class="chapter-list">
            <div v-for="item,index in navigation" :key="index" class="chapter-item" @click="()=>{jumpTo(item.href)}" @click.stop>
              <p :class="{'chapter-title':true, 'current-chapter': index.toString() === currentSection}">{{ item.label }}</p>
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
  
  <!-- 顶部设置栏 -->
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
        <TBDivider direction="vertical" style="height: 60%;"/>
        <p> 阅读模式</p>
        <TBDivider direction="vertical" style="height: 60%;"/>
        <div class="background-color-box">
          <p>颜色</p>
          <TBCheckBox
            name="color"
            v-for="(item, key) in backgroundColorList"
            :key="key"
            type="radio"
            :color="item.color"
            :value="key"
            v-model="selectedColor"
            :style="{border: `1px solid ${item.border}`}"
          />
        </div>
        <div class="font-size-box">
          <p>字号</p>
          <MinusCircle @click="FontSizeMinus"/>
          <p>{{ fontSize }}</p>
          <PlusCircle @click="FontSizePlus"/>
        </div>
        <TBDivider direction="vertical" style="height: 60%;"/>
        <div class="more-setting-box" @click="handleClickSetting">
          <SettingIcon/>
          <span>更多设置</span>
        </div>
        <div class="right-icon-box">
          <div class="side-buttom-box" >
            <BookMarkIcon class="side-icon right-icon"/>   
            <div class="float" style="--xtrans: -7px"><span>添加书签</span></div>
          </div>
          <div class="side-buttom-box" >
            <DownArrow2 class="side-icon right-icon"/>   
            <div class="float" style="--xtrans: -7px"><span>更多书签</span></div>
          </div>
          <div class="side-buttom-box" >
            <SearchIcon class="side-icon right-icon" style="transform: scaleX(-1);"/>   
            <div class="float" style="--xtrans: 0"><span>搜索</span></div>
          </div>
          <div class="side-buttom-box" >
            <FullScreenIcon class="side-icon right-icon"/>   
            <div class="float" style="--xtrans: 0"><span>全屏</span></div>
          </div>
          <div class="side-buttom-box" @click="changeDisplay">
            <DownArrow class="side-icon right-icon" style="transform: rotate(180deg) translate(0, 3px); width: 24px; height: 24px;"/>   
            <div class="float" style="--xtrans: 4px"><span>收起</span></div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>

  <Teleport to="body">
    <transition name="bottom-process">
      <div id="bottom-process-panel" class="bordered" v-if="displaySetting">
        <div class="chapter-control-box">
          <PrevIcon class="chapter-icon" @click="prevSection"/>
          <TBInput v-model="currentSection" class="chapter-input"/>
          <p> /&nbsp;{{ navigation?navigation.length - 1:0 }}</p>
          <NextIcon class="chapter-icon" @click="nextSection"/>
        </div>
        <TBDivider direction="vertical" style="height: 60%;"/>
        <input 
          ref="inputRef" 
          type="range" 
          class="range-bar" 
          min="0" 
          max="100" 
          step="1" 
          v-model="process4bar" 
          :style="{'--position':process4bar.toString() + '%'}"
          @mouseup="()=>{findPage(process4bar / 100); displayProcessView=false}"
          @mousedown="()=>{displayProcessView=true}"
        />
        <p class="process-tag" v-if="process">{{ process }}</p>
      </div>
    </transition>
    <div class="darg-info-box" :style="{left:processBarPos + 6 +'px'}" v-if="loaded && displayProcessView">
      <p>{{ process4bar }}%</p>
      <p> {{ navigation[parseInt(findSection(process4bar + '%'))].label}}</p>
    </div>
  </Teleport>

  <!-- 设置栏更多设置面板 -->
  <Teleport to="body">
    <div class="bordered setting-box" v-if="displaySettingPanel">
      <div class="bordered sub-setting-box">
        <p>字体</p>
        <div class="radio-group">
          <div class="checkbox-label" v-for="item,index in fontFamilyList" :key="item.name">
            <input type="radio" name="font-family" v-model="selectedFont" :value="index" :id="item.name"/>
            <label :for="item.name">{{ item.name }}</label>
          </div>
        </div>
      </div>
      <div class="bordered sub-setting-box">
        <p>文字加粗</p>
        <div class="radio-group">
          <div class="checkbox-label">
            <input type="radio" name="font-weight" id="open" :value="true" v-model="isbold">
            <label for="open"> 开启 </label>
          </div>
          <div class="checkbox-label">
            <input type="radio" name="font-weight" id="close" :value="false" v-model="isbold">
            <label for="close"> 关闭 </label>
          </div>
        </div>
      </div>
      <div class="bordered sub-setting-box">
        <p>行间距</p>
        <div class="radio-group">
          <div class="checkbox-label" v-for="item,index in lineSpaceList" :key="index">
            <input type="radio" name="line-space" :id="item" :value="item" v-model="lineSpace"/>
            <label :for="item">{{ item }}</label>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
  
</template>

<script setup>
import Epub from "epubjs";
import { computed, onMounted, ref, watch } from "vue";
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
import TBCheckBox from "@/components/TBCheckBox.vue";
// 字体大小控制
import MinusCircle from "@/assets/minusCircle.svg"
import PlusCircle from "@/assets/plusCircle.svg"
// 设置
import SettingIcon from "@/assets/setting.svg"
// 全屏
import FullScreenIcon from "@/assets/fullScreen.svg"
// 搜索
import SearchIcon from "@/assets/search.svg"
// 书签
import DownArrow2 from "@/assets/downArrow-3.svg"
import BookMarkIcon from "@/assets/bookMark.svg"
import { useRoute } from "vue-router";

// 加载书籍
const route = useRoute();
var book
var rendition

// 目录/笔记 控制
const displayLeftBar = ref(true)
const displayCatalog = ref(true)
const displayNote = ref(false)


// 目录进度控制
const navigation = ref()
const navigationProcess = ref([])
const process = ref('0.00%')
const currentSection = ref('0')
const process4bar = ref(0)
const loaded = ref(false)

// 进度预览控制
const displayProcessView = ref(false)


// 样式控制
const backgroundColor = ref('white')
const fontColor = ref('rgb(38,38,38)')
const fontSize = ref(16)
// const lineSpace = ref(1.75)
const fontFamilyList = [
  { family:'"黑体", "Heiti SC", "Blod"', name:'黑体' },
  { family:'"SimSun", "宋体", serif', name:'宋体' },
  { family:'"楷体", SimSun, "Sunflower", sans-serif', name:'楷体'},
  { family:'"幼圆", "Arial", sans-serif', name:'幼圆'}
]
const selectedFont = ref(0)

const fontFamily = computed(()=>{
  return fontFamilyList[selectedFont.value].family
})

const isbold = ref(false)
const fontWeight = computed(()=>{
  return isbold.value?700:500
})

const lineSpaceList = [
  '1.0','1.2','1.5','1.75','2.0'
]
const lineSpace = ref('1.75')

const style = computed(()=>{
  return {
    'html':{
      'background': backgroundColor.value,
      'color': fontColor.value
    },
    'body':{
      'font-size': fontSize.value + 'px !important',
      'line-height': (fontSize.value * parseFloat(lineSpace.value)) + 'px !important',
      'background': backgroundColor.value,
      'font-family': fontFamily.value,
      'font-weight': fontWeight.value
    },
    'p':{
      'font-size': fontSize.value + 'px !important',
      'line-height': (fontSize.value * lineSpace.value) + 'px !important'
    }
  }
})

// 背景颜色列表
const backgroundColorList = ref([
  {color:'rgb(252,252,252)', border:'rgb(215,215,215)'},
  {color:'rgb(249,244,233)', border:'rgb(187,182,171)'},
  {color:'rgb(206,234,186)', border:'rgb(164,235,160)'},
  {color:'rgb(109,109,111)', border:'rgb(83,83,83)'},
  {color:'rgb(83,83,83)', border:'rgb(74,74,74)'}
])

const selectedColor = ref(0)

// 处理颜色变化
watch(selectedColor,(newValue)=>{
  backgroundColor.value = backgroundColorList.value[newValue].color
})

// 更新样式
watch(style,(newValue)=>{
  rendition.destroy()
  initRendition(displayLeftBar.value);
})

// 处理字号改变
const FontSizeMinus = () => {
  if (fontSize.value > 10) {
    fontSize.value--
  }
}

const FontSizePlus = () => {
  if (fontSize.value < 30) {
    fontSize.value++
  }
}

// 设置面板显示控制
const displaySettingPanel = ref(false)

const handleClickSetting = () => {
  displaySettingPanel.value = !displaySettingPanel.value
}

// 格式化 process
const formatProcess = (process) =>{
  return (process * 100).toFixed(2) + '%'
}

const PageList = ref([])

// 加载书本基本信息
window.ipcRenderer.invoke('read-book-info', route.params.id).then((res)=>{
  document.title = res.name
})

// 加载书本
window.ipcRenderer.invoke('read-book', route.params.id).then((res)=>{
  book = new Epub(res.buffer)
  console.log(book)
  book.ready.then(()=>{
    // 加载目录
    navigation.value = book.navigation.toc
    
    // 分页
    book.locations.generate(
      750 * ((window.innerWidth - 460) / 375 * (fontSize/16))
    ).then((location)=>{
      console.log(location)
      PageList.value = location
      navigation.value.forEach((item)=>{
        navigationProcess.value.push(
          formatProcess(book.locations.percentageFromCfi(book.spine.get(item.href).cfiFromRange(0)))
        )
      })
      console.log(navigationProcess.value)
      initRendition(displayLeftBar.value);
      loaded.value = true
    })
  })
})


// 跳转到指定目录
const jumpTo = (herf)=>{
  rendition.display(herf).then(()=>{
    process.value = formatProcess(rendition.currentLocation().start.percentage)
    currentCFI.value = rendition.currentLocation().start.cfi
    console.log(currentCFI.value)
  })
}

// 翻页
const prevPage = (e) => {
  rendition.prev().then(()=>{
    process.value = formatProcess(rendition.currentLocation().start.percentage)
    currentCFI.value = rendition.currentLocation().start.cfi
    console.log(currentCFI.value)
  });
  e.stopPropagation();
}

const nextPage = (e) => {
  rendition.next().then(()=>{
    process.value = formatProcess(rendition.currentLocation().start.percentage)
    currentCFI.value = rendition.currentLocation().start.cfi
    console.log(currentCFI.value)
  });
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
    width: (window.innerWidth- (leftBar?390:90)).toString() + "px",
    // width: "500px",
    height: (window.innerHeight-90).toString() + "px",
  })
  rendition.spread('auto', 640)
  rendition.display().then(()=>{
    process.value = formatProcess(rendition.currentLocation().start.percentage)
    if (currentCFI.value){
      jumpTo(currentCFI.value)
    }
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
    displaySettingPanel.value = false
  })

  rendition.themes.default(style.value)
}

// initRendition(displayLeftBar.value);


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


const currentCFI = ref(null)
// 窗口变化时重新挂载阅读器
onMounted(()=>{
  window.onresize = ()=>{
    // var lastCFI 
    // try{
    //   lastCFI = rendition.currentLocation().start.cfi
    // }catch(e){
    //   lastCFI = null
    // }
    // currentCFI.value = lastCFI?lastCFI:currentCFI.value
    // console.log(lastCFI, currentCFI.value)
    // 可能需要防抖
    rendition.destroy()
    initRendition(displayLeftBar.value);
    // jumpTo(currentCFI.value)
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

const findSection = (p) => {
    console.log(p)
    const lessThan = (arg1, arg2)=>{
      return Number(arg1.slice(0,arg1.length - 1)) < Number(arg2.slice(0,arg2.length - 1))
    }
    // 封面
    if (lessThan(p,navigationProcess.value[0])){
      return '0'
    }

    // 找到属于哪一章
    for (var i = 1;i < navigationProcess.value.length; i++){
      if (lessThan(p, navigationProcess.value[i])){
        return (i - 1).toString()
      }
    }

    // 最后一章
    return (navigationProcess.value.length - 1).toString()
  }


// 处理目录高亮变化
watch(process, async (newValue)=>{
  // const findSection = () => {
  //   // console.log(newValue)
  //   const lessThan = (arg1, arg2)=>{
  //     return Number(arg1.slice(0,arg1.length - 1)) < Number(arg2.slice(0,arg2.length - 1))
  //   }
  //   // 封面
  //   if (lessThan(newValue,navigationProcess.value[0])){
  //     currentSection.value = '0'
  //     return
  //   }

  //   // 找到属于哪一章
  //   for (var i = 1;i < navigationProcess.value.length; i++){
  //     if (lessThan(newValue, navigationProcess.value[i])){
  //       currentSection.value = (i - 1).toString()
  //       return
  //     }
  //   }

  //   // 最后一章
  //   currentSection.value = (navigationProcess.value.length - 1).toString()
  // }
  currentSection.value = findSection(newValue);
})

const prevSection = () => {
  // 处于第一章
  if (currentSection.value == '0'){
    return
  } else {
    currentSection.value = (parseInt(currentSection.value) - 1).toString()
    jumpTo(navigation.value[parseInt(currentSection.value)].href)
  }
}

const nextSection = () => {
  // 处于最后一章
  if (currentSection.value == (navigationProcess.value.length - 1).toString()){
    return
  } else {
    currentSection.value = (parseInt(currentSection.value) + 1).toString()
    jumpTo(navigation.value[parseInt(currentSection.value)].href)
  }
}

// 处理大进度条拖动
const findPage = async (percentage)=>{
  const pageLoc = parseInt(book.locations.total * percentage )
  const targetCFI = PageList.value[pageLoc]
  jumpTo(targetCFI)
  console.log(processBarPos)
}


// const inputRef = ref()

// onMounted(()=>{
//   inputRef.value.addEventListener("mouseup",()=>{findPage(process4bar.value / 100)})
// })

// // 被销毁后重新添加监听器
// watch(displaySetting,(newValue)=>{
//   if (newValue){
//     setTimeout(()=>{
//       const targetDOM = document.querySelector('.range-bar')
//       console.log(targetDOM)
//       targetDOM.addEventListener("mouseup",()=>{findPage(process4bar.value / 100)})
//     },500)
//   }
// })

// 大进度条跟随进度
watch(process, (newValue)=>{
  process4bar.value = parseInt(newValue)
})


const processBarPos = computed(()=>{
  var processBarDOM = document.querySelector('.range-bar')
  if (!processBarDOM){return  process4bar.value}
  const rect = processBarDOM.getBoundingClientRect()
  const offsetX = rect.left
  const barWidth = rect.width
  const sliderPos = offsetX + barWidth/100 * process4bar.value
  return sliderPos
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

#head-setting-panel p:nth-child(5){
  margin: 0;
  color: rgb(109,109,111);
  font-size: 14px;
  user-select: none;
}

#head-setting-panel input[type='radio']:checked::after{
  opacity: 0;
}

.turn-page{
 height: 100vh;
 width: 40px; 
 position: relative;
 cursor: pointer;
}

.turn-page::after{
  position: absolute;
  bottom: 300px;
  /* left: 10px; */
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
  min-width: 48px;
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
  transform: translate(var(--xtrans), 0) scale(0.5) !important;
  transition: all 0.2s !important;
}

.float span{
  font-size: 14px;
  white-space: nowrap;
  padding: 0 4px;
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
  transform: translate(var(--xtrans), 0) scale(1) !important;
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
  border: rgba(255,255,255,0) solid 1px;
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
  padding-right: 16px;
}

.chapter-control-box{
  margin-left: 8px;
  margin-right: 16px;
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
  cursor: pointer;
}

.range-bar{
  flex-grow: 1;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0 24px;
}

.range-bar[type='range']::-webkit-slider-runnable-track{
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 5px;
  cursor:pointer;
  border-radius:9999px;
  background: -webkit-linear-gradient(rgb(188,188,188), rgb(188,188,188)) no-repeat,rgb(215,215,215);
  background-size: var(--position) 100%;
}

.range-bar[type='range']:hover::-webkit-slider-runnable-track{
  background: -webkit-linear-gradient(rgb(66,165,245), rgb(66,165,245)) no-repeat,rgb(188,188,188);
  background-size: var(--position) 100%;
}

.range-bar[type='range']::-webkit-slider-thumb{
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 8px;
  width: 8px;
  box-sizing: content-box;
  border: 2px rgb(188,188,188) solid;
  border-radius: 100%;
  background: rgb(215,215,215);
  transform: translate(0,-3px);
}

.range-bar[type='range']:hover::-webkit-slider-thumb{
  background: white;
  border-color: rgb(66,165,245);
}

.process-tag{
  margin: 0;
  text-align: center;
  user-select: none;
  font-size: 12px;
  color: rgb(102,102,102)
}

.darg-info-box{
  background: white;
  position: absolute;
  bottom: 36px;
  transform: translate(-50%,0);
  padding:8px 16px;
  color:rgb(102,102,102);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.darg-info-box p{
  margin:0;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  max-width: 160px;
  white-space:nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.darg-info-box > p:first-child{
  font-weight: 500;
}

.background-color-box{
  margin: 0;
  color: rgb(109,109,111);
  font-size: 12px;
  user-select: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px
}

.font-size-box{
  font-size: 12px;
  user-select: none;
  color: rgb(109,109,111);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.font-size-box svg{
  fill:rgb(85,85,85);
  cursor: pointer;
  height: 18px;
  width: 18px;
}

.font-size-box svg:hover{
  fill: black;
}

.more-setting-box{
  font-size: 12px;
  user-select: none;
  color: rgb(109,109,111);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  cursor: pointer;
}

.more-setting-box svg{
  fill:rgb(85,85,85);
  height: 18px;
  width: 18px;
}

.more-setting-box:hover svg{
  fill: black;
}

.right-icon-box{
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 24px;
  gap: 10px;
}

.right-icon{
  height: 16px;
  width: 16px;
}

.setting-box{
  position: absolute;
  top: 41px;
  left: 580px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: rgb(109,109,111);
  /* width: 500px; */
}

.setting-box p{
  margin: 0;
}

.sub-setting-box{
  width: 100%;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
}

.radio-group{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
}

.checkbox-label label{
  text-align: center;
}

.checkbox-label{
  display: flex;
  align-items: center;
  min-width: 60px;
  gap: 4px;
}

.float{
  z-index: 100;
}
</style>