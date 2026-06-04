// Element Plus 类型扩展
declare module 'element-plus' {
    import type { DefineComponent, ComponentOptionsBase, ComponentPublicInstance } from 'vue'

    // ElMessage 相关的类型
    interface ElMessageOptions {
        message?: string | VNode | ComponentPublicInstance
        type?: 'success' | 'warning' | 'info' | 'error'
        title?: string
        duration?: number
        showClose?: boolean
        center?: boolean
        offset?: number
        appendTo?: string | HTMLElement
    }

    interface ElMessage {
        (options?: string | ElMessageOptions): { close: () => void }
        success(options?: string | ElMessageOptions): { close: () => void }
        warning(options?: string | ElMessageOptions): { close: () => void }
        info(options?: string | ElMessageOptions): { close: () => void }
        error(options?: string | ElMessageOptions): { close: () => void }
    }

    interface ElLoadingService {
        close: () => void
    }

    interface ElLoadingOptions {
        text?: string
        fullscreen?: boolean
        lock?: boolean
        body?: boolean
        customClass?: string
        background?: string
        target?: HTMLElement | string
    }

    export const ElMessage: ElMessage
    export const ElLoading: {
        service(options?: ElLoadingOptions): ElLoadingService
    }
    export const ElMessageBox: {
        msgbox: (options?: any) => any
        alert: (message: string, title?: string, options?: any) => any
        confirm: (message: string, title?: string, options?: any) => any
        prompt: (message: string, title?: string, options?: any) => any
    }
    export const ElNotification: any
    export const ElMessageBoxShortcuts: any
}

