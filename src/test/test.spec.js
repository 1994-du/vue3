import Home from '@/Home.vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ElementPlus from 'element-plus'
describe('Home.vue', () => {
    const wrapper = mount(Home,{
        global: {
            plugins: [ElementPlus],
            stubs:{
                'el-menu':false,
            }
        }
    })
    console.log(wrapper.html());
    
    it('renders the correct title', () => {
        expect(wrapper.vm.isCollapse).toBe(false)
    })
})