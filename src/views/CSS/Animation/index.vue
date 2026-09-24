<template>
    <div class="page animation-page">
        <!-- ① 属性参考 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Properties</span>
                    <h2 class="panel__title">animation 属性一览</h2>
                </div>
                <span class="panel__meta">八个子属性控制动画的每个环节</span>
            </div>
            <div class="panel__body">
                <el-table :data="properties" border>
                    <el-table-column prop="name" label="属性" width="240" class-name="col-mono" />
                    <el-table-column prop="content" label="描述" width="220" />
                    <el-table-column label="值">
                        <template #default="scope">
                            <div v-for="value in scope.row.values" :key="value" class="prop-value">
                                {{ value }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </section>

        <!-- ② 演示剧场 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Demo Theater</span>
                    <h2 class="panel__title">七个纯 CSS 动画</h2>
                </div>
                <span class="panel__meta">悬停「渐变旋转卡」可暂停动画（animation-play-state）</span>
            </div>
            <div class="panel__body">
                <div class="demo-grid">
                    <!-- 加载环 -->
                    <article class="demo-card">
                        <div class="demo-card__stage">
                            <div class="icon1"></div>
                        </div>
                        <h3 class="demo-card__name">加载环 <span class="demo-card__en">Loader</span></h3>
                        <p class="demo-card__desc">透明边框只留两段上色，外环旋转、内点缩放，两组 keyframes 同时跑。</p>
                    </article>
                    <!-- 跑马灯边框 -->
                    <article class="demo-card">
                        <div class="demo-card__stage">
                            <div class="login"><span></span><span></span><span></span><span></span><span class="login__label">登录</span></div>
                        </div>
                        <h3 class="demo-card__name">跑马灯边框 <span class="demo-card__en">Border Runner</span></h3>
                        <p class="demo-card__desc">四条渐变线各自从一侧滑到另一侧，首尾相接形成绕框光带。</p>
                    </article>
                    <!-- 渐变旋转卡 -->
                    <article class="demo-card">
                        <div class="demo-card__stage">
                            <div class="item"></div>
                        </div>
                        <h3 class="demo-card__name">渐变旋转卡 <span class="demo-card__en">Conic Spinner</span></h3>
                        <p class="demo-card__desc">conic-gradient 伪元素旋转做流光边框；悬停暂停——animation-play-state 的交互演示。</p>
                    </article>
                    <!-- 霓虹光球 -->
                    <article class="demo-card">
                        <div class="demo-card__stage">
                            <div class="light_ball"></div>
                        </div>
                        <h3 class="demo-card__name">霓虹光球 <span class="demo-card__en">Neon Ball</span></h3>
                        <p class="demo-card__desc">多层 box-shadow 在两个状态间往复（alternate），代价是持续重绘，慎用在大面积上。</p>
                    </article>
                    <!-- 太极图 -->
                    <article class="demo-card">
                        <div class="demo-card__stage">
                            <bg :width="96"></bg>
                        </div>
                        <h3 class="demo-card__name">太极图 <span class="demo-card__en">Taiji</span></h3>
                        <p class="demo-card__desc">两个半圆容器各放一个大圆，overflow: hidden 裁出 S 形分界——纯几何拼图。</p>
                    </article>
                    <!-- 八卦阵 -->
                    <article class="demo-card">
                        <div class="demo-card__stage">
                            <eight class="bagua">
                                <bg :width="56" class="bagua__core"></bg>
                            </eight>
                        </div>
                        <h3 class="demo-card__name">八卦阵 <span class="demo-card__en">Bagua</span></h3>
                        <p class="demo-card__desc">八组爻线按角度排布；悬停触发 transition: all 10s 的慢速大旋转。</p>
                    </article>
                    <!-- 粒子环 -->
                    <article class="demo-card">
                        <div class="demo-card__stage">
                            <animationDemo1></animationDemo1>
                        </div>
                        <h3 class="demo-card__name">粒子环 <span class="demo-card__en">Particle Ring</span></h3>
                        <p class="demo-card__desc">36 个点绕环排布，负 animation-delay 错帧 + translate3d 走 3D 翻转。</p>
                    </article>
                </div>
            </div>
        </section>

        <!-- ③ 使用要点 -->
        <section class="panel">
            <div class="panel__head">
                <div class="head-group">
                    <span class="kicker">Notes</span>
                    <h2 class="panel__title">使用要点</h2>
                </div>
            </div>
            <div class="panel__body">
                <div class="note-grid">
                    <div v-for="note in notes" :key="note.title" class="note">
                        <span class="note__mark" aria-hidden="true">▸</span>
                        <div>
                            <p class="note__title">{{ note.title }}</p>
                            <p class="note__desc">{{ note.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import bg from '@/components/animations/bg.vue'
import animations from '@/json/animation.json'
import { ref } from 'vue'
import animationDemo1 from '@/components/animations/animationDemo1.vue'
import eight from '@/components/animations/eight.vue'

const properties = ref(animations)

const notes = [
    {
        title: 'shorthand 一行写完',
        desc: 'animation: fade-in 1s ease 0.5s infinite alternate both; 前两个时间值依次是 duration 和 delay，其余子属性不限顺序。',
    },
    {
        title: '只有可插值的属性才能动',
        desc: 'display 进不了 keyframes；优先动 transform / opacity（走合成，见渲染原理页），动颜色会触发重绘。',
    },
    {
        title: '负 delay 的妙用',
        desc: 'animation-delay: -0.5s 让动画跳过开头直接进入中间状态——多元素错帧动画（如粒子环）全靠它。',
    },
    {
        title: '状态可以交互控制',
        desc: 'animation-play-state: paused 配合 :hover 即可做「悬停暂停」；切回 running 从暂停处继续，不重头播。',
    },
    {
        title: 'fill-mode 决定播完去哪',
        desc: '默认播完回到原始样式；要停在最后一帧用 forwards，延迟期间也想用第一帧样式就用 both。',
    },
    {
        title: '尊重系统偏好',
        desc: '装饰性动画应包进 @media (prefers-reduced-motion: no-preference)，给开了「减弱动态效果」的用户留退路。',
    },
]
</script>

<style lang="scss" scoped>
.head-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.prop-value {
    font-size: 12px;
    line-height: 1.8;
    color: var(--text-secondary);
}

/* ---- ② 演示剧场 ----------------------------------------------------
   以下演示样式改编自原 styles/animation.scss：页面框架色走全局令牌，
   演示内容保留各自的专属配色（它们就是演示对象）。 */

.demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 8px;
}

.demo-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--hairline);
    min-width: 0;
}

