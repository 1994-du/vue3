<!-- components/ArrowStep.vue -->
<template>
  <div class="arrow-steps">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="step"
      :class="{
        active: index === activeIndex,
        first: index === 0,
        last: index === steps.length - 1,
      }">
      <span>{{ step }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  steps: {
    type: Array,
    default: () => [],
  },
  activeIndex: {
    type: Number,
    default: 0,
  },
});
</script>

<style scoped>
.arrow-steps {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.step {
    width: 175px;
    height: 25px;
    line-height: 25px;
    position: relative;
    /* padding: 10px 24px; */
    background-color: var(--surface-muted);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    clip-path: polygon(
        0 0,
        calc(100% - 12px) 0,
        100% 50%,
        calc(100% - 12px) 100%,
        0% 100%,
        12px 50%
    );
    margin-right: 10px;
    transition: background-color var(--transition-fast), color var(--transition-fast);
}

.step.active {
  background-color: var(--brand);
  color: var(--app-bg);
}
/* 第一个步骤：左侧圆角 + 右箭头 */
.step.first {
  clip-path: polygon(
    0% 0%,
    calc(100% - 12px) 0%,
    100% 50%,
    calc(100% - 12px) 100%,
    0% 100%,
    0% 50%
  );
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* 最后一个步骤：左箭头 + 右侧圆角 */
.step.last {
  clip-path: polygon(
    0% 0%,
    100% 0%,
    100% 100%,
    0% 100%,
    12px 50%
  );
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  margin-right: 0;
}
</style>