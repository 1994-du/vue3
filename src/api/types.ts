import type { AxiosRequestConfig } from 'axios'

export interface ApiResponse<T = unknown> {
    code: number
    data: T
    msg?: string
    message?: string
}

export interface ApiRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
    needAuth?: boolean
    operationType?: 'query' | 'operate'
    showLoading?: boolean
    showSuccess?: boolean
}

export class ApiError extends Error {
    code?: number
    status?: number

    constructor(message: string, options: { code?: number; status?: number } = {}) {
        super(message)
        this.name = 'ApiError'
        this.code = options.code
        this.status = options.status
    }
}