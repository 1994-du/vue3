<template>
<h4>轮播图</h4>
<div class="carousel_warp">
    <div class="carousel_list">
        <div class="carousel__item">
            <img src="/img/echart_bar.png" alt="">
        </div>
        <div class="carousel__item">1</div>
        <div class="carousel__item">2</div>
        <div class="carousel__item">3</div>
        <div class="carousel__item">
            <img src="/img/echart_bar.png" alt="">
        </div>
        <div class="carousel__item">1</div>
    </div>
    <button class="carousel_btn prev" @click="prev">上一张</button>
    <button class="carousel_btn next" @click="next">下一张</button>
</div>
</template>
<script setup lang="ts">

let currentIndex=1;
function prev() {
    currentIndex--;
    updateCarousel();
}
function next() {
    currentIndex++;
    updateCarousel();
}

function updateCarousel() {
    const carouselWrap = document.querySelector('.carousel_warp') as HTMLElement | null;
    if (!carouselWrap) return;
    const imageWidth = carouselWrap.clientWidth
    const images = document.querySelector('.carousel_list') as HTMLElement | null;
    if (!images) return;
    const offset = -currentIndex * imageWidth;
    images.style.transform = `translateX(${offset}px)`;
    if(currentIndex === images.children.length -1){
        currentIndex = 1;
        const offset = -currentIndex * imageWidth;
        setTimeout(() => {
            images.style.transition = 'none';
            images.style.transform = `translateX(${offset}px)`;
        },500)
    }
    if(currentIndex === 0){
        currentIndex = images.children.length -2;
        const offset = -currentIndex * imageWidth;
        setTimeout(() => {
            images.style.transition = 'none';
            images.style.transform = `translateX(${offset}px)`;
        },500)
    }
    images.style.transition = 'transform 0.5s ease-in-out';
}
</script>
<style lang='scss' scoped>
.carousel_warp {
    width: 400px;
    height: 300px;
    border: 1px solid var(--hairline);
    overflow: hidden;
    position: relative;
    .carousel_list{
        width: 100%;
        height: 100%;
        display: flex;
        transform: translateX(-400px);
        transition: transform 0.5s ease-in-out;
        .carousel__item {
            width: 100%;
            flex-shrink: 0;
            height: 100%;
            color: var(--text-primary);
            /* 幻灯片底色是演示内容——没有图片的那几张全靠底色才看得见，不能像普通
               装饰色那样直接删掉。原来用的是浏览器原色红/绿/蓝/黄，跟主题无关，
               改成「琥珀淡底 / 中性面」交替：既能分辨相邻两张，又同属一套主题。 */
            &:nth-child(odd){
                background-color: var(--brand-soft);
            }
            &:nth-child(even){
                background-color: var(--surface-raised);
            }
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .carousel_btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 70px;
        height: 70px;
        border-radius: 50%;
        /* 原来是 #ccc 底 + #fff 字，对比度只有 ~1.4:1，字几乎看不见。 */
        background-color: var(--surface-raised);
        color: var(--text-primary);
        border: 1px solid var(--hairline);
        cursor: pointer;
        z-index: 10;
    }
    .prev {
        left: 10px;
    }
    .next {
        right: 10px;
    }
}
</style>