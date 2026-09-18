/* 这里原先挂着 postcss-px-to-viewport-8-plugin（viewportWidth 1920 / viewportUnit rem），
   它把样式里写的每一个 px 都换成 rem。1920 设计稿下 1rem 应等于 19.2px，而项目根字号是
   浏览器默认的 16px，于是 22px 被渲染成 18.33px —— 全站恒定缩到 83.3%。除了尺寸对不上稿，
   DevTools 里看到的也是 1.14583rem / 0.416667rem 这类读不出设计意图的值（含圆角、行高、间距）。

   现在按需求移除该转换：样式里写 px 就是 px，所见即所得。
   注：@tailwindcss/postcss 保留原样。它其实一直没生效 —— Tailwind v4 需要 src 里显式
   `@import "tailwindcss"` 才会产出样式，项目里没有这个入口。 */
export default {
    plugins: {
        '@tailwindcss/postcss': {}
    }
}
