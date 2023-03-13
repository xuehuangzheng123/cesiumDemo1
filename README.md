# 综合分析 + 大屏（QQ-ANALYSIS-WEB）

### 一、项目相关文档 📚

- 项目更新日志：[CHANGELOG.md](./CHANGELOG.md)

- 代码规范文档：[STANDARD.md](./STANDARD.md)

### 二、🔨🔨🔨 项目功能

- 🚀 使用 Vue3.2 开发，单文件组件 `＜script setup＞`
- 🚀 采用 Vite3 作为项目开发、打包工具（配置了 Gzip 打包、TSX 语法、跨域代理、打包预览工具……）
- 🚀 整个项目集成了 TypeScript
- 🚀 使用 Pinia🍍 替代 Vuex，轻量、简单、易用
- 🚀 使用 TypeScript 对 Axios 整个二次封装 （全局错误拦截、常用请求封装、全局请求 Loading、取消重复请求……）
- 🚀 使用 Unocss 原子化方案，简化 css 使用
- 🚀 常用自定义指令开发（复制、水印、拖拽、节流、防抖、长按……）
- 🚀 使用 Prettier 统一格式化代码，集成 Eslint、Stylelint 代码校验规范（STANDARD.md 文件）
- 🚀 使用 husky、lint-staged、commitlint、commitizen、cz-git 规范提交信息（STANDARD.md 文件）

### 三、安装使用步骤 📔

- **vscode**插件:

```text
ESLint
JSON to TS
Prettier-Code fromatter
Stylelint
UnoCss
Iconify IntelliSense
Vue3 Snippets
Vue Language Feature(Volar)
Code snippets for potato project  # 找钱铭要打包文件
```

- **Install：**

```text
npm install
cnpm install

# npm install 安装失败，请升级 nodejs 到 16 以上
```

- **Run：**

```text
npm run dev
npm run serve
```

- **Build：**

```text
# 开发环境
npm run build:dev

# 测试环境
npm run build:test

# 生产环境
npm run build
```

- **Lint：**

```text
# eslint 检测代码
npm run lint:eslint

# prettier 格式化代码
npm run lint:prettier

# stylelint 格式化样式
lint:stylelint
```

- **commit：**

```text
# 提交代码（提交前会自动执行 lint:lint-staged 命令）
npm run commit
```

### 四、文件资源目录 📚

```text
自然资源确权登记平台
├─ .vscode                # vscode推荐配置
├─ public                 # 静态资源文件（忽略打包）
├─ src
│  ├─ api                 # API 接口管理
│  ├─ assets              # 静态资源文件
│  ├─ components          # 全局组件
│  ├─ config              # 全局配置项
│  ├─ directives          # 全局指令文件
│  ├─ enums               # 项目枚举
│  ├─ hooks               # 常用 Hooks
│  ├─ languages            # 语言国际化
│  ├─ layouts              # 框架布局
│  ├─ routers             # 路由管理
│  ├─ stores               # pinia store
│  ├─ styles              # 全局样式
│  ├─ typings             # 全局 ts 声明
│  ├─ utils               # 工具库
│  ├─ views               # 项目所有页面
│  ├─ App.vue             # 入口页面
│  ├─ env.d.ts            # ts 识别 vue 文件
│  └─ main.ts             # 入口文件
├─ .editorconfig          # 编辑器配置（格式化）
├─ .env                   # vite 常用配置
├─ .env.development       # 开发环境配置
├─ .env.production        # 生产环境配置
├─ .env.test              # 测试环境配置
├─ .eslintignore          # 忽略 Eslint 校验
├─ .eslintrc.js           # Eslint 校验配置
├─ .gitignore             # git 提交忽略
├─ .prettierignore        # 忽略 prettier 格式化
├─ .prettierrc.js         # prettier 配置
├─ .stylelintignore       # 忽略 stylelint 格式化
├─ .stylelintrc.js        # stylelint 样式格式化配置
├─ CHANGELOG.md           # 项目更新日志
├─ commitlint.config.js   # git 提交规范配置
├─ index.html             # 入口 html
├─ LICENSE                # 开源协议文件
├─ lint-staged.config     # lint-staged 配置文件
├─ package-lock.json      # 依赖包包版本锁
├─ package.json           # 依赖包管理
├─ postcss.config.js      # postcss 配置
├─ README.md              # README 介绍
├─ remove-node_modules.bat# 移除 node_modules 文件夹脚本
├─ STANDARD.md            # 项目编码规范说明书
├─ tsconfig.json          # typescript 全局配置
├─ unocss.config.js       # unocss 配置
└─ vite.config.ts         # vite 配置
```

