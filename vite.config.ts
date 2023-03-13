import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
// import { presetAttributify, presetIcons, presetUno } from "unocss";
// 引入Unocss
import Unocss from "unocss/vite";
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from "vite";
import importToCDN from "vite-plugin-cdn-import";
import viteCompression from "vite-plugin-compression";
import eslintPlugin from "vite-plugin-eslint";
import { createHtmlPlugin } from "vite-plugin-html";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import VueSetupExtend from "vite-plugin-vue-setup-extend";

import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import { wrapperEnv } from "./src/utils/getEnv";

// import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";
// import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// @see: https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	const env = loadEnv(mode, process.cwd());
	const viteEnv = wrapperEnv(env);

	return {
		base: "/",
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src"),
				"vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
			}
		},
		css: {
			// css预处理器
			preprocessorOptions: {
				less: {
					modifyVars: {
						hack: `true; @import (reference) "${resolve("src/styles/var.less")}";`
					},
					// math: 'strict',
					javascriptEnabled: true
				}
			}
		},
		server: {
			// 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
			host: "0.0.0.0",
			port: viteEnv.VITE_PORT,
			open: viteEnv.VITE_OPEN,
			cors: true,
			// 代理跨域（mock 不需要配置跨域，直接能访问，这里只是个示例）
			proxy: {
				"^/.*/v1": {
					// 正则已匹配，不需加网关
					// target: "http://10.1.3.125:40001", // 125环境
					target: "http://10.1.3.125:29080", // 开发125网关环境
					// target: "http://10.1.1.83:40001",  // 彦龙本地
					changeOrigin: true
				},
				"/mapdata/": {
					target: "https://mapdata.i-tudou.com/",
					// target: 'http://mapdata.tudoucloud.com:8081/',
					changeOrigin: true // 是否跨域
				}
			}
		},
		plugins: [
			vue(),
			createHtmlPlugin({
				inject: {
					data: {
						title: viteEnv.VITE_GLOB_APP_TITLE
					}
				}
			}),
			// * 使用 svg 图标
			createSvgIconsPlugin({
				iconDirs: [resolve(process.cwd(), "src/assets/icons")],
				symbolId: "icon-[dir]-[name]"
			}),
			// * EsLint 报错信息显示在浏览器界面上
			eslintPlugin(),
			// * vite 可以使用 jsx/tsx 语法
			vueJsx(),
			// * name 可以写在 script 标签上
			VueSetupExtend(),
			// * 是否生成包预览(分析依赖包大小,方便做优化处理)
			viteEnv.VITE_REPORT && visualizer(),
			// * gzip compress
			viteEnv.VITE_BUILD_GZIP &&
				viteCompression({
					verbose: true,
					disable: false,
					threshold: 10240,
					algorithm: "gzip",
					ext: ".gz"
				}),
			// * cdn 引入（vue按需引入会导致依赖vue的插件出现问题(列如:pinia/vuex)）
			importToCDN({
				modules: [
					// {
					// 	name: "vue",
					// 	var: "Vue",
					// 	path: "https://unpkg.com/vue@next"
					// },
					// 使用cdn引入element-plus时,开发环境还是需要在main.js中引入element-plus,可以不用引入css
					// {
					// 	name: "element-plus",
					// 	var: "ElementPlus",
					// 	path: "https://unpkg.com/element-plus",
					// 	css: "https://unpkg.com/element-plus/dist/index.css"
					// }
				]
			}),
			Unocss({
				// 使用Unocss
				// presets: [
				// 	presetUno(),
				// 	presetAttributify(),
				// 	presetIcons({
				// 		// You can provide the extra CSS properties to control the default behavior of the icons.
				// 		extraProperties: {
				// 			display: "inline-block",
				// 			"vertical-align": "middle"
				// 		}
				// 	})
				// ]
			})
			// * demand import element
			// AutoImport({
			// 	resolvers: [ElementPlusResolver()]
			// }),
			// Components({
			// 	resolvers: [ElementPlusResolver()]
			// }),
		],
		// * 打包去除 console.log && debugger
		esbuild: {
			pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
		},
		build: {
			outDir: "dist",
			minify: "esbuild",
			// esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
			// minify: "terser",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: viteEnv.VITE_DROP_CONSOLE,
			// 		drop_debugger: true
			// 	}
			// },
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					// Static resource classification and packaging
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
				}
			}
		}
	};
});
