import type { InjectionKey, Ref } from 'vue'

export interface BreadcrumbItem {
    label: string
    to?: string
}

export interface BreadcrumbContext {
    items: Ref<BreadcrumbItem[]>
    setItems: (items: BreadcrumbItem[]) => void
}

export const breadcrumbKey: InjectionKey<BreadcrumbContext> = Symbol('breadcrumb')