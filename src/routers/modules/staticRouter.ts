import { RouteRecordRaw } from "vue-router";

/**
 * staticRouter(静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: "/layout1"
	},
	{
		path: "/layout",
		name: "layout",
		component: () => import("@/layouts/index.vue"),
		redirect: "/****",
		children: []
	},
	{
		path: "/layout1",
		name: "layout1",
		component: () => import("@/layouts/noMenuLayout.vue"),
		redirect: "/analysis/index",
		children: [
			{
				path: "/analysis/index",
				name: "aMap",
				meta: {
					title: "综合分析系统"
				},
				component: () => import("@/views/analysis/aMap/index.vue")
			}
		]
	},
	{
		path: "/big-screen/index",
		name: "bigScreen",
		meta: {
			title: "登记平台"
		},
		component: () => import("@/views/bigScreen/index.vue")
	},
	{
		path: "/analysis/sys-config/index",
		name: "SysConfig",
		meta: {
			title: "工作台"
		},
		component: () => import("@/views/analysis/sysConfig/index.vue"),
		children: [
			{
				path: "/analysis/sys-config/catalog-management",
				name: "catalogManagement",
				meta: {
					title: "编目管理"
				},
				component: () => import("@/views/analysis/sysConfig/catalogManagement/index.vue")
			}
		]
	}
];

/**
 * errorRouter(错误页面路由)
 */
export const errorRouter = [
	{
		path: "/403",
		name: "403",
		component: () => import("@/components/ErrorMessage/403.vue"),
		meta: {
			title: "403页面"
		}
	},
	{
		path: "/404",
		name: "404",
		component: () => import("@/components/ErrorMessage/404.vue"),
		meta: {
			title: "404页面"
		}
	},
	{
		path: "/500",
		name: "500",
		component: () => import("@/components/ErrorMessage/500.vue"),
		meta: {
			title: "500页面"
		}
	}
];

/**
 * notFoundRouter(找不到路由)
 */
export const notFoundRouter = {
	path: "/:pathMatch(.*)*",
	name: "notFound",
	redirect: { name: "404" }
};
