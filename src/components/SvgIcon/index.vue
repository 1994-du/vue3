<template>
    <svg v-if="loaded" class="svg-icon" aria-hidden="true">
        <use :xlink:href="`#icon-${name}`"></use>
    </svg>>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import svgLoader from './loader.js'
const props = defineProps({
    name: {
        type: String,
        required: true
    }
});
let loaded = ref(false);
onMounted(async () => {
    loaded.value = await svgLoader(props.name);
});
</script>
<style scoped lang='less'>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>