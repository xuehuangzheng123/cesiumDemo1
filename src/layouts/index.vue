<!-- 含左侧菜单的layout -->
<template>
	<div class="root-node">
		<a-layout class="td-container">
			<Header></Header>
			<a-layout>
				<a-layout-sider
					:width="240"
					:style="{ 'overflow-y': 'auto', height: 'calc(100vh - 56px)' }"
					v-model:collapsed="isCollapse"
				>
					<a-menu
						v-model:openKeys="menuData.openKeys"
						v-model:selectedKeys="menuData.selectedKeys"
						mode="inline"
						theme="light"
						:forceSubMenuRender="true"
						@click="handleClickMenu"
					>
						<template v-for="item in menuList" :key="item.path">
							<template v-if="!item.children?.length">
								<a-menu-item :key="item.path">
									<template v-if="item.meta.icon" #icon>
										<SvgIcon :name="menuData.selectedKeys.includes(item.path) ? item.meta.icon + '-checked' : item.meta.icon" />
									</template>
									{{ item.meta.title }}
								</a-menu-item>
							</template>
							<template v-else>
								<sub-menu :key="item.path" :menu-info="item" :selectedKeys="menuData.selectedKeys" />
							</template>
						</template>
					</a-menu>
				</a-layout-sider>
				<a-layout-content>
					<!-- <Breadcrumb :breadcrumbData="breadcrumbData"></Breadcrumb> -->
					<div class="main-panel">
						<router-view v-slot="{ Component, route }">
							<transition appear name="fade-transform" mode="out-in">
								<keep-alive :include="keepAliveStore.keepLiveName" v-if="isRouterRefresh">
									<component :is="Component" :key="route.path" />
								</keep-alive>
							</transition>
						</router-view>
					</div>
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>

<script setup lang="ts" name="layout">
import { computed, nextTick, onBeforeUnmount, provide, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import _debounce from "lodash/debounce";

// import Breadcrumb from "@/components/Breadcrumb/index.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import Header from "@/layouts/components/Header/index.vue";
import SubMenu from "@/layouts/components/Menu/SubMenu.vue";
import { GlobalStore } from "@/stores";
import { AuthStore } from "@/stores/modules/auth";
import { KeepAliveStore } from "@/stores/modules/keepAlive";
const oRoute = useRoute();
const router = useRouter();
const authStore = AuthStore();
const globalStore = GlobalStore();
const keepAliveStore = KeepAliveStore();

const menuList = computed(() => authStore.showMenuListGet);
const isCollapse = computed(() => globalStore.themeConfig.isCollapse);
const themeConfig = computed(() => globalStore.themeConfig);
const activeMenu = computed(() => oRoute.path);
const menuData = reactive({
	openKeys: [],
	selectedKeys: [activeMenu.value]
});

watch(activeMenu, (newVal: string): void => {
	menuData.selectedKeys = [newVal];
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleClickMenu = ({ key }: any) => {
	// if (subItem.meta.isLink) window.open(subItem.meta.isLink, "_blank");
	router.push(key);
};

// 刷新当前页面
const isRouterRefresh = ref(true);
const refreshCurrentPage = () => {
	isRouterRefresh.value = false;
	nextTick(function () {
		isRouterRefresh.value = true;
	});
};
provide("refresh", refreshCurrentPage);

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref<number>(0);
const listeningWindow = () => {
	screenWidth.value = document.body.clientWidth;
	if (!isCollapse.value && screenWidth.value < 1200) globalStore.setThemeConfig({ ...themeConfig.value, isCollapse: true });
	if (isCollapse.value && screenWidth.value > 1200) globalStore.setThemeConfig({ ...themeConfig.value, isCollapse: false });
};
window.addEventListener(
	"resize",
	_debounce(() => listeningWindow(), 300)
);
onBeforeUnmount(() => {
	window.removeEventListener("resize", listeningWindow);
});
</script>
<style scoped lang="less">
@import "./index.less";
</style>
