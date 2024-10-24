<template>
    <div class="bus_event">
        <h4>Vue2</h4>
        <p>1.创建全局Bus</p>
        <p>2.main.js文件中引入</p>
        <p> 
            <span>import bus from '@/bus.js'</span><br>
            <span>Vue.use(bus)</span>
        </p>
        <h4>Vue3弃用了此方法，推荐使用mitt库</h4>
    </div>
</template>
<script setup>
import { getCurrentInstance } from 'vue';
const bus = getCurrentInstance().appContext.config.globalProperties.$bus;
bus.on('test',(data)=>{
    console.log(data);
})
bus.emit('test','hello world');
</script>
<style lang="scss" scoped>
img{
    display: inline-block;
    width: 200px;
    transition: all 0.5s;
}
img:hover{
    width: 400px;
}
p{
    text-align: left;
}
.bus_event{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
</style>