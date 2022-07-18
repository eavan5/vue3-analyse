const queue = []

let isFlushing = false

const resolvePromise = Promise.resolve()

export function queueJob (job) {
  if (!queue.includes(job)) {
    queue.push(job)
  }
  // 开一个定时器去批量处理
  if(!isFlushing) {
    isFlushing = true
    resolvePromise.then(() => {
      isFlushing = false
      const copyQueue = queue.slice()
      queue.length = 0
      for(let i = 0; i < copyQueue.length; i++) {
        let job = copyQueue[i]
        job()
      }
      copyQueue.length = 0
    })
  }

  // 浏览器的时间环，将任务先放到队列中，去重，然后异步调用任务

}