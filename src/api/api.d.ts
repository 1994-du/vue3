// API 模块类型声明
declare module '@/api/api' {
    interface ApiResponse {
        data: any
        code?: number
        message?: string
    }
    export function getUsers(data?: { page?: number; pageSize?: number }): Promise<ApiResponse>
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
    interface ChatResponse {
        data: string
    }
    export function toChatDeepSeek(data: ChatRequest): Promise<ChatResponse>
}

declare module '@/api/upload' {
    export function uploadFile(data: FormData, extraConfig?: Record<string, any>): Promise<any>
    export function uploadImage(data: FormData, extraConfig?: Record<string, any>): Promise<any>
    export function uploadFolder(data: FormData, extraConfig?: Record<string, any>): Promise<any>
}

declare module '@/api/role' {
    export function getRoles(data?: any): Promise<any>
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
