import Popover from '@/views/ElementPlus/popover.vue'
import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
describe('Home.vue', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(Popover,{
            global: {
                plugins: [ElementPlus],
                stubs:false
            }
        })
    })
    it('renders the correct title', async() => {
        await wrapper.vm.$nextTick()
        console.log(wrapper.html());
    })
})