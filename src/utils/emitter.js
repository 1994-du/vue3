import mitt from 'mitt'
const emitter = mitt()
// // 绑定事件一
// emitter.on('event1',()=>{
//     console.log('event1触发')
// })
// // 触发事件一
// emitter.emit('event1')

// // 解绑事件一
// emitter.off('event1')

// // 解绑所有事件
// emitter.all.clear()

export default emitter