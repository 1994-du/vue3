function init(screenRatioByDesign: number = 16 / 9): void {
    const docElement = document.documentElement
    const screen = window.screen

    function updateFontSize(): void {
        const screenRatio = screen.width / screen.height
        const fontSize =
            ((screenRatio > screenRatioByDesign ? screenRatioByDesign / screenRatio : screenRatio / screenRatioByDesign) *
                screen.width) /
            100
        docElement.style.fontSize = fontSize.toFixed(3) + 'px'
    }

    updateFontSize()
}

init()