.demo-card__stage {
    height: 170px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--hairline);
    overflow: hidden;
}

.demo-card__name {
    margin: 0;
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.demo-card__en {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
}

.demo-card__desc {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

/* 1. 加载环 */
.icon1 {
    position: relative;
    width: 50px;
    height: 50px;
    border: 3px solid transparent;
    border-top: 3px solid #3cefff;
    border-bottom: 3px solid #3cefff;
    border-radius: 50%;
    animation: icona 1s linear infinite;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        margin: auto;
        width: 10px;
        height: 10px;
        border: 3px solid #3cefff;
        border-radius: 50%;
        animation: iconb 2s alternate ease-in-out infinite;
    }
}

/* 2. 跑马灯边框 */
.login {
    height: 40px;
    width: 80px;
    background-color: #000;
    color: #fff;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .login__label {
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: 0.2em;
        text-indent: 0.2em;
    }

    span {
        position: absolute;

        &:nth-of-type(1) {
            width: 100%;
            height: 3px;
            background: linear-gradient(to right, #fff, #3cefff);
            top: 0;
            left: 0;
            animation: login1 3s linear infinite;
        }

        &:nth-of-type(2) {
            width: 3px;
            height: 100%;
            background: linear-gradient(to bottom, #fff, #3cefff);
            right: 0;
            top: 0;
            animation: login2 3s linear infinite;
        }

        &:nth-of-type(3) {
            width: 100%;
            height: 3px;
            background: linear-gradient(to left, #fff, #3cefff);
            left: 0;
            bottom: 0;
            animation: login3 3s linear infinite;
        }

        &:nth-of-type(4) {
            width: 3px;
            height: 100%;
            background: linear-gradient(to top, #fff, #3cefff);
            left: 0;
            top: 0;
            animation: login4 3s linear infinite;
        }
    }
}

/* 3. 渐变旋转卡：hover 暂停 = animation-play-state 演示 */
.item {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    &::before {
        content: '';
        background: conic-gradient(#fe2441 20deg, transparent 120deg);
        width: 150%;
        height: 150%;
        position: absolute;
        animation: rotate 2s linear infinite;
    }

    &::after {
        content: '测试';
        width: 90px;
        height: 90px;
        background-color: #101010;
        position: absolute;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fe2441;
    }

    &:hover::before {
        animation-play-state: paused;
    }
}

/* 4. 霓虹光球 */
.light_ball {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    box-shadow:
        0 0 20px #fff,
        -20px 0 80px #f0f,
        20px 0 80px #0ff,
        inset 0 0 50px #fff,
        inset 50px 0 80px #f0f,
        inset -50px 0 80px #0ff,
        inset 50px 0 200px #f0f,
        inset -50px 0 200px #0ff;
    animation: balla 3s linear infinite;
}

/* 八卦阵：核心太极图叠在阵中心 */
.bagua {
    position: relative;
}

.bagua__core {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
}

/* 粒子环组件的 .warp 是全局样式，这里收掉它自带的外边距 */
.demo-card__stage :deep(.warp) {
    margin: 0;
}

@keyframes balla {
    50% {
        box-shadow:
            0 0 20px #fff,
            20px 0 80px #f0f,
            -20px 0 80px #0ff,
            inset 0 0 50px #fff,
            inset -50px 0 80px #f0f,
            inset 50px 0 80px #0ff,
            inset -50px 0 200px #f0f,
            inset 50px 0 200px #0ff;
    }
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes login1 {
    from {
        transform: translateX(-80px);
    }

    to {
        transform: translateX(80px);
    }
}

@keyframes login2 {
    from {
        transform: translateY(-40px);
    }

    to {
        transform: translateY(40px);
    }
}

@keyframes login3 {
    from {
        transform: translateX(80px);
    }

    to {
        transform: translateX(-80px);
    }
}

@keyframes login4 {
    from {
        transform: translateY(40px);
    }

    to {
        transform: translateY(-40px);
    }
}

@keyframes icona {
    to {
        transform: rotate(360deg);
    }
}

@keyframes iconb {
    from {
        transform: scale(0.5);
    }

    to {
        transform: scale(1.2);
    }
}

/* ---- ③ 使用要点 ---------------------------------------------------- */

.note-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}

.note {
    display: flex;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--hairline);
}

.note__mark {
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--brand);
    padding-top: 2px;
    user-select: none;
}

.note__title {
    margin: 0 0 2px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.note__desc {
    margin: 0;
    font-size: 12px;
    line-height: 1.7;
    color: var(--text-secondary);
}

@media (max-width: 760px) {
    .note-grid {
        grid-template-columns: 1fr;
    }
}
</style>
