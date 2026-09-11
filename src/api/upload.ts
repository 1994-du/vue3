import axios from './index'
import type { ApiRequestConfig, ApiResponse } from './types'

type UploadConfig = Pick<ApiRequestConfig, 'headers' | 'onUploadProgress'>
type UploadResponse = ApiResponse<unknown>

/**
 * @description 上传单个文件
 */
export const uploadFile = (data: FormData, extraConfig: UploadConfig = {}): Promise<UploadResponse> => {
    return axios({
        url: '/file/upload',
        method: 'post',
        needAuth: true,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...(extraConfig.headers || {})
        },
        data,
        ...extraConfig
    })
}

/**
 * @description 上传单张图片
 */
export const uploadImage = (data: FormData, extraConfig: UploadConfig = {}): Promise<UploadResponse> => {
    return axios({
        url: '/files/upload-image',
        method: 'post',
        needAuth: true,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...(extraConfig.headers || {})
        },
        data,
        ...extraConfig
    })
}

/**
 * @description 上传整个文件夹
 */
export const uploadFolder = (data: FormData, extraConfig: UploadConfig = {}): Promise<UploadResponse> => {
    return axios({
        url: '/files/upload-folder',
        method: 'post',
        needAuth: true,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...(extraConfig.headers || {})
        },
        data,
        ...extraConfig
    })
}