// Element Plus Icons
declare module '@element-plus/icons-vue' {
    import type { DefineComponent } from 'vue'
    export const Plus: DefineComponent<{}, {}, any>
    export const Edit: DefineComponent<{}, {}, any>
    export const Delete: DefineComponent<{}, {}, any>
    export const Refresh: DefineComponent<{}, {}, any>
    export const UploadFilled: DefineComponent<{}, {}, any>
    export const Upload: DefineComponent<{}, {}, any>
    export const Document: DefineComponent<{}, {}, any>
    export const Folder: DefineComponent<{}, {}, any>
    export const FolderOpened: DefineComponent<{}, {}, any>
    export const Files: DefineComponent<{}, {}, any>
    export const Connection: DefineComponent<{}, {}, any>
    export const Close: DefineComponent<{}, {}, any>
    export const Check: DefineComponent<{}, {}, any>
    export const CircleCheck: DefineComponent<{}, {}, any>
    export const Warning: DefineComponent<{}, {}, any>
    export const InfoFilled: DefineComponent<{}, {}, any>
    export const SuccessFilled: DefineComponent<{}, {}, any>
    export const Loading: DefineComponent<{}, {}, any>
    export const Search: DefineComponent<{}, {}, any>
    export const View: DefineComponent<{}, {}, any>
    export const Hide: DefineComponent<{}, {}, any>
    export const User: DefineComponent<{}, {}, any>
    export const Key: DefineComponent<{}, {}, any>
    export const Lock: DefineComponent<{}, {}, any>
    export const More: DefineComponent<{}, {}, any>
    export const MoreFilled: DefineComponent<{}, {}, any>
    export const Setting: DefineComponent<{}, {}, any>
    export const HomeFilled: DefineComponent<{}, {}, any>
    export const House: DefineComponent<{}, {}, any>
    export const Menu: DefineComponent<{}, {}, any>
    export const Grid: DefineComponent<{}, {}, any>
    export const Link: DefineComponent<{}, {}, any>
    export const Phone: DefineComponent<{}, {}, any>
    export const Message: DefineComponent<{}, {}, any>
    export const Bell: DefineComponent<{}, {}, any>
    export const BellFilled: DefineComponent<{}, {}, any>
    export const Date: DefineComponent<{}, {}, any>
    export const Clock: DefineComponent<{}, {}, any>
    export const Picture: DefineComponent<{}, {}, any>
    export const PictureFilled: DefineComponent<{}, {}, any>
    export const Camera: DefineComponent<{}, {}, any>
    export const VideoCamera: DefineComponent<{}, {}, any>
    export const Download: DefineComponent<{}, {}, any>
    export const Upload2: DefineComponent<{}, {}, any>
    export const Paperclip: DefineComponent<{}, {}, any>
    export const Operation: DefineComponent<{}, {}, any>
    export const FullScreen: DefineComponent<{}, {}, any>
    export const ScaleToOriginal: DefineComponent<{}, {}, any>
    export const Rank: DefineComponent<{}, {}, any>
    export const Sort: DefineComponent<{}, {}, any>
    export const SortUp: DefineComponent<{}, {}, any>
    export const SortDown: DefineComponent<{}, {}, any>
    export const Filter: DefineComponent<{}, {}, any>
    export const EditPen: DefineComponent<{}, {}, any>
    export const DeleteFilled: DefineComponent<{}, {}, any>
    export const Trash: DefineComponent<{}, {}, any>
    export const FolderAdd: DefineComponent<{}, {}, any>
    export const FolderDelete: DefineComponent<{}, {}, any>
    export const FileAdd: DefineComponent<{}, {}, any>
    export const FileDelete: DefineComponent<{}, {}, any>
    export const Tools: DefineComponent<{}, {}, any>
    export const Suny: DefineComponent<{}, {}, any>
    export const Moon: DefineComponent<{}, {}, any>
    export const Sunny: DefineComponent<{}, {}, any>
    export const Wind: DefineComponent<{}, {}, any>
    export const Lightning: DefineComponent<{}, {}, any>
    export const Drizzling: DefineComponent<{}, {}, any>
    export const Pouring: DefineComponent<{}, {}, any>
    export const Cloudy: DefineComponent<{}, {}, any>
    export const PartlyCloudy: DefineComponent<{}, {}, any>
    export const CloudyAndSunny: DefineComponent<{}, {}, any>
    export const SunnyBude: DefineComponent<{}, {}, any>
    export const Sunrise: DefineComponent<{}, {}, any>
    export const Sunset: DefineComponent<{}, {}, any>
    export const QuestionFilled: DefineComponent<{}, {}, any>
    export const Info: DefineComponent<{}, {}, any>
    export const WarnTriangleFilled: DefineComponent<{}, {}, any>
    export const SuccessFilled: DefineComponent<{}, {}, any>
    export const CircleCloseFilled: DefineComponent<{}, {}, any>
    export const WarnTriangle: DefineComponent<{}, {}, any>
    export const CircleCheckFilled: DefineComponent<{}, {}, any>
    export const Avatar: DefineComponent<{}, {}, any>
    export const OfficeBuilding: DefineComponent<{}, {}, any>
    export const School: DefineComponent<{}, {}, any>
    export const Van: DefineComponent<{}, {}, any>
    export const ArrowRight: DefineComponent<{}, {}, any>
    export const ArrowLeft: DefineComponent<{}, {}, any>
    export const DArrowLeft: DefineComponent<{}, {}, any>
    export const DArrowRight: DefineComponent<{}, {}, any>
    export const ArrowDown: DefineComponent<{}, {}, any>
    export const ArrowUp: DefineComponent<{}, {}, any>
    export const Top: DefineComponent<{}, {}, any>
    export const Bottom: DefineComponent<{}, {}, any>
    export const TopRight: DefineComponent<{}, {}, any>
    export const TopLeft: DefineComponent<{}, {}, any>
    export const BottomRight: DefineComponent<{}, {}, any>
    export const BottomLeft: DefineComponent<{}, {}, any>
    export const CloseBold: DefineComponent<{}, {}, any>
    export const Plus: DefineComponent<{}, {}, any>
    export const MiniSearch: DefineComponent<{}, {}, any>
    export const ZoomOut: DefineComponent<{}, {}, any>
    export const ZoomIn: DefineComponent<{}, {}, any>
    export const RefreshRight: DefineComponent<{}, {}, any>
    export const RefreshLeft: DefineComponent<{}, {}, any>
    export const RefreshDot: DefineComponent<{}, {}, any>
    export const ArrowRightBold: DefineComponent<{}, {}, any>
    export const ArrowLeftBold: DefineComponent<{}, {}, any>
    export const UserFilled: DefineComponent<{}, {}, any>
    export const Management: DefineComponent<{}, {}, any>
    export const List: DefineComponent<{}, {}, any>
    export const Setting: DefineComponent<{}, {}, any>
    export const Monitor: DefineComponent<{}, {}, any>
    export const Cellphone: DefineComponent<{}, {}, any>
    export const Notebook: DefineComponent<{}, {}, any>
    export const Odometer: DefineComponent<{}, {}, any>
    export const ChartLine: DefineComponent<{}, {}, any>
    export const DataLine: DefineComponent<{}, {}, any>
    export const DataAnalysis: DefineComponent<{}, {}, any>
    export const CreditCard: DefineComponent<{}, {}, any>
    export const Money: DefineComponent<{}, {}, any>
    export const Ticket: DefineComponent<{}, {}, any>
    export const present: DefineComponent<{}, {}, any>
    export const promotion: DefineComponent<{}, {}, any>
    export const shoppingCart: DefineComponent<{}, {}, any>
    export const shoppingCartFull: DefineComponent<{}, {}, any>
    export const Delete: DefineComponent<{}, {}, any>
    export const EditPen: DefineComponent<{}, {}, any>
    export const Edit: DefineComponent<{}, {}, any>
    export const CirclePlus: DefineComponent<{}, {}, any>
    export const Plus: DefineComponent<{}, {}, any>
    export const Vxet: DefineComponent<{}, {}, any>
    export const Vue: DefineComponent<{}, {}, any>
    export * from '@element-plus/icons-vue'
}
