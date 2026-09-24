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
</script>
  
<style lang="scss" scoped>
  /* 代码块本来就是终端语汇，接回 token 即可：底取地面色、字取主文色、方角，
     外面补一圈 hairline 让它和页面有明确边界。 */
  .codepre {
    font-family: inherit;
    white-space: pre-wrap; /* 保留换行和缩进 */
    background-color: var(--app-bg);
    border: 1px solid var(--hairline);
    padding: 16px;
    border-radius: 0;
    color: var(--text-secondary);
    pre {
        display: block; /* 使每个 <pre> 元素保持为内联 */
        margin: 0;
        background: transparent;
        color: var(--text-primary);
    }
  }
</style>