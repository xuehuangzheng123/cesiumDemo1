import { createApp } from "vue";

// 引入ant-design
import Antd from "@potato/antd";

// custom directives
import directives from "@/directives/index";
// vue Router
import router from "@/routers/index";
// vue i18n
// import I18n from "@/languages/index";
// pinia store
import pinia from "@/stores/index";
// errorHandler
import errorHandler from "@/utils/errorHandler";

import App from "./App.vue";

// reset style sheet
/**
 *  项目内的样式，
 *  注意：最好放在重置样式后，uno.css前
 */
import "@/styles/reset.less";
import "@potato/antd/index.css";
// CSS common style sheet
import "@/styles/common.less";
// antD reset
import "@/styles/reset-antD.less";
// 导入Unocss
import "uno.css";
// fonts css
import "@/assets/fonts/font.less";
// iconfont css
import "@/assets/iconfont/iconfont.less";

// svg icons
import "virtual:svg-icons-register";

const app = createApp(App);

app.config.errorHandler = errorHandler;

// 注册ant-design-vue Icons组件
// Object.keys(Icons).forEach(key => {
// 	app.component(key, Icons[key as keyof typeof Icons]);
// });

app.use(Antd).use(router).use(pinia).use(directives).mount("#app");
