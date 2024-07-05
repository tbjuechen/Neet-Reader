import TBDialog from "@/components/TBDialog.vue";
import { createApp, h } from 'vue';

export default function openDialog(message, reject_fun, accept_fun){
    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);
    
    const props = {
        message: message,
        reject_fun: reject_fun,
        accept_fun: accept_fun
    }
    // 创建 Vue 应用并挂载到占位符
    createApp({
        render() {
            return h(TBDialog, props);
        }
    }).mount(placeholder);
}