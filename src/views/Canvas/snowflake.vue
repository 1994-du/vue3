<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const particles = ref<Particle[]>([]);
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);

const initCanvas = () => {
    if (!canvas.value) {
        console.error('Canvas element not found');
        return;
    }
    ctx.value = canvas.value.getContext('2d');
    if (!ctx.value) {
        console.error('Failed to get 2D context');
        return;
    }
    canvas.value.width = 1200;
    canvas.value.height = 400;
    // 设置 canvas 背景色为黑色
    ctx.value.fillStyle = 'black';
    ctx.value.fillRect(0, 0, width.value, height.value);
}

const createParticles = () => {
    if (!ctx.value) return;
    for (let i = 0; i < 100; i++) {
        particles.value.push(new Particle(ctx.value, width.value, height.value));
    }
}

const animate = () => {
    if (!ctx.value) return;
    // 重新绘制背景色
    ctx.value.fillStyle = 'black';
    ctx.value.fillRect(0, 0, width.value, height.value);
    particles.value.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animate);
}

class Particle {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.width || this.x < 0) {
            this.speedX *= -1;
        }
        if (this.y > this.height || this.y < 0) {
            this.speedY *= -1;
        }
    }

    draw() {
        // 将粒子颜色改为白色
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

const handleResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
    initCanvas();
    // 重新创建粒子以适应新的画布大小
    particles.value = [];
    createParticles();
}

onMounted(() => {
    initCanvas();
    createParticles();
    animate();
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

<template>
    <canvas ref="canvas"></canvas>
</template>