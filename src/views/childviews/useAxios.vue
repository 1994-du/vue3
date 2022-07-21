<template>
  <div class="use_axios">

  </div>
</template>

<script>
export default {
mounted(){
    this.$axios.get('https://api.apiopen.top/getJoke?page=1&count=2&type=video').then(res=>{
        console.log(res.data.result)
    })
}
}
</script>

<style>

</style>