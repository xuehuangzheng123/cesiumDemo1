<template>
	<a-layout-header class="td-ant-hd p-x-24">
		<div class="f-ic select-none">
			<img class="w-30px h-30px mr-16 font-600" src="@/assets/images/logo.png" alt="logo" />
			<h1 class="text-18 color-#fff mb-0">自然资源确权</h1>
			<a-divider class="border-color-$pt-text-color-stair-dark h1.2em -mb3px" type="vertical" />
			<h3 class="!mb0 sys-name">综合分析系统</h3>
		</div>
		<div class="center-cont flex align-items flx-justify-end">
			<a-menu v-model:selectedKeys="navPath" class="analysis-menu flex align-items mr16 w-386" mode="horizontal">
				<a-menu-item key="/analysis/index"> <router-link to="/analysis/index"> 一张图</router-link> </a-menu-item>
				<a-menu-item key="2">专题分析</a-menu-item>
				<a-menu-item key="3">应用分析</a-menu-item>
				<a-menu-item key="/analysis/sys-config/index"
					><router-link to="/analysis/sys-config/index" target="_blank"> 系统设置</router-link>
				</a-menu-item>
			</a-menu>
			<!-- <AppList></AppList> -->
		</div>
		<div class="tool-bar-right f-c-c">
			<span
				v-if="false"
				:class="[
					'message-icon',
					{
						'message-anim': messageNum > 0
					}
				]"
			>
				<span class="w-20px h-20px color-#fff" i-ant-design-bell-outlined></span>
				<i v-if="messageNum > 0"
					><i>{{ messageNum }}</i></i
				>
			</span>
			<span
				v-if="false"
				class="w-20px h-20px ml-40 mr-16 cursor-pointer color-#fff"
				i-ant-design-fund-outlined
				@click="goHere"
			></span>
			<!-- <span class="w-30px h-30px color-#fff" i-ant-design-user-outlined></span> -->
			<!-- <img v-if="userInfo.avatar" class="w-30px h-30px rounded-full" :src="userInfo.avatar" />
			<a-button class="!color-#fff" type="link" @click="logout">注销</a-button> -->
			<a-popover trigger="hover" placement="bottomRight">
				<template #title>
					<div class="flx-align-center userInfo">
						<a-avatar :size="46" :src="userInfo.avatar" class="big-avatar">
							<template #icon><UserOutlined /></template>
						</a-avatar>
						<div class="ml-10">
							<div v-if="userInfo?.userName && userInfo?.userName?.length < 13" class="font-black">{{ userInfo.userName }}</div>
							<a-tooltip v-else color="var(--pt-bg-color-popup)">
								<template #title>
									<span style="color: var(--pt-text-color-third-light)">{{ userInfo.userName }}</span>
								</template>
								<div class="font-black font-ellipsis w-170px">{{ userInfo.userName }}</div>
							</a-tooltip>
							<div class="font-grey">{{ userInfo.userId }}</div>
						</div>
					</div>
				</template>
				<template #content>
					<div>
						<div class="font-grey mt-5 mb-8">手机号码：{{ userInfo.tel }}</div>
						<div v-if="userInfo?.dept && userInfo?.dept?.length < 14" class="font-grey mb-18">所属机构：{{ userInfo.dept }}</div>
						<a-tooltip v-else color="var(--pt-bg-color-popup)">
							<template #title>
								<span style="color: var(--pt-text-color-third-light)">{{ userInfo.dept }}</span>
							</template>
							<div class="font-grey mb-18 font-ellipsis w-230px">所属机构：{{ userInfo.dept }}</div>
						</a-tooltip>
						<div class="grey-line"></div>
					</div>
					<div class="text-center mt-15">
						<!-- <a style="margin-right: 51px; color: black" @click="logout('您是否确认退出当前账户切换新账户?')">切换用户</a> -->
						<a style="color: grey" @click="logout('您是否确认退出登录?')">退出</a>
					</div>
				</template>
				<a-avatar :size="36" :src="userInfo.avatar" class="small-avatar">
					<template #icon><UserOutlined /></template>
				</a-avatar>
			</a-popover>
		</div>
	</a-layout-header>
</template>
<script setup lang="ts" name="Header">
import { onBeforeMount, reactive, ref } from "vue";
import { Modal } from "ant-design-vue";

import { UserOutlined } from "@ant-design/icons-vue";

import { loginOutApi } from "@/api/modules/login";
import { getUserMessApi } from "@/api/modules/user";
import { getLoginUrl } from "@/config/siteConfig";
import { storage } from "@/utils/storage";

// import AppList from "../AppList/index.vue";
let userInfoInCookie = JSON.parse(storage.get("userInfo"));
let userInfo = reactive<{
	avatar?: string;
	userName?: string;
	userId?: number;
	tel?: number | string;
	dept?: string;
}>({});

const getUserDet = () => {
	getUserMessApi({ id: userInfoInCookie.userId }).then((res: any) => {
		if (res.data) {
			Object.assign(userInfo, {
				avatar: res.data.avatar,
				userName: res.data.username,
				userId: res.data.id,
				tel: res.data.tel,
				dept: res.data.dept
			});
		}
	});
};

const messageNum = ref<number>(1);
const handleLoginOut = async () => {
	const { code } = await loginOutApi();
	if (code) {
		storage.clear();
		window.location.href = getLoginUrl(false);
	}
};
// 退出登录
const logout = (title: string) => {
	Modal.confirm({
		title,
		content: "",
		okText: "确定",
		okType: "primary",
		cancelText: "取消",
		async onOk() {
			handleLoginOut();
		},
		onCancel() {}
	});
};
const goHere = () => {};

onBeforeMount(() => {
	getUserDet();
});

const navPath = ref<string[]>(["/analysis/aMap"]);
</script>
<style scoped lang="less">
@import "./index.less";
</style>
