import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { getToken, handleTokenExpire, isTokenExpired } from '@/utils/tokenManager'
import { ApiError, type ApiRequestConfig, type ApiResponse } from './types'

let loadingInstance: { close: () => void } | null = null
let loadingRequestCount = 0

const showLoading = (): void => {
    if (loadingRequestCount === 0) {
        loadingInstance = ElLoading.service({
            lock: true,
            text: '加载中...',
            background: 'rgba(0,0,0,0.7)'
        })
    }
    loadingRequestCount += 1
}

const hideLoading = (): void => {
    loadingRequestCount = Math.max(loadingRequestCount - 1, 0)
    if (loadingRequestCount === 0 && loadingInstance) {
        loadingInstance.close()
        loadingInstance = null
    }
}

const isUnauthorized = (response?: AxiosResponse): boolean => {
    return response?.status === 401
        || response?.data?.code === 401
        || response?.data?.status === 401
}

const createTokenExpiredError = (): ApiError => {
    return new ApiError('token已过期', { status: 401 })
}

const Axios: AxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 300000
})

Axios.interceptors.request.use(
    async config => {
        const requestConfig = config as ApiRequestConfig
        if (requestConfig.needAuth !== false) {
            if (isTokenExpired()) {
                await handleTokenExpire()
                return Promise.reject(createTokenExpiredError())
            }

            const token = getToken()
            if (token) {
                config.headers.set('Authorization', `Bearer ${token}`)
            }
        }

        if (requestConfig.showLoading) {
            showLoading()
        }

        if (!config.headers.has('Content-Type') && !(config.data instanceof FormData)) {
            config.headers.set('Content-Type', 'application/json;charset=UTF-8')
        }
        return config
    },
    error => Promise.reject(error)
)

Axios.interceptors.response.use(
    response => {
        const requestConfig = response.config as ApiRequestConfig
        if (requestConfig.showLoading) hideLoading()

        if (isUnauthorized(response)) {
            void handleTokenExpire()
            return Promise.reject(createTokenExpiredError())
        }

        const result = response.data as ApiResponse
        const shouldShowSuccess = requestConfig.showSuccess ?? requestConfig.operationType === 'operate'

        if (result.code !== 200) {
            ElMessage.error(result.msg || result.message || '请求失败')
        } else if (shouldShowSuccess && (result.msg || result.message)) {
            ElMessage.success(result.msg || result.message)
        }

        return result as unknown as AxiosResponse
    },
    error => {
        const requestConfig = error.config as ApiRequestConfig | undefined
        if (requestConfig?.showLoading) hideLoading()

        if (error instanceof ApiError || error.name === 'CanceledError') {
            return Promise.reject(error)
        }

        if (isUnauthorized(error.response)) {
            void handleTokenExpire()
        } else {
            const responseData = error.response?.data as ApiResponse | undefined
            ElMessage.error(responseData?.msg || responseData?.message || '请求失败')
        }

        return Promise.reject(error)
    }
)

const request = async <T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>> => {
    return Axios.request<ApiResponse<T>>(config) as unknown as Promise<ApiResponse<T>>
}

export type { ApiRequestConfig, ApiResponse }
export { ApiError }
export default request