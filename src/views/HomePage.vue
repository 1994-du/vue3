<template>
    <div class="home_wrap" ref="homeWrap">
        <div class="home_header">
            <h1 class="page_title">知识引擎</h1>
            <p class="page_subtitle">探索前端技术的无限可能</p>
        </div>
        
        <div class="waterfall_container">
            <div 
                v-for="(item, index) in cardList" 
                :key="index"
                class="knowledge_card"
                :style="{ height: item.height + 'px' }"
                @mouseenter="handleCardHover(index, true)"
                @mouseleave="handleCardHover(index, false)"
            >
                <div class="card_icon" :class="item.iconClass">
                    <svg-icon :name="item.icon" size="32" />
                </div>
                <h3 class="card_title">{{ item.title }}</h3>
                <div class="card_content">
                    <p v-for="(desc, dIndex) in item.descriptions" :key="dIndex">
                        {{ desc }}
                    </p>
                </div>
                <div class="card_footer">
                    <span class="card_tag">{{ item.tag }}</span>
                    <el-icon class="card_arrow"><ArrowRight /></el-icon>
                </div>
                <div class="card_glow" :class="{ active: hoveredIndex === index }"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { ArrowRight } from '@element-plus/icons-vue'

// 卡片数据
const cardList = ref([
    {
        title: 'HTML',
        icon: 'wenjian',
        iconClass: 'html',
        tag: '基础',
        height: 160,
        descriptions: ['HTML5新特性：语义化标签、Canvas绘图、本地存储等']
    },
    {
        title: 'CSS',
        icon: 'shezhi',
        iconClass: 'css',
        tag: '样式',
        height: 220,
        descriptions: [
            'CSS3新特性：Flexbox布局、Grid布局、动画过渡效果',
            '响应式设计：媒体查询、流体布局、弹性盒模型'
        ]
    },
    {
        title: 'JavaScript',
        icon: 'shouji',
        iconClass: 'js',
        tag: '核心',
        height: 280,
        descriptions: [
            'JavaScript高级特性：闭包、原型链、异步编程',
            'ES6+新特性：箭头函数、Promise、async/await',
            '模块化开发：CommonJS、ES Modules'
        ]
    },
    {
        title: '网络',
        icon: 'tongzhi',
        iconClass: 'network',
        tag: '协议',
        height: 320,
        descriptions: [
            'HTTP协议：请求方法、状态码、缓存机制',
            'TCP/IP协议：三次握手、四次挥手',
            '性能优化：CDN、HTTP/2、Websocket',
            '安全：HTTPS、CORS、XSS防护'
        ]
    },
    {
        title: '工程化',
        icon: 'wenjianbao',
        iconClass: 'engineering',
        tag: '工具',
        height: 200,
        descriptions: [
            '构建工具：Webpack、Vite、Rollup',
            '包管理：npm、yarn、pnpm',
            '代码规范：ESLint、Prettier'
        ]
    },
    {
        title: '性能优化',
        icon: 'shouyi',
        iconClass: 'performance',
        tag: '优化',
        height: 140,
        descriptions: ['页面加载优化：懒加载、预加载、代码分割']
    },
    {
        title: '前端框架',
        icon: 'zhibo',
        iconClass: 'framework',
        tag: '框架',
        height: 180,
        descriptions: [
            'Vue 3：Composition API、响应式系统',
            'React：Hooks、组件化开发'
        ]
    },
    {
        title: '数据库',
        icon: 'guancangguanli',
        iconClass: 'database',
        tag: '数据',
        height: 340,
        descriptions: [
            '关系型数据库：MySQL、PostgreSQL',
            '非关系型数据库：MongoDB、Redis',
            'ORM框架：Sequelize、TypeORM',
            '数据库设计：范式、索引优化',
            '事务管理：ACID特性、隔离级别'
        ]
    },
    {
        title: '服务器',
        icon: 'kufangguanli',
        iconClass: 'server',
        tag: '后端',
        height: 150,
        descriptions: ['Node.js：Express、Koa、NestJS']
    },
    {
        title: '安全',
        icon: 'shezhi_1',
        iconClass: 'security',
        tag: '安全',
        height: 260,
        descriptions: [
            'XSS防护：转义输出、CSP策略',
            'CSRF防护：Token验证、SameSite Cookie',
            '密码安全：加盐哈希、bcrypt',
            '身份认证：JWT、OAuth2.0'
        ]
    },
    {
        title: '算法',
        icon: 'jiaojieguanli',
        iconClass: 'algorithm',
        tag: '基础',
        height: 190,
        descriptions: [
            '排序算法：快速排序、归并排序',
            '搜索算法：二分查找、哈希表',
            '数据结构：链表、树、图'
        ]
    },
    {
        title: '架构设计',
        icon: 'pandianguanli',
        iconClass: 'architecture',
        tag: '架构',
        height: 300,
        descriptions: [
            '微前端：Single-SPA、MicroApp',
            '微服务：Spring Cloud、Docker、Kubernetes',
            '服务端渲染：Next.js、Nuxt.js',
            '静态站点生成：Gatsby、VuePress'
        ]
    },
    {
        title: '设计模式',
        icon: 'liwu',
        iconClass: 'pattern',
        tag: '模式',
        height: 210,
        descriptions: [
            '创建型模式：单例、工厂、建造者',
            '结构型模式：代理、装饰器、适配器',
            '行为型模式：观察者、策略、模板方法'
        ]
    },
    {
        title: '版本控制',
        icon: 'shijian',
        iconClass: 'git',
        tag: '工具',
        height: 130,
        descriptions: ['Git：分支管理、合并策略、版本回退']
    }
])

