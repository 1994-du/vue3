<template>
    <span class="box">CSS 文字渐变</span>
    <div class="reflect_container">
        <img src="/img/kenan.png" alt="">
    </div>
</template>

<script setup>
</script>
<style scoped lang='less'>
.box{
    font-size: 20px;
    font-weight: bold;
    background-image: -webkit-linear-gradient(0deg,yellow,red,green);
    -webkit-background-clip: text;
    color: transparent;
}
.reflect_container{
    position: relative;
    display: inline-block;
    margin: 100px;
    img{
        width: 300px;
        aspect-ratio: 16 /9;
        display: block;
        border-radius: 10px;
    }
    &::after{
        content: '';
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        background: url(/img/kenan.png) no-repeat;
        background-size: 100% 100%;
        transform: scaleY(-1);
        opacity: .9;
        -webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,1),rgba(0,0,0,0));
        mask-image: linear-gradient(to bottom,rgba(0,0,0,1),rgba(0,0,0,0));
        pointer-events: none;
    }
}
// img{
//     width: 300px;
//     aspect-ratio: 16 / 9;
//     -webkit-box-reflect: below 0px -webkit-linear-gradient(
//         transparent,
//         ragba(0,0,0,0.5)
//     );
// }
</style>