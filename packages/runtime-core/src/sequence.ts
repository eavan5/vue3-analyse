// [5, 3, 4, 01 > [1,2)

//从一个序列中找到最长递增子序列的个数

// 贪心算法、找更有潜力的

// 23768495

//以2 开头开始算

// 2 3

// 2 3 7

// 2 36

//2368

//2348

//2348

//当前和和序列的最后一项比较，如果比最后一项大，直接追加到尾部，如果比尾部小，則找到序列中比他当前大的替换掉
// 个数没向题，那么最后在把序列弄对了就好

// 采用二分查找找比当前项大的那个人
// nLog(n)

function getSequence(arr) {
	let len = arr.length
	let result = [0]
	const p = Array(len).fill(0) // p中存的什么无所谓
	let lastIndex
	let start, end, middle
	for (let i = 0; i < len; i++) {
		const arrI = arr[i]
		if (arrI !== 0) {
			// 0在vue3中意味着新增的节点，这个不计入最长递增子序列
			lastIndex = result.at(-1) // 数组中最后一项 就是最大的那个索引
			if (arr[lastIndex] < arrI) {
				// 说明当前这一项比结果集中最后一项大 则直接把索引追加到结果集中
				p[i] = lastIndex // 存的是索引
				result.push(i)
				continue
			}
			// 否则，找到比当前项大的那个索引 	// 二分查找
			start = 0
			end = result.length - 1
			while (start < end) {
				middle = Math.floor((start + end) / 2)
				if (arr[result[middle]] < arrI) {
					start = middle + 1
				} else {
					end = middle
				}
			}
			if (arrI < arr[result[end]]) {
				p[i] = result[end - 1]
				result[end] = i
			}
		}
	}
	console.log(p)
	// 倒序追溯 先取到结果集的最后一项
	let i = result.length
	let last = result[i - 1]
	while (i--) {
		//检索后停止
		result[i] = last // 第一次最后一项肯定是正确的
		last = p[last] // 根据最后一项向前追溯
	}

	return result
}

let arrIndex = getSequence([2, 3, 7, 6, 8, 4, 9, 5]) // [0,1,5,7,6] => [0,1,3,4,6]

console.log(arrIndex)
