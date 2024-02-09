<script setup>
import { computed } from '@vue/reactivity';

const props = defineProps({
    width:{
        type:Number,
        default:()=>{
            return 100
        }
    }
})
const initVal = computed(()=>{
    return props.width
})
const test='200px'
</script>
<template>
<div class="bg_wrap" :style="{width:initVal+'px',height:initVal+'px'}">
    <div class="circle_point circle_point_left" :style="{width:initVal/4+'px',height:initVal/4+'px'}"></div>
    <div class="circle_point circle_point_right" :style="{width:initVal/4+'px',height:initVal/4+'px'}"></div>
    <div class="bg_left">
        <div class="big_circle" :style="{width:initVal+'px',height:initVal+'px'}">
            <div class="small_circle" :style="{width:initVal/2+'px',height:initVal/2+'px'}">
            </div>
        </div>
    </div>
    <div class="bg_right">
        <div class="big_circle" :style="{width:initVal+'px',height:initVal+'px'}">
            <div class="small_circle" :style="{width:initVal/2+'px',height:initVal/2+'px'}">
            </div>
        </div>
    </div>
</div>
</template>
<style lang="less" scoped>
.bg_wrap{
    display: flex;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    .circle_point{
        position: absolute;
        z-index: 1;
        border-radius: 50%;
        
    }
    .circle_point_left{
        background-color: white;
        top: 12.5%;
        left: 37%;
    }
    .circle_point_right{
        background-color: black;
        bottom: 12.5%;
        right: 37%;
    }
    .bg_left{
        width: 50%;
        height: 100%;
        overflow: hidden;
        .big_circle{
            border-radius: 50%;
            background-color: black;
            position: relative;
            .small_circle{
                background-color: white;
                border-radius: 50%;
                position: absolute;
                bottom: 0;
                left: 25%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
    .bg_right{
        width: 50%;
        height: 100%;
        overflow: hidden;
        position: relative;
        .big_circle{
            border-radius: 50%;
            background-color: white;
            position: absolute;
            top: 0;
            left: -100%;
            
            .small_circle{
                background-color: black;
                border-radius: 50%;
                position: absolute;
                top: 0;
                left: 25%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
}
</style>