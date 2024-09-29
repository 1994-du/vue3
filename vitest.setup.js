import { vi } from "vitest";
import { createStore } from "vuex";
import { config } from "@vue/test-utils";

vi.mock("axios", () => {
	const mockInterceptors = vi.fn((config)=>{
		return Promise.resolve({
			code:'200',
			data:{},
			message:'ok'
		})
	})
	mockInterceptors.get = vi.fn((config)=>{
		return Promise.resolve({
			code:'200',
			data:{},
			message:'ok'
		})
	})
	mockInterceptors.post = vi.fn((config)=>{
		return Promise.resolve({
			code:'200',
			data:{},
			message:'ok'
		})
	})
	mockInterceptors.interceptors = {
		request: {
			use: vi.fn((resolve) =>
				resolve({ 
					code:'200',
					data:{},
					message:'ok'
				})
			),
		},
		response: {
			use: vi.fn((resolve) =>
				resolve({ 
					code:'200',
					data:{},
					message:'ok'
				})
			),
		}
	}
	const mockAxios = {
		create: vi.fn(() => mockInterceptors)
	}
	return {
		default: mockAxios,
	};
});

vi.mock("vue-router", () => {
  return {
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      go: vi.fn(),
      currentRoute: vi.fn(() => ({
        value: {
          path: "/",
          query: {},
          params: {},
          name: "Home",
          meta: {},
        },
      })),
    })),
    createRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      currentRoute: { path: "/", name: "home" },
    })),
    createWebHistory: vi.fn(),
  };
});

vi.mock("vuex", () => {
	const mockStore = {
		state:{},
		mutations:{},
		getters:{},
		actions:{},
		commint:vi.fn(),
		dispatch:vi.fn(),
	}
  return {
    useStore: vi.fn(() => mockStore),
    createStore: vi.fn(() => mockStore),
  };
});
