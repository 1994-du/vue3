import { mount } from '@vue/test-utils'
import Login from '../Login.vue'
import { ElButton, ElInput } from 'element-plus'
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { toLogin ,toRegistry} from "@/api/api";
// 缺少mock请求
describe('Login.vue', () => {
  it('fetches data on mount', async () => {
    const wrapper = mount(Login,{
        global: {
            components: {
                ElButton,
                ElInput
            }
        }
    })
    // await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('登录');
  });
});
