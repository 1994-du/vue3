<template>
    <el-input
        :model-value="modelValue"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        clearable
        class="page-search"
        @update:model-value="updateValue"
        @keyup.enter="emitSearch"
        @clear="emitSearch">
        <template #suffix>
            <button
                type="button"
                class="page-search__submit"
                :aria-label="ariaLabel"
                :title="ariaLabel"
                @click="emitSearch">
                <el-icon><Search /></el-icon>
            </button>
        </template>
    </el-input>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

defineProps<{
    modelValue: string
    placeholder: string
    ariaLabel: string
}>()

const emit = defineEmits<{
    (event: 'update:modelValue', value: string): void
    (event: 'search'): void
}>()

const updateValue = (value: string): void => {
    emit('update:modelValue', value)
}

const emitSearch = (): void => {
    emit('search')
}
</script>

<style scoped lang="scss">
.page-search {
    width: 280px;
    max-width: 100%;
}

.page-search :deep(.el-input__wrapper) {
    height: 36px;
    min-height: 36px;
    padding-right: 4px;
    box-sizing: border-box;
}

.page-search__submit {
    width: 28px;
    height: 28px;
    padding: 0;
    display: grid;
    place-items: center;
    color: var(--text-secondary);
    background: transparent;
    border: 0;
    border-radius: var(--radius-xs);
    cursor: pointer;
    transition: color var(--transition-fast), background-color var(--transition-fast);
}

.page-search__submit:hover,
.page-search__submit:focus-visible {
    color: var(--brand);
    background: var(--brand-soft);
}

@media (max-width: 760px) {
    .page-search {
        width: 100%;
    }
}
</style>
