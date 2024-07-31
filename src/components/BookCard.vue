<template>
  <div class="book-card-box">
    <div v-if="data.last_visit" id="new-create">
      <p class="book-last-visit">{{ data.last_visit }}</p>
    </div>
    <div v-else id="new-create">
      <div class="dot" style="margin-right: 8px" />
      <p class="book-last-visit">新添加</p>
    </div>
    <div :class="{ 'cover-box': true, selected: select_mode }" @click="handleClickBook">
      <img :src="data.cover" class="book-cover" />
      <input
        type="checkbox"
        class="book-slecet"
        v-model="isChecked"
        :checked="modelValue"
        @input="$emit('update:modelValue', $event.target.checked)"
        @click.stop
      />
      <div class="cloud-save" @click.stop>
        <div class="dot" id="cloud-save-background">
          <CloudIcon width="20" height="20" style="margin-left: 0.67px" />
        </div>
      </div>
    </div>
    <p class="book-title">{{ data.title }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CloudIcon from "@/assets/cloud.svg";

const props = defineProps({
  book_id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
  },
  select_mode: {
    type: Boolean,
    default: false,
  },
});

// for frontend dev
const data = ref({
  last_visit: null, // xx天前 xx小时前 null=新添加
  cover: null,
  title: null,
});

// 时间转换器
const timeParse = (time) => {
  if (!time) return null;
  const now = new Date();
  const last = new Date(time);
  const diff = now - last;
  if (diff < 1000 * 60) return "刚刚";
  if (diff < 1000 * 60 * 60) return `${Math.floor(diff / 1000 / 60)}分钟前`;
  if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / 1000 / 60 / 60)}小时前`;
  return `${Math.floor(diff / 1000 / 60 / 60 / 24)}天前`;
};

// 请求
// data = await window.ipcRenderer.invoke("read-book-info", props.book_id);
window.ipcRenderer.invoke("read-book-info", props.book_id).then(async (res) => {
  var coverData = await window.ipcRenderer.invoke("get-cover", res.uuid);
  const coverBlob = new Blob([coverData], { type: "image/jpeg" });
  data.value.cover = URL.createObjectURL(coverBlob);
  data.value.title = res.name;
  console.log(res.lastRead);
  data.value.last_visit = timeParse(res.lastRead);
});

// is checked
const isChecked = ref(false);

const handleClickBook = () =>{
  window.ipcRenderer.invoke("open-win",props.book_id)
}

</script>

<style scoped>
.book-card-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 156px;
}

.book-cover {
  width: 150px;
  height: 200px;
}

.book-last-visit {
  margin: 0;
  font-size: 11px;
  user-select: none;
  color: rgb(158, 158, 158);
  display: inline-block;
  text-align: center;
  line-height: 11px;
}

.dot {
  display: inline-block;
  background: rgb(255, 101, 37);
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.cover-box {
  position: relative;
  border: white solid 2px;
  box-shadow: 0 0 4px 0 rgba(154, 154, 154, 0.8);
  transition: border 0.6s;
  cursor: pointer;
  max-height: 200px;
}

.selected,
.cover-box:hover {
  border: rgb(24, 144, 255) solid 2px;
}

.selected .book-slecet,
.cover-box:hover .book-slecet {
  opacity: 1;
}

.book-slecet {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  opacity: 0;
}

.book-title {
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  font-size: 15px;
  color: rgb(74, 74, 74);
  user-select: none;
  margin: 0;
  margin-top: 6px;
}

.cloud-save {
  position: absolute;
  bottom: 12px;
  left: 20px;
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 999em;
  box-shadow: 0 0 6px -2px rgba(108, 108, 108, 0.8);
  transition: 0.6s;
}

.cloud-save::after {
  content: "上传到云端";
  font-size: 14px;
  color: rgb(66, 165, 245);
  top: 6px;
  left: 30px;
  position: absolute;
  font-weight: 500;
  width: 78px;
  opacity: 0;
  transition-delay: 0s;
  line-height: 14px;
}

.cover-box:hover .cloud-save {
  width: 110px;
}

.cover-box:hover .cloud-save::after {
  opacity: 1;
  transition-delay: 0.35s;
}

#cloud-save-background {
  width: 22px;
  height: 22px;
  background: rgb(80, 177, 236);
  position: absolute;
  top: 3px;
  left: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#new-create{
  height: 16px;
}
</style>