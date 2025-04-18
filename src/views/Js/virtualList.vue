<template>
    <h4>虚拟列表</h4>
    <div ref="container" class="virtual-list-container" @scroll="handleScroll">
        <div class="virtual-list-content" :style="{ height: totalHeight + 'px' }">
            <div v-for="item in visibleItems" :key="item.id" class="list-item"
                :style="{ height: itemHeight + 'px', top: item.top + 'px' }">
                Item #{{ item.id }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 配置参数
const itemHeight = 60;  // 每项高度
const items = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1 })); // 测试数据

// DOM引用 & 响应式状态
const container = ref(null);
const scrollTop = ref(0);
const startIndex = ref(0);

// 计算属性
const containerHeight = computed(() => container.value?.clientHeight || 0);
const visibleCount = computed(() => Math.ceil(containerHeight.value / itemHeight)); // 直接计算可见项数
const totalHeight = computed(() => items.length * itemHeight);

const visibleItems = computed(() => {
    const start = Math.max(0, startIndex.value);
    const end = Math.min(items.length, startIndex.value + visibleCount.value);
    return items.slice(start, end).map((item, index) => ({
        ...item,
        top: (start + index) * itemHeight
    }));
});

// 滚动处理
const handleScroll = () => {
    scrollTop.value = container.value.scrollTop;
    startIndex.value = Math.floor(scrollTop.value / itemHeight);
};

onMounted(() => {
    container.value.scrollTop = 0;
});
</script>

<style scoped>
.virtual-list-container {
    height: 600px;
    /* 容器高度需刚好等于 itemHeight * 可见项数 */
    overflow-y: auto;
}

.virtual-list-content {
    position: relative;
}

.list-item {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    padding: 0 16px;
}
</style>