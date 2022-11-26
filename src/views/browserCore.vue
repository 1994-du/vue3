<!-- 浏览器内核 -->
<template>
<div class="browser_core">
    <span>浏览器内核</span>
    <div class="imgs">
        <div class="img_item">
            <img src="static/image/browser.jpg" alt="Trident" title="Trident" class="ie_browser">
        </div>
        <div class="img_item">
            <img src="static/image/browser.jpg" alt="Trident" title="Trident" class="edge_browser">
        </div>
        <div class="img_item">
            <img src="static/image/browser.jpg" alt="Chromium/Blink" title="Chromium/Blink" class="chrome_browser">
        </div>
        <div class="img_item">
            <img src="static/image/browser.jpg" alt="Gecko" title="Gecko" class="firefox_browser">
        </div>
        <div class="img_item">
            <img src="static/image/browser.jpg" alt="Persto/Blink" title="Persto/Blink" class="opera_browser">
        </div>
        <div class="img_item">
            <img src="static/image/browser.jpg" alt="Webkit" title="Webkit" class="safari_browser">
        </div>
    </div>
</div>
</template>

<script>

export default {
name:'BrowserCore',
components: {},
data() {
return {

};
},
computed: {},
watch: {},
methods: {

},
created() {

},
mounted() {

},
beforeCreate() {},
beforeMount() {},
beforeUpdate() {},
updated() {},
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='less' scoped>
.browser_core{
    display: flex;
    flex-direction: column;
    .imgs{
        display: flex;
        .img_item{
            width: 60px;
            height: 60px;
            overflow: hidden;
            position: relative;
            img{
                display: block;
                height: 120px;
                position: absolute;
                cursor: pointer;
                -webkit-user-drag: none;
                // pointer-events: none;
            }
            .ie_browser{
                left: 0;
                // clip: rect(0,60px,60px,0);
            }
            .chrome_browser{
                left: -70px;
            }
            .firefox_browser{
                left: -136px;
            }
            .opera_browser{
                left: 0;
                top: -60px;
            }
            .safari_browser{
                left: -70px;
                top: -60px;
            }
            .edge_browser{
                left: -136px;
                top: -60px;
            }
        }
        
    }
}
</style>