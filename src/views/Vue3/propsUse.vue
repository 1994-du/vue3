<template>
   <h1>Props使用</h1>
   <h4>vue3.0</h4>
   <highlightjs code="<script>
export default{
    props:['obj'],
    setup(props){
        console.log(props)
    }
}
</script>"></highlightjs>
<h4>vue3.2</h4>
<highlightjs code="<script setup lang="ts">
import { defineProps } from 'vue';

// 定义props对象接口
interface PropsObj {
    [key: string]: any
}

// 使用defineProps泛型语法定义props类型
const props = defineProps<{
    obj?: PropsObj
}>({
    obj: {
        type: Object as () => PropsObj,
        default: () => {
            return {}
        }
    }
})
</script>"></highlightjs>
</template>
<script setup lang="ts">
const props = defineProps({
    obj:{
        type:Object,
        default:()=>{
            return{}
        }
    }
})
</script>
<style lang="less" scoped>
*{
    text-align: left;
}
</style>