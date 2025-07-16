<template>
    <div class="clip-path">
        <h4>circle:圆形</h4>
        <p>clip-path：circle(50% at 50% 50%); // circle(半径 at 原点)</p>
        <div class="circle"></div>
        <h4>ellipse:椭圆</h4>
        <p>clip-path:ellipse(60% 40% at 50% 50%); // ellipse（水平半轴 垂直半轴 at 中心点）</p>
        <div class="ellipse"></div>
        <h4>inset:矩形或圆角矩形</h4>
        <p>clip-path:inset(30% round 10px); // inset([padding] roud [border-radius])</p>
        <div class="inset"></div>
        <h4>polygon:多边形</h4>
        <p>clip-path:polygon(0 0, 100% 0, 100% 100%, 0 100%); // polygon(点1 点2 ...)</p>
        <div class="polygon"></div>
    </div>
</template>
<script setup lang="ts">

</script>
<style lang="scss" scoped>
p{
    text-align: left;
}
.circle,.ellipse,.inset,.polygon{
    width: 100px;
    height: 100px;
    background-color: aquamarine;
    clip-path: circle(50% at 50% 50%);
}
.ellipse{
    clip-path: ellipse(50% 30% at 50% 50%);
}
.inset{
    clip-path: inset(30% round 10px);
}
.polygon{
    clip-path: polygon(
        50% 0%,
        61.8% 38.2%,
        100% 38.2%,
        69.1% 61.8%,
        80.9% 100%,
        50% 76.4%,
        19.1% 100%,
        30.9% 61.8%,
        0% 38.2%,
        38.2% 38.2%
    );
}
</style>