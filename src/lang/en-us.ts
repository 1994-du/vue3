import type { I18nSchema } from './zh-cn'

const enUs: I18nSchema = {
    common: {
        login: 'Login',
        register: 'Register',
        confirm: 'Confirm',
        cancel: 'Cancel',
        search: 'Search',
        reset: 'Reset',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        submit: 'Submit',
        back: 'Back',
        detail: 'Detail',
        upload: 'Upload',
        download: 'Download',
        export: 'Export',
        import: 'Import',
        copy: 'Copy',
        copied: 'Copied',
        refresh: 'Refresh',
        close: 'Close',
        expand: 'Expand',
        collapse: 'Collapse',
        retry: 'Retry',
        more: 'More',
        all: 'All',
        yes: 'Yes',
        no: 'No',
        enable: 'Enable',
        disable: 'Disable',
        loading: 'Loading…',
        noData: 'No data',
        language: 'Language'
    },
    login: {
        title: 'Sign in',
        subtitle: 'Continue with your workspace account to enter the multi-panel workspace.',
        account: 'Account',
        password: 'Password',
        rememberPassword: 'Remember password',
        noAccount: "Don't have an account?",
        registerNow: 'Register now',
        accountRequired: 'Please enter account and password',
        loginFailed: 'Login failed, please check your credentials',
        registerSuccess: 'Registered successfully, please sign in',
        tokenMissing: 'Login response is missing token'
    },
    topbar: {
        user: 'User',
        currentAccount: 'Current account',
        userInfo: 'Profile',
        logout: 'Sign out',
        expandNav: 'Expand navigation',
        collapseNav: 'Collapse navigation',
        openSearch: 'Open search',
        closeSearch: 'Close search',
        searchMenuPlaceholder: 'Search menu by name',
        searchMenu: 'Search menu',
        noMatchMenu: 'No matching menu',
        switchToLight: 'Switch to light mode',
        switchToDark: 'Switch to dark mode'
    },
    message: {
        opSuccess: 'Operation succeeded',
        opFailed: 'Operation failed',
        saveSuccess: 'Saved successfully',
        deleteConfirm: 'Are you sure to delete this record?',
        deleteSuccess: 'Deleted successfully',
        networkError: 'Network error, please try again later',
        requestFailed: 'Request failed',
        uploadSuccess: 'Files uploaded successfully',
        uploadFailed: 'File upload failed'
    },
    table: {
        index: 'No.',
        actions: 'Actions',
        status: 'Status',
        createTime: 'Created at',
        updateTime: 'Updated at'
    }
}

export default enUs
