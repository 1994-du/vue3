<template>
    <div class="page-heading" :class="{ 'is-actions-only': !title }">
        <div v-if="title" class="page-heading__title">
            <span class="page-heading__marker" aria-hidden="true"></span>
            <h1>{{ title }}</h1>
        </div>
        <div v-if="$slots.actions" class="page-heading__actions">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
/* 顶栏（Home.vue 的 .route-heading）已经是全局唯一的页面标题位，
   所以页面内不要再传 title 重复一遍——只留一行右对齐的操作按钮。
   title 仍保留为可选能力，给将来确实需要页内大标题的页面用。 */
defineProps<{
    title?: string
}>()
</script>

<style scoped lang="scss">
.page-heading {
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
}

/* 只有操作按钮时，整行靠右收在内容区右上角 */
.page-heading.is-actions-only {
    justify-content: flex-end;
    min-height: 40px;
}

/* 操作按钮被权限条件挡掉时，整行不留空档 */
.page-heading.is-actions-only:not(:has(.page-heading__actions > *)) {
    display: none;
}

.page-heading__title {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.page-heading__marker {
    width: 3px;
    height: 16px;
    border-radius: 0;
    background: var(--brand);
    flex-shrink: 0;
}

h1 {
    margin: 0;
    font-size: 13px;
    line-height: 1.3;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--text-primary);
}

.page-heading__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    flex-wrap: wrap;
}

.page-heading__actions :deep(.el-button) {
    min-height: 32px;
}

.page-heading__actions :deep(.el-button + .el-button) {
    margin-left: 0;
}

@media (max-width: 760px) {
    .page-heading {
        align-items: stretch;
        flex-direction: column;
    }

    .page-heading__actions {
        width: 100%;
        align-items: stretch;
        justify-content: flex-start;
    }
}
</style>
