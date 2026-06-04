export interface LocaleMessages {
    common: {
        login: string
        register: string
        confirm: string
        cancel: string
        search: string
        reset: string
        add: string
        edit: string
        delete: string
        save: string
        submit: string
        back: string
        detail: string
        upload: string
        [key: string]: string
    }
    [key: string]: any
}

const zhCn: LocaleMessages = {
    common: {
        login: '登录',
        register: '注册',
        confirm: '确认',
        cancel: '取消',
        search: '查询',
        reset: '重置',
        add: '新增',
        edit: '编辑',
        delete: '删除',
        save: '保存',
        submit: '提交',
        back: '返回',
        detail: '详情',
        upload: '上传'
    }
}

export default zhCn
