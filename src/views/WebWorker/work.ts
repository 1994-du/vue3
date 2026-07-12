self.onmessage = (data)=>{
    console.log('worker接受的数据',data); 
    console.time('耗时')
    let sum = 0
    for (let i = 0; i < 10_000_000_000; i++) {
        sum += i
    }
    console.timeEnd('耗时')
    self.postMessage(`worker返回数据-${sum}`)
}