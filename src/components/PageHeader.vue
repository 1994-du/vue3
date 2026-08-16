<template>
    <div class="page-heading">
        <div class="page-heading__title">
            <span class="page-heading__marker" aria-hidden="true"></span>
            <h1>{{ title }}</h1>
        </div>
        <div v-if="$slots.actions" class="page-heading__actions">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
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

.page-heading__title {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.page-heading__marker {
    width: 4px;
    height: 20px;
    border-radius: 2px;
    background: var(--brand);
    flex-shrink: 0;
}

h1 {
    margin: 0;
    font-size: 20px;
    line-height: 1.3;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: 0;
}

.page-heading__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    flex-wrap: wrap;
}

.page-heading__actions :deep(.el-button) {
    min-height: 36px;
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
