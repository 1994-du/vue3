<template>
<div id="chart" style="width:100%;height:100%;"></div>
</template>
<script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';
let chartConfig={
    width:500,
    height:500,
}
const initChart = () => {
    // 初始化 ECharts 实例
    var chart = echarts.init(document.getElementById('chart'));
    // 配置项
    // 配置项
    var option = {
    tooltip: {
        trigger: 'axis', // 提示框触发类型
        confine:true,
        formatter: function (params) {
            if(params[0].axisIndex === 0) return
            let result = `${params[0].axisValue}<br>`;
            params.forEach(item => {
                if (item.seriesType === 'bar') { // 只处理柱状图数据
                    result += `${item.marker} ${item.seriesName}: ${item.value}<br>`;
                }
            });
            return result;
        },
    },
    axisPointer: {
        type:'shadow',
        link: { xAxisIndex: 'all' } // 指示器联动
    },
    grid: [
        {
            left: '55px',
            right: '10%',
            top: '40px',
            bottom: '50%', // 为底部的 X 轴留出空间
            height:'35%',
            containLabel: false
        },
        {
            left: '55px',
            right: '10%',
            // top: '200px',
            bottom: '30px', // 为底部的 X 轴留出空间
            height:'50%',
            containLabel: false
        }
    ],
    xAxis: [
        {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
            show:false, // 隐藏 X 轴,
            gridIndex: 0,
            axisPointer: {
                type:'line',
                snap:true,
            }
        },
        {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
            show:true, // 隐藏 X 轴,
            gridIndex: 1,
            axisPointer: {
                type:'shadow',
                snap:true,
            }
        }
    ],
    yAxis: [
        {
            name: '同比增长率',
            nameRotate:-90,
            nameLocation:'middle',
            nameGap:40,
            nameTextStyle:{
                padding:[0,0,0,-120]
            },
            gridIndex: 0,
            type: 'value',
            axisLabel:{
                show:true,
                formatter:(value,index)=>{
                    return value+'%'
                }
            },
            splitLine:{
                show:true,
                lineStyle: {
                    color: '#ccc', // 设置横向坐标线的颜色
                    type: 'solid' // 设置横线为虚线样式
                }
            }
        },
        {
            name: '本年利润',
            nameRotate:-90,
            nameLocation:'middle',
            nameGap:40,
            nameTextStyle:{
                padding:[0,0,0,-120]
            },
            gridIndex: 1,
            type: 'value',
            splitLine:{
                show:true,
                lineStyle: {
                    color: '#ccc', // 设置横向坐标线的颜色
                    type: 'solid' // 设置横线为虚线样式
                }
            }
        }
    ],
    series: [
        {
            name: '同比增长率',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: [2.1, 2.3, 2.5, 2.4, 2.8, 3.1, 3.2, 3.5],
            itemStyle: {
                color: '#2f4554',
                borderColor: '#ffffff', // 圆点的边框颜色（白色）
                borderWidth: 2, // 边框宽度
            },
            // smooth: true // 平滑曲线,
            showSymbol: true ,// 不显示折线上的点
            symbol:'circle',
            symbolSize:10,
            emphasis:{
                label:{
                    show:true,
                    position: 'top',
                    formatter: (params) => {
                        return `{value|${params.value}%}\n{triangle|\u25BC}`;
                    },
                    rich: {
                        value:{
                            color: '#fff',
                            backgroundColor: '#595959',
                            borderRadius: 2,
                            padding: [5, 10],
                            lineHeight: 12,
                            fontSize:12,
                        },
                        triangle: {
                            color: '#595959',
                            align: 'center',
                            fontSize:12,
                            lineHeight: 12,
                        },
                    },
                }
            },
            labelLayout:{
                hideOverlap:true,
                draggable:true,
                moveOverlap:'shiftY'
            }
        },
        {
            name: '本年利润',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: [10, 16, 19, 20, 12, 0, 1, 15],
            itemStyle: {
                color: '#c23531'
            }
        },
        
    ]
};

    chart.setOption(option);
}
onMounted(() => {
    initChart()
})
</script>
<style lang='scss' scoped>
</style>