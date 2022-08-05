<template>
    <div class="spreadjs">
        <div class="import_box">
            <div class="upload_btn">
                <el-button @click="toUploadFile" type="primary">上传</el-button>
                <input
                    ref="upload"
                    type="file"
                    @change="getFile"
                    style="display: none"
                />
            </div>
            <!-- <div
                class="drag_box"
                @dragenter="uploadEnter"
                @dragover="uploadOver"
                @dragleave="uploadLeave"
                @drop="uploadDrop"
            >
            文件拖拽区域
            </div> -->
        </div>
        <div class="spread_view">
            <gc-spread-sheets-designer
                :styleInfo="styleInfo"
                :config="config"
                @designerInitialized="designerInitialized"
            >
            </gc-spread-sheets-designer>
        </div>
    </div>
</template>

<script>
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css'
import '@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css'
import GC from '@grapecity/spread-sheets'
import '@grapecity/spread-sheets-pivot-addon'
import '@grapecity/spread-sheets-resources-zh'
GC.Spread.Common.CultureManager.culture('zh-cn')
import '@grapecity/spread-sheets-designer-resources-cn'
// import { Designer } from '@grapecity/spread-sheets-designer-vue'
// import * as ExcelIO from '@grapecity/spread-excelio'

// 测试环境
GC.Spread.Sheets.LicenseKey =
    'openbi-demo.paic.com.cn,169722287413857#B0LSg3UO6l7MGlUeEZ4NQJmUolFN7clU9VUTDljQnZ4K4o5YBl7LwpFaLVzUIxWUvkHOap7QxEWOVBlSQVEWzIGewcmbpJ6KUpVTyczTn3EWxBlZk3Ed4M5Vy5mav8ERqFXRUlXV8ZGbN5EUkRDTpd4NCd5MyckNNZ7aHlTVGNHd5Mnc6RHWKNVSxhGcSp7LWhVQrZGUtNnMZtGayJkSxwUWO3kb4VVTad5SplVbSVFWY9GOrN6NmhlNx94VwEHOrY4N7BzZCpEMMRUWSxmNldlaYFjd7Q4N98UZTRza8ImSNZHRVZzMmZUSRBXMa94YWdWVDVEZFJGUH3CRz4WSiojITJCLicDMFZjRERTNiojIIJCLwUzN5gTN7EDN0IicfJye#4Xfd5nIFVUSWJiOiMkIsICNx8idgAyUKBCZhVmcwNlI0IiTis7W0ICZyBlIsIiN4YjM7ADI5AzMwEjMwIjI0ICdyNkIsIibj9SbvNmLjlWYw9ybtVGZtkmYuVGcvJiOiMXbEJCLig1jlzahlDZmpnInmDoimH9pn71gorbmmrJgpbKton1olPLnlH1tmLiOiEmTDJCLicTN8MTM4cDOyIjM7kjNxIiOiQWSiwSflNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPRhDRodzVXtGRz34ZQZ4MB5kR6QnZMBlUlp7SFtEV0VTeslke7RWRwRzNnpGczckQWx6Q9hWZzVHNwY7SnhVQpZ6TLlzTj3GbyQlW4YTMvJFRyFlYSJ1WxV'
GC.Spread.Sheets.Designer.LicenseKey =
    'openbi-demo.paic.com.cn,672999589434341#B0jQDFbkZWRiJUVDxGbBFmcZNWNaZWeYNHNyYWUxtmNwcUVallQ5lzUjRXRTZWcJ3mTHZTamNHN0hTT4k5aVlXSy4WTwsSTsJVb8QTYxpFO6gUbrl6TONGcBBFMzEHTp5mW5RGOIZGNF9WdVxWTnRkePB5TxkmVQllMLpUdvsmUKJnNM3UMzFzQrdnb7p6SyMVNjNmdaRFWxITRpNDN6t4Ro9UMwMDWUZ4UGVTOyJ4b6VHcGp4dOBTM9UEeXFGU8cTSzUXZvJDZlRlcKpURRR7b7gHOwEkNRFmdi9mZ744Tid5cilncrJkY7gWeItWa6FVe8o7LpdFVmpXQiojITJCLiITNCFDO9UzMiojIIJCL4cTNykjN9cDO0IicfJye&Qf35VfiklNFdjI0IyQiwiI4EjL6BibvRGZB5icl96ZpNXZE5yUKRWYlJHcTJiOi8kI1tlOiQmcQJCLiMTM7IzNwASNwMDMxIDMyIiOiQncDJCLi86Yu46bj9yYpFGcu2WblRWLpJmblB7biojIz5GRiwiI8+Y9sWY9QmZ0Jyp9Aqo9Re093OI00mp9aCY0mSL09Oa9zyZ9xer9iojIh94QiwiIxQzM4MDN9gTN9kTOycjNiojIklkI1pjIEJCLi4TPRtURMhUUZtiYzJVNXlkSrYmWyMTcGdWdyYHWFNVSoBzT8sESalTYJdWYr5GaldmT6hERvI5cKxWQHdEc5sCOvgUWmZEZudmaRZzZFtEUwMURxBzZwBnaJRD6Jr0'
