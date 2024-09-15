import { mount } from '@vue/test-utils'
import Login from '../Login.vue'
import { ElButton } from 'element-plus'
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { toLogin ,toRegistry} from "@/api/api";

vi.mock('axios', () => {
    const mockAxiosInstance = {
        interceptors: {
          request: {
            use: vi.fn((resolve) => resolve({ data: { status: true, data: 'mocked data' } })),
          },
          response: {
            use: vi.fn((resolve) => resolve({ data: { status: true, data: 'mocked data' } })),
          },
        },
        get: vi.fn(() => Promise.resolve({ data:{
            status:'success'
        } })),
        post: vi.fn(() => Promise.resolve({ data:{
            status:'success'
        } })),
      };
    
      return {
        default: {
          create: vi.fn(() => mockAxiosInstance),
        },
      };
});

describe('Login.vue', () => {
  it('fetches data on mount', async () => {
    const wrapper = mount(Login,{
        global: {
            components: {
                ElButton
            }
        }
    })
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('登录');
  });
});
