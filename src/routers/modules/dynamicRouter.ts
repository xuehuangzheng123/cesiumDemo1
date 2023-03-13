import { notification } from "ant-design-vue";

// import { LOGIN_URL } from "@/config/config";
import { getLoginUrl } from "@/config/siteConfig";
import router from "@/routers/index";
import { notFoundRouter } from "@/routers/modules/staticRouter";
import { AuthStore } from "@/stores/modules/auth";
import { storage } from "@/utils/storage";
import { isType } from "@/utils/util";

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob("@/views/**/*.vue");

/**
 * 初始化动态路由
 */
export const initDynamicRouter = async () => {
	const authStore = AuthStore();
	try {
		const dom = document.querySelector("meta[itemprop=appCode]") as HTMLMetaElement | null;
		const appCode = dom?.content || "";
		// 1.获取菜单列表 && 按钮权限
		await authStore.getAuthMenuList({
			id: appCode
		});
		await authStore.getAuthButtonList({
			appCode: appCode
		});

		// 2.判断当前用户有没有菜单权限
		if (!authStore.authMenuListGet.length) {
			notification.warning({
				message: "无权访问",
				description: "当前账号无任何菜单权限，请联系系统管理员！",
				duration: 3
			});
			setTimeout(() => {
				storage.clear();
				window.location.href = getLoginUrl();
			}, 2000);
			return Promise.reject("No permission");
		}

		// 3.添加动态路由
		authStore.flatMenuListGet.forEach((item: any) => {
			item.children && delete item.children;
			if (item.component && isType(item.component) === "string") {
				item.component = modules["/src/views" + item.component + ".vue"];
			}
			if (item.meta.isFull) {
				router.addRoute(item);
			} else {
				router.addRoute("layout", item);
			}
		});

		// 4.最后添加 notFoundRouter
		router.addRoute(notFoundRouter);
	} catch (error) {
		// 💢 当按钮 || 菜单请求出错时，重定向到登陆页
		setTimeout(() => {
			storage.clear();
			window.location.href = getLoginUrl();
		}, 2000);
		return Promise.reject(error);
	}
};
