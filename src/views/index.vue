<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: dxx
 * @Date: 2021-07-11 18:13:34
 * @LastEditors: dxx
 * @LastEditTime: 2021-07-11 18:26:39
-->
<template>
    <div>
        首页
        <hello-world></hello-world>
    </div>
</template>

<script>
import HelloWorld from "../components/HelloWorld.vue";
export default {
    components: { HelloWorld },
	mounted(){
		console.log(this.$G6)
	}
};
</script>

<style>
</style>