export default{
    // 设置测试文件的匹配模式
    testMatch: ['**/__tests__/**/*.(js|ts|jsx|tsx)|**/?(*.)+(spec|test).(js|ts|jsx|tsx)'],
  
    // 设置 Jest 如何转换特定的文件类型
    transform: {
        '^.+\\.vue$': 'vue-jest', // 处理 .vue 文件
        '^.+\\.(js|jsx|ts|tsx)?$': 'babel-jest' // 处理 JavaScript/TypeScript 文件
    },
    // 设置文件扩展名的自动解析
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'vue'],
  
    // Mock 静态资源，如图片和样式
    moduleNameMapper: {
        '^.+\\.(css|scss|sass|less)$': 'identity-obj-proxy', // Mock 样式文件
        '^.+\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js' // Mock 静态资源
    },
  
    // Jest 运行的环境，默认为 Node，但 Vue 项目使用 jsdom 来模拟浏览器环境
    testEnvironment: 'jsdom',
  
    // 在每个测试文件运行之前执行一些代码，通常用于设置全局对象
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
    // 忽略测试某些文件/目录
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  
    // 配置覆盖率报告
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,vue}',
        '!src/main.js', // 忽略入口文件
        '!src/router/**', // 忽略路由配置
        '!src/store/**' // 忽略 Vuex 状态管理
    ],
  
    // Jest 工作目录
    rootDir: './',
  
    // 解决别名问题（如 @ 符号）
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    "presets": [
        ["@babel/preset-env", { "targets": { "node": "current" } }]
    ]
};