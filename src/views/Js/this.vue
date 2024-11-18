<template>
<h4>this指向</h4>
<code>
    <pre>var year = 2021</pre>
    <pre>function getDate(month,day){</pre>
    <pre>   return this.year + '-' + month + '-' +day</pre>
    <pre>}</pre>
    <pre>var date1 = getDate(1,1) // 2021-1-1</pre>
</code>
<h4>call和apply作用一样，区别就是参数区别；apply参数为数据</h4>
<code>
    <pre>getDate.call({year:2022},1,1) // 2022-1-1</pre>
</code>
<code>
    <pre>getDate.apply({year:2023},[1,1]) // 2023-1-1</pre>
</code>
<h4>bind是返回函数 不会立即调用</h4>
<code>
    <pre>let newFun = getDate.bind({year:2024})(1,1)</pre>
    <pre>newFun() // 2024-1-1</pre>
</code>


<!-- <el-form :model="formModel" :rules="formRules">
    <el-table :data="maintainNodeData">
        <el-table-column label="序号" prop="nodeNum"></el-table-column>
        <el-table-column label="节点名称">
            <template #default="scope">
                <el-form-item
                    draggable="true"
                    @dragstart="maintainNodeDragStart(scope.row)"
                    @dragover.prevent
                    @drop="maintainNodeDrop(scope.row)">
                    <el-input v-model="maintainNodeData[scope.$index].nodeName"></el-input>
                </el-form-item>
            </template>
        </el-table-column>
    </el-table>
</el-form> -->



</template>
<script setup>
</script>
<style lang='scss' scoped>
</style>