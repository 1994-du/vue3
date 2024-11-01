<template>
    <div class="echart_bar">
        <!-- line -->
        <div class="echart_item">
            <div class="img">
                <img src="/img/echart_line.png" alt="">
            </div>
            <div class="echart">
                <div id="echart_line" style="width:400px;height:400px;"></div>
            </div>
            <div class="img">
                <img src="/img/echart_line2.png" alt="">
            </div>
        </div>
        <!-- bar -->
        <div class="echart_item">
            <div class="img">
                <img src="/img/echart_bar.png" alt="">
            </div>
            <div class="echart">
                <div id="echart_bar" style="width:400px;height:400px;"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let echartLine=null;
let echartBar=null;
const initEchartLine=()=>{
    echartLine = echarts.init(document.getElementById('echart_line'));
    
    let option = {
        grid:{
            left:'60px',
            right:'60px'
        },
        tooltip:{
            show:true
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            name:'Y轴名称',
            nameLocation:'end',
            nameTextStyle:{
                color:'red',
                fontSize:12,
                align:'right'
            },
            type: 'value',
            // 刻度
            axisTick:{
                show:true
            },
            // 线
            axisLine:{
                show:true
            }
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'line'
            }
        ]
    };

    echartLine.setOption(option);
}
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
    initEchartLine()
    initEchartBar()
})
</script>
<style lang='scss' scoped>
.echart_bar{
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