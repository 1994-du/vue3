const directive=(app)=>{
    app.directive('focus',{
        mounted(el) {
            el.focus()
        }
    })
}
export default directive