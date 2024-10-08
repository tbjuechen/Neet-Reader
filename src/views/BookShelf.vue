<template>
  <div class="shelf-container">
    <div class="title-bar">
      <b id="shelf-name">{{ data.name }}</b>
      <p id="book-cnt">({{ data.size }})</p>
    </div>
    <div id="filter-box">
      <TBInput
        id="book-filter"
        style="box-sizing: border-box; width: 100%"
        placeholder="输入书名，进行筛选"
        v-model="select_text"
        @input="handleInputSelectText"
      />
      <div id="clean-input" v-if="select_text !== ''" @click="()=> select_text = ''"><p>+</p></div>
      <p id="sort" @click="handleSort">
        排序
        <DownArrowIcon
          style="
            width: 12px;
            transform: translate(8px, 3px);
            fill: rgb(198, 198, 198);
          "
        />
      </p>
      <TBFloatBox :style="{right:'26px', top:'102px'}" v-if="displaySoetTable">
        <div class="drop-box sort-table">
          <div :class="{'drop-box-item':true ,'selected':sortByTime}" @click="handleClickTime">
            <p class="drop-box-text">最近</p>
          </div>
          <div :class="{'drop-box-item':true ,'selected':sortByName}" @click="handleClickName">
            <p class="drop-box-text">书名</p>
          </div>
          <TBDivider style="height: 1px; width: 90%; margin-left: 5%;"/>
          <div :class="{'drop-box-item':true ,'selected':hideCloudBook}" @click="handleHideCloudBook">
            <p class="drop-box-text">隐藏云端图书</p>
          </div>
        </div>
      </TBFloatBox>
    </div>
    <div class="book-grid-box">
      <BookCard
        v-for="(item, key) in displayBookList"
        :book_id="item.uuid"
        :key="item.uuid"
        v-model="selectDist[item.uuid]"
        :select_mode="select_mode"
        @contextmenu.prevent="(e) => {handleRightClick(e, item.uuid)}"
      ></BookCard>
    </div>
    <TBFloatBox :style="style" v-if="displayRightClickMenu">
      <div class="drop-box sort-table right-click-menu">
        <div class="drop-box-item" @click="handelOpenBook">
          <p class="drop-box-text"> 打开 </p>
        </div>
        <div class="drop-box-item sub-item-wrapper">
          <p class="drop-box-text"> 添加至分类 </p>
          <div class="drop-box sort-table sub-item">
            <div class="drop-box-item" v-for="item in catalogList" :key="item.uuid" style="width:100%" 
              @click="handleAddCatalog(item.uuid)">
              <p class="drop-box-text">{{ item.name }}</p>
            </div>
          </div>
        </div>
        <div class="drop-box-item">
          <p class="drop-box-text"> 上传到云端 </p>
        </div>
        <div class="drop-box-item">
          <p class="drop-box-text"> 导出文件 </p>
        </div>
        <div class="drop-box-item">
          <p class="drop-box-text"> 导出笔记 </p>
        </div>
        <div class="drop-box-item" @click="handleDeleteBook">
          <p class="drop-box-text red-text"> 彻底删除 </p>
        </div>
      </div>
    </TBFloatBox>
    <transition name="select-box">
      <div class="select-panel" v-if="select_mode">
        <input
          type="checkbox"
          id="full-select"
          @change="handleSelectChange"
          :checked="select_all"
        />
        <TBButton class="select-panel-button">添加至分类</TBButton>
        <TBButton class="select-panel-button">上&nbsp;传</TBButton>
        <TBButton class="select-panel-button delete-button">删&nbsp;除</TBButton>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import TBInput from "@/components/TBInput.vue";
import DownArrowIcon from "@/assets/downArrow.svg";
import BookCard from "@/components/BookCard.vue";
import TBButton from "@/components/TBButton.vue";
import TBFloatBox from "@/components/TBFloatBox.vue";
import TBDivider from "@/components/TBDivider.vue";
import { useRoute } from "vue-router";
import openDialog from "@/core/dialog.js";


// 书架信息
const route = useRoute();
var currentCatalog;

const data = ref({
  name: null,
  size: null,
});

const sortByTime = ref(true);
const sortByName = ref(false);

const bookList = ref([]);
const displayBookList = ref([]);
const selectDist = ref({});

// 右击事件对象
const focusedBook = ref()

// 右击菜单位置
const style = ref()

// 显示右击菜单
const displayRightClickMenu = ref(false)

