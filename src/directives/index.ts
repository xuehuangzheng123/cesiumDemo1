import { App } from "vue";

import auth from "./modules/auth";
import copy from "./modules/copy";
import debounce from "./modules/debounce";
import loading from "./modules/loading";
import longpress from "./modules/longpress";
import throttle from "./modules/throttle";
import waterMarker from "./modules/waterMarker";

const directivesList: any = {
	// Custom directives
	auth,
	copy,
	waterMarker,
	debounce,
	throttle,
	longpress,
	loading
};

const directives = {
	install: function (app: App<Element>) {
		Object.keys(directivesList).forEach(key => {
			// 注册所有自定义指令
			app.directive(key, directivesList[key]);
		});
	}
};

export default directives;
