import TBDialog from "@/components/TBDialog.vue";
import { createApp, h } from 'vue';

export default function openDialog(message, reject_fun, accept_fun, x=0, y=0, content=null){
    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);
    
    const props = {
        message: message,
        reject: reject_fun,
        accept: accept_fun,
        x: x,
        y: y
    }
    // 创建 Vue 应用并挂载到占位符
    createApp({
        render() {
            return h(TBDialog, props);
        }
    }).mount(placeholder);
}