const closeRightClickMenu = () => {
  displayRightClickMenu.value = false
  window.removeEventListener('click', closeRightClickMenu)
}

// 当前书架信息
const catalogList = ref()

// 同步书架
const loadCatalog = () => {
  window.ipcRenderer.invoke("get-catalog-list").then((res) => {
  catalogList.value = res.filter(item => item.uuid !== 'default')
});
}

// 处理右击事件
const handleRightClick = (e, uuid) =>{
  const pos_x = e.clientX
  const pos_y = e.clientY
  loadCatalog()
  focusedBook.value = uuid
  // 计算右键菜单出现位置
  style.value = {'box-shadow': 'none'}
  if (pos_y + 210 > window.innerHeight) {
    style.value['bottom'] = 0;
  } else {
    style.value['top'] = pos_y + 'px';
  }

  if (pos_x + 144 > window.innerWidth) {
    style.value['right'] = 0;
  } else {
    style.value['left'] = pos_x + 'px';
  }
  displayRightClickMenu.value = true
  window.addEventListener('click', closeRightClickMenu)
}

// 打开
const handelOpenBook = () => {
  window.ipcRenderer.invoke("open-win",focusedBook.value)
}

// 添加至分类
const handleAddCatalog = (catalog_id) => {
  window.ipcRenderer.invoke('add-to-catalog', focusedBook.value, catalog_id)
}

// 删除
const handleDeleteBook = (e) => {
  const message = '是否彻底删除该图书'
  const content = '该操作会删除该书在本地所有数据'
  const x = e.clientX.toString() + "px";
  const y = e.clientY.toString() + "px";
  const accept = () => {
    window.ipcRenderer.invoke('delete-book',focusedBook.value).then((res)=>{
      console.log(res)
    })
    window.location.reload() // 重新加载页面
  }
  const reject = () => {}
  openDialog(message, reject, accept, x, y, content)
}

watch(()=>route.params.id, async (newVal, oldVal) => {
  currentCatalog = await window.ipcRenderer.invoke("find-catalog", newVal);
  data.value.name = currentCatalog.name;
  data.value.size = currentCatalog.books.length;
  bookList.value = [];
  displayBookList.value = [];
  await Promise.all(currentCatalog.books.map(async (book) => {
    const bookInfo = await window.ipcRenderer.invoke("read-book-info", book);
    bookList.value.push(bookInfo);
    displayBookList.value.push(bookInfo);
    selectDist.value[bookInfo.uuid] = false;
  }));
  if (sortByName.value) {
    sortByNameFunc();
  } else if (sortByTime.value) {
    sortByTimeFunc();
  }
}, {immediate: true});

const sortByNameFunc = () => {
  displayBookList.value.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
};

const sortByTimeFunc = () => {
  console.log(displayBookList.value.sort((a, b) => {
    const aDate = new Date(a.lastRead);
    const bDate = new Date(b.lastRead);
    console.log(aDate, bDate);
    return bDate - aDate;
  }));
  console.log(displayBookList.value);
};

// const print = () => {
//     console.log(check_list.value)
//     setTimeout(print, 10000)
// }

// print()

const select_mode = computed(() => {
  return Object.values(selectDist.value).some((item) => item === true);
});

const select_all = computed(() => {
  return Object.values(selectDist.value).every((item) => item === true);
});

const select_text = ref("");

const handleSelectChange = (e) => {
  if (e.target.checked) {
    Object.getOwnPropertyNames(selectDist.value).forEach(key => {
      selectDist.value[key] = true
    });
  } else {
    Object.getOwnPropertyNames(selectDist.value).forEach(key => {
      selectDist.value[key] = false
    });
  }
};

const timeoutId = ref(null);

const handleInputSelectText = (e) => {
  clearTimeout(timeoutId.value);
  timeoutId.value = setTimeout(() => {
    console.log(select_text.value);
    // filter 逻辑
    displayBookList.value = bookList.value.filter((item) => {
      return item.name.includes(select_text.value);
    });
  }, 500);
};

const displaySoetTable = ref(false);

const handleSort = (e) => {
  displaySoetTable.value = !displaySoetTable.value;
  e.stopPropagation();
  if (displaySoetTable.value) {
    document.addEventListener("click", handleSort);
  } else {
    document.removeEventListener("click", handleSort);
  }
  console.log(sortByName.value, sortByTime.value);
};



