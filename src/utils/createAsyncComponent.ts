import { defineAsyncComponent } from 'vue'
import type { Component, AsyncComponentLoader } from 'vue'
import loadingComponent from '@/components/loadingComponent.vue'
import errorComponent from '@/components/errorComponent.vue'

interface CreateAsyncComponentOptions {
    loader?: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
}

export const createAsyncComponent = (path: string, options: CreateAsyncComponentOptions = {}): Component => {
    return defineAsyncComponent({
        loader: () => import(`@/views/${path}.vue`),
        loadingComponent,
        errorComponent,
        delay: 200,
        timeout: 3000,
        ...options
    })
}
