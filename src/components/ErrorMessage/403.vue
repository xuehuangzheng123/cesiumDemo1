<template>
	<div class="not-container">
		<img src="@/assets/images/403.png" class="not-img" alt="403" />
		<div class="not-detail">
			<h2>403</h2>
			<h4>抱歉，您无权访问该页面~🙅‍♂️🙅‍♀️</h4>
			<a-button type="primary" @click="router.push(homeUrl)">返回默认跳转页面</a-button>
		</div>
	</div>
</template>

<script setup lang="ts" name="403">
import { useRouter } from "vue-router";

import { AuthStore } from "@/stores/modules/auth";
const authStore = AuthStore();
let homeUrl = authStore.homeUrl;
const router = useRouter();
</script>

<style scoped lang="less">
@import "./index.less";
</style>
