const args = require('minimist')(process.argv.slice(2)) // minimist 可以解析命令行参数
const { resolve } = require('path')

const target = args._[0] || 'reactivity'

const format = args.f || 'global'

const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`)).buildOptions?.name

// iife // 在浏览器环境，所以需要加一个全局变量
// cjs
// esm

const outputFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'

const outfile = resolve(__dirname, `../packages/dist/${target}.${format}.js`)

const { build } = require('esbuild')

build({
	entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
	outfile,
	bundle: true,
	sourcemap: true,
	format: outputFormat,
	globalName: pkg.buildOptions?.name,
	platform: format === 'cjs' ? 'node' : 'browser',
	watch: {
		// 监控文件变化
		onRebuild(error) {
			if (!error) console.log(`rebuilt~~~~`)
		},
	},
}).then(() => {
	console.log('watching~~~')
})

// console.log(target, format, entry, outputFormat, outFile, packageName)
