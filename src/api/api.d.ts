// API 模块类型声明
declare module '@/api/api' {
    interface ApiResponse {
        data: any
        code?: number
        msg?: string
        message?: string
    }
    export function getUsers(data?: { page?: number; pageSize?: number }): Promise<any>
    export function toUpload(data: any): Promise<any>
    export function updateUser(data: any): Promise<any>
    export function addUser(data: any): Promise<any>
    export function toResetPassword(data: any): Promise<any>
    export function delUser(data: any): Promise<any>
    export function getRolesDict(data?: any): Promise<any>
    export function fragmentUpload(data: any): Promise<any>
    export function fragmentDownload(data: any): Promise<any>
    export function updateAvatar(data: any): Promise<any>
    export function uploadFile(data: any): Promise<any>
    export function getOrgTree(data?: any): Promise<any>
    export function getOrgDetail(data: any): Promise<any>
    export function addOrg(data: any): Promise<any>
    export function updateOrg(data: any): Promise<any>
    export function deleteOrg(data: any): Promise<any>
}

declare module '@/api/chat' {
    interface ChatRequest {
        message: string
    }
    export function toChatDeepSeek(data: ChatRequest): Promise<any>
}

declare module '@/api/upload' {
    interface UploadResponse {
        code: number
        msg: string
        data: any
    }
    export function uploadFile(data: FormData, extraConfig?: Record<string, any>): Promise<UploadResponse>
    export function uploadImage(data: FormData, extraConfig?: Record<string, any>): Promise<UploadResponse>
    export function uploadFolder(data: FormData, extraConfig?: Record<string, any>): Promise<UploadResponse>
}

declare module '@/api/role' {
    interface RolesResponse {
        code: number
        msg: string
        data: any
    }
    export function getRoles(data?: any): Promise<RolesResponse>
    export function setRole(data: any): Promise<any>
    export function addRole(data: any): Promise<any>
    export function delRole(data: any): Promise<any>
}

declare module '@/api/menus' {
    export function getMenus(): Promise<any>
    export function getMenuTree(): Promise<any>
    export function setMenu(data: any): Promise<any>
    export function deleteMenu(data: any): Promise<any>
    export function addMenu(data: any): Promise<any>
}

declare module '@/api/wps' {
    export function uploadToWPS(data: FormData, extraConfig?: Record<string, any>): Promise<any>
    export function wpsUpload(data: FormData, extraConfig?: Record<string, any>): Promise<any>
}
