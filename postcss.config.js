// postcss.config.js
export default {
    plugins: {
      // 自动添加 CSS 前缀
      autoprefixer: {
        // 指定兼容的浏览器范围（使用 Browserslist 语法）
        overrideBrowserslist: [
            "chrome >= 85",
            ">1%",          // 全球使用率 >1% 的浏览器
            "last 2 versions", // 所有浏览器的最近两个版本
            "not ie <= 10"  // 排除 IE 10 及以下版本
        ]
      }
    }
  };