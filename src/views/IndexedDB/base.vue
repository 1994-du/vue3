<template>
    <h4>基本使用</h4>
    <h5>1.连接indexedDB数据库</h5>
    <code>
        <pre>let request = window.indexDB.open('db_name', db_version)</pre>
        <pre>let db;</pre>
        <pre>request.onsuccess((event)=>{
    db = event.target.result;
}) // 打开数据库成功</pre>
        <pre>request.onerror(()=>{}) // 打开数据库失败</pre>
        
    </code>
    <h5>2.创建对象存储（创建数据表）</h5>
    <code>
        <pre>request.onupgradeneeded((event)=>{
    // 数据库的创建是通过indexedDB.open方法触发的，当数据库不存在或者版本更新时，会触发onupgradeneeded事件，这时候才是调用createObjectStore的正确时机。            
    let db = event.target.result;
    if(!db.objectStoreNames.contains(storeName)){
        // 创建对象存储（创建数据表）
        db.createObjectStore(storeName, {keyPath: 'id', autoIncrement: true})
    }
}) // 数据库版本升级</pre>
    </code>
    <h5>3.创建事务（创建数据库）</h5>
    <code>
        <pre>let transaction = db.transaction(storeName, model,option);</pre>
        <pre>// storeName:事务设计的对象存储（数据表），涉及多个的情况下为数组['table1,'table2'']</pre>
        <pre>// model:事务模式；readonly、readwrite。默认readonly</pre>
        <pre>// option:配置。durability：设置事务的持久性级别，
// 可选值为：
// "default"：浏览器自动平衡性能和数据安全。
// "strict"：优先保证数据持久化（可能牺牲性能）。
// "relaxed"：优先性能，数据持久化可能延迟。</pre>
    </code>
    <h5>4.通过事务获取特定对象存储的实例，后续的增删改查都通过这个实例进行</h5>
    <code>
        <pre>const objectStore = transaction.objectStore(storeName);</pre>
        <pre>// storeName：对象存储。类型：字符串</pre>
        <pre>objectStore.add(data); // 添加数据</pre>
        <pre>objectStore.put(data); // 修改数据</pre>
        <pre>objectStore.delete(key); // 删除数据</pre>
        <pre>objectStore.get(key); // 获取数据</pre>
        <pre>objectStore.getAll(); // 获取所有数据</pre>
    </code>
</template>
<script setup>
</script>
<style lang='scss' scoped>
</style>