import { defineAsyncComponent, AsyncComponentOptions } from 'vue'
import loadingComponent from '@/components/LoadingComponent.vue'
import errorComponent from '@/components/errorComponent.vue'

interface CreateAsyncComponentOptions {
    loader?: () => Promise<any>
    loadingComponent?: any
    errorComponent?: any
    delay?: number
    timeout?: number
}

export const createAsyncComponent = (path: string, options: CreateAsyncComponentOptions = {}): any => {
    return defineAsyncComponent({
        loader: () => import(`@/views/${path}.vue`),
        loadingComponent,
        errorComponent,
        delay: 200,
        timeout: 3000,
        ...options
    })
}
