import { vi } from 'vitest';
import { createStore } from 'vuex';
import { config } from '@vue/test-utils';

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

vi.mock('vue-router', () => {
  return {
    useRouter: vi.fn(()=>({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        go: vi.fn(),
        currentRoute: vi.fn(()=>({
            value: {
                path: '/',
                query: {},
                params: {},
                name: 'Home',
                meta: {}
            }
        }))
    })),
    createRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      currentRoute: { path: '/', name: 'home' },
    })),
    createWebHistory: vi.fn(),
  }
})

vi.mock('vuex', () => {
  return {
    useStore: vi.fn(() => ({
      state: { mockData: 'mock value' },
      getters: {},
      commit: vi.fn(),
      dispatch: vi.fn(),
    })),
    createStore: vi.fn(() => ({
      state: { mockData: 'mock value' },
      getters: {},
    })),
  }
})