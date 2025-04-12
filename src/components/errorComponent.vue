<template>
    <div class="error-component">
        <p>Error: {{ errorMessage }}</p>
    </div>
</template>

<script setup>
</script>
<style scoped lang='scss'>
.error-component {
    color: red;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}
</style>