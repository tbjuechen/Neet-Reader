<template>
  <div id="sidebar">
    <LogoIcon class="icon-logo" />
    <TBButton
      id="add-book-button"
      @click="createBook"
    >
      添加图书
    </TBButton>
    <p id="book-shelf-name">书架</p>
    <SideBarItem
      v-for="(item, key) in book_shelf_items"
      :key="item.name"
      :isSelect="item.isSelect"
      :to="{ name: 'shelf', params: { id: item.uuid } }"
      @click="handleSwich(item)"
    >
      <NoteIcon
        v-if="item.filled"
        :style="{
          width: '8px',
          height: '8px',
          marginRight: '12px',
          marginTop: '2px',
          fill: `${color_dict[item.filled]}`,
        }"
      />
      <p class="item-text">{{ item.name }}</p>
      <MoreIcon
        v-if="item.filled"
        class="more-icon"
        @click="(e) => handleClickMore(e, key)"
      />
    </SideBarItem>
    <SideBarItem
      :操了不让我用ref="
        (el) => {
          createRef = el;
        }
      "
      :isSelect="false"
      @click="handleClickCreate"
    >
      <AddIcon
        :style="{
          width: '8px',
          height: '8px',
          marginRight: '12px',
          marginTop: '2px',
        }"
      />
      <p>新建分类</p>
    </SideBarItem>
    <TBDivider class="divider" direction="horizontal" style="width: 176px" />
    <SideBarItem
      :isSelect="cloud_item.isSelect"
      @click="handleSwich(cloud_item)"
    >
      <p>{{ cloud_item.name }}</p>
    </SideBarItem>
    <TBDivider class="divider" direction="horizontal" style="width: 176px" />
  </div>
  <component
    v-if="item_menu_display"
    :is="item_menu_cpt"
    v-bind="item_menu_props"
  >
    <div class="drop-box">
      <div class="drop-box-item" @click="handleClickEdit">
        <p class="drop-box-text">编辑</p>
      </div>
      <TBDivider direction="horizontal" />
      <div class="drop-box-item" @click="(e) => handleClickDelete(e)">
        <p class="drop-box-text">删除</p>
      </div>
    </div>
  </component>

  <component
    v-if="edit_panel_display"
    :is="edit_panel_cpt"
    v-bind="edit_panel_props"
  >
    <div class="edit-panel" @click="(e) => e.stopPropagation()">
      <h4>编辑分类</h4>
      <TBInput
        type="text"
        placeholder="请输入分类名称"
        v-model="item_name_text"
      />
      <div class="color-box">
        <TBCheckBox
          name="color"
          v-for="(item, key) in color_list"
          :key="item.name"
          type="radio"
          :color="item.color"
          :value="key"
          v-model="selected_color"
        />
      </div>
      <TBButton id="confirm-button" :full="true" @click="handleConfirmEdit()"
        ><p>确认</p></TBButton
      >
    </div>
  </component>

  <component
    v-if="create_panel_display"
    :is="create_panel_cpt"
    v-bind="create_panel_props"
  >
    <div class="edit-panel" @click="(e) => e.stopPropagation()">
      <h4>新建分类</h4>
      <TBInput
        type="text"
        placeholder="请输入分类名称"
        v-model="item_name_text"
      />
      <div class="color-box">
        <TBCheckBox
          name="color"
          v-for="(item, key) in color_list"
          :key="item.name"
          type="radio"
          :color="item.color"
          :value="key"
          v-model="selected_color"
        />
      </div>
      <TBButton id="confirm-button" :full="true" @click="handelConfirmCreate()"
        ><p>确认</p></TBButton
      >
    </div>
  </component>
</template>

<script setup>
import LogoIcon from "@/assets/logo.svg";
import { ref, shallowRef } from "vue";
import TBButton from "./TBButton.vue";
import SideBarItem from "./SideBarItem.vue";
import NoteIcon from "@/assets/note.svg";
import AddIcon from "@/assets/add.svg";
import TBDivider from "./TBDivider.vue";
import MoreIcon from "@/assets/more.svg";
import TBFloatBox from "./TBFloatBox.vue";
import TBInput from "./TBInput.vue";
import TBCheckBox from "./TBCheckBox.vue";
import openDialog from "@/core/dialog.js";
import Epub from "epubjs";

