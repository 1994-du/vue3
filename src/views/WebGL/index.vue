<template>
    <div class="album-container">
        <div class="title-section">
            <h1>3D 翻页相册</h1>
            <p class="subtitle">拖拽相册或滑动翻页</p>
        </div>
        
        <div ref="canvasContainer" class="canvas-wrapper">
            <div class="loading" v-if="isLoading">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>
        </div>
        
        <div class="controls">
            <button @click="goToPrev" class="control-btn prev-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            
            <div class="page-dots">
                <span 
                    v-for="(_, index) in images" 
                    :key="index"
                    class="dot"
                    :class="{ active: currentIndex === index }"
                    @click="goToPage(index)"
                ></span>
            </div>
            
            <button @click="goToNext" class="control-btn next-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const canvasContainer = ref(null)
const currentIndex = ref(0)
const isLoading = ref(true)

const images = [
    {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
        title: '山间晨雾',
        description: '清晨的山谷被薄雾笼罩，阳光透过云层洒向大地'
    },
    {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
        title: '宁静湖泊',
        description: '碧绿的湖水倒映着蓝天，微风拂过泛起涟漪'
    },
    {
        url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80',
        title: '森林小径',
        description: '阳光穿透树叶，照亮蜿蜒的森林小径'
    },
    {
        url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80',
        title: '瀑布飞虹',
        description: '壮观的瀑布从高处倾泻而下，彩虹在水雾中若隐若现'
    },
    {
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef281b3b9?w=600&q=80',
        title: '海上日落',
        description: '金色的夕阳染红了海面，渔船在暮色中归来'
    }
]

let scene, camera, renderer, photoMeshes = []
let isDragging = false
let dragStartX = 0
let dragStartIndex = 0
let dragOffset = 0
let totalDragOffset = 0
let animationId
let clock

const initScene = () => {
    const container = canvasContainer.value
    const width = container.clientWidth
    const height = container.clientHeight

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)

    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.z = 8

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    clock = new THREE.Clock()

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1)
    mainLight.position.set(5, 5, 5)
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0x667eea, 0.4)
    fillLight.position.set(-5, 3, -3)
    scene.add(fillLight)

    const backLight = new THREE.DirectionalLight(0x764ba2, 0.3)
    backLight.position.set(0, -3, -5)
    scene.add(backLight)

    createPhotos()
}

const createPhotos = () => {
    const loader = new THREE.TextureLoader()
    const photoWidth = 2.8
    const photoHeight = 2.1
    let loadedCount = 0

    images.forEach((imageData, index) => {
        loader.load(imageData.url, (texture) => {
            texture.minFilter = THREE.LinearFilter
            texture.magFilter = THREE.LinearFilter
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

            const photoGeometry = new THREE.PlaneGeometry(photoWidth, photoHeight)
            const photoMaterial = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
                shininess: 100,
                specular: 0x444444
            })

            const photo = new THREE.Mesh(photoGeometry, photoMaterial)
            photo.userData = { index }

            scene.add(photo)
            photoMeshes.push(photo)
            
            loadedCount++
            if (loadedCount === images.length) {
                isLoading.value = false
            }
        }, undefined, () => {
            const fallbackGeometry = new THREE.PlaneGeometry(photoWidth, photoHeight)
            const fallbackMaterial = new THREE.MeshPhongMaterial({
                color: 0x444444,
                side: THREE.DoubleSide
            })
            const fallbackPhoto = new THREE.Mesh(fallbackGeometry, fallbackMaterial)
            fallbackPhoto.userData = { index }
            
            scene.add(fallbackPhoto)
            photoMeshes.push(fallbackPhoto)
            
            loadedCount++
            if (loadedCount === images.length) {
                isLoading.value = false
            }
        })
    })
}

const animate = () => {
    animationId = requestAnimationFrame(animate)
    
    const elapsed = clock.getElapsedTime()
    const targetIndex = currentIndex.value + dragOffset
    
    photoMeshes.forEach((photo, index) => {
        const offsetFromTarget = index - targetIndex
        const pageAngle = (Math.PI * 2) / images.length
        const angle = -targetIndex * pageAngle + index * pageAngle
        const radius = 6
        
        const targetX = Math.sin(angle) * radius
        const targetZ = Math.cos(angle) * radius
        const targetY = Math.sin(angle * 2 + elapsed * 0.5) * 0.3
        
        const isActive = Math.abs(offsetFromTarget % images.length) < 0.5 || Math.abs(offsetFromTarget % images.length) > images.length - 0.5
        const targetScale = isActive ? 1.2 : 0.8
        
        photo.position.x += (targetX - photo.position.x) * 0.1
        photo.position.z += (targetZ - photo.position.z) * 0.1
        photo.position.y += (targetY - photo.position.y) * 0.05
        
        photo.lookAt(0, 0, 0)
        
        photo.scale.x += (targetScale - photo.scale.x) * 0.1
        photo.scale.y += (targetScale - photo.scale.y) * 0.1
        photo.scale.z += (targetScale - photo.scale.z) * 0.1
    })

    renderer.render(scene, camera)
}

