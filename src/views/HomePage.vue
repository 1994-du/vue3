<template>
    首页
    <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
        :cell-style="{ color: '#606266' }"
        :row-class-name="(row, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')"
    >
        <el-table-column prop="sha" label="SHA" width="300"></el-table-column>
        <el-table-column prop="commit.author.name" label="Author" width="150"></el-table-column>
        <el-table-column prop="commit.message" label="Message"></el-table-column>
        <el-table-column prop="commit.author.date" label="Date" width="200"></el-table-column>
    </el-table>
    <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :total="100"
        layout="prev, pager, next"
        @current-change="(page) => { pageNum = page; fetchData(); }"
    />
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import Axios from 'axios';

let tableData = ref<any[]>([])
let pageSize = ref(10)
let pageNum = ref(1)
let branch = ref('master')
onMounted(() => {
    fetchData()
})
const fetchData = () => {
    Axios.get(`https://api.github.com/repos/1994-du/vue3/commits?per_page=${pageSize.value}&page=${pageNum.value}&sha=${branch.value}`).then((res) => {
        console.log(res);
        tableData.value = res.data
    });
}
</script>

<style lang='scss' scoped>

</style>
