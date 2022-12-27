<!-- keyframes -->
<template>
<div class="use_keyframes">
  <h4>animation:动画</h4>
  <table cellspacing="0" cellpadding="10px 0">
    <tr>
      <th>属性名</th>
      <th>属性值</th>
      <th>属性描述</th>
    </tr>
    <tr>
      <td>animation-name</td>
      <td>动画名称</td>
      <td>设置绑定到元素的动画</td>
    </tr>
    <tr>
      <td>animation-duration</td>
      <td>1s或者1000ms</td>
      <td>完成动画所需要的时间</td>
    </tr>
    <tr>
      <td rowspan="6">animation-timing-function:动画速度曲线</td>
      <td>linear</td>
      <td>匀速执行</td>
    </tr>
    <tr>
      <td>ease</td>
      <td>默认值，低速开始，然后加快，结束前变慢</td>
    </tr>
    <tr>
      <td>ease-in</td>
      <td>低速开始</td>
    </tr>
    <tr>
      <td>ease-out</td>
      <td>低速结束</td>
    </tr>
    <tr>
      <td>ease-in-out</td>
      <td>低速开始并结束</td>
    </tr>
    <tr>
      <td>cubic-bezier(n,n,n)</td>
      <td>使用函数来定义播放速度，0 &#60; n &#60; 1 </td>
    </tr>
    <tr>
      <td rowspan="4">animation-fill-mode:设置动画不播放时动画的状态</td>
      <td>none</td>
      <td>不改变动画的默认行为</td>
    </tr>
    <tr>
      <td>forwards</td>
      <td>动画播放完成后，保持动画最后一个关键帧的中的样式</td>
    </tr>
    <tr>
      <td>backwards</td>
      <td>在animation-delay所指定的时间段内，应用动画第一帧中的样式</td>
    </tr>
    <tr>
      <td>both</td>
      <td>动画播放完成后，保持动画最后一个关键帧的中的样式</td>
    </tr>
    <tr>
      <td>animation-delay</td>
      <td>1s</td>
      <td>延迟动画播放时间</td>
    </tr>
    <tr>
      <td rowspan="2">animation-iteration-count</td>
      <td>n</td>
      <td>使用具体数值定于动画播放次数</td>
    </tr>
    <tr>
      <td>infinite</td>
      <td>动画无限次播放</td>
    </tr>
    <tr>
      <td rowspan="4">animation-direction：设置是否轮流反向播放动画</td>
      <td>normal</td>
      <td>正常播放</td>
    </tr>
    <tr>
      <td>reverse</td>
      <td>相反的方向播放</td>
    </tr>
    <tr>
      <td>alternate</td>
      <td>奇数次正常，偶数次反向</td>
    </tr>
    <tr>
      <td>alternate-reverse</td>
      <td>奇数次反向，偶数次正常</td>
    </tr>
    <tr>
      <td rowspan="2">animation-play-state</td>
      <td>paused</td>
      <td>暂停动画播放</td>
    </tr>
    <tr>
      <td>running</td>
      <td>正常播放</td>
    </tr>
  </table>
  <div class="container">
    <div class="img_transform" >
      <img src="static/image/smallportal.webp" alt="">
    </div>
    <div class="icon1"></div>
    <div class="login">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span>登录</span>
    </div>
    <div class="item"></div>
    <div class="light_ball"></div>
  </div>
  <h4>keyframes:关键帧</h4>
  <img class="example_img" src="static/image/keyframes.png" alt="">
</div>
</template>

<script>

export default {
name:'KeyFrames',
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
    // this.$axios.get('/user', {
    //     params: {
    //     ID: 12345
    //     }
    // })
    // .then(function (response) {
    //     console.log(response);
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
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
<style lang="less" scoped>
@import "@/styles/keyframes.less";
</style>