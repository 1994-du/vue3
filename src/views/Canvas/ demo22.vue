<template>
    <div class="canvas-container">
        <canvas ref="canvas" class="canvas"></canvas>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const particles = ref([]);
const canvas = ref(null);
const ctx = ref(null);
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);

const initCanvas = ()=> {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
}
const createParticles = ()=> {
    for (let i = 0; i < 100; i++) {
        this.particles.push(new Particle(this.ctx, this.width, this.height));
    }
}
const animate = ()=> {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(this.animate);
}

class Particle {
    constructor(ctx, width, height) {
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
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
</script>

<style scoped>
.canvas-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>