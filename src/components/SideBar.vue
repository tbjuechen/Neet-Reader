<template>
  <div id="sidebar">
    <LogoIcon class="icon-logo"/>
    <TBButton id="add-book-button" @click="()=>{console.log('2')}">添加图书</TBButton>
    <p id="book-shelf-name">书架</p>
    <SideBarItem
      v-for="item in book_shelf_items" 
      :key="item.name" 
      :isSelect="item.isSelect"
      @click="handleSwich(item)"
    >
      <NoteIcon v-if="item.filled" :style="{width:'8px',height:'8px',marginRight:'12px',marginTop:'2px',stroke:item.color,fill:item.color}"/>
      <p class="item-text">{{item.name}}</p>
      <MoreIcon v-if="item.filled" class="more-icon" @click="(e)=>handleClickMore(e,item)"/>
    </SideBarItem>
    <SideBarItem :isSelect="false"><AddIcon :style="{width:'8px',height:'8px',marginRight:'12px',marginTop:'2px'}"/><p>新建分类</p></SideBarItem>
    <TBDivider class="divider" direction="horizontal" style="width:176px"/>
    <SideBarItem :isSelect="cloud_item.isSelect" @click="handleSwich(cloud_item)">
      <p>{{cloud_item.name}}</p>
    </SideBarItem>
    <TBDivider class="divider" direction="horizontal" style="width:176px"/>
  </div>
  <component id="edit-del-memu" v-if="item_menu_display" :is="item_menu_cpt" v-bind="item_menu_props">
    <div class="drop-box">
      <div class="drop-box-item">
        <p class="drop-box-text">编辑</p>
      </div>
      <TBDivider direction="horizontal"/>
      <div class="drop-box-item">
        <p class="drop-box-text">删除</p>
      </div>
    </div>
  </component>
</template>

<script setup>
import LogoIcon from '@/assets/logo.svg';
import { ref } from 'vue';
import TBButton from './TBButton.vue';
import SideBarItem from './SideBarItem.vue';
import NoteIcon from '@/assets/note.svg';
import AddIcon from '@/assets/add.svg';
import TBDivider from './TBDivider.vue';
import MoreIcon from '@/assets/more.svg';
import TBFloatBox from './TBFloatBox.vue';

const color_dict = {
  'red': '#FF0000',
  'green': '#00FF00',
  'blue': '#0000FF',
  'yellow': '#FFFF00',
  'purple': '#800080',
  'orange': '#FFA500',
  'black': '#000000',
  'white': '#FFFFFF',
  'gray': '#808080',
  'brown': '#A52A2A',
  'pink': '#FFC0CB',
  'cyan': '#00FFFF',
}

const book_shelf_items = ref(
  [
    {name: '全部图书', filled: null},
    {name: '分类一', filled: 'red'},
    {name: '分类二', filled: 'green'},
  ]
)

const cloud_item= ref({
  name: '云端存储', isSelect: false
})

book_shelf_items.value.forEach((item) => {
  if (item.filled) {
    item.color = color_dict[item.filled];
  }
  item.isSelect = false;
})

const handleSwich = (item) => {
  book_shelf_items.value.forEach((item) => {
    item.isSelect = false;
  })
  cloud_item.value.isSelect = false;
  item.isSelect = true;
}

const item_menu_cpt = ref(null)
const item_menu_props = ref({
  top_pos:0,
  left_pos:0
})
const item_menu_display = ref(false)


const handleClickMore = (e,item)=>{
  item_menu_display.value = false
  item_menu_cpt.value = null;
  const target = e.target.tagName === 'svg'?e.target:e.target.parentNode;
  const rect = target.getBoundingClientRect()
  let pos_x = rect.left + 0.5 * target.clientWidth;
  let pos_y = rect.top + 0.5 * target.clientHeight;
  item_menu_props.value.top_pos = pos_y.toString();
  item_menu_props.value.left_pos = (pos_x + 12).toString();
  item_menu_cpt.value = TBFloatBox;
  item_menu_display.value = true
  window.addEventListener('click',()=>{item_menu_display.value = false;item_menu_cpt.value = null})
  e.stopPropagation()
}

</script>


<style scoped>

#sidebar {
  width: 200px;
  height: 100%;
  background-color: var(--bg-color);
  display: flex;
  align-items: center;
  /* justify-content: center; */
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
}

.icon-logo{
    margin-top: 48px;
}

#add-book-button{
    width: 160px;
    height: 24px;
    margin-top: 16px;
}

#book-shelf-name{
    margin-top: 16px;
    font-size: 16px;
    color: var(--bg-color-line);
    width: 160px;
    font-size: 14px;
    margin-bottom: 8px;
}

p{
  user-select: none;
}

.divider{
  margin: 8px 0;
}

.item-text{
  flex:1
}

.more-icon{
  fill: rgb(102,102,102);
  height:12px;
  width:12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.sidebar-item:hover .more-icon{
  opacity: 1;
}

path{
  pointer-events:none
}

#edit-del-memu{
  position: fixed;
  z-index: 100;
}

.drop-box{
  padding: 6px 0;
}
.drop-box-item{
  padding: 4px 12px;
  transition: background-color 0.3s;
}

.drop-box-item:hover{
  background-color: rgb(245,245,245);
  cursor:pointer;
}

.drop-box-text{
  margin:0;
  font-size: 14px;
}
</style>