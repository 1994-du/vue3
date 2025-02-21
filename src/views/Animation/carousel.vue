<template>
<h4>轮播图</h4>
<div class="carousel_warp">
    <div class="carousel_list">
        <div class="carousel__item">
            <img src="./public/img/echart_bar.png" alt="">
        </div>
        <div class="carousel__item">1</div>
        <div class="carousel__item">2</div>
        <div class="carousel__item">3</div>
        <div class="carousel__item">
            <img src="./public/img/echart_bar.png" alt="">
        </div>
        <div class="carousel__item">1</div>
    </div>
    <button class="carousel_btn prev" @click="prev">上一张</button>
    <button class="carousel_btn next" @click="next">下一张</button>
</div>
</template>
<script setup>

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
    const carouselWrap = document.querySelector('.carousel_warp');
    const imageWidth = carouselWrap.clientWidth
    let images = document.querySelector('.carousel_list');
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
    border: 1px solid #ccc;
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
            &:nth-child(1){
                background-color: #f00;
            }
            &:nth-child(2){
                background-color: #0f0;
            }
            &:nth-child(3){
                background-color: #00f;
            }
            &:nth-child(4){
                background-color: #ff0;
            }
            &:nth-child(5){
                background-color: #f00;
            }
            &:nth-child(6){
                background-color: #0f0;
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
        background-color: #ccc;
        color: #fff;
        border: none;
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