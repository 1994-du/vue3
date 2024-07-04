<!-- gitline -->
<template>
<div>
<h1>git命令行</h1>
<highlightjs code="基础命令
git add . //添加所有文件到暂存区
git commit -m '注释' //添加到本地仓库
git pull //获取远程仓库文件
git push //提交本地仓库文件到远程仓库"></highlightjs>
<h4>不提交当前分支修改内容，切换到其他分支</h4>
<highlightjs code="git stash //保存当前分支未提交的修改 
git stash list //查看保存的修改 例：stash@{0}: WIP on master: ea39ac0 20230212menu
git stash save '修改注释' //查看保存的修改 例：stash@{0}: On master: 20230217--2
git stash pop //取出保存的修改并删除此保存记录
git stash pop 'stash@{index}' //取出指定index修改，并删除修改记录 
git stash apply //取出保存的修改不删除此保存记录
git stash apply stash@{index} //取出指定index修改，并保存修改记录
"></highlightjs>
<h4>假定文件未修改</h4>
<highlightjs code="git update-index --assume-unchanged filename //忽略文件更改 
git update-index --no-assume-unchanged filename //取消忽略文件更改 "></highlightjs>
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