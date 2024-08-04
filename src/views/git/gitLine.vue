<!-- gitline -->
<template>
<div>
    <h1>git命令行</h1>
    <h4>基础命令</h4>
    <p>git add . //添加所有文件到暂存区</p>
    <p>git commit -m '注释' //添加到本地仓库</p>
    <p>git pull //获取远程仓库文件</p>
    <p>git push //提交本地仓库文件到远程仓库</p>
    <h4>不提交当前分支修改内容，切换到其他分支</h4>
    <p>git stash //保存当前分支未提交的修改 </p>
    <p>git stash list //查看保存的修改 例：stash@{0}: WIP on master: ea39ac0 20230212menu</p>
    <p>git stash save '修改注释' //查看保存的修改 例：stash@{0}: On master: 20230217--2</p>
    <p>git stash pop //取出保存的修改并删除此保存记录</p>
    <p>git stash pop 'stash@{index}' //取出指定index修改，并删除修改记录 </p>
    <p>git stash apply //取出保存的修改不删除此保存记录</p>
    <p>git stash apply stash@{index} //取出指定index修改，并保存修改记录</p>
    <h4>假定文件未修改</h4>
    <p>git update-index --assume-unchanged filename //忽略文件更改 </p>
    <p>git update-index --no-assume-unchanged filename //取消忽略文件更改</p>
</div>
</template>

<script>

export default {
name:'gitLine',
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
p{
    text-align: left;
}
</style>