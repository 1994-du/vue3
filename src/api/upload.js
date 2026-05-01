import Axios from './index'

const baseUrl = '/api'

/**
 * @description 上传单个文件
 * @param {FormData} data - 包含文件的 FormData 对象
 * @param {Object} extraConfig - 额外的 axios 配置，例如 onUploadProgress
 */
export function uploadFile(data, extraConfig = {}) {
    const requestConfig = {
        url: `${baseUrl}/file/upload`,
        method: 'post',
        needAuth: true,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...(extraConfig.headers || {})
        },
        data,
        ...extraConfig
    }

    return new Promise((resolve, reject) => {
        Axios(requestConfig).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * @description 上传单张图片
 * @param {FormData} data - 包含图片文件的 FormData 对象
 * @param {Object} extraConfig - 额外的 axios 配置，例如 onUploadProgress
 */
export function uploadImage(data, extraConfig = {}) {
    const requestConfig = {
        url: `${baseUrl}/files/upload-image`,
        method: 'post',
        needAuth: true,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...(extraConfig.headers || {})
        },
        data,
        ...extraConfig
    }

    return new Promise((resolve, reject) => {
        Axios(requestConfig).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * @description 上传整个文件夹
 * @param {FormData} data - 包含目录文件和相对路径的 FormData 对象
 * @param {Object} extraConfig - 额外的 axios 配置，例如 onUploadProgress
 */
export function uploadFolder(data, extraConfig = {}) {
    const requestConfig = {
        url: `${baseUrl}/files/upload-folder`,
        method: 'post',
        needAuth: true,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...(extraConfig.headers || {})
        },
        data,
        ...extraConfig
    }

    return new Promise((resolve, reject) => {
        Axios(requestConfig).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
