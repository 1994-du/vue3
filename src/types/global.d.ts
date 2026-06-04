// Vuex 类型声明
declare module 'vuex' {
    export interface StoreOptions<S> {
        state?: S
        getters?: any
        actions?: any
        mutations?: any
        modules?: any
        plugins?: any
        strict?: boolean
    }

    export interface Dispatch {
        (type: string, payload?: any): Promise<any>
    }

    export interface Commit {
        (type: string, payload?: any): void
    }

    export class Store<S> {
        constructor(options: StoreOptions<S>)
        state: S
        getters: any
        commit: Commit
        dispatch: Dispatch
    }

    export function createStore<S>(options: StoreOptions<S>): Store<S>
    export function useStore<S = any>(): Store<S>
}

// Three.js 类型声明
declare module 'three' {
    export * from 'three'
}

// 自定义 SDK 类型声明
declare module '@/assets/web-office-sdk-v1.1.20.es.js' {
    export interface WebOfficeConfigOptions {
        appId: string
        fileId: string
        mount?: HTMLElement
        commonOptions?: {
            isShowTopArea?: boolean
            isShowHeader?: boolean
            [key: string]: any
        }
        [key: string]: any
    }
    
    export interface WebOfficeInstance {
        ready(): Promise<void>
        destroy(): void
        on(event: string, callback: (data: any) => void): void
        off(event: string, callback: (data: any) => void): void
        getStatus(): string
        [key: string]: any
    }
    
    export function config(options: WebOfficeConfigOptions): WebOfficeInstance
}

// 组件库类型声明
declare module '@1994-du/vue3-ui' {
    import type { App, Plugin } from 'vue'
    const dxUI: Plugin
    export default dxUI
    export * from '@1994-du/vue3-ui'
}

// Web API 扩展
interface Window {
    showOpenFilePicker(options?: any): Promise<FileSystemFileHandle[]>
    showDirectoryPicker(options?: any): Promise<FileSystemDirectoryHandle>
    showSaveFilePicker(options?: any): Promise<FileSystemFileHandle>
    db: IDBDatabase | null
    __MICRO_APP_ENVIRONMENT__?: boolean
    microApp?: {
        addDataListener: (callback: (data: any) => void, immediate?: boolean) => void
        removeDataListener: (callback: (data: any) => void) => void
        clearDataListener: () => void
        getData: () => any
        dispatch: (data: any) => void
    }
}
