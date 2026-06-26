const iconCache = new Map<string, Promise<boolean | null>>()

export default function (
    iconName: string,
    svgPath?: string
): Promise<boolean | null> {
    if (iconCache.has(iconName)) {
        return iconCache.get(iconName)!
    }
    const promise = loadSvg(iconName, svgPath)
    iconCache.set(iconName, promise)
    return promise
}

async function loadSvg(iconName: string, svgPath?: string): Promise<boolean | null> {
    const path = svgPath || `/icons/${iconName}.svg`
    
    try {
        const response = await fetch(import.meta.env.VITE_PROJECT_URL + path)
        if (!response.ok) throw new Error(`Failed to load SVG icon: ${iconName}`)
        
        const svgText = await response.text()
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
        const svgElement = svgDoc.querySelector('svg')
        
        if (!svgElement) throw new Error(`Invalid SVG content for icon: ${iconName}`)
        
        svgElement.removeAttribute('width')
        svgElement.removeAttribute('height')
        svgElement.removeAttribute('fill')
        
        const paths = svgElement.querySelectorAll('[fill]')
        paths.forEach((el) => {
            el.setAttribute('fill', 'currentColor')
        })
        
        svgElement.setAttribute('viewBox', svgElement.getAttribute('viewBox') || '0 0 1024 1024')
        
        const symbolId = `icon-${iconName}`
        
        // 创建symbol标签
        const symbolElement = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')
        symbolElement.setAttribute('id', symbolId)
        symbolElement.setAttribute('viewBox', svgElement.getAttribute('viewBox') || '')
        
        while (svgElement.firstChild) {
            symbolElement.appendChild(svgElement.firstChild)
        }
        
        // 将symbol添加到全局svg精灵中
        let svgContainer = document.getElementById('svg-icon-sprite')
        
        if (!svgContainer) {
            const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as any
            newSvg.setAttribute('id', 'svg-icon-sprite')
            newSvg.style.position = 'absolute'
            newSvg.style.width = '0'
            newSvg.style.height = '0'
            newSvg.style.overflow = 'hidden'
            document.body.prepend(newSvg)
            svgContainer = newSvg
        }
        
        if (!document.getElementById(symbolId) && svgContainer) {
            svgContainer.appendChild(symbolElement)
        }
        
        return true
    } catch (err) {
        console.error(`Error loading SVG icon: ${iconName} from path: ${path}`, err)
        return null
    }
}
