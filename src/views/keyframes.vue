<!-- keyframes -->
<template>
<div class="use_axios">
    keyframes使用
    <div class="img_transform" >
      <img src="@/assets/image/smallportal.webp" alt="">
    </div>
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