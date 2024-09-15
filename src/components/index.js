const registryComponents = (app)=>{
    const componentsDir = import.meta.glob('./*.vue',{eager:true});
    const componentNames = Object.keys(componentsDir).map((key)=>{
        return key.replace(/(\.\/|\.vue)/g,'');
    });
}
export{
    registryComponents
}