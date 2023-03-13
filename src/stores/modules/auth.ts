import _cloneDeep from "lodash/cloneDeep";
import { defineStore } from "pinia";

// import { getAuthButtonListApi, getAuthMenuListApi } from "@/api/modules/login";
import { getAuthButtonListApi } from "@/api/modules/login";
import DynamicRouter from "@/assets/json/dynamicRouter.json";
import { AuthState } from "@/stores/interface";
// import { formatMenuData, getFlatArr } from "@/utils/util";
import { getFlatArr } from "@/utils/util";
import { getAllBreadcrumbList, getShowMenuList } from "@/utils/util";
// AuthStore
export const AuthStore = defineStore({
	id: "AuthState",
	state: (): AuthState => ({
		// 当前页面的 router name，用来做按钮权限筛选
		routeName: "",
		// 默认跳转页面
		homeUrl: "",
		// 按钮权限列表
		authButtonList: {},
		// 菜单权限列表
		authMenuList: []
	}),
	getters: {
		// 按钮权限列表
		authButtonListGet: state => state.authButtonList,
		// 后端返回的菜单列表 ==> 这里没有经过任何处理
		authMenuListGet: state => state.authMenuList,
		// 后端返回的菜单列表 ==> 左侧菜单栏渲染，需要去除 isHide == true
		showMenuListGet: state => getShowMenuList(state.authMenuList),
		// 扁平化之后的一维数组路由，主要用来添加动态路由
		flatMenuListGet: state => getFlatArr(_cloneDeep(state.authMenuList)),
		// 所有面包屑导航列表
		breadcrumbListGet: state => getAllBreadcrumbList(_cloneDeep(state.authMenuList))
	},
	actions: {
		// getAuthButtonList
		async getAuthButtonList(params: any) {
			const { data } = await getAuthButtonListApi(params);
			this.authButtonList = data;
		},
		// getAuthMenuList(params: any)
		async getAuthMenuList(params: any) {
			console.log(params);
			// const { data } = await getAuthMenuListApi(params);
			// 如果想让菜单变为本地数据，放开下面注释代码，并引入本地 dynamicRouter.json 数据
			this.authMenuList = DynamicRouter.data as any;
			this.homeUrl = this.authMenuList[0].path || "";
			return;
			// if (data.length > 0) {
			// 	let authMenuData = formatMenuData(data);
			// 	this.homeUrl = authMenuData[0].path || "";
			// 	console.log(authMenuData);
			// 	this.authMenuList = authMenuData;
			// } else {
			// 	this.homeUrl = "";
			// 	this.authMenuList = [];
			// }
		},
		// setRouteName
		async setRouteName(name: string) {
			this.routeName = name;
		}
	}
});
