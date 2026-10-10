// 词条按场景分组：common 通用操作 / login 登录注册 / topbar 顶栏 / message 提示 / table 表格
// en-us.ts 通过 LocaleMessages 类型约束，两边 key 不对齐会 typecheck 报错

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
        download: string
        export: string
        import: string
        copy: string
        copied: string
        refresh: string
        close: string
        expand: string
        collapse: string
        retry: string
        more: string
        all: string
        yes: string
        no: string
        enable: string
        disable: string
        loading: string
        noData: string
        language: string
    }
    login: {
        title: string
        subtitle: string
        account: string
        password: string
        rememberPassword: string
        noAccount: string
        registerNow: string
        accountRequired: string
        loginFailed: string
        registerSuccess: string
        tokenMissing: string
    }
    topbar: {
        user: string
        currentAccount: string
        userInfo: string
        logout: string
        expandNav: string
        collapseNav: string
        openSearch: string
        closeSearch: string
        searchMenuPlaceholder: string
        searchMenu: string
        noMatchMenu: string
        switchToLight: string
        switchToDark: string
    }
    message: {
        opSuccess: string
        opFailed: string
        saveSuccess: string
        deleteConfirm: string
        deleteSuccess: string
        networkError: string
        requestFailed: string
        uploadSuccess: string
        uploadFailed: string
    }
    table: {
        index: string
        actions: string
        status: string
        createTime: string
        updateTime: string
    }
}

// 喂给 vue-i18n 的类型：交叉 Record 索引签名满足 LocaleMessage 约束，
// 同时保留各组必填 key —— en-us 漏译任何一个 key 都会 typecheck 报错
export type I18nSchema = {
    [K in keyof LocaleMessages]: LocaleMessages[K] & Record<string, string>
}

const zhCn: I18nSchema = {
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
        upload: '上传',
        download: '下载',
        export: '导出',
        import: '导入',
        copy: '复制',
        copied: '已复制',
        refresh: '刷新',
        close: '关闭',
        expand: '展开',
        collapse: '收起',
        retry: '重试',
        more: '更多',
        all: '全部',
        yes: '是',
        no: '否',
        enable: '启用',
        disable: '禁用',
        loading: '加载中…',
        noData: '暂无数据',
        language: '语言'
    },
    login: {
        title: '账户登录',
        subtitle: '使用你的工作空间账号继续。登录后进入多面板工作区。',
        account: '账号',
        password: '密码',
        rememberPassword: '记住密码',
        noAccount: '还没有账号？',
        registerNow: '立即注册',
        accountRequired: '请输入账号和密码',
        loginFailed: '登录失败，请检查账号密码',
        registerSuccess: '注册成功，请登录',
        tokenMissing: '登录响应缺少 token'
    },
    topbar: {
        user: '用户',
        currentAccount: '当前账号',
        userInfo: '个人信息',
        logout: '退出登录',
        expandNav: '展开导航',
        collapseNav: '收起导航',
        openSearch: '打开搜索',
        closeSearch: '关闭搜索',
        searchMenuPlaceholder: '搜索菜单名称',
        searchMenu: '搜索菜单',
        noMatchMenu: '未找到匹配菜单',
        switchToLight: '切换浅色模式',
        switchToDark: '切换深色模式'
    },
    message: {
        opSuccess: '操作成功',
        opFailed: '操作失败',
        saveSuccess: '保存成功',
        deleteConfirm: '确定删除该条数据吗？',
        deleteSuccess: '删除成功',
        networkError: '网络异常，请稍后重试',
        requestFailed: '请求失败',
        uploadSuccess: '文件上传成功',
        uploadFailed: '文件上传失败'
    },
    table: {
        index: '序号',
        actions: '操作',
        status: '状态',
        createTime: '创建时间',
        updateTime: '更新时间'
    }
}

export default zhCn
