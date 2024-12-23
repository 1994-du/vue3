<template>
	<div class="masonry">
		<code>
			<pre>// 切换分支</pre>
			<pre>git checkout [branch-name]</pre>
		</code>
		<code>
			<pre>// 合并分支</pre>
			<pre>git merge [branch-name]</pre>
		</code>
		<code>
			<pre>// 删除远程仓库分支</pre>
			<pre>git push origin --delete 【branch-name】 </pre>
		</code>
		<code>
			<pre>// 修改分支名</pre>
			<pre>git branch -m [new-branch] // 在目标分支</pre>
			<pre>git branch -m [old-branch] [new-branch] // 不在目标分支</pre>
		</code>
		<code>
			<pre>// 推送新分支到远程</pre>
			<pre>git push origin new-branch</pre>
			<pre>git push --set-upstream origin new-branch // 关联远程分支</pre>
		</code>
		<code>
			<pre>// 删除本地分支</pre>
			<pre>git branch -d [branch-name]</pre>
		</code>
		<code>
			<pre>// 查看远程仓库</pre>
			<pre>git remote -v</pre>
		</code>
	</div>
</template>

<style scoped>
.masonry {
	display: flex;
	flex-wrap: wrap;
	gap:0 10px; /* 设置间距 */
}
code {
	flex: 1 1 auto;
    margin: 0;
	margin-bottom: 10px;
}
</style>
