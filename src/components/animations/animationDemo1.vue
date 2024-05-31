<template>
    <div class="warp">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>
</template>
<style lang="scss">
$n:36;
$width:100px;
$inWidth:10px;
$animationTime:2s;
.warp{
    width: $width;
    height: $width;
    border-radius: 50%;
    margin:100px auto;
    position: relative;
    .dot{
        width: $inWidth;
        height: $inWidth;
        position: absolute;
        left: 50%;
        top: 0;
        margin-left: - calc($inWidth / 2);
        margin-top: - calc($inWidth / 2);
        transform-style: preserve-3d;
        transform-origin: center calc(($width + $inWidth) / 2);
        perspective: 160px;
        @for $i from 1 through $n{
            &:nth-child(#{$i}){
                transform: rotate(#{calc(360deg / $n) * $i});
                &::after,&::before{
                    animation-delay: - calc($animationTime / $n * ($i - 1) * 6);
                }
            }
        }
        &::before,&::after{
            content:'';
            position: absolute;
            left: 0;
            top: 0;
            width:$inWidth;
            height: $inWidth;
            border-radius: 50%;
        }
        &::before{
            top:-$inWidth;
            background-color: black;
            animation: rotate-black $animationTime infinite;
            @keyframes rotate-black {
                0%{
                    animation-timing-function: ease-in;
                }
                25%{
                    transform:translate3d(0,100%,20px);
                    animation-timing-function: ease-out;
                }
                50%{
                    transform:translate3d(0,200%,20px);
                    animation-timing-function: ease-in;
                }
                75%{
                    transform:translate3d(0,100%,-20px);
                    animation-timing-function: ease-out;
                }
            }
        }
        &::after{
            top:-$inWidth;
            background-color: white;
            animation: rotate-white $animationTime infinite;
            @keyframes rotate-white {
                0%{
                    animation-timing-function: ease-in;
                }
                25%{
                    transform:translate3d(0,-100%,-20px);
                    animation-timing-function: ease-out;
                }
                50%{
                    transform:translate3d(0,-200%,20px);
                    animation-timing-function: ease-in;
                }
                75%{
                    transform:translate3d(0,-100%,20px);
                    animation-timing-function: ease-out;
                }
            }
        }
    }
}
</style>