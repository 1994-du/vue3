<template>
    Mysql
    <p>命令行连接mysql：mysql -uroot -p</p>
    <p>断开连接：\q </p>
    <p>命令行启动mysql：mysql服务安装路径下 管理员开打cmd， net start mysql</p>
    <p>命令行关闭mysql：mysql服务安装路径下 管理员开打cmd， net stop mysql</p>
    <p>修改密码：ALTER USER 'username'@'localhost' IDENTIFIED BY 'new_password';</p>

</template>
<style lang="scss" scoped>
p{
    text-indent: 20px;
    text-align: left;
    background-color: bisque;
    font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
}
</style>