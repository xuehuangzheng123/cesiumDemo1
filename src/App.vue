<template>
	<a-config-provider
		:getPopupContainer="getPopupContainer"
		:locale="i18nLocale"
		:autoInsertSpace="autoInsertSpace"
		:componentSize="componentSize"
	>
		<router-view></router-view>
	</a-config-provider>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import en from "ant-design-vue/es/locale/en_US";
import zhCn from "ant-design-vue/es/locale/zh_CN";

import { GlobalStore } from "@/stores";
// import { useTheme } from "@/hooks/useTheme";
import { getBrowserLang } from "@/utils/util";

// 使用主题
// useTheme();
const globalStore = GlobalStore();
// 配置 ant-design-vue 按钮文字中间是否有空格
const autoInsertSpace = ref(false);

// ant-design-vue 语言配置
const i18nLocale = computed(() => {
	if (globalStore.language && globalStore.language == "zh") return zhCn;
	if (globalStore.language == "en") return en;
	return getBrowserLang() == "zh" ? zhCn : en;
});

// 配置全局组件大小 (small/default(medium)/large)
const componentSize = computed((): string => globalStore.assemblySize);

// 配置弹窗
const getPopupContainer = (el: any, dialogContext: any) => {
	if (dialogContext) {
		return dialogContext.getDialogWrap();
	} else {
		return document.body;
	}
};
</script>
<style lang="less">
body {
	overflow: auto;
}
</style>
