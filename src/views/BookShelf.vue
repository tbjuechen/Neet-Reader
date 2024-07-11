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
        :select_mode="select_mode"
      >
      </TBInput>
      <p id="sort">
        排序
        <DownArrowIcon
          style="
            width: 12px;
            transform: translate(8px, 3px);
            fill: rgb(198, 198, 198);
          "
        />
      </p>
    </div>
    <div class="book-grid-box">
      <BookCard
        book_id="-1"
        v-for="(item, key) in check_list"
        :key="key"
        v-model="check_list[key]"
        :select_mode="select_mode"
      ></BookCard>
    </div>
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
        <TBButton class="select-panel-button delete-button"
          >删&nbsp;除</TBButton
        >
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import TBInput from "@/components/TBInput.vue";
import DownArrowIcon from "@/assets/downArrow.svg";
import BookCard from "@/components/BookCard.vue";
import TBButton from "@/components/TBButton.vue";

// 从后端获取
const data = ref({
  name: "分类",
  size: 16,
});

// for test
const check_list = ref([false, false, false, false, false, false, false]);

// const print = () => {
//     console.log(check_list.value)
//     setTimeout(print, 10000)
// }

// print()

const select_mode = computed(() => {
  return check_list.value.some((item) => item === true);
});

const select_all = computed(() => {
  return check_list.value.every((item) => item === true);
});

const select_text = ref("");

const handleSelectChange = (e) => {
  if (e.target.checked) {
    check_list.value.forEach((item, index, arr) => (arr[index] = true));
  } else {
    check_list.value.forEach((item, index, arr) => (arr[index] = false));
  }
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
  gap: 12px;
  justify-content: center;
  width: 100%;
  padding-top: 24px;
  padding-left: 54px;
  padding-right: 30px;
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
</style>