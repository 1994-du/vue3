<template>
    <div class="echart_bar">
        <div id="echart_bar" style="width:100%;height:100%;"></div>
    </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let echartBar=null;
const initEchartBar=()=>{
    echartBar = echarts.init(document.getElementById('echart_bar'));
    let option = {
        tooltip:{
            show:true
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }
        ]
    };

    echartBar.setOption(option);
}
onMounted(()=>{
    initEchartBar()
})
</script>
<style lang='scss' scoped>
.echart_bar{
height: 100%;
    display: flex;
    flex-direction: column;
    .echart_item{
        display: flex;
        align-items: center;
        .img{
            img{
                width: 400px;
                height: 400px;
            }
        }
    }
}
</style>