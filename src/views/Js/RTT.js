// const ping = require('ping');
import ping from 'ping';
// 并发控制函数
async function limitedConcurrent(tasks, limit) {
  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const promise = task().then((result) => {
      executing.delete(promise);
      return result;
    });
    results.push(promise);
    executing.add(promise);

    // 如果当前并发达到限制，则等待其中一个任务完成
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

// Ping 一个 IP，返回 RTT
async function pingIP(ip) {
  try {
    const res = await ping.promise.probe(ip, { timeout: 1 });
    return {
      ip,
      rtt: res.time === 'unknown' ? Infinity : parseFloat(res.time),
    };
  } catch (err) {
    return { ip, rtt: Infinity };
  }
}

// 主函数
async function findMinRTTIP(ips) {
  const tasks = ips.map((ip) => () => pingIP(ip));
  const results = await limitedConcurrent(tasks, 10);

  // 找到 RTT 最小的 IP
  const minResult = results.reduce((min, current) => (current.rtt < min.rtt ? current : min));
  return minResult;
}

// 示例 IP 列表
const ips = ["8.8.8.8", "1.1.1.1", "192.168.1.1", "127.0.0.1", "114.114.114.114"];

// 执行
findMinRTTIP(ips)
  .then((result) => {
    console.log(`RTT 最小的 IP: ${result.ip} (RTT: ${result.rtt} ms)`);
  })
  .catch((err) => {
    console.error("出错了:", err);
  });