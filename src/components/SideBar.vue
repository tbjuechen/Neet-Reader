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
      <NoteIcon v-if="item.filled" :style="{width:'8px',height:'8px',marginRight:'12px',marginTop:'2px',stroke:item.color,fill:item.color}"/><p>{{item.name}}</p>
    </SideBarItem>
    <SideBarItem :isSelect="false"><AddIcon :style="{width:'8px',height:'8px',marginRight:'12px',marginTop:'2px'}"/><p>新建分类</p></SideBarItem>
    <TBDivider class="divider" direction="horizontal" style="width:176px"/>
    <SideBarItem :isSelect="cloud_item.isSelect" @click="handleSwich(cloud_item)">
      <p>{{cloud_item.name}}</p>
    </SideBarItem>
    <TBDivider class="divider" direction="horizontal" style="width:176px"/>

  </div>
</template>

<script setup>
import LogoIcon from '@/assets/logo.svg';
import { ref } from 'vue';
import TBButton from './TBButton.vue';
import SideBarItem from './SideBarItem.vue';
import NoteIcon from '@/assets/note.svg';
import AddIcon from '@/assets/add.svg';
import TBDivider from './TBDivider.vue';

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
</style>