GC.Spread.Sheets.LicenseKey = ExcelIO.LicenseKey =
    'openbi-demo.paic.com.cn,169722287413857#B0LSg3UO6l7MGlUeEZ4NQJmUolFN7clU9VUTDljQnZ4K4o5YBl7LwpFaLVzUIxWUvkHOap7QxEWOVBlSQVEWzIGewcmbpJ6KUpVTyczTn3EWxBlZk3Ed4M5Vy5mav8ERqFXRUlXV8ZGbN5EUkRDTpd4NCd5MyckNNZ7aHlTVGNHd5Mnc6RHWKNVSxhGcSp7LWhVQrZGUtNnMZtGayJkSxwUWO3kb4VVTad5SplVbSVFWY9GOrN6NmhlNx94VwEHOrY4N7BzZCpEMMRUWSxmNldlaYFjd7Q4N98UZTRza8ImSNZHRVZzMmZUSRBXMa94YWdWVDVEZFJGUH3CRz4WSiojITJCLicDMFZjRERTNiojIIJCLwUzN5gTN7EDN0IicfJye#4Xfd5nIFVUSWJiOiMkIsICNx8idgAyUKBCZhVmcwNlI0IiTis7W0ICZyBlIsIiN4YjM7ADI5AzMwEjMwIjI0ICdyNkIsIibj9SbvNmLjlWYw9ybtVGZtkmYuVGcvJiOiMXbEJCLig1jlzahlDZmpnInmDoimH9pn71gorbmmrJgpbKton1olPLnlH1tmLiOiEmTDJCLicTN8MTM4cDOyIjM7kjNxIiOiQWSiwSflNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPRhDRodzVXtGRz34ZQZ4MB5kR6QnZMBlUlp7SFtEV0VTeslke7RWRwRzNnpGczckQWx6Q9hWZzVHNwY7SnhVQpZ6TLlzTj3GbyQlW4YTMvJFRyFlYSJ1WxV'
// 测试环境
export default {
    data: function () {
        return {
            styleInfo: {
                height: '800px',
                width: '1200px',
                border: 'solid red 1px',
            },
            config: null,
            designer: null,
            spread: null,
            sheet:null
        }
    },
    methods: {
        uploadEnter(e) {
            e.preventDefault()
            e.stopPropagation()
        },
        uploadOver(e) {
            e.preventDefault()
            e.stopPropagation()
        },
        uploadLeave(e) {
            e.preventDefault()
            e.stopPropagation()
        },
        uploadDrop(e) {
            e.preventDefault()
            e.stopPropagation()

            let file = e.dataTransfer.files[0]
            console.log('drop', file)
            let excelIO = new ExcelIO.IO()
            let _this = this
            excelIO.open(
                file,
                function (json) {
                    console.log('json', json)
                    _this.spread.fromJSON(json)
                },
                (err) => {
                    console.log(err)
                },
                { password: '' }
            )
        },
        ////////////////////////////
        toUploadFile() {
            this.$refs.upload.click();
        },
        getFile(e) {
            let file = e.target.files[0]
            let excelIO = new ExcelIO.IO()
            let _this = this
            excelIO.open(
                file,
                function (json) {
                    _this.spread.fromJSON(json)
                    //获取所有自定义名称信息--spread.getCustomNames()
                    //获取指定的自定义名称信息--spread.getCustomName(name)
                    //获取指定单元格内容--sheet.getValue(row,col)
                    console.log(_this.spread.getCustomNames())
                    let testName = _this.spread.getCustomName('V_1');
                    let range = testName.getExpression().getRange();
                    console.log(testName)
                    console.log(range)
                    console.log(GC.Spread.Sheets.CalcEngine.rangeToFormula(range))
                },
                (err) => {
                    console.log(err)
                },
                { password: '' }
            )
            this.$refs.upload.value=null;
        },
        ////////////////////////////////
        // 设计器
        designerInitialized(value) {
            //设计器
            this.designer = value
            // 工作溥
            this.spread = value.Spread
            // 活跃表单
            this.sheet = value.Spread.getActiveSheet()
        },
    },
}
</script>

<style lang="less" scoped>
@import '~@/styles/spreadjs.less';
</style>
