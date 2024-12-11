<template>
    <div class="chart-container">
      <div ref="chartRef" class="chart"></div>
      <button @click="downloadFullImage">下载完整图表</button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import * as echarts from "echarts";
  
  export default {
    name: "DownloadAllDataChart",
    setup() {
      const chartRef = ref(null); // 图表 DOM 引用
      let chartInstance = null; // 主图表实例
  
      // 模拟数据
      const chartData = Array.from({ length: 50 }, (_, i) => ({
        name: `数据${i + 1}`,
        value: Math.floor(Math.random() * 100),
      }));
  
      // 初始化图表
      const initChart = () => {
        const chartDom = chartRef.value;
        chartInstance = echarts.init(chartDom);
  
        const dataLength = chartData.length;
        const enableScroll = dataLength > 10;
  
        const option = {
          title: { text: "滚动条控制图表" },
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          grid: { left: "10%", right: "10%", bottom: "15%", containLabel: true },
          xAxis: { type: "value", boundaryGap: [0, 0.01] },
          yAxis: {
            type: "category",
            data: chartData.map((item) => item.name),
          },
          series: [
            {
              type: "bar",
              data: chartData.map((item) => item.value),
            },
          ],
          dataZoom: enableScroll
            ? [
                {
                  type: "slider",
                  yAxisIndex: 0,
                  start: 0,
                  end: (100 / dataLength) * 10,
                },
              ]
            : [],
        };
  
        chartInstance.setOption(option);
      };
  
      // 下载完整图表图片
      const downloadFullImage = () => {
        if (!chartInstance) return;
  
        // 获取当前图表配置
        const fullOption = chartInstance.getOption();
  
        // 移除 dataZoom 配置，确保显示所有数据
        if (fullOption.dataZoom) {
          fullOption.dataZoom = [];
        }
  
        // 创建隐藏容器用于渲染完整图表
        const hiddenDiv = document.createElement("div");
        hiddenDiv.style.width = "800px";
        hiddenDiv.style.height = `${chartData.length * 40}px`; // 根据数据量动态调整高度
        hiddenDiv.style.position = "absolute";
        hiddenDiv.style.top = "-9999px";
        document.body.appendChild(hiddenDiv);
  
        // 初始化临时图表实例
        const tempChart = echarts.init(hiddenDiv);
        tempChart.setOption(fullOption);
  
        // 获取完整图表的图片
        setTimeout(() => {
          const image = tempChart.getDataURL({
            type: "png",
            backgroundColor: "#fff",
            pixelRatio: 2,
          });
  
          // 销毁临时图表实例并移除容器
          tempChart.dispose();
          document.body.removeChild(hiddenDiv);
  
          // 下载图片
          const link = document.createElement("a");
          link.href = image;
          link.download = "full_chart.png";
          link.click();
        }, 500); // 等待 500ms 确保渲染完成
      };
  
      // Vue 生命周期
      onMounted(() => {
        initChart();
      });
  
      onBeforeUnmount(() => {
        if (chartInstance) {
          chartInstance.dispose();
        }
      });
  
      return { chartRef, downloadFullImage };
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 800px;
    height: 400px;
    margin: auto;
    text-align: center;
  }
  
  .chart {
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
  }
  </style>