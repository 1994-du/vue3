// mock/user.ts
import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

export default [
  {
    url: '/getway/mock/user/info',
    method: 'post',
    response: () => {
      return {
        code: 0,
        data: (Mock as any).mock({
          name: '@name',
          age: '@integer(18, 30)',
          email: '@email'
        })
      }
    }
  }
] as MockMethod[]