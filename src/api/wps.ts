import axios from './index'

/**
 * WPS Office API 模块
 */

/**
 * 上传文件到 WPS
 */
export const uploadToWPS = (formData: any, extraConfig: any = {}) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/file/upload-wps',
            method: 'post',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(extraConfig.headers || {})
            },
            ...extraConfig
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

/**
 * 通过 WPS 接口上传文件
 */
export const wpsUpload = (formData: any, extraConfig: any = {}) => {
    return new Promise((resolve, reject) => {
        axios({
            url: '/wps/upload',
            method: 'post',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(extraConfig.headers || {})
            },
            ...extraConfig
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

/**
 * 获取 WPS 文件信息
 */
export const getWpsFileInfo = (wpsFileId: string) => {
    return new Promise((resolve, reject) => {
        axios({
            url: `/wps/file/${wpsFileId}`,
            method: 'get'
        } as any).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}
