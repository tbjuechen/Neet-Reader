<template>
  <Teleport to="body">
    <div
      :class="{ 'tb-dialog': true, quit: isQuit }"
      v-if="show"
      :style="{ '--top': props.y, '--left': props.x }"
    >
      <span id="message">
        <WarningIcon id="message-icon" />
        <p id="message-text">{{ props.message }}</p>
      </span>
      <div class="botton-box">
        <TBButton :style="button_style" id="reject" @click="handleReject"
          >取&ensp;消</TBButton
        >
        <TBButton :style="button_style" id="accept" @click="handleAccept"
          >确&ensp;定</TBButton
        >
      </div>
    </div>
    <div class="tb-dialog-mask" v-if="show" />
  </Teleport>
</template>

<script setup>
import WarningIcon from "@/assets/warning.svg";
import TBButton from "./TBButton.vue";
import { ref } from "vue";

const show = ref(true);
const isQuit = ref(false);

const props = defineProps({
  message: {
    type: String,
    default: () => "请输入信息",
  },
  accept: {
    type: Function,
    default: () => {
      () => {};
    },
  },
  reject: {
    type: Function,
    default: () => {
      () => {};
    },
  },
  x: {
    type: String,
    default: () => "0",
  },
  y: {
    type: String,
    default: () => "0",
  },
});

const button_style = {
  width: "60px",
  height: "30px",
  borderRadius: "2px",
};

const handleReject = () => {
  props.reject();
  removeComponent();
};

const handleAccept = () => {
  props.accept();
  removeComponent();
};

function removeComponent() {
  setTimeout(() => {
    show.value = false;
  }, 400);
  isQuit.value = true;
}
</script>

<style>
.tb-dialog {
  position: absolute;
  width: 400px;
  height: 160px;
  animation: moveToCenter 0.5s forwards;
  background: white;
  overflow: hidden;
  transform: translate(-50%, -50%);
  z-index: 100;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

@keyframes moveToCenter {
  0% {
    transform: translate(-50%, -50%) scale(0);
    top: var(--top);
    left: var(--left);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    top: 40%;
    left: 50%;
  }
}

@keyframes quit {
  0% {
    transform: translate(-50%, -50%) scale(1);
    top: 40%;
    left: 50%;
  }
  100% {
    transform: translate(-50%, -50%) scale(0);
    top: 100%;
    left: 0;
  }
}

.quit {
  animation: quit 0.6s cubic-bezier(0.5, 0.2, 0.5, 1) forwards;
}

.tb-dialog-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  left: 0;
  top: 0;
  z-index: 50;
  /* opacity: 0.5; */
}

span#message {
  margin: 0 36px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

#message-text {
  margin: 0;
  color: rgb(84, 84, 84);
  letter-spacing: 0;
}

#message-icon {
  height: 24px;
  width: 24px;
  fill: rgb(250, 173, 20);
}

#message-icon > path {
  stroke: rgb(250, 173, 20);
  stroke-width: 20;
  fill: rgb(250, 173, 20);
}

div.botton-box {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 32px;
  gap: 12px;
}

#reject {
  border: rgb(217, 217, 217) 1px solid;
  color: rgb(38, 38, 38);
  transition: all 0.5s;
}

#reject:hover {
  border: rgb(64, 169, 255) 1px solid;
  color: rgb(64, 169, 255);
}

#accept {
  border: rgb(255, 77, 79) 1px solid;
  color: rgb(255, 77, 79);
  transition: all 0.5s;
}

#accept:hover {
  border: rgb(255, 120, 117) 1px solid;
  color: rgb(255, 120, 117);
}
</style>