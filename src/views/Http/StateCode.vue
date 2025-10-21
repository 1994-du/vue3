<template>
    <el-table :data="stateCodeList" height="400px">
        <el-table-column label="状态码" prop="statusCode"></el-table-column>
        <el-table-column label="状态描述" prop="statusDesc"></el-table-column>
    </el-table>
</template>
<script setup>
import { ref } from 'vue'
const stateCodeList = ref([
    {
        statusCode:100,
        statusDesc:'继续 - 服务器已经收到请求的部分，正在等待剩余部分，客户端应继续发送请求'
    },
    {
        statusCode:101,
        statusDesc:'切换协议 - 服务器根据客户端的请求切换协议，常见于WebSocket升级'
    },
    {
        statusCode:200,
        statusDesc:'成功 - 请求已成功处理，服务器返回了请求的内容'
    },
    {
        statusCode:201,
        statusDesc:'已创建 - 请求已成功处理并创建了新资源，通常在POST请求后返回'
    },
    {
        statusCode:202,
        statusDesc:'已接受 - 请求已被接受但尚未处理完成，处理可能是异步的'
    },
    {
        statusCode:204,
        statusDesc:'无内容 - 服务器成功处理了请求但没有返回任何内容'
    },
    {
        statusCode:300,
        statusDesc:'多种选择 - 请求的资源有多种表示形式，客户端需进一步指定'
    },
    {
        statusCode:301,
        statusDesc:'永久移动 - 请求的资源已被永久移动到新位置，将来的请求应使用新URI'
    },
    {
        statusCode:302,
        statusDesc:'临时移动 - 请求的资源临时移动到新位置，客户端应继续使用原URI'
    },
    {
        statusCode:304,
        statusDesc:'未修改 - 资源自上次请求后未修改，客户端可使用缓存的资源'
    },
    {
        statusCode:400,
        statusDesc:'客户端错误 - 服务器无法理解请求，通常是由于请求语法错误或参数无效'
    },
    {
        statusCode:401,
        statusDesc:'未授权 - 请求需要用户验证，客户端需提供有效的身份验证凭据'
    },
    {
        statusCode:403,
        statusDesc:'禁止 - 服务器理解请求但拒绝执行，通常是由于权限不足'
    },
    {
        statusCode:404,
        statusDesc:'未找到 - 服务器无法找到请求的资源，可能是URL错误或资源已被删除'
    },
    {
        statusCode:500,
        statusDesc:'服务器错误 - 服务器遇到了意外情况，无法完成请求'
    },
    {
        statusCode:501,
        statusDesc:'未实现 - 服务器不支持请求的功能，无法完成请求'
    },
    {
        statusCode:502,
        statusDesc:'网关错误 - 作为网关或代理的服务器从上游服务器接收到无效响应'
    },
    {
        statusCode:503,
        statusDesc:'服务不可用 - 服务器当前无法处理请求，通常是由于过载或维护'
    },
    {
        statusCode:504,
        statusDesc:'网关超时 - 作为网关或代理的服务器未能及时从上游服务器收到响应'
    },
    {
        statusCode:505,
        statusDesc:'HTTP版本不受支持 - 服务器不支持请求中使用的HTTP版本'
    }
])
</script>
<style lang="less" scoped>
p{
    text-align: left;
}
</style>