const color_dict = {
  gray: "rgb(158,158,158)",
  blue: "rgb(61,168,245)",
  green: "rgb(117,201,64)",
  purple: "rgb(121,126,201)",
  orange: "rgb(255,175,56)",
  red: "rgb(255,79,62)",
};

const book_shelf_items = ref([
  { name: "全部图书", filled: null },
  { name: "分类一", filled: "gray" },
  { name: "分类二", filled: "green" },
]);

window.ipcRenderer.invoke("get-catalog-list").then((res) => {
  console.log(res);
  book_shelf_items.value = res
});

const cloud_item = ref({
  name: "云端存储",
  isSelect: false,
});

// book_shelf_items.value.forEach((item) => {
//   if (item.filled) {
//     item.color = color_dict[item.filled];
//   }
//   item.isSelect = false;
// });

const handleSwich = (item) => {
  book_shelf_items.value.forEach((item) => {
    item.isSelect = false;
  });
  cloud_item.value.isSelect = false;
  item.isSelect = true;
};

const item_menu_cpt = ref(null);
const item_menu_props = ref({
  top_pos: 0,
  left_pos: 0,
});
const item_menu_display = ref(false);
let last_click_item = null;

const selected_color = ref(null); //被选中的颜色
const item_name_text = ref(""); //类别原名

const handleClickMore = (e, key) => {
  distoryEditPanel();
  distoryCreatePanel();
  const target = e.target.tagName === "svg" ? e.target : e.target.parentNode;
  const rect = target.getBoundingClientRect();
  let pos_x = rect.left + 0.5 * target.clientWidth;
  let pos_y = rect.top + 0.5 * target.clientHeight;
  last_click_item = key;
  item_menu_props.value.top_pos = (pos_y + 12).toString();
  item_menu_props.value.left_pos = (pos_x - 6).toString();
  item_menu_cpt.value = TBFloatBox;
  item_menu_display.value = true;
  window.addEventListener("click", distoryMenu);
  e.stopPropagation();
};

function distoryMenu() {
  item_menu_display.value = false;
  item_menu_cpt.value = null;
  window.removeEventListener("click", distoryMenu);
}

const edit_panel_cpt = ref(null);
const edit_panel_props = ref({
  top_pos: 0,
  left_pos: 0,
});
const edit_panel_display = ref(false);

const handleClickEdit = (e) => {
  distoryMenu();
  // 装载数据
  item_name_text.value = book_shelf_items.value[last_click_item].name;
  selected_color.value = color_list.value.findIndex(
    (el) => el.name == book_shelf_items.value[last_click_item].filled
  );
  // console.log(selected_color.value)
  edit_panel_props.value.top_pos = (
    parseInt(item_menu_props.value.top_pos) - 74
  ).toString();
  edit_panel_props.value.left_pos = (
    parseInt(item_menu_props.value.left_pos) + 14
  ).toString();
  edit_panel_cpt.value = TBFloatBox;
  edit_panel_display.value = true;
  window.addEventListener("click", distoryEditPanel);
  e.stopPropagation();
};

function distoryEditPanel() {
  edit_panel_display.value = false;
  edit_panel_cpt.value = null;
  window.removeEventListener("click", distoryEditPanel);
  selected_color.value = null;
}

const color_list = ref([]);

for (const key in color_dict) {
  color_list.value.push({
    name: key,
    color: color_dict[key],
  });
}

const handleConfirmEdit = () => {
  let flag = false;
  // 判断内容是否发生改变
  if (item_name_text.value !== book_shelf_items.value[last_click_item].name) {
    flag = true;
    book_shelf_items.value[last_click_item].name = item_name_text.value;
  }
  if (selected_color.value !== null) {
    // debugger;
    if (
      color_list.value[selected_color.value].name !==
      book_shelf_items.value[last_click_item].filled
    ) {
      flag = true;
      book_shelf_items.value[last_click_item].filled =
        color_list.value[selected_color.value].name;
    }
  }
  // 和后端同步
  if (flag) {
    window.ipcRenderer
      .invoke(
        "update-catalog",
        JSON.stringify(book_shelf_items.value[last_click_item]),
      )
      .then((res) => {
        console.log(res);
      });
  }
  distoryEditPanel();
};

