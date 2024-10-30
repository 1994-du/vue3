<template>
    <div class="codepre">
        <pre v-for="(word, index) in formattedContent" :key="index">{{ word }}</pre>
    </div>
</template>
  
<script setup>
    import { computed } from 'vue';
    const slots = defineSlots();
    // 格式化代码，根据空格条件分割并处理缩进和换行
    function formatCode(content) {
    // 使用正则按空格分割，并保留空格（用分组捕获空格）
    const segments = content.trim().split(' ');
    const formattedLines = [];
    segments.forEach((segment, index) => {
        // console.log('segment',segment);
        if(index > 0){
            if(segments[index -1].includes('{')&&segments[index+1].includes('}')){
                formattedLines.push(`  ${segment}`)
            }else{
                formattedLines.push(segment)
            }
        }else{
            formattedLines.push(segment)
        }
    });

    return formattedLines;
    }
    // 获取插槽所有内容
    const getSlotContent = computed(() => {
        let slotStr=''
        slots.default().forEach((slot)=>{
            slotStr+=slot.children
        })
        return slotStr
    });
    // 计算属性，将格式化后的内容返回
    const formattedContent = computed(() => formatCode(getSlotContent.value));
    console.log('slots.default()[0].children',slots.default());
    
    
</script>
  
<style lang="scss" scoped>
  .codepre {
    font-family: monospace;
    white-space: pre-wrap; /* 保留换行和缩进 */
    background-color:black;
    padding: 16px;
    border-radius: 4px;
    color: #333;
    pre {
        display: block; /* 使每个 <pre> 元素保持为内联 */
        margin: 0;
        background: black;
        color: white;
    }
  }
</style>