### 五、动态路由 json 示例

```json
{
	"path": "/menu",
	"name": "menu",
	"redirect": "/menu/menu1",
	"meta": {
		"icon": "org_manage",
		"title": "菜单嵌套",
		"isLink": "",
		"isHide": true,
		"isFull": false,
		"isAffix": false,
		"isKeepAlive": true
	},
	"children": [
		{
			"path": "/menu/menu1",
			"name": "menu1",
			"component": "/menu/menu1/index",
			"meta": {
				"icon": "org_manage",
				"title": "菜单1",
				"isLink": "",
				"isHide": false,
				"isFull": false,
				"isAffix": false,
				"isKeepAlive": true
			}
		},
		{
			"path": "/menu/menu2",
			"name": "menu2",
			"redirect": "/menu/menu2/menu21",
			"meta": {
				"icon": "org_manage",
				"title": "菜单2",
				"isLink": "",
				"isHide": false,
				"isFull": false,
				"isAffix": false,
				"isKeepAlive": true
			},
			"children": [
				{
					"path": "/menu/menu2/menu21",
					"name": "menu21",
					"component": "/menu/menu2/menu21/index",
					"meta": {
						"icon": "org_manage",
						"title": "菜单2-1",
						"isLink": "",
						"isHide": false,
						"isFull": false,
						"isAffix": false,
						"isKeepAlive": true
					}
				},
				{
					"path": "/menu/menu2/menu22",
					"name": "menu22",
					"redirect": "/menu/menu2/menu22/menu221",
					"meta": {
						"icon": "org_manage",
						"title": "菜单2-2",
						"isLink": "",
						"isHide": false,
						"isFull": false,
						"isAffix": false,
						"isKeepAlive": true
					},
					"children": [
						{
							"path": "/menu/menu2/menu22/menu221",
							"name": "menu221",
							"component": "/menu/menu2/menu22/menu221/index",
							"meta": {
								"icon": "org_manage",
								"title": "菜单2-2-1",
								"isLink": "",
								"isHide": false,
								"isFull": false,
								"isAffix": false,
								"isKeepAlive": true
							}
						},
						{
							"path": "/menu/menu2/menu22/menu222",
							"name": "menu222",
							"component": "/menu/menu2/menu22/menu222/index",
							"meta": {
								"icon": "org_manage",
								"title": "菜单2-2-2",
								"isLink": "",
								"isHide": false,
								"isFull": false,
								"isAffix": false,
								"isKeepAlive": true
							}
						}
					]
				},
				{
					"path": "/menu/menu2/menu23",
					"name": "menu23",
					"component": "/menu/menu2/menu23/index",
					"meta": {
						"icon": "org_manage",
						"title": "菜单2-3",
						"isLink": "",
						"isHide": false,
						"isFull": false,
						"isAffix": false,
						"isKeepAlive": true
					}
				}
			]
		},
		{
			"path": "/menu/menu3",
			"name": "menu3",
			"component": "/menu/menu3/index",
			"meta": {
				"icon": "org_manage",
				"title": "菜单3",
				"isLink": "",
				"isHide": false,
				"isFull": false,
				"isAffix": false,
				"isKeepAlive": true
			}
		}
	]
}
```
