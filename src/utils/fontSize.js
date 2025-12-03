function init(screenRatioByDesign = 16 / 9){
    const docElement = document.documentElement;
    const screen = window.screen;
    function updateFontSize(){
        const screenRatio = screen.width / screen.height;
        const fontSize = ((screenRatio > screenRatioByDesign ? screenRatioByDesign / screenRatio : screenRatio / screenRatioByDesign)*screen.width) / 100
        docElement.style.fontSize = fontSize.toFixed(3) + 'px';
    }
    updateFontSize();
}
init();