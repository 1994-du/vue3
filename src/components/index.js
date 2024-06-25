const registryComponents = (app)=>{
    const componentsDir = import.meta.globEager('./*.vue');
    const componentNames = Object.keys(componentsDir).map((key)=>{
        return key.replace(/(\.\/|\.vue)/g,'');
    });
}
export{
    registryComponents
}