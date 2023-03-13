<template>
	<div class="sys-config w-100% h-100%">
		<a-layout class="w-100% h-100%">
			<a-layout-sider>
				<div class="h-80px bg-#001529 f-c-c">
					<div class="f-ic select-none">
						<img class="w-30px h-30px mr-16 font-600" src="@/assets/images/logo.png" alt="logo" />
						<h1 class="text-18 color-#fff mb-0">工作台</h1>
					</div>
				</div>
				<a-menu v-model:selectedKeys="selectedKeys" theme="dark" class="h-[calc(100%-80px)]">
					<a-menu-item key="1">
						<read-outlined />
						<span class="nav-text">编目管理</span>
					</a-menu-item>
				</a-menu>
			</a-layout-sider>
			<a-layout>
				<!-- <a-layout-header :style="{ background: '#fff', padding: 0 }" /> -->
				<a-layout-content class="h-100% my-24px mx-16px">
					<div class="h-100% bg-#fff">
						<CatalogManagement />
					</div>
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>
<script setup lang="tsx" name="SysConfig">
import { ref } from "vue";

import { ReadOutlined } from "@ant-design/icons-vue";

import CatalogManagement from "./catalogManagement/index.vue";

const selectedKeys = ref<string[]>(["1"]);
</script>
<style scoped lang="less">
.sys-config {
	width: 100%;
	height: 100%;
}
</style>
