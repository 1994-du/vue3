<!--  -->
<template>
    <el-card>
        <h2>浏览器缓存的优点</h2>
        <p>1.减少重复数据请求，节省流量</p>
        <p>2.降低服务器压力，提高网站性能</p>
        <p>3.加快网页加载速度，提升用户体验</p>
    </el-card>
    <el-card>
        <h2>缓存基本原理</h2>
        <p>第一次请求时，浏览器缓存资源；</p>
        <p>再次请求时，根据响应头中的<b>expires</b>或<b>cache-control</b>来判断是否命中 <b>强缓存</b></p>
    </el-card>
    <div class="cache_cards">
        <el-card class="box-card">
            <template #header>
                <p>强缓存---状态码：200(from cache)</p>
                <p>请求不会被服务器接收到</p>
            </template>
            <div class="card_content">
                <el-row>
                    <el-col :span="24">
                        <p>cache-control:</p>
                        <p>expires:资源过期时间；在过期时间内请求资源不会请求服务器，直接在缓存里面获取；</p>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-card class="box-card">
            <template #header>
                <p>协商缓存---状态码：304(not modified)</p>
            </template>
            <div class="card_content">
                <el-row>
                    <el-col :span="24">
                        <p>If-None-Match/Etag:</p>
                        <p>if-Modified-Since(If-Unmodified-Since)/Last-Modified:</p>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
    
    <table border cellspacing="0">
        <thead>
            <tr>
                <th style="width:80px">缓存类型</th>
                <th style="width:150px">头字段</th>
                <th>字段含义</th>
                <th>优点</th>
                <th>缺点</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td rowspan="2">强缓存</td>
                <td>Cache-Control</td>
                <td>请求/响应头，缓存控制字段，精确控制缓存策略；HTTP1.1新增字段，既能出现在请求头，也能出现在相应头，不同值代表不同意思</td>
                <td >\</td>
                <td>\</td>
            </tr>
            <tr>
                <td>Expires</td>
                <td>Expires:响应头，表示资源过期时间</td>
                <td>在过期时间内请求，不需要请求服务器，直接在缓存里面拿，为用户节省流量，减少服务器重复读取磁盘文件压力</td>
                <td>过期后，资源未变化还是会请求服务器，过期时间依赖客户端时间，时间不准确或者被改动，缓存也随之受影响</td>
            </tr>
            <tr>
                <td rowspan="4">协商缓存</td>
                <td rowspan="2">Etag <br> if-None-Match</td>
                <td>Etag：响应头，资源标识，有服务器告诉浏览器，Etag由文件修改时间和大小计算而成</td>
                <td  rowspan="2">当缓存有效时，服务器不会返回文件，直接返回304状态码，让客户端从缓存中获取文件，节省流量和宽带及服务器压力。并且解决了一秒内修改并读取文件的问题</td>
                <td rowspan="2">/</td>
            </tr>
            <tr>
                <td>if-None-Match:请求头，缓存资源标识，由浏览器告诉服务器，即第一次访问服务器时返回的Etag的值</td>
                
            </tr>
            <tr>
                <td rowspan="2">Last-modified <br> if-Modified-Since、</td>
                <td>Last-modified：响应头，资源最近修改时间，由服务器告诉浏览器</td>
                <td rowspan="2">当缓存有效时，服务器不会返回文件，直接返回304状态码，让客户端从缓存中获取文件。节省流量和宽带及服务器压力</td>
                <td rowspan="2">过期时间只能精确到秒，如果同一秒即修改又获取了文件，客户端拿不到最新的文件</td>
            </tr>
            <tr>
                <td>if-Modified-Since：请求头，资源最近修改时间。即第一次访问服务器时返回的Last-Modified的值</td>
            </tr>
        </tbody>
    </table>
    <h2>Cache-Control:请求/响应头，缓存控制字段，精确控制缓存策略；HTTP1.1新增字段，既能出现在请求头，也能出现在相应头，不同值代表不同意思</h2>
    <h5>服务端参数</h5>
    <table border>
        <thead>
            <tr>
                <th>值</th>
                <th>含义</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>max-age</td>
                <td>在多少秒内有效，是一个相对时间，比Expires更精确</td>
            </tr>
            <tr>
                <td>s-maxage</td>
                <td>表示缓存服务器上的缓存的有效时间，并只对public缓存有效</td>
            </tr>
            <tr>
                <td>no-cache</td>
                <td>不使用本地强缓存，需要使用协商缓存</td>
            </tr>
            <tr>
                <td>no-store</td>
                <td>直接禁止浏览器缓存数据，每次请求都会向服务器发送一个请求，每次都会下载完整资源</td>
            </tr>
            <tr>
                <td>public</td>
                <td>可以被所有用户缓存，包括终端用户和中间代理服务器</td>
            </tr>
            <tr>
                <td>private</td>
                <td>只能被终端用户的浏览器缓存，不允许中间缓存代理进行缓存</td>
            </tr>
        </tbody>
        
    </table>
    <h5>客户端参数</h5>
    <table border>
        <thead>
            <tr>
                <th>值</th>
                <th>含义</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>max-stale</td>
                <td>例如：5;表示客户端到代理服务器上拿缓存的时候，即使代理缓存过期了也不要紧，只要在过期时间5秒内，还是可以从代理中获取</td>
            </tr>
            <tr>
                <td>min-fresh</td>
                <td>表示代理缓存需要一定的新鲜度，一定要在缓存到期前5秒之前的时间拿，否则拿不到</td>
            </tr>
            <tr>
                <td>only-if-cached</td>
                <td>表示客户端只会接受代理缓存，而不会接收源服务器的响应。如果代理缓存失效，则返回50</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import {ref,reactive}from'vue'
const tableData=reactive([
    {
        name:'1',
        children:[
            {
                name:'1-1',
                children:[
                    {
                        name:'1-1-1',
                        children:[]
                    }
                ]
            }
        ],
    }
])
</script>
<style lang="less" scoped>
p{
    font-size: 16px;
    color: #303030;
}
h2,h4,h5,h6,p{
    text-align: left;
}
td{
    text-align: left;
}
.el-card{
    margin-bottom: 10px;
}
.cache_cards{
    display:flex;
    justify-content: space-between;
    .box-card{
        width: 49.5%;
        // margin:10px 0;
    }
}

</style>