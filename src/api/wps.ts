import axios from './index'

const baseUrl = '/api'

/**
 * WPS Office API 模块
 */

interface ExtraConfig {
    headers?: Record<string, string>
    [key: string]: any
}

/**
 * 上传文件到 WPS
 * @param formData - 包含文件的 FormData
 * @param extraConfig - 额外配置
 */
export function uploadToWPS(formData: FormData, extraConfig: ExtraConfig = {}): Promise<any> {
    return axios({
        url: `${baseUrl}/file/upload-wps`,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...(extraConfig.headers || {})
        },
        ...extraConfig
    })
}

/**
 * 通过 WPS 接口上传文件
 * @param formData - 包含文件的 FormData
 * @param extraConfig - 额外配置
 */
export function wpsUpload(formData: FormData, extraConfig: ExtraConfig = {}): Promise<any> {
    return axios({
        url: `/wps/upload`,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...(extraConfig.headers || {})
        },
        ...extraConfig
    })
}

/**
 * 获取 WPS 文件信息
 * @param wpsFileId - WPS 文件 ID
 */
export function getWpsFileInfo(wpsFileId: string): Promise<any> {
    return axios({
        url: `${baseUrl}/wps/file/${wpsFileId}`,
        method: 'get'
    })
}
