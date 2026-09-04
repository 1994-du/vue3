import axios from './index'

/**
 * @description 上传单个文件
 */
export const uploadFile = (data: any, extraConfig: any = {}) => {
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
    } as any)
}

/**
 * @description 上传单张图片
 */
export const uploadImage = (data: any, extraConfig: any = {}) => {
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
    } as any)
}

/**
 * @description 上传整个文件夹
 */
export const uploadFolder = (data: any, extraConfig: any = {}) => {
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
    } as any)
}
