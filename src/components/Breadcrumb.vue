<template>
    <nav v-if="items.length" class="breadcrumb" aria-label="面包屑导航">
        <template v-for="(item, index) in items" :key="`${item.label}-${index}`">
            <span v-if="index > 0" class="breadcrumb__separator" aria-hidden="true">/</span>
            <RouterLink v-if="item.to && index < items.length - 1" class="breadcrumb__link" :to="item.to">
                {{ item.label }}
            </RouterLink>
            <span v-else class="breadcrumb__current" :aria-current="index === items.length - 1 ? 'page' : undefined">
                {{ item.label }}
            </span>
        </template>
    </nav>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@/utils/breadcrumb'

defineProps<{
    items: BreadcrumbItem[]
}>()
</script>

<style scoped lang="scss">
.breadcrumb {
    min-height: 24px;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 0 20px 12px;
    color: var(--text-tertiary);
    font-size: 12px;
    line-height: 1.4;
}

.breadcrumb__separator {
    color: var(--border-strong);
}

.breadcrumb__link {
    color: var(--text-tertiary);
    text-decoration: none;
}

.breadcrumb__link:hover {
    color: var(--brand);
}

.breadcrumb__current {
    overflow: hidden;
    color: var(--text-primary);
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (max-width: 900px) {
    .breadcrumb {
        padding-right: 14px;
        padding-left: 14px;
    }
}
</style>