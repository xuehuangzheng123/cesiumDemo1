<template>
	<div class="app-list" v-if="appList.length > 0">
		<a :href="appList[0].url">{{ appList[0].name }}</a>
		<a-divider type="vertical" v-if="appList.length > 1" />
		<a :href="appList[1].url" v-if="appList.length > 1">{{ appList[1].name }}</a>
		<a-divider type="vertical" v-if="appList.length > 2" />
		<a-dropdown v-if="appList.length > 2">
			<a class="ant-dropdown-link" @click.prevent>
				更多
				<DownOutlined />
			</a>
			<template #overlay>
				<a-menu>
					<a-menu-item v-for="item of moreAppList" :key="item.id">
						<a :href="item.url">{{ item.name }}</a>
					</a-menu-item>
				</a-menu>
			</template>
		</a-dropdown>
	</div>
</template>
<script setup lang="ts" name="AppList">
import { computed, ref } from "vue";

import { DownOutlined } from "@ant-design/icons-vue";

import { getAppList } from "@/api/modules/app";
import { storage } from "@/utils/storage";
let userInfo = JSON.parse(storage.get("userInfo"));
const dom = document.querySelector("meta[itemprop=appCode]") as HTMLMetaElement | null;
const appCode = dom?.content || "";
type AppList = {
	[propName: string]: any;
};
let appList = ref<AppList[]>([]);
getAppList(userInfo.userId).then(res => {
	if (res.data) {
		delete res.data[appCode];
		appList.value = Object.values(res.data);
	}
});
const moreAppList = computed(() => {
	let copyArr = JSON.parse(JSON.stringify(appList.value));
	return copyArr.splice(2);
});
</script>
<style scoped lang="less">
.app-list {
	margin-right: 16px;
	& > a {
		color: var(--pt-text-color-stair-dark);
	}
}

.ant-divider {
	border-left-color: var(--pt-text-color-stair-dark);
}
</style>
