<template>
  <div class="time-bar">
    <span>{{ timeMessage }}</span>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const getCurrentTime = () => {
    const current = new Date();
    const hours = current.getHours();
    const minutes = current.getMinutes();
    // 上下午判断
    const period = hours>=12?'PM':'AM'

    const formatHours = (hours) =>{
        if (hours >= 12) {
            hours -= 12
        }
        // if (hours < 10){
        //     hours = '0' + hours
        // }
        return hours
    }

    const formattedHours = formatHours(hours)

    // 将分钟数转换为两位数格式
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return formattedHours + ':' + formattedMinutes + ' ' + period
}

const timeMessage = ref()

const refleshTime = () => {
    timeMessage.value = getCurrentTime()
    setTimeout(()=>{refleshTime()}, 30000)
}

refleshTime();

</script>

<style scoped>

</style>