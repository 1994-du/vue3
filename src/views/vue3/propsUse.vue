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
<highlightjs code="<script setup>
import { defineProps } from 'vue';
const props=defineProps({
    obj:{
        type:Object,
        default:()=>{
            return{}
        }
    }
})
</script>"></highlightjs>
</template>
<script setup>
import { defineProps } from 'vue';
const props=defineProps({
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