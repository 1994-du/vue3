import Axios from './index'

const baseUrl = '/api'

/**
 * WPS Office API 模块
 */

/**
 * 上传文件到 WPS
 * @param {FormData} formData - 包含文件的 FormData
 * @param {Object} extraConfig - 额外配置
 */
export function uploadToWPS(formData, extraConfig = {}) {
    return Axios({
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
 * @param {FormData} formData - 包含文件的 FormData
 * @param {Object} extraConfig - 额外配置
 */
export function wpsUpload(formData, extraConfig = {}) {
    return Axios({
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
 * @param {string} wpsFileId - WPS 文件 ID
 */
export function getWpsFileInfo(wpsFileId) {
    return Axios({
        url: `${baseUrl}/wps/file/${wpsFileId}`,
        method: 'get'
    })
}
