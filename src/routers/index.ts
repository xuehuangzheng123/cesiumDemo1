import { createRouter, createWebHistory } from "vue-router";

import NProgress from "@/config/nprogress";
import { getLoginUrl } from "@/config/siteConfig";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { errorRouter, staticRouter } from "@/routers/modules/staticRouter";
import { AuthStore } from "@/stores/modules/auth";
import { storage } from "@/utils/storage";

/**
 * @description 动态路由参数配置简介
 * @param path ==> 菜单路径
 * @param name ==> 菜单别名
 * @param redirect ==> 重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 菜单信息
 * @param meta.icon ==> 菜单图标
 * @param meta.title ==> 菜单标题
 * @param meta.isLink ==> 是否外链
 * @param meta.isHide ==> 是否隐藏
 * @param meta.isFull ==> 是否全屏(示例：数据大屏页面)
 * @param meta.isAffix ==> 是否固定在 tabs nav
 * @param meta.isKeepAlive ==> 是否缓存
 * */
const router = createRouter({
	history: createWebHistory(import.meta.env.VITE_BASE_PATH),
	routes: [...staticRouter, ...errorRouter],
	strict: false,
	scrollBehavior: () => ({ left: 0, top: 0 })
});

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
	const cookie_token = storage.get("token");
	const cookie_userInfoStr = storage.get("userInfo");
	// 1.NProgress 开始
	NProgress.start();

	// 2.动态设置标题
	const title = import.meta.env.VITE_GLOB_APP_TITLE;
	document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

	// 4.判断是否有 Token，没有重定向到 login
	if (!cookie_token || !cookie_userInfoStr) return (window.location.href = getLoginUrl());

	// 5.如果没有菜单列表，就重新请求菜单列表并添加动态路由
	const authStore = AuthStore();
	authStore.setRouteName(to.name as string);
	if (!authStore.authMenuListGet.length) {
		await initDynamicRouter();
		if (to.path.includes("/****")) {
			return next({ path: authStore.homeUrl, replace: true });
		} else {
			return next({ ...to, replace: true });
		}
	}
	// 6.正常访问页面
	next();
});

/**
 * @description 重置路由
 * */
export const resetRouter = () => {
	const authStore = AuthStore();
	authStore.flatMenuListGet.forEach(route => {
		const { name } = route;
		if (name && router.hasRoute(name)) router.removeRoute(name);
	});
};

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
	NProgress.done();
});

/**
 * @description 路由跳转错误
 * */
router.onError(error => {
	NProgress.done();
	console.warn("路由错误", error.message);
});

export default router;
