import loadingComponent from '@/components/LoadingComponent.vue'
import errorComponent from '@/components/errorComponent.vue'
import { defineAsyncComponent } from 'vue'
export const createAsyncComponent = (path) => {
    return defineAsyncComponent({
        loader: () => import(`@/views/${path}.vue`),
        loadingComponent,
        errorComponent,
        delay: 200,
        timeout: 3000,
    })
}