const hoveredIndex = ref(-1)

const handleCardHover = (index, isHover) => {
    hoveredIndex.value = isHover ? index : -1
}

// 瀑布流布局
const homeWrap = ref(null)
const cardSpacing = 20
const cardWidth = 280

const createWaterfall = () => {
    if (!homeWrap.value) return
    
    const container = homeWrap.value.querySelector('.waterfall_container')
    if (!container) return
    
    const cards = container.querySelectorAll('.knowledge_card')
    if (!cards.length) return
    
    const containerWidth = container.offsetWidth
    const columns = Math.max(1, Math.floor(containerWidth / (cardWidth + cardSpacing)))
    
    const columnHeights = new Array(columns).fill(0)
    
    cards.forEach((card, index) => {
        let minHeightColumn = 0
        let minHeight = columnHeights[0]
        
        for (let i = 1; i < columns; i++) {
            if (columnHeights[i] < minHeight) {
                minHeight = columnHeights[i]
                minHeightColumn = i
            }
        }
        
        card.style.position = 'absolute'
        card.style.left = `${minHeightColumn * (cardWidth + cardSpacing)}px`
        card.style.top = `${columnHeights[minHeightColumn]}px`
        
        columnHeights[minHeightColumn] += card.offsetHeight + cardSpacing
    })
    
    container.style.height = `${Math.max(...columnHeights)}px`
}

const handleResize = () => {
    createWaterfall()
}

onMounted(() => {
    setTimeout(() => {
        createWaterfall()
    }, 100)
    
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<style lang='scss' scoped>
.home_wrap {
    width: 100%;
    min-height: 100%;
    padding: 0 0 40px 0;
    box-sizing: border-box;
    
    .home_header {
        text-align: center;
        padding: 40px 20px;
        margin-bottom: 20px;
        
        .page_title {
            font-size: var(--font-size-3xl);
            font-weight: 700;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0 0 12px 0;
            letter-spacing: 2px;
        }
        
        .page_subtitle {
            font-size: var(--font-size-base);
            color: var(--text-secondary);
            margin: 0;
        }
    }
    
    .waterfall_container {
        position: relative;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    
    .knowledge_card {
        width: 280px;
        background: var(--bg-elevated);
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--border-color);
        padding: 20px;
        box-sizing: border-box;
        position: absolute;
        transition: all var(--transition-base);
        cursor: pointer;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        
        &:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
            border-color: var(--primary-light);
        }
        
        .card_icon {
            width: 56px;
            height: 56px;
            border-radius: var(--border-radius);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            transition: all var(--transition-base);
            
            &.html { background: linear-gradient(135deg, #e44d26 0%, #f16529 100%); }
            &.css { background: linear-gradient(135deg, #264de4 0%, #2965f1 100%); }
            &.js { background: linear-gradient(135deg, #f7df1e 0%, #f0db4f 100%); color: #323330; }
            &.network { background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%); }
            &.engineering { background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%); }
            &.performance { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
            &.framework { background: linear-gradient(135deg, #42b883 0%, #35495e 100%); }
            &.database { background: linear-gradient(135deg, #00758f 0%, #f29111 100%); }
            &.server { background: linear-gradient(135deg, #68a063 0%, #3c873a 100%); }
            &.security { background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); }
            &.algorithm { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            &.architecture { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
            &.pattern { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
            &.git { background: linear-gradient(135deg, #f05032 0%, #bd2c00 100%); }
            
            &:hover {
                transform: scale(1.05);
            }
        }
        
        .card_title {
            font-size: var(--font-size-lg);
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 12px 0;
            background: none;
            padding: 0;
            box-shadow: none;
        }
        
        .card_content {
            flex: 1;
            
            p {
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
                line-height: 1.6;
                margin: 0 0 8px 0;
                
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
        
        .card_footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px solid var(--border-color);
            
            .card_tag {
                font-size: var(--font-size-xs);
                color: var(--primary);
                background: var(--menu-bg-active);
                padding: 4px 10px;
                border-radius: 20px;
                font-weight: 500;
            }
            
            .card_arrow {
                color: var(--text-tertiary);
                transition: all var(--transition-fast);
            }
        }
        
        &:hover .card_arrow {
            color: var(--primary);
            transform: translateX(4px);
        }
        
        .card_glow {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 50% 0%, rgba(93, 186, 171, 0.15) 0%, transparent 70%);
            opacity: 0;
            transition: opacity var(--transition-base);
            pointer-events: none;
            
            &.active {
                opacity: 1;
            }
        }
    }
}

/* 响应式适配 */
@media (max-width: 768px) {
    .home_wrap {
        .knowledge_card {
            width: calc(50% - 20px);
        }
    }
}

@media (max-width: 480px) {
    .home_wrap {
        .knowledge_card {
            width: calc(100% - 40px);
        }
    }
}
</style>
