<template>
    <div class="yaos">
        <div class="yao_name">{{ yaoNmString }}</div>
        <div class="yao">
            <div class="item"></div>
            <div class="item" :class="yaoNm.includes('1')?'active':''"></div>
            <div class="item"></div>
        </div>
        <div class="yao">
            <div class="item"></div>
            <div class="item" :class="yaoNm.includes('2')?'active':''"></div>
            <div class="item"></div>
        </div>
        <div class="yao">
            <div class="item"></div>
            <div class="item" :class="yaoNm.includes('3')?'active':''"></div>
            <div class="item"></div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({
    yaoNm: {
        type: Array,
        default: () => []
    }
})
const yaoNmString = computed(()=>{
    if(props.yaoNm.length==0){
        return '— — —'
    }
    if(props.yaoNm.length==1){
        if(props.yaoNm.includes('1')){
            return '— — —'
        }
        if(props.yaoNm.includes('2')){
            return '— — —'
        }
        if(props.yaoNm.includes('3')){
            return '— — —'
        }
    }
    if(props.yaoNm.length==2){
        if(props.yaoNm.includes('1')&&props.yaoNm.includes('2')){
            return '— — —'
        }
        if(props.yaoNm.includes('1')&&props.yaoNm.includes('3')){
            return '— — —'
        }
        if(props.yaoNm.includes('2')&&props.yaoNm.includes('3')){
            return '— — —'
        }
    }
    if(props.yaoNm.length==3){
        return '— — —'
    }
})
</script>
<style lang="scss" scoped>
.yaos{
    margin: 10px;
    width: 12px;
    height: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    .yao_name{
        position: absolute;
        left: 0;
        top: 12px;
        color: white;
        font-size: 12px;
    }
    .yao{
        height: 5px;
        display: flex;
        justify-content: space-between;
        .item{
            width: 4px;
            height: 2px;
            background-color: white;
        }
        .active{
            background-color: transparent;
        }
    }
}
</style>