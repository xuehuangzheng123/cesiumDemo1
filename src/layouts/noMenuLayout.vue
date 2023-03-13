<!-- 不含左侧菜单的layout -->
<template>
	<div class="root-node">
		<a-layout class="td-container">
			<Header></Header>
			<a-layout>
				<a-layout-content>
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

<script setup lang="ts" name="NoMenuLayout">
import { computed, nextTick, provide, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

import Header from "@/layouts/components/Header/index.vue";
import { KeepAliveStore } from "@/stores/modules/keepAlive";
const oRoute = useRoute();
const keepAliveStore = KeepAliveStore();

const activeMenu = computed(() => oRoute.path);
const menuData = reactive({
	openKeys: [],
	selectedKeys: [activeMenu.value]
});

watch(activeMenu, (newVal: string): void => {
	menuData.selectedKeys = [newVal];
});

// 刷新当前页面
const isRouterRefresh = ref(true);
const refreshCurrentPage = () => {
	isRouterRefresh.value = false;
	nextTick(function () {
		isRouterRefresh.value = true;
	});
};
provide("refresh", refreshCurrentPage);
</script>
<style scoped lang="less">
@import "./index.less";
</style>
