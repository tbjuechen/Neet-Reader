<template>
  <div class="drag-header">
    <div class="drag"></div>
    <div class="buttons">
      <button @click="minimizeWindow">
        <svg
          t="1719676584365"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2067"
          width="64"
          height="64"
        >
          <path
            d="M929.8 528.1H93.5c-15.5 0-28-12.5-28-28s12.5-28 28-28h836.3c15.5 0 28 12.5 28 28s-12.5 28-28 28z"
            fill=""
            p-id="2068"
          ></path>
        </svg>
      </button>
      <button @click="toggleMaximizeWindow">
        <svg
          t="1719676731867"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2317"
          width="64"
          height="64"
        >
          <path
            d="M812.3 959.4H213.7c-81.6 0-148-66.4-148-148V212.9c0-81.6 66.4-148 148-148h598.5c81.6 0 148 66.4 148 148v598.5C960.3 893 893.9 959.4 812.3 959.4zM213.7 120.9c-50.7 0-92 41.3-92 92v598.5c0 50.7 41.3 92 92 92h598.5c50.7 0 92-41.3 92-92V212.9c0-50.7-41.3-92-92-92H213.7z"
            fill=""
            p-id="2318"
          ></path>
        </svg>
      </button>
      <button @click="closeWindow" id="close">
        <svg
          id="close-icon"
          t="1719676742290"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2465"
          width="64"
          height="64"
        >
          <path
            d="M96.6 915c-10.9-10.9-10.9-28.7 0-39.6L887 85c10.9-10.9 28.7-10.9 39.6 0 10.9 10.9 10.9 28.7 0 39.6L136.2 915c-10.9 10.9-28.6 10.9-39.6 0z"
            fill=""
            p-id="2466"
          ></path>
          <path
            d="M887 915L96.6 124.6c-10.9-10.9-10.9-28.7 0-39.6 10.9-10.9 28.7-10.9 39.6 0l790.4 790.4c10.9 10.9 10.9 28.7 0 39.6-10.9 10.9-28.6 10.9-39.6 0z"
            fill=""
            p-id="2467"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const minimizeWindow = () => {
  window.ipcRenderer.send("minimize-win");
};

const toggleMaximizeWindow = () => {
  window.ipcRenderer.send("maximize-win");
};

const closeWindow = () => {
  window.ipcRenderer.send("close-win");
};
</script>

<style scoped>
.drag-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 49; /* 确保在最顶层 */
  -webkit-app-region: drag;
  background-color: transparent; /* 设置透明背景 */
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drag {
  flex: 1;
  height: 100%;
}

.buttons {
  display: flex;
  margin-right: 3px;
}

button {
  -webkit-app-region: no-drag; /* 禁止按钮区域拖拽 */
  background: none;
  border: none;
  border-radius: 5px;
  color: var(--icon-color);
  cursor: pointer;
  width: 32px;
  height: 26px;
  padding: 0;
  margin: 5px 1px;
}

button:hover {
  background-color: var(--icon-shadow-hover);
}

.icon {
  height: 12px;
  width: 24px;
  display: inline;
  fill: var(--icon-color);
  padding: 7px 4px;
}

#close:hover {
  background-color: rgb(253, 83, 89);
}

#close-icon:hover {
  fill: white;
}
</style>
