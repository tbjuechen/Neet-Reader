<template>
  <div class="book-card-box">
    <p v-if="data.last_visit" class="book-last-visit">{{ data.last_visit }}</p>
    <div v-else id="new-create">
      <div class="dot" style="margin-right: 8px" />
      <p class="book-last-visit">新添加</p>
    </div>
    <div :class="{ 'cover-box': true, selected: select_mode }">
      <img :src="data.cover" class="book-cover" />
      <input
        type="checkbox"
        class="book-slecet"
        v-model="isChecked"
        :checked="modelValue"
        @input="$emit('update:modelValue', $event.target.checked)"
      />
      <div class="cloud-save">
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
  cover: "/example/cover.jpg",
  title: "13.[武田绫乃].吹响吧！上低音号：仰望你展翅飞翔的背影",
});

// is checked
const isChecked = ref(false);
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
</style>