const handleClickDelete = (e) => {
  // // 删除分类
  // book_shelf_items.value.splice(last_click_item,1);
  distoryMenu();
  const item = book_shelf_items.value[last_click_item];
  const message = "确认删除分类“" + item.name + "”吗？";
  const accept = () => {
    // 同步
    window.ipcRenderer.invoke("delete-catalog", item.uuid).then((res) => {
      console.log(res);
    });
    // 删除分类
    book_shelf_items.value.splice(last_click_item, 1);
  };
  const reject = () => {};
  // 获取点击位置
  const x = e.clientX.toString() + "px";
  const y = e.clientY.toString() + "px";
  openDialog(message, reject, accept, x, y);
};

const create_panel_cpt = ref(null);
const create_panel_props = ref({
  top_pos: 0,
  left_pos: 0,
});
const create_panel_display = ref(false);

const createRef = ref(null);

const handleClickCreate = (e) => {
  distoryMenu();
  distoryEditPanel();
  selected_color.value = 0;
  const rect = createRef.value.getBoundingClientRect();
  create_panel_props.value.top_pos = (parseInt(rect.top) - 50).toString();
  create_panel_props.value.left_pos = (parseInt(rect.left) + 170).toString();
  create_panel_cpt.value = TBFloatBox;
  create_panel_display.value = true;
  window.addEventListener("click", distoryCreatePanel);
  e.stopPropagation();
};

const distoryCreatePanel = () => {
  create_panel_display.value = false;
  create_panel_cpt.value = null;
  window.removeEventListener("click", distoryCreatePanel);
};

const handelConfirmCreate = () => {
  const new_catalog = {
    name: item_name_text.value,
    filled: color_list.value[selected_color.value].name,
    color: color_list.value[selected_color.value].color,
  };
  // 和后端同步
  window.ipcRenderer.invoke("create-catalog", new_catalog.name, new_catalog.filled).then((res) => {
    new_catalog.uuid = res;
    book_shelf_items.value.push(new_catalog);
  });
  distoryCreatePanel();
};

const createBook = async () => {
  const bookPath = await window.ipcRenderer.invoke("open-file-dialog");
  if (!bookPath || !bookPath.endsWith(".epub")) {
    console.log(123)
    return;
  }
  const bookData = await window.ipcRenderer.invoke("read-file",bookPath);
  const book = Epub(bookData.buffer);
  console.log(book)
  await book.ready
  // 提取封面
  const resources = book.resources;  
  const items = await resources.replacements()
  var coverIndex = resources.urls.indexOf("Images/cover.jpg")
  if (coverIndex === -1) {
    coverIndex = resources.urls.indexOf("Images/cover.jpeg")
  }
  const coverURL = items[coverIndex]
  console.log(coverURL)
  const response = await fetch(coverURL);
  const coverBuffer = await response.arrayBuffer();
  window.ipcRenderer.invoke("create-book",bookPath , coverBuffer);
  // 刷新页面
  window.location.reload();
};

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

.icon-logo {
  margin-top: 48px;
}

#add-book-button {
  width: 160px;
  height: 24px;
  margin-top: 16px;
}

#book-shelf-name {
  margin-top: 16px;
  font-size: 16px;
  color: var(--bg-color-line);
  width: 160px;
  font-size: 14px;
  margin-bottom: 8px;
}

p {
  user-select: none;
}

.divider {
  margin: 8px 0;
}

.item-text {
  flex: 1;
}

.more-icon {
  fill: rgb(102, 102, 102);
  height: 12px;
  width: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.sidebar-item:hover .more-icon {
  opacity: 1;
}

path {
  pointer-events: none;
}

#edit-del-memu {
  position: fixed;
  z-index: 100;
}

.edit-panel {
  display: flex;
  flex-direction: column;
  padding: 2px 12px;
  align-items: flex-start;
  /* gap: 8px; */
  justify-content: space-evenly;
  height: 128px;
}

h4 {
  margin: 0;
  color: rgb(51, 51, 51);
  font-size: 14px;
  user-select: none;
}

.color-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

#confirm-button {
  width: 60px;
  height: 24px;
}

#confirm-button > p {
  margin: 0;
}
</style>