const goToPrev = () => {
    currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
    dragOffset = 0
}

const goToNext = () => {
    currentIndex.value = (currentIndex.value + 1) % images.length
    dragOffset = 0
}

const goToPage = (index) => {
    currentIndex.value = index
    dragOffset = 0
}

const handleMouseDown = (event) => {
    isDragging = true
    dragStartX = event.clientX
    dragStartIndex = currentIndex.value
    totalDragOffset = 0
    dragOffset = 0
}

const handleMouseMove = (event) => {
    if (!isDragging) return
    const deltaX = event.clientX - dragStartX
    dragOffset = -deltaX / 200
    totalDragOffset = dragOffset
}

const handleMouseUp = () => {
    if (!isDragging) return
    isDragging = false
    
    const targetExactIndex = dragStartIndex + totalDragOffset
    const targetIndex = Math.round(targetExactIndex) % images.length
    const normalizedIndex = targetIndex < 0 ? targetIndex + images.length : targetIndex
    
    currentIndex.value = normalizedIndex
    dragOffset = 0
}

const handleWheel = (event) => {
    event.preventDefault()
    const now = Date.now()
    
    if (now - lastWheelTime < WHEEL_THROTTLE) {
        return
    }
    
    lastWheelTime = now
    
    if (event.deltaY > 0) {
        goToNext()
    } else {
        goToPrev()
    }
}

const handleTouchStart = (event) => {
    isDragging = true
    dragStartX = event.touches[0].clientX
    dragStartIndex = currentIndex.value
    totalDragOffset = 0
    dragOffset = 0
}

const handleTouchMove = (event) => {
    if (!isDragging) return
    const deltaX = event.touches[0].clientX - dragStartX
    dragOffset = -deltaX / 200
    totalDragOffset = dragOffset
}

const handleTouchEnd = () => {
    if (!isDragging) return
    isDragging = false
    
    const targetExactIndex = dragStartIndex + totalDragOffset
    const targetIndex = Math.round(targetExactIndex) % images.length
    const normalizedIndex = targetIndex < 0 ? targetIndex + images.length : targetIndex
    
    currentIndex.value = normalizedIndex
    dragOffset = 0
}

const handleResize = () => {
    const width = canvasContainer.value.clientWidth
    const height = canvasContainer.value.clientHeight
    
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
}

let lastWheelTime = 0
const WHEEL_THROTTLE = 400

onMounted(() => {
    initScene()
    animate()
    
    const canvas = canvasContainer.value
    canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    
    const canvas = canvasContainer.value
    if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('wheel', handleWheel)
        canvas.removeEventListener('touchstart', handleTouchStart)
    }
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
    window.removeEventListener('resize', handleResize)
    
    if (renderer) {
        renderer.dispose()
    }
})
</script>

<style scoped lang="scss">
.album-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 50%, rgba(118, 75, 162, 0.15) 0%, transparent 50%);
        pointer-events: none;
    }
}

.title-section {
    text-align: center;
    padding: 40px 20px 20px;
    position: relative;
    z-index: 10;
    
    h1 {
        color: white;
        font-size: 42px;
        font-weight: 800;
        margin: 0 0 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        letter-spacing: 2px;
    }
    
    .subtitle {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        margin: 0;
        font-weight: 400;
    }
}

.canvas-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    
    canvas {
        width: 100% !important;
        height: 100% !important;
        display: block;
        cursor: grab;
        
        &:active {
            cursor: grabbing;
        }
    }
}

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    z-index: 20;
    
    .spinner {
        width: 48px;
        height: 48px;
        margin: 0 auto 16px;
        border: 3px solid rgba(255, 255, 255, 0.2);
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    
    p {
        margin: 0;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
    }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
    padding: 24px 20px 40px;
    position: relative;
    z-index: 10;
}

.control-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    
    &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
    }
    
    &:active {
        transform: scale(0.95);
    }
}

.page-dots {
    display: flex;
    gap: 12px;
    
    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
            background: rgba(255, 255, 255, 0.5);
            transform: scale(1.2);
        }
        
        &.active {
            width: 32px;
            border-radius: 6px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
    }
}
</style>
