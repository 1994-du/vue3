export default async function (iconName,svgPath=`/icons/${iconName}.svg`) {
    try{
        const response = await fetch(import.meta.env.VITE_PROJECT_URL+svgPath);
        if(!response.ok) throw new Error(`Failed to load SVG icon: ${iconName}`);
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.querySelector('svg');
        if(!svgElement) throw new Error(`Invalid SVG content for icon: ${iconName}`);
        svgElement.removeAttribute('width');
        svgElement.removeAttribute('height');
        svgElement.removeAttribute('fill');
        svgElement.setAttribute('viewBox',svgElement.getAttribute('viewBox') || '0 0 1024 1024');
        const symbolId = `icon-${iconName}`;
        // 创建symbol标签
        const symbolElement = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
        symbolElement.setAttribute('id', symbolId);
        symbolElement.setAttribute('viewBox', svgElement.getAttribute('viewBox'));
        while(svgElement.firstChild){
            symbolElement.appendChild(svgElement.firstChild);
        }
        // 将symbol添加到全局svg精灵中
        let svgContainer = document.getElementById('svg-icon-sprite');
        if(!svgContainer){
            svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgContainer.setAttribute('id', 'svg-icon-sprite');
            svgContainer.style.position = 'absolute';
            svgContainer.style.width = '0';
            svgContainer.style.height = '0';
            svgContainer.style.overflow = 'hidden';
            document.body.prepend(svgContainer);
        }
        if(!document.getElementById(symbolId)){
            svgContainer.appendChild(symbolElement);
        }
        return true;
    }
    catch(err){
        console.error(`Error loading SVG icon: ${iconName} from path: ${svgPath}`, err);
        return null;
    }
}