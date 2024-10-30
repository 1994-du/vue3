const registryComponents = (app)=>{
    const componentsDir = import.meta.glob('./*.vue',{eager:true});
    const componentNames = Object.keys(componentsDir).map((key)=>{
        return key.replace(/(\.\/|\.vue)/g,'');
    });
    componentNames.forEach((name)=>{
        app.component(name,componentsDir[`./${name}.vue`].default);
    })
}
export default registryComponents;