const handleClickTime = (e) => {
  sortByTime.value = true;
  sortByTimeFunc();
  sortByName.value = false;
  e.stopPropagation();
};

const handleClickName = (e) => {
  sortByTime.value = false;
  sortByName.value = true;
  sortByNameFunc();
  e.stopPropagation();
};

const hideCloudBook = ref(false);
const handleHideCloudBook = (e) => {
  hideCloudBook.value = !hideCloudBook.value;
  e.stopPropagation();
};
</script>

<style scoped>
.shelf-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0;
  padding: 0;
  padding-top: 30px;
  gap: 16px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.shelf-container > * {
  padding: 0 24px;
  width: 100%;
  box-sizing: border-box;
}

p {
  margin: 0;
}

/* .title-bar{

} */

#shelf-name {
  font-size: 22px;
  display: inline;
  color: rgb(102, 102, 102);
  user-select: none;
}

#book-cnt {
  font-size: 14px;
  display: inline;
  margin-left: 10px;
  color: rgb(153, 153, 166);
  user-select: none;
}

#book-filter {
  flex-grow: 1;
  width: 100%;
}

#filter-box {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 16px;
  justify-content: center;
  align-items: center;
}

#sort {
  flex: 56px;
  font-size: 12px;
  color: rgb(102, 102, 102);
  user-select: none;
  cursor: pointer;
}

.book-grid-box {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(154px, 1fr));
  grid-column-gap: 18px;
  grid-row-gap: 36px;
  justify-content: center;
  width: 100%;
  padding-top: 24px;
  padding-left: 54px;
  padding-right: 30px;
  padding-bottom: 24px ;
  box-sizing: border-box;
  overflow: auto;
}

.select-panel {
  position: fixed;
  bottom: 16px;
  left: 220px;
  padding: 0;
  width: calc(100% - 240px);
  height: 40px;
  background: rgb(243, 247, 250);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  padding-left: 12px;
}

.select-box-enter-active,
.select-box-leave-active {
  transition: bottom 0.2s;
}

.select-box-enter-from,
.select-box-leave-to {
  bottom: -40px;
}

#full-select {
  width: 16px;
  height: 16px;
}

#full-select::after {
  content: "";
  display: block;
  transform: translate(3px, 3px);
  width: 10px;
  height: 10px;
  background: rgb(24, 144, 255);
}

#full-select:checked::after {
  width: 16px;
  height: 16px;
  transform: translate(-8px, -16px);
  background: none;
}

.select-panel-button {
  width: 96px;
  height: 24px;
  border-radius: 2px;
}

.delete-button {
  border: rgb(255, 77, 79) 1px solid;
  color: rgb(255, 77, 79);
}

.delete-button:hover {
  border: rgb(255, 120, 117) 1px solid;
  color: rgb(255, 120, 117);
}

#clean-input{
  width: 12px;
  height: 12px;
  /* display: block; */
  right: 96px;
  background: rgb(171,171,171);
  cursor: pointer;
  position:absolute;
  border-radius: 50%;
}

#clean-input p{
  margin: 0;
  color: white;
  font-size: 12px;
  text-align: center;
  line-height: 12px;
  transform: rotateZ(45deg);
  font-weight: lighter;
  user-select: none;
}

.sort-table{
  width: 168px;
  border: rgb(246,246,246) solid 1px;
  box-shadow: 0 0 10px 0 rgb(246,246,246);
}

.sort-table div{
  height: 24px;
  display: flex;
  align-items: center;
  color: rgb(102,102,102);
}

.sort-table div p{
  font-size: 13px;
  user-select: none;
}

.selected p{
  color: rgb(24, 144, 255);
}

.selected::after{
  content: "✔";
  position: absolute;
  right: 16px;
  color: rgb(24, 144, 255);
}

.right-click-menu{
  width: 144px;
  box-shadow: none;
}

.sub-item-wrapper{
  position: relative;
}

.sub-item-wrapper::after{
  position: absolute;
  content: '▶';
  left: calc(100% - 20px);
  color: rgb(201,201,201);
  font-size: 10px;
}

.sub-item{
  position:absolute;
  width: 100px;
  left: 100%;
  z-index: 10;
  background-color: white;
  box-shadow: 0 0 5px -2px rgb(88,88,88);
  opacity: 0;
}

.sub-item-wrapper:hover .sub-item{
  opacity: 1;
}

.red-text{
  color: rgb(255,100,109)
}
</style>