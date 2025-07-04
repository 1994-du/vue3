<script setup>
import ArrowTmp from '@/components/arrow.vue'
import { computed } from 'vue';

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
<div class="animation_wrap">
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
    <!-- 步骤条 -->
    <ArrowTmp 
      :steps="['步骤1', '步骤2', '步骤3', '步骤4']"
      :activeIndex="1"
    />
    <!-- 五角星 -->
    <div class="start_wrap"></div>

</div>

</template>
<style lang="less" scoped>
.bg_wrap{
    display: flex;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    background-color: black;
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
.step_wrap{
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .step{
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background-color: #F0F1FE;
        color: rgb(97, 114, 247);
        font-size: 20px;
        margin: 0 10px;
        position: relative;
        .step_num{
            position: absolute;
            z-index: 1;
        }
    }
}
.start_wrap{
    width: 100px;
    height: 100px;
    background-color: red;
    clip-path: polygon(
        50% 0%,
        61.8% 38.2%,
        100% 38.2%,
        69.1% 61.8%,
        80.9% 100%,
        50% 76.4%,
        19.1% 100%,
        30.9% 61.8%,
        0% 38.2%,
        38.2% 38.2%
    );
}
</style>