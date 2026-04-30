<template>
  <h4>数组转树</h4>
  <CodeEditor code="let arr=[
    { id:1,value:1,parent:null},
    { id:2,value:2,parent:1},
    { id:3,value:3,parent:1},
    { id:4,value:4,parent:2},
    { id:5,value:5,parent:2},
    { id:6,value:6,parent:3},
    { id:7,value:7,parent:3},
    { id:8,value:8,parent:4},
    { id:9,value:9,parent:4},
    { id:10,value:10,parent:5},
    { id:11,value:11,parent:5},
    { id:12,value:12,parent:6},
]
const arrayToTree = (arr) => {
    const map=new Map();
    for(let item of arr){
        map.set(item.id,item)
    }
    let result=[];
    for(let item of arr){
        if(!item.parent){
            result.push(item)
        }else{
            const parent=map.get(item.parent)
            if(!parent.children){
                parent.children=[item]
            }else{
                parent.children.push(item)
            }
        }
    }
    return result
}
console.log(arrayToTree(arr))"></CodeEditor>
</template>
<script setup>
let arr=[
    { id:1,value:1,parent:null},
    { id:2,value:2,parent:1},
    { id:3,value:3,parent:1},
    { id:4,value:4,parent:2},
    { id:5,value:5,parent:2},
    { id:6,value:6,parent:3},
    { id:7,value:7,parent:3},
    { id:8,value:8,parent:4},
    { id:9,value:9,parent:4},
    { id:10,value:10,parent:5},
    { id:11,value:11,parent:5},
    { id:12,value:12,parent:6},
]
const arrayToTree = (arr) => {
    const map=new Map();
    arr.forEach(el=>{
        map.set(item.id,item)
    })
    console.log('map',map);
    
    let result=[];
    for(let item of arr){
        if(!item.parent){
            result.push(item)
        }else{
            const parent=map.get(item.parent)
            if(!parent.children){
                parent.children=[item]
            }else{
                parent.children.push(item)
            }
        }
    }
    return result
}
console.log(arrayToTree(arr))
</script>
<style lang='scss' scoped>
</style>