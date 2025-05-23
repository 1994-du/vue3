<template>
   <div id="echart_line" style="width:100%;height:100%;"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let echartLine=null;
const initEchartBar=()=>{
    echartLine = echarts.init(document.getElementById('echart_line'));
    let option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
                type: 'shadow' // 阴影
            }
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'line'
        }]
    };

    echartLine.setOption(option);
    // 获取点击时 axisPointer 当前指向的 axis 值
    echartLine.getZr().on('click', function (params) {
        const pointInPixel = [params.offsetX, params.offsetY];
        const pointInGrid = echartLine.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
        
        if (!pointInGrid) return;

        const xIndex = Math.round(pointInGrid[0]); // x 轴的 index
        const xValue = option.xAxis.data[xIndex];  // x 轴的 label，如 'Tue'
        const yValue = option.series[0].data[xIndex]; // 对应的 value，如 200

        console.log(`点击了 ${xValue}，值为 ${yValue}`);
    });
}

onMounted(()=>{
    initEchartBar()
})
</script>
<style scoped lang='less'>
</style>