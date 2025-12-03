export default{
    plugins: {
        'postcss-px-to-viewport': {
            viewportWidth: 1920, // 设计稿宽度
            viewportHeight: 1080, // 设计稿高度
            unitToConvert: 'px', // 需要转换的单位
            unitPrecision: 6, // 转换后的精度，即小数点位数
            propList: ['*'], // 需要转换的属性
            viewportUnit: 'rem', // 转换后的单位
            fontViewportUnit: 'rem', // 字体转换后的单位
            selectorBlackList: [], // 忽略转换的类名
            minPixelValue: 1, // 小于或等于1px不转换
            mediaQuery: false, // 媒体查询是否需要转换
            exclude: [], // 忽略某些文件夹下的文件或特定文件
            include: undefined, // 如果设置了include，那将只有匹配到的文件才会被转换
            landscape: false, // 是否处理横屏情况
            landscapeUnit: 'rem', // 横屏时使用的单位
            landscapeWidth: 1920 // 横屏时使用的视口宽度
        }
    }
}