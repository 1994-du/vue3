<template>
    <div class="point">
        <slot></slot>
        <div class="in_line in_line_1"></div>
        <div class="in_line in_line_2"></div>
        <div class="in_line in_line_3"></div>
        <div class="in_line in_line_4"></div>
        <div class="out_line out_line_1">
            <yaos :yaoNm="['1','2']" name="震"></yaos>
        </div>
        <div class="out_line out_line_3">
            <yaos :yaoNm="['1','3']" name="坎"></yaos>
        </div>
        <div class="out_line out_line_5">
            <yaos :yaoNm="['2','3']" name="艮"></yaos>
        </div>
        <div class="out_line out_line_7">
            <yaos :yaoNm="[]" name="乾"></yaos>
        </div>
        <div class="out_line out_line_2">
            <yaos :yaoNm="['2']" name="离"></yaos>
        </div>
        <div class="out_line out_line_4">
            <yaos :yaoNm="['3']" name="巽"></yaos>
        </div>
        <div class="out_line out_line_6">
            <yaos :yaoNm="['1']" name="兑"></yaos>
        </div>
        <div class="out_line out_line_8">
            <yaos :yaoNm="['1','2','3']" name="坤"></yaos>
        </div>
    </div>
</template>
<script setup>
import yaos from "./yaos.vue"
</script>
<style lang="less" scoped>
.point{
    width: 100px;
    height: 100px;
    position: relative;
    left: 0;
    top: 0;
    filter: blur(.5px);
    transition: all 10s;
    .in_line{
        width: 100px;
        height: 1px;
        transform-origin: 50% 50%;
        position: absolute;
        left: 0;
        top: 50%;
    }
    .out_line{
        width: 38.3px;
        height: 1px;
        position: absolute;
        left: 0;
        top: 50%;
        background-color: chartreuse;
        transform-origin: 100% 50%;
        display: flex;
        justify-content: center;
    }
    .in_line_1{
        transform: rotateZ(22.5deg);
    }
    .in_line_2{
        transform: rotateZ(67.5deg);
    }
    .in_line_3{
        transform: rotateZ(112.5deg);
    }
    .in_line_4{
        transform: rotateZ(157.5deg);
    }
    .out_line_1{
        transform: rotateZ(0deg) translateX(30.9px) translateY(46.2px);
    }
    .out_line_2{
        transform: rotateZ(0deg) translateX(30.9px) translateY(-46.2px) rotateX(180deg);
    }
    .out_line_3{
        transform: rotateZ(90deg) translateX(19.2px) translateY(34.5px);
    }
    .out_line_4{
        transform: rotateZ(90deg) translateX(19.2px) translateY(-57.9px) rotateX(180deg);
    }
    .out_line_5{
        transform: translateX(11.7px) rotateZ(135deg) translateY(46.2px) translateX(19.2px);
    }
    .out_line_6{
        transform: translateX(11.7px) rotateZ(135deg) translateY(-46.2px) translateX(19.2px) rotateX(180deg);
    }
    .out_line_7{
        transform: translateX(11.7px) rotateZ(45deg) translateX(19.2px) translateY(46.2px);
    }
    .out_line_8{
        transform: translateX(11.7px) rotateZ(45deg) translateX(19.2px) translateY(-46.2px) rotateX(180deg);
    }
}
.point:hover{
    transform: rotateZ(360deg